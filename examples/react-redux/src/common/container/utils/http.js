class Http {
	options = {};

	// 请求之前的hook
	uses = [];

	use(fn){
		this.uses.push(fn)
	};

	_requestBefore(){
		// 添加事件到uses
		this.uses.forEach((v,i) => {
			// 抛出options
			v(this.options);
		})
	};

	get(param){
		// request with options.header
	};

	post(){
		// request with options.header
	};

	// 获取本地的token，添加到this.option， 也可以通过this.use方法添加
	// src/core/authorize.js
	setHeader(){
		//设置header
	};

	remove(fn){
		const index = this.uses.findIndex(fn);
		this.uses.splice(index, 1)
	};
}

export default new Http