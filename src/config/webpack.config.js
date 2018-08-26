const merge = require('webpack-merge');
const path = require("path");
const safe = require('postcss-safe-parser');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const userConfig = require("./user.config");
const paths = require('./paths');

const cwd = process.cwd();
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const { userWebpackConfig, apps = [] } = userConfig;
const cssRegex = /\.css$/;
const cssModuleRegex = /node_modules[\s\S]*.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /node_modules[\s\S]*.less$/;

const getEntry = (apps) => {
	return apps.reduce((appResult, app) => {
		appResult[app] =  [
			require.resolve('../asserts/js/polyfills'),
			path.resolve(cwd, `src/${app}/index.js`)
		]	
		if(isDev){
			appResult[app].unshift(
				require.resolve('../scripts/utils/hotDevClient/webpackHotDevClient')
			);
		}
		return appResult;
	}, {});
};

// common function to get style loaders
const getStyleLoaders = (styleType, options) => {
	const loaders = [
		isDev ? "style-loader": MiniCssExtractPlugin.loader,
		{
			loader: 'css-loader',
			options,
		},
		{
			loader: 'postcss-loader',
			options: {
	        	// Necessary for external CSS imports to work
	        	// https://github.com/facebook/create-react-app/issues/2677
	        	ident: 'postcss',
	       		plugins: () => [
	       			require('postcss-flexbugs-fixes'),
	         		autoprefixer({
	            		flexbox: 'no-2009',
	          		}),
	        	],
	        	sourceMap: shouldUseSourceMap,
	      	},
		}
	];
	if(styleType === "less"){
		loaders.push({
			loader: 'less-loader',
	        options: {
	            sourceMap: true,
	            javascriptEnabled: true 
	        }
		})
	}
	return loaders;
};

const getJsLoaders = () => {
	return [
		{
  			loader: require.resolve('thread-loader'),
  			options: {
    			poolTimeout: Infinity // keep workers alive for more effective watch mode
  			},
		},
		{
  			loader: require.resolve('babel-loader'),
  			options: {
    			babelrc: true,
    			compact: false,
    			presets: [
      	 			require.resolve('babel-preset-react-app'),
    			],
    			plugins: ['transform-decorators-legacy','transform-decorators'], // es7 语法
    			cacheDirectory: true,
    			highlightCode: true,
  			},
		},
	]
};

const createMutilHtmlPage = (apps) => {
  return apps.map(app => {
    return new HtmlWebpackPlugin({
        template: paths.appHtml,
        filename: `${path.join(cwd, 'dist')}/${app}/index.html`,
        alwaysWriteToDisk: true,
        chunks: [app],
        [isProd && "minify"]: {
	        removeComments: true,
	        collapseWhitespace: true,
	        removeRedundantAttributes: true,
	        useShortDoctype: true,
	        removeEmptyAttributes: true,
	        removeStyleLinkTypeAttributes: true,
	        keepClosingSlash: true,
	        minifyJS: true,
	        minifyCSS: true,
	        minifyURLs: true,
	    },
     });
  })
};

const baseWebpackConfig = {
	entry: getEntry(apps),
	resolve: {
		modules: ['node_modules'],
		// These are the reasonable defaults supported by the Node ecosystem.
		extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
		alias: {
			// '@babel/runtime': path.dirname(
		    // 	require.resolve('@babel/runtime/package.json')
			'react-native': 'react-native-web',
		},
	},
	module: {
		strictExportPresence: true,
    	rules: [
        	{
          		test: /\.js$/,
          		use: getJsLoaders()
        	},
        	{
	            test: cssRegex,
	            exclude: cssModuleRegex,
	            use: getStyleLoaders("css",{
					modules: true,
	            	//importLoaders: 1
	          	}),
	        },
	        {
	            test: cssModuleRegex,
	            use: getStyleLoaders("css", {
	            	// 兼容antd
	            	importLoaders: 1 
	          	}),
	        },
	        {
	            test: lessRegex,
	            exclude: lessModuleRegex,
	            use: getStyleLoaders("less", {
					modules: true,
	          	})
	        },
	        {
	            test: lessModuleRegex,
	            use: getStyleLoaders("less", {
	  	          	importLoaders: 1
	          	})
	        },
	        {
	            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
	            loader: require.resolve('url-loader'),
	            options: {
	              	limit: 10000,
	              	name: 'static/media/[name].[hash:8].[ext]',
	            },
	        },
	        {
	        	test: /\.(woff|woff2|svg|eot|ttf)$/,
	        	loader: require.resolve('url-loader'),
	            options: {
	                limit: isProd ? 8192 : -1,
	                name: `static/fonts/[hash:8].[name].[ext]`
	            }
	        }
    	]
  	},

	plugins: [
		...createMutilHtmlPage(apps)
	]
}

module.exports = {
	apps,
	webpackConfig: merge(
		userWebpackConfig,
		baseWebpackConfig
	)
};