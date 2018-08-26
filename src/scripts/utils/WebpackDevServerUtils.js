'use strict';

const url = require('url');
const address = require('address');
const chalk = require('chalk');
const moment = require("moment");
const clearConsole = require('./clearConsole');

function createCompiler(webpack, config, appName){
  let compiler;

  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'));
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle
  compiler.hooks.invalid.tap('invalid', () => {
    console.log('Compiling...');
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  compiler.hooks.done.tap('done', stats => {

    try{
      console.log(`startTime: ${moment(stats.startTime).format("YYYY MM DD, h:mm:ss")}`);
      console.log(`endTime: ${moment(stats.endTime).format("YYYY MM DD, h:mm:ss")}`);
      console.log();
      console.log(chalk.green(`${appName} compiled done!`));
    }catch(err){
      console.log(err)
    }
  })

  return compiler;
}

function prepareUrls(protocol, host, port) {
  const formatUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port,
      pathname: '/',
    });
  const prettyPrintUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname: '/',
    });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  let prettyHost, lanUrlForConfig, lanUrlForTerminal;
  if (isUnspecifiedHost) {
    prettyHost = 'localhost';
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = address.ip();
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (
          /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
            lanUrlForConfig
          )
        ) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host;
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  };
}

module.exports = {
  createCompiler,
  prepareUrls
}