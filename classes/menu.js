"use strict";

import GraphicsPreparer from "./graphics-preparer.js";

export default class Menu {
		
	static promise = void 0;
	
	static buttons = {
		menu: {
			texture: "menu_icon"
		},
		cancel: {
			texture: "cancel_icon"
		},
		sound: {
			texture: "sounds_icon"
		},
		music: {
			texture: "music_icon"
		},
		/*camera_rotating: {
			texture: "camera_rotating_icon"
		},
		options: {
			texture: "options_icon"
		}*/
	};
	
	static load() {
		this.promise = new Promise((resolve, reject)=>{
			GraphicsPreparer.promise.then(()=>{
				SG2D.Sound.on("sounds", (sound)=>{
					//this.set("music_icon_on", sound.music);
					//this.set("sounds_icon_on", sound.sounds);
				}, void 0, void 0, SG2D.Model.FLAG_IMMEDIATELY);
				resolve();
			});
		});
		return this.promise;
	}
	
	/*static defaultProperties = {
		menu_icon_hover: false,
		cancel_icon_hover: false,
		//options_icon_hover: false,
		sounds_icon_hover: false,
		sounds_icon_on: false,
		music_icon_hover: false,
		music_icon_on: false,
		//exit_icon_hover: false
	}*/
	
	/*initialize(properties, thisProps, options) {
		
		Promise.all([ // TODO: the music and sound icons in the menu display correctly the first time?
			this.application.graphicsPreparer.promise,
			this.application.options.promise
		]).then(()=>{
		
			this.baseInit(this.buttons);
			
			this.application.options.on("sound", (sound)=>{
				this.set("music_icon_on", sound.music);
				this.set("sounds_icon_on", sound.sounds);
			}, void 0, void 0, SG2D.Model.FLAG_IMMEDIATELY);
			
			this.on("view", (view)=>{
				var views = GameMenu.views[view];
				if (! views) { debugger; throw "Error 3272002!"; }
				for (var s in this.buttons) { this[this.buttons[s].propertyName].style.display = "none";};
				views.forEach(s=>{ this[this.buttons[s].propertyName].style.display = "block";});
			}, void 0, void 0, SG2D.Model.FLAG_IMMEDIATELY);

			GameMenu.promise.resolve();
		});
		
		this.application.on("view", (view)=>{
			if (view === "scene_options") {
				this.application.options.controls.screenShaders.disabled = true
				this.application.options.controls.screenShaders.parentNode.classList.add("disabled");
			} else {
				this.application.options.controls.screenShaders.disabled = false;
				this.application.options.controls.screenShaders.parentNode.classList.remove("disabled");
			}
		});
	}*/
	
	static initialize() {
		for (let id in this.buttons) {
			let fClick = this.buttons[id];
			let code = "e" + id.split("_").map(s=>SG2D.Model.upperFirstLetter(s)).join("");
			fClick.propertyName = code;
			let eIcon = this[code] = document.querySelector("#" + id);
			eIcon.addEventListener("click", fClick);
			eIcon.addEventListener("mouseover", ()=>{
				SG2DSound.play("button_over");
				this.set(id+"_hover", true);
			});
			eIcon.addEventListener("mouseout", ()=>this.set(id+"_hover", false));
			this.on(id+"_hover", this.drawIcon, void 0, eIcon, SG2D.Model.FLAG_IMMEDIATELY);
			if (this.properties.hasOwnProperty(id + "_on")) {
				this.on(id+"_on", this.drawIcon, void 0, eIcon, SG2D.Model.FLAG_IMMEDIATELY);
			}
		}
	}
	
	async drawIcon(eIcon) {
		var hover = this.properties[eIcon.id + "_hover"];
		var on = this.properties[eIcon.id + "_on"];
		var url = "interface/"+eIcon.id+(on !== void 0 ? (on ? "_on": "_off") : "") + (hover ? "_hover" : "");
		eIcon.src = await SG2DUtils.getTextureUrl(url);
	}
}