'use strict';

const argv = process.argv.slice(2) || [];
const spawn = require('cross-spawn');

// execute command
try{
	const jsonServer = spawn(
		'json-server',
		argv,
		{ stdio: 'inherit' }
	);

	const start = spawn(
		'npm',
		['start'],
		{ stdio: 'inherit' }
	);
}catch(err){
	console.log(err)
}
