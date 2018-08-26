export function setStorage(key, value){
	window.localStorage.setItem(...arguments);
}

export function getStorage(key){
	return window.localStorage.getItem(key);
}