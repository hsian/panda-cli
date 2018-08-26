import BaseAuthority from "./BaseAuthority";
import {getStorage, setStorage} from "./utils";

export default class Authority extends BaseAuthority {

	get authrize(){
		const value = getStorage("authrize");
		return value || this.__authrize;
	}

	set authrize(auth){
		this.__authrize = auth;
		setStorage("authrize", auth);
	}

	get token(){
		const value = getStorage("token");
		return value || this.__token;
	}

	set token(token){
		this.__token = token;
		setStorage("token", token);
	}

}