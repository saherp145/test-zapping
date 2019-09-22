var express = require('express');
var router = express.Router();

var car = require('../controllers/car');

router.get('/cars', car.getAllCars);

router.get('/location/:location', car.getAllCarsByLocation);
router.get('/year/:year', car.getAllCarsByYear);

module.exports = router;