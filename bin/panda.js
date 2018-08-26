#!/usr/bin/env node

'use strict';

// https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection
process.on('unhandledRejection', err => {
	throw err;
});

const spawn = require('cross-spawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex( x => (
	x === 'build' || x === 'start' || x === 'test' || x === 'mock'
));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

// panda -d build => ['-d']
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script){
	case '-v':
		const pkg = require('../package.json');
		console.log(pkg.version);
		break;
	case 'build':
	case 'dev':
	case 'create':
	case 'mock':
	case 'test':
		// exect child_process use spawn
		const result = spawn.sync(
			// command
			'node',
			// command args
			nodeArgs
				.concat(require.resolve('../src/scripts/' + script))
				.concat(args.slice(scriptIndex + 1)),
			{stdio: 'inherit'}
		);
		console.log(result.signal);
		process.exit(result.status);
		break;
	default:
		console.log(`Unknown script ${script}.`);
		break;
}
