const packageJson = require("./package.json");

module.exports = {
	name: packageJson.name || "",
	apps: ['main'],
	webpackConfig: {

	}
}