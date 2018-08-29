const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { webpackConfig } = require("./webpack.config");
const userConfig = require("./user.config");
const paths = require('./paths');

const cwd = process.cwd();
const { name } = userConfig;

module.exports = merge(
  webpackConfig,
  {
  	mode: 'development',
  	output:{
  		pathinfo: true,
		  path: paths.appBuild,  /* can add version "version&&isString(version)?`dist/${version}`:'dist'" */
		  filename: `[name]/js/[name].js`,
		  chunkFilename: '[name].chunk.js',
		  publicPath: `/${name}`
  	},
  	devtool: 'cheap-module-source-map',
  	plugins: [
      new webpack.HotModuleReplacementPlugin(),
  	]
  }
)



