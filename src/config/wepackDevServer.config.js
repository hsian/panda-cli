'use strict';

const paths = require('./paths');
const webpackDevConfig = require('./webpack.config.dev');
const userConfig = require("./user.config");
const { port, proxy } = userConfig;

const urlConfig = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || port || 4000,
  protocol: process.env.HTTPS === 'true' ? 'https' : 'http'
}


// const createRewrites = () => {
//   return userConfig.apps.map(app => {
//     const _from = `${webpackDevConfig.output.publicPath}/${app}/`
//     return { from: new RegExp(_from), to: `/${app}/index.html` }
//   })
// }

const createDevServerConfig = function(allowedHost) {
  return {

    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',

    compress: true,

    clientLogLevel: 'none',

    contentBase: webpackDevConfig.output.path,

    watchContentBase: true,

    hot: true,

    publicPath:webpackDevConfig.output.publicPath,

    quiet: true,

    watchOptions: {
      ignored: ""
    },

    https: urlConfig.protocol === 'https',
    host: urlConfig.host,
    overlay: false,
    historyApiFallback: {
      rewrites: [
        {from: /\/react-redux-example\/portal/, to: '/portal/index.html' },
      ]
    },
    //public: allowedHost,
    proxy
  };
};

module.exports = {
  urlConfig,
  createDevServerConfig
}
