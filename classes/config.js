"use strict";

export default class Config extends SGModel {
	
	static singleInstance = true;
		
	static defaultProperties = {
		sounds: true,
		music: false
	};
	
	static typeProperties = {
		sounds: SGModel.TYPE_BOOLEAN,
		music: SGModel.TYPE_BOOLEAN
	};
	
	static localStorageKey = "config";
}

new Config();