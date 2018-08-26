const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MultiHtmlWebpaclPlugin = require('../plugins/multi-html-webpack-plugin');

const { webpackConfig } = require("./webpack.config");
const paths = require('./paths');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = merge(
	webpackConfig,
	{
		mode: 'production',
		output:{
	  		pathinfo: false,
			path: paths.appBuild,  
			filename: `[name]/js/[name].js`,
			chunkFilename: 'vendors/js/[name].chunk.js',
			publicPath: `/`
	  	},
		// Don't attempt to continue if there are any errors.
		bail: true,
		devtool: shouldUseSourceMap ? 'source-map' : false,
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						parse: {
						 	ecma: 8,
						},
						compress: {
				            ecma: 5,
				            warnings: false,
				            comparisons: false,
				        },
				        mangle: {
				        	safari10: true,
				        },
				        output: {
				        	ecma: 5,
				        	comments: false,
				        	ascii_only: true,
				        }
					},
					parallel: true,
					cache: true,
					sourceMap: shouldUseSourceMap,
				}),

				new OptimizeCSSAssetsPlugin({ }),
			],
			// Automatically split vendor and commons
			splitChunks: {
		    	chunks: 'all',
		    	name: 'vendors',
		    },
		    // Keep the runtime chunk seperated to enable long term caching
		    // 生成runtime文件夹
		    //runtimeChunk: true,
		},
		plugins: [
			new MultiHtmlWebpaclPlugin(),
			new MiniCssExtractPlugin({
	      		// Options similar to the same options in webpackOptions.output
	      		// both options are optional
	      		filename: '[name]/css/[name].[contenthash:8].css',
	      		chunkFilename: '[name]/css/[name].chunk.css',
	    	}),
			new ManifestPlugin({
		    	fileName: 'asset-manifest.json',
		    }),
		    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		],
		// Some libraries import Node modules but don't use them in the browser.
		// Tell Webpack to provide empty mocks for them so importing them works.
		node: {
	    	dgram: 'empty',
	    	fs: 'empty',
	    	net: 'empty',
	    	tls: 'empty',
	    	child_process: 'empty',
	  	},
	  	performance: false,
	}
)