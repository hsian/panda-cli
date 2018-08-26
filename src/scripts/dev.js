'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const checkRequiredFiles = require('./utils/checkRequiredFiles');
const clearConsole = require('./utils/clearConsole');
// resource from react-scripts
const openBrowser = require('./utils/openBrowser');
const { createCompiler, prepareUrls } = require('./utils/WebpackDevServerUtils');

const paths = require('../config/paths');
const webpackConfigDev = require('../config/webpack.config.dev');
const userConfig = require("../config/user.config");
const { urlConfig, createDevServerConfig } = require('../config/wepackDevServer.config');

// check stream
//const isInteractive = process.stdout.isTTY;
// if(!checkRequiredFiles([paths.appIndexJs])){
// 	process.exit(1);
// }

if(process.env.HOST){
	console.log(
		chalk.cyan(
	      	`Attempting to bind to HOST environment variable: ${chalk.yellow(
	        	chalk.bold(process.env.HOST)
	      	)}`
	    )
	)
}

// config dev before open browser
const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(
	urlConfig.protocol, 
	urlConfig.host,
	urlConfig.port
);
const compiler = createCompiler(
  	webpack,
  	webpackConfigDev,
  	appName
);

const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);

devServer.listen(urlConfig.port, urlConfig.host, err => {
	if(err){
		return console.log(err);
	}
	const urlPath = `${urls.localUrlForBrowser}${userConfig.name}/${userConfig.apps[0]}`;
	console.log(chalk.cyan('Starting the development server...\n'));
	console.log(urlPath);
	console.log()
	openBrowser(urlPath);
})
