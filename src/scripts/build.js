'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');

const paths = require('../config/paths');
const config = require('../config/webpack.config.prod');

const formatWebpackMessages = require('./utils/formatWebpackMessages');
// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;
let compiler = webpack(config);

// start build
console.log(
	chalk.cyan('Creating an optimized production build...')
);

function preCompiler(){
	return new Promise((resolve, reject) => {
		fs.emptyDirSync(paths.appBuild);
		copyPublicFolder();
		resolve();
	})
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

preCompiler().then(() => {

	// build
	compiler.run((err, stats) => {
		if(err){
			return console.log(err);
		}
		const messages = formatWebpackMessages(stats.toJson({}, true));

		// errors
		if (messages.errors.length) {
		    // Only keep the first error. Others are often indicative
		    // of the same problem, but confuse the reader with noise.
		    if (messages.errors.length > 1) {
		      messages.errors.length = 1;
		    }
		    throw new Error(messages.errors.join('\n\n'));
		    return;
		}

		// warnings
		if (
	        process.env.CI &&
	        (typeof process.env.CI !== 'string' ||
	          process.env.CI.toLowerCase() !== 'false') &&
	        messages.warnings.length
	    ) {
	        console.log(
	          chalk.yellow(
	            '\nTreating warnings as errors because process.env.CI = true.\n' +
	              'Most CI servers set it automatically.\n'
	          )
	        );
	        throw new Error(messages.warnings.join('\n\n'));
	        return;
	    }

	    // json Stream
	    if (writeStatsJson) {
	    	bfj.write(paths.appBuild + '/bundle-stats.json', stats.toJson())
	        	.then(() => {
	        		console.log(chalk.green('Compiled successfully.\n'));
	        		process.exit(0);
	        	})
	        	.catch(error => reject(new Error(error)));
	    }else{
	    	console.log(chalk.green('Compiled successfully.\n'));
	    	process.exit(0);
	    }

	   
	});
}).catch(err => {
	if (err && err.message) {
    	console.log(err.message);
    }
    process.exit(1);
})


