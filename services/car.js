//var Cars = require('../models/cars');
var sequelize = require('../common/mysql');

const getAvgs = (elements) => {
    let total = elements.reduce((accumulator, currentValue) => {
        return {
            price: accumulator.price + currentValue.price,
            km: accumulator.km + currentValue.km
        };
    });

    let priceAvg = total.price / elements.length;
    let kmAvg = total.km / elements.length;

    return {
        priceAvg,
        kmAvg
    };
};

exports.getAllCars = async () => {
    var statement = "SELECT c.* FROM cars c JOIN locations l ON c.idlocation = l.idlocation;";

    let cars = await sequelize.query(statement);

    let {
        priceAvg,
        kmAvg
    } = getAvgs(cars[0]);

    return {
        cars: cars[0],
        priceAvg,
        kmAvg
    };
};

exports.getAllCarsByLocation = async (location) => {
    var statement = "SELECT c.*, l.description as location FROM cars c JOIN locations l ON c.idlocation = l.idlocation WHERE l.description = ?;";

    let cars = await sequelize.query(statement, {
        replacements: [location]
    });

    let {
        priceAvg,
        kmAvg
    } = getAvgs(cars[0]);

    return {
        cars: cars[0],
        priceAvg,
        kmAvg
    };
};

exports.getAllCarsByYear = async (year) => {
    if (isNaN(year)) return null;

    var statement = "SELECT c.*, l.description as location FROM cars c JOIN locations l ON c.idlocation = l.idlocation WHERE c.year = ?;";

    let cars = await sequelize.query(statement, {
        replacements: [year]
    });

    let {
        priceAvg,
        kmAvg
    } = getAvgs(cars[0]);

    return {
        cars: cars[0],
        priceAvg,
        kmAvg
    };
};