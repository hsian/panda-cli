const { resolve } = require("path");
const assert = require('assert');
const { existsSync, readFileSync } = require('fs');
const cwd = process.cwd();
// bug
//const debug = require('debug')('getUserConfig');
// 监听配置文件变化
//import chokidar from 'chokidar';

function userConfig(){
	let userConfig = {
		name: "",
		port: "",
		proxy: {},
		apps: [],
		webpackConfig: {}
	}
	const fileName = 'panda.config.js';
	const resolveFile = resolve(cwd, fileName);
	let config = {}

	assert(
		existsSync(resolveFile),
		`${resolveFile} file can not exist.` 
	)

	if(existsSync(resolveFile)){
		delete require.cache[resolveFile];
		try{
			const {
				webpackConfig,
				apps,
				...config
			} = require(resolveFile);
			
		    // set webpack config
			if(webpackConfig){
				const type = typeof config.webpackConfig;
				if(type === 'function'){
					webpackConfig(userConfig.webpackConfig);
				}else if(type === 'object'){
					userConfig.webpackConfig = webpackConfig
				}
			}
			// multiple apps
			if(Array.isArray(apps)){
				userConfig.apps = apps;
			}else{
				throw new Error("apps type must be array.");
			}
			userConfig = {
				...userConfig,
				...config
			}
		}catch(e){
			console.error(e);
		}
	}

	return userConfig;
}

module.exports = userConfig();