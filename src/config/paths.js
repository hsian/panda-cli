'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	//appIndexJs: resolveApp('src/main/index.js'),
	appPackageJson: resolveApp('package.json'),
	appHtml: resolveApp('public/index.html'),
	appPublic: resolveApp('public'),
	appBuild: resolveApp('dist'),
	ownNodeModules: resolveApp('node_modules'),
}