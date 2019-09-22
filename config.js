var config = {
	debug: true,
	port: 3005,
	mysql: {
		host: "localhost",
		username: "root",
		user: "root", //For mysql2
		database: "zapping_test_db",
		password: "sapn1412"
	},
	parallelProcessingPages: 10,
	siteUrl: "https://www.yapo.cl/region_metropolitana/autos"
}

module.exports = config