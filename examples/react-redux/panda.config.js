const packageJson = require("./package.json");

module.exports = {
	name: packageJson.name || "",
	apps: ['portal', 'main', 'user'],
	webpackConfig: {

	}
}