
'use strict';

function MultiHtmlWebpaclPlugin(options){
	options = options || {}
}

MultiHtmlWebpaclPlugin.prototype.apply = function(compiler){
	compiler.hooks.compilation.tap('MultiHtmlWebpaclPlugin', (compilation) => {
		console.log('The compiler is starting a MultiHtmlWebpaclPlugin compilation...');

		compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
			'MultiHtmlWebpaclPlugin',
			(data, cb) => {
				this.processCss(data);
				this.processJs(data);
				cb(null, data);
			}
		);
	})
};

MultiHtmlWebpaclPlugin.prototype.processCss = function(data){
	const {head = []} = data;
	head.forEach((attr, i) => {
		const href = attr.attributes.href;
		data.head[i].attributes.href = href.replace(/^\/[\w|\d|-]+\/?/, "./");
	})
	head.push({ 
		tagName: 'link',
    	selfClosingTag: false,
    	voidTag: true,
    	attributes: { href: '../vendors/css/vendors.chunk.css', rel: 'stylesheet' } 
    })
};

MultiHtmlWebpaclPlugin.prototype.processJs = function(data){
	const {body = []} = data;
	body.forEach((attr, i) => {
		const src = attr.attributes.src;
		data.body[i].attributes.src = src.replace(/^\/[\w|\d|-]+\/?/, "./");
	})
	data.body.push({
		tagName: 'script',
	    closeTag: true,
	    attributes: { type: 'text/javascript', src: '../vendors/js/vendors.chunk.js' } 
	})
};

module.exports = MultiHtmlWebpaclPlugin;