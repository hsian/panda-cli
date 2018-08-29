'use strict';

const paths = require('./paths');
const webpackDevConfig = require('./webpack.config.dev');
const userConfig = require("./user.config");
const { port, proxy, name, apps } = userConfig;

const urlConfig = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || port || 4000,
  protocol: process.env.HTTPS === 'true' ? 'https' : 'http'
}

const createDevServerConfig = function(allowedHost) {
  return {

    // disableHostCheck:
    //   !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',

    compress: true,

    clientLogLevel: 'none',

    contentBase: webpackDevConfig.output.path,

    watchContentBase: true,

    hot: true,

    publicPath: webpackDevConfig.output.publicPath,

    quiet: true,

    watchOptions: {
      ignored: ""
    },

    https: urlConfig.protocol === 'https',
    host: urlConfig.host,
    overlay: false,
    historyApiFallback: {
      //index: `/${name}/portal/index.html`,
      // rewrites: apps.map(app => {
      //   const path = `${name}/${app}`;
      //   return { 
      //     from: new RegExp(`((${path}(?=/)|(${path}$)))`),
      //     to: `${name}/${app}/index.html` 
      //   }
      // }),
      rewrites: {
        from: new RegExp(`react-redux-example/portal`),
        to: `/react-redux-example/portal/index.html` 
      }
    },
    //public: allowedHost,
    proxy: [
      {
        context: [
          `!${name}/portal/**`
        ]
      }
    ]
  };
};

module.exports = {
  urlConfig,
  createDevServerConfig
}
