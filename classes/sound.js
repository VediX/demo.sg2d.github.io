"use strict";

import Config from "./config.js";

export default class Sound extends SG2D.Model {
	
	static singleInstance = true;
		
	static options = {
		music_dir: "./res/music/",
		sounds_dir: "./res/sounds/",
		config: "./res/sounds.json" // or object
	};
	
	static defaultProperties = {
		sounds: SG2D.Utils.ifUndefined(Config.get("sounds"), true),
		music: SG2D.Utils.ifUndefined(Config.get("music"), false),
		musicVolume: 10,
		volumeDecreaseDistance: 10, // units changes in clusters
		environment2D: true,
		view: "profile" // You can start the melodies in this way or in another way, see below
	};
	
	static toggleMusic() {
		let music = ! SG2D.Sound.get("music");
		SG2D.Sound.set("music", music);
		Config.set("music", music);
		this.set("music", music);
		Config.save();
	}
	
	static toggleSounds() {
		let sounds = ! SG2D.Sound.get("sounds");
		SG2D.Sound.set("sounds", sounds);
		Config.set("sounds", sounds);
		this.set("sounds", sounds);
		Config.save();
	}
}

new Sound();