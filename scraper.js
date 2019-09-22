const cheerio = require("cheerio");
const axios = require("axios");
const mysql = require('mysql2/promise');
const AsyncLock = require('async-lock');
const iconv = require('iconv-lite');

const appConfig = require("./config.json");
const locations = {};
const cars = {};

const MAX_PAGES = appConfig["parallelProcessingPages"];

axios.interceptors.response.use(response => {
    let ctype = response.headers["content-type"];
    if (ctype.includes("charset=ISO-8859-1")) {
        response.data = iconv.decode(response.data, 'ISO-8859-1');
    }
    return response;
});

var dbConn = null;
const initDbConnection = async () => {
    if (!dbConn) {
        // eslint-disable-next-line require-atomic-updates
        dbConn = await mysql.createConnection(appConfig["dbSettings"]);
    }
    return dbConn;
};

var lock = new AsyncLock();
const getIdInDb = async (table, keyColumn, conditionKey, conditionValue) => {
    let r = await dbConn.query("SELECT ?? AS keyCol FROM ?? WHERE ?? = ?", [keyColumn, table, conditionKey, conditionValue]);
    return r[0].length > 0 ? r[0][0].keyCol : -1;
};
const saveLocation = async (location) => {
    return lock.acquire(location, async () => {
        try {
            if (!locations[location]) {
                let idLocation = await getIdInDb("locations", "idlocation", "description", location);
                if (idLocation == -1) {
                    console.info("Saving location", location);
                    let result = await dbConn.query('INSERT INTO locations (description) VALUES (?)', [location]);
                    // eslint-disable-next-line require-atomic-updates
                    locations[location] = result[0].insertId;
                } else {
                    // eslint-disable-next-line require-atomic-updates
                    locations[location] = idLocation;
                }
            }
        } catch (error) {
            console.error(error);
            process.kill(0);
        }
        return locations[location];
    });
};
const saveCar = async (car) => {
    return lock.acquire(car.id, async () => {
        try {
            if (!cars[car.id]) {
                let idCar = await getIdInDb("cars", "idcar", "code", car.id);
                if (idCar == -1) {
                    const result = await dbConn.query('INSERT INTO cars (code, description, price, km, year, url, idlocation) VALUES (?, ?, ?, ?, ?, ?, ?)', [car.id, car.title, car.price, car.km, car.year, car.url, car.idLocation]);
                    // eslint-disable-next-line require-atomic-updates
                    cars[car.id] = result[0].insertId;
                } else {
                    // eslint-disable-next-line require-atomic-updates
                    cars[car.id] = idCar;
                }
            }
        } catch (error) {
            console.error(error);
            console.log(car);
            process.kill(0);
        }
        return cars[car.id];
    });
};

const fetchData = async (url) => {
    const response = await axios.get(url, {
        "timeout": 180000,
        "responseEncoding": "binary",
        "responseType": "arraybuffer"
    });

    return cheerio.load(response.data, {
        decodeEntities: false,
        normalizeWhitespace: true
    });
};

const doCollectData = async () => {
    let $ = await fetchData(appConfig["siteUrl"]);

    await initDbConnection();

    let nextPage = null;

    let scrapedPages = {};

    let pages = [];

    do {
        pages = [];
        let i = 0;
        $(".resultcontainer span.nohistory:not('.FloatRight') a:not(a[rel])").each((index, element) => {
            let pageNumber = $(element).text();
            if (!scrapedPages[pageNumber]) {
                if (i > MAX_PAGES) return;
                pages.push($(element).attr("href"));
                scrapedPages[pageNumber] = $(element).attr("href");
                i++;
            }
        });

        await Promise.all(
            pages.map(async (page) => {
                let _$ = await fetchData(page);
                let htmlElements = [];

                _$("#hl tbody tr.ad").each((index, element) => {
                    htmlElements.push(element);
                });

                await Promise.all(htmlElements.map(async (element) => {
                    let id = _$(element).attr("id");

                    if (!cars[id]) {
                        let location = _$(element).find(".commune").text().replace("\n", " ");
                        let title = _$(element).find(".title").text().replace("\n", " ");
                        let url = _$(element).find(".redirect-to-url").attr("href");
                        let price = Number(_$(element).find(".price").text().replace(/[$.]/g, ""));
                        let year = null;
                        let km = null;

                        _$(element).find(".icons .icons__element-text").each((idx, ele) => {
                            if (_$(ele).parent().find(".fa-tachometer").length > 0) {
                                km = Number(_$(ele).text().replace("km", ""));
                            } else if (_$(ele).parent().find(".fa-calendar-alt").length > 0) {
                                year = Number(_$(ele).text());
                            }
                        });

                        let idLoc = await saveLocation(location);
                        await saveCar({
                            id,
                            location,
                            title,
                            url,
                            price,
                            year,
                            km,
                            idLocation: idLoc,
                            page
                        });
                    }
                }));
            })
        );

        console.log("scrapped pages", pages);

        if (pages.length) {
            nextPage = pages[pages.length - 1];
            if (nextPage)
                // eslint-disable-next-line require-atomic-updates
                $ = await fetchData(nextPage);
        } else {
            nextPage = null;
        }
    }
    //while (false);
    while (pages.length);

    return {
        cars,
        locations,
    };
};

doCollectData().then(() => {
    console.info("Finished");
    process.kill(0);
});

// module.exports = getResults;