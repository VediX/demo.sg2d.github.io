"use strict";

import GraphicsPreparer from "./graphics-preparer.js";
import Config from "./config.js";
import Sound from "./sound.js";

export default class Menu extends SG2D.Model {
	
	static singleInstance = true;
		
	static promise = void 0;
	
	static defaultProperties = {
		expanded: false
	};
	
	static buttons = ["menu", "cancel", "sounds", "music"];
	
	static wh = 68;
	static wh05 = 68/2;
	
	initialize() {
		
		Menu.promise = new Promise((resolve, reject)=>(this.resolve = resolve));
		
		// Add a template circle for the mouse cursor above the round button
		
		document.querySelector("#main_menu").insertAdjacentHTML(
			"beforeend",
			"<svg id=\"svg_circle_clip\"><clippath id=\"circle_clip\" ><circle/></clippath></svg>"
		);
		
		let svgClip = document.querySelector("#svg_circle_clip");
		svgClip.setAttribute("width", Menu.wh);
		svgClip.setAttribute("height", Menu.wh);
		
		let circle = svgClip.querySelector("circle");
		circle.setAttribute("cx", Menu.wh05);
		circle.setAttribute("cy", Menu.wh05);
		circle.setAttribute("r", Menu.wh05);
		
		this.on("expanded", (expanded)=>{
			document.querySelectorAll(".menu-item").forEach(e=>{e.style.display = (expanded ? "block" : "none");});
			document.querySelector(".menu-item.menu").style.display = (! expanded ? "block" : "none");
		});
		
		this.onItemClick = this.onItemClick.bind(this);
	}
	
	async load() {
		GraphicsPreparer.promise.then(async function() {

			for (var i = 0; i < Menu.buttons.length; i++) {
				await this.buildMenuItem( Menu.buttons[i] );
			}
			
			this.updateIconMusic();
			this.updateIconSounds();

			document.querySelector("#main_menu").classList.remove("loading");
			
			this.resolve();
			
		}.bind(this));
		
		return Menu.promise;
	}
	
	static bindScene(scene) {
		scene.pointer.on("cursor", (cursor)=>{
			document.querySelector("#main_menu").style.cursor = scene.pointer.cursors[scene.pointer.properties.cursor];
		}, void 0, void 0, SGModel.FLAG_IMMEDIATELY);
	}
	
	async buildMenuItem(code) {
		let url = SG2D.Utils.getTextureUrl("ui/"+code+"_icon");
		let eDiv = document.querySelector(".menu-item."+code);
		eDiv.insertAdjacentHTML("beforeend",
		`<svg width="${Menu.wh}" height="${Menu.wh}">
			<image id="svg_menuitem_${code}" xlink:href="${await url}" width="${Menu.wh}" height="${Menu.wh}" x="0" y="0" clip-path="url(#circle_clip)" style="cursor: ${GraphicsPreparer.cursors.pointer}"/>
		</svg>`);
		
		let eSVG = document.querySelector("#svg_menuitem_" + code);
		eSVG.addEventListener("pointerup", this.onItemClick);
		eSVG.addEventListener("pointerover", this.onItemOver);
		
		return url;
	}
	
	async onItemClick(event) {
		let code = event.currentTarget.parentElement.parentElement.id.replace(/.*_/, "");
		switch (code) {
			case "menu": case "cancel": 
				this.set("expanded", ! this.properties.expanded);
				break;
			case "music":
				Sound.toggleMusic();
				this.updateIconMusic();
				break;
			case "sounds":
				Sound.toggleSounds();
				this.updateIconSounds();
				break;
		}
		
		if (SG2D.Sound.get("sounds")) {
			SG2D.Sound.play("button_ok");
		}
	}
	
	onItemOver(event) {
		SG2D.Sound.play("button_over");
	}
	
	async updateIconMusic() {
		let e = document.querySelector("#svg_menuitem_music");
		document.querySelector("#svg_menuitem_music").setAttribute(
			"href", 
			await SG2D.Utils.getTextureUrl("ui/music_icon" + (Sound.get("music") ? "" : "_off"))
		);
	}
	
	async updateIconSounds() {
		document.querySelector("#svg_menuitem_sounds").setAttribute(
			"href", 
			await SG2D.Utils.getTextureUrl("ui/sounds_icon" + (Sound.get("sounds") ? "" : "_off"))
		);
	}
}