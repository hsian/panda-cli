export default class BaseAuthority {

	__authrize = "";
	__token = "";

	get authrize(){
		return this.__authrize;
	}

	set authrize(auth){
		this.__authrize = auth;
	}

	get token(){
		return this.__token;
	}

	set token(token){
		this.__token = token;
	}
}