"use strict";

import GraphicsPreparer from "./graphics-preparer.js";

export default class Menu extends SGModel {
		
	static promise = void 0;
	
	static defaultProperties = {
		expanded: false,
		menu_icon_hover: false,
		cancel_icon_hover: false,
		sounds_icon_hover: false,
		music_icon_hover: false,
		options_icon_hover: false,
		sounds_on: true,
		music_on: true
	};
	
	static buttons = ["menu", "cancel", "sounds", "music", "options"];
	
	initialize() {
		Menu.promise = new Promise((resolve, reject)=>(this.resolve = resolve));
	}
	
	load() {
		GraphicsPreparer.promise.then(async function() {

			for (var i = 0; i < Menu.buttons.length; i++) {
				document.querySelector("#"+Menu.buttons[i]+"_icon").src = await SG2D.Utils.getTextureUrl("ui/"+Menu.buttons[i]+"_icon");
			}

			document.querySelector("#main_menu").classList.remove("loading");

			this.resolve();
			
		}.bind(this));
		
		return Menu.promise;
	}
}