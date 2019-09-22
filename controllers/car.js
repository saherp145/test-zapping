var Car = require('../services/car');

exports.getAllCars = (req, res) => {
    try {
        Car.getAllCars()
            .then((data) => {
                res.render('cars', {
                    cars: data.cars,
                    kmAvg: data.kmAvg,
                    priceAvg: data.priceAvg,
                });
            })
            .catch(() => {
                res.locals.message = "Error";
                res.status(500);
                res.render("error");
            });
    } catch (error) {
        throw new Error("Opps! Something went wrong");
    }
};

exports.getAllCarsByLocation = (req, res) => {
    try {
        Car.getAllCarsByLocation(req.params.location)
            .then(data => {
                res.render('cars', {
                    cars: data.cars,
                    kmAvg: data.kmAvg,
                    priceAvg: data.priceAvg,
                    title: 'Cars by Location'
                });
            }).catch(() => {
                res.locals.message = "Error";
                res.status(500);
                res.render("error");
            });
    } catch (error) {
        throw new Error("Opps! Something went wrong");
    }
}

exports.getAllCarsByYear = (req, res) => {
    try {
        Car.getAllCarsByYear(req.params.year)
            .then(data => {
                res.render('cars', {
                    cars: data.cars,
                    kmAvg: data.kmAvg,
                    priceAvg: data.priceAvg,
                    title: 'Cars by Year'
                });
            }).catch(() => {
                res.locals.message = "Error";
                res.status(500);
                res.render("error");
            });
    } catch (error) {
        throw new Error("Opps! Something went wrong");
    }
}