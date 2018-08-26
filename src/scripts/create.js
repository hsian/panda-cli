'use strict';

// Process CLI arguments
const argv = process.argv.slice(3) || "";
const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');

const program = new commander.Command()
	.arguments('<app-name>')
	.option('--use-npm')
	.parse(process.argv);

createApp(
	program.args[1],
	// 手动下载
	program.useNpm 
);

function createApp(name, useNpm){
	checkAppName(name);
	fs.ensureDirSync(name);

	const root = path.resolve(name);
	const appName = path.basename(root);
	const useYarn = useNpm ? false : true;

	const packageJson = {
		name: appName,
		version: "0.1.0",
		private: true
	};

	fs.writeFileSync(
		path.join(root, 'package.json'),
		JSON.stringify(packageJson, null, 2) //+ os.EOL
	);

	process.chdir(root); // change dir
	install(root, appName, useYarn).then(() => {
		console.log("Installing packages finish!");

		// init new app
		const appPackage = require(path.join(root, 'package.json'));

		// Copy over some of the devDependencies
  		appPackage.dependencies = appPackage.dependencies || {};

  		// Setup the script rules
		appPackage.scripts = {
		    start: 'panda dev',
		    build: 'panda build',
		    test: 'panda test --env=jsdom',
		    mock: 'panda mock --watch db/db.json',
		};

		fs.writeFileSync(
		    path.join(root, 'package.json'),
		    JSON.stringify(appPackage, null, 2) + os.EOL
		);

		const readmeExists = fs.existsSync(path.join(root, 'README.md'));
		if (readmeExists) {
			fs.renameSync(
				path.join(root, 'README.md'),
				path.join(root, 'README.old.md')
			);
		}

		const templatePath = path.join("../../src", 'template');
		if(fs.existsSync(templatePath)){
			fs.copySync(templatePath, root);
		}else{
			console.error(
		    	`Could not locate supplied template: ${chalk.green(templatePath)}`
		    );
		    return;
		}
	});
}

function install(root, appName, useYarn){
	const depandencies = ['react', 'react-dom', /*"panda-cli"*/];
	console.log('Installing packages. This might take a couple of minutes.');

	return new Promise((resolve, reject) => {
		let command;
		let args;

		if(useYarn){
			command = 'yarnpkg';
			args = ['add', '--exact'];
			[].push.apply(args, depandencies);
		} else {
			command = 'npm';
			args = [
				'install',
				'--save',
				'--save-exact',
				'--loglevel',
				'error',
			].concat(depandencies);
		}

		const child = spawn(command, args, {stdio: 'inherit'});
		child.on('close', code => {
			if(code !== 0){
				reject({
					command
				});
				return;
			}
			resolve();
		});
	});
}

function checkAppName(appName){
	if(!appName){
		throw new Error("Please input a project name");
		process.exit(1);
	}
	console.log(
		chalk.green(
			`Creating a new React app project name: ${appName}`
		)
	);
	console.log();
}