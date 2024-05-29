/**
 * SG2D Example
 * https://github.com/VediX/sg2d.github.io
 * (c) 2019-2021 Kalashnikov Ilya
 */

"use strict";

import Config from "./classes/config.js";
import GraphicsPreparer from "./classes/graphics-preparer.js";
import Sound from "./classes/sound.js";
import SceneEffects from "./classes/scene-effects.js";
import SceneUI from "./classes/scene-ui.js";
import Area from "./classes/area.js";
import Menu from "./classes/menu.js";
import Player from "./classes/player.js";

class Application {
	
	constructor() {
		
		window.app = this;
		
		let btnPlay = document.querySelector("#btnPlay");
		btnPlay.dataset.state = "ready";
		
		let callback = ()=>{
			
			btnPlay.removeEventListener("click", callback);
			
			btnPlay.dataset.state = "loading";
			
			Promise.all([
				GraphicsPreparer.load(),
				SG2D.Sound.load(Sound.options, Sound.getProperties()),
				(new Menu()).load()
			]).then(()=>{
				document.querySelector("#loader_screen").style.display = "none";
				document.querySelector("#game_screen").style.display = "block";
				let scene = this.createScene();
				
				// TODO: bug:
				//scene.promise.then(()=>SG2D.Sound.musicPlay("level01")); // Второй способ играть мелодию по кругу для указанной вьюхи
				
				Menu.bindScene(scene);
			});
		};
		
		btnPlay.addEventListener("click", callback);
	}
	
	createScene() {
		
		const cameraPosX = Config.bTest1 ? 128 * 64 : 224;
		const cameraPosY = Config.bTest1 ? 128 * 64 : 224;
		
		this.scene =  new SG2D.Application({
			id: "level01",
			canvasId: "canvas",
			cellsizepix: 64,
			clusters: {
				areasize: (Config.bTest1 ? 256 : 64)
			},
			pixi: { // config passed to PIXI.Application constructor
				antialias: true,
				autoStart: false
			},
			matter: { // config object pass to Matter.Engine.create() constructor
				gravity: { x: 0, y: 0 },
				broadphase: { bucketWidth: 64, bucketHeight: 64 }
			},
			camera: {
				rotation: true,
				rotate: 45, // Start rotate of camera. Default 0
				position: {x: cameraPosX, y: cameraPosY}, // Start position of camera. Default [0, 0]
				scale_min: (Config.bTest1 ? 1 : 2),
				scale_max: 10,
				movement_by_pointer: SG2D.Camera.MOVEMENT_BY_POINTER_RIGHT,
				rotate_adjustment: -90 // Base offset of the camera angle in degrees. Default 0
			},
			pointer: {
				cursors: GraphicsPreparer.cursors
			},
			iterate: this.iterate.bind(this),
			resize: this.resize.bind(this),
			layers: {
				bottom: {},
				fluids: {},
				grounds: {},
				roads: {},
				bodies: {},
				trees: {},
				animations: {},
				interface: { position: SG2D.Consts.LAYER_POSITION_FIXED, zIndex: 10 }
			},
			plugins: ["sg2d-transitions"],
			sound: {
				options: {
					music_dir: "./res/music/",
					sounds_dir: "./res/levels/01/",
					config: "./res/levels/01/sounds.json"
				},
				properties: {
					view: "level01"
				}
			}
		});
		
		let camera = this.scene.camera;

		// Print information to the console about the current scaling
		camera.on("scale", (scale)=>{
			SG2D.MessageToast.show({ text: "Scale: " + camera.getScale().percent + "%" });
		}, void 0, void 0, true);

		// Generate the map
		this.area = Area.build(this.scene.clusters);

		// Graphic effects
		this.sceneEffect = SceneEffects.toApply(this.scene);
		
		const playerX = Config.bTest1 ? 129 : 5;
		const playerY = Config.bTest1 ? 129 : 5;
		
		this.player = new Player({
			position: this.scene.clusters.getCluster(playerX, playerY).position,
			angle: 45
		}, {
			pointer: this.scene.pointer,
			camera: camera
		});
		
		this.sceneUI = SceneUI.toApply(this.scene, this.player);
		
		this.scene.run();
		
		camera.followTo(this.player);
		/* TODO:
		camera.setRelativity({
			follow: this.player, // The camera can move smoothly behind player. Also, camera can be moved to any on map, after which it will also move in parallel with player
			scaling: this.player, //TODO: The camera is zoomed relative to cursor position, or relative to tile
			rotation: this.player //TODO: The camera is rotated either relative to center of the screen, or relative to player
		});*/
		
		return this.scene;
	}
	
	iterate() {
		if (this.scene.frame_index % 30 === 0) {
			document.querySelector("#info > span:nth-child(1)").innerText = (1 / this.scene.tRequestAnimationFrame).toFixed(0); // FPS
			document.querySelector("#info > span:nth-child(2)").innerText = SG2D.Application.spritesCount + '/' + SG2D.Clusters.tiles.length; // Visible sprites / total
		}
	}
	
	resize() {
		this.sceneUI.resize();
	}
	
	destroy() {
		this.player.destroy();
		this.scene.destroy();
	}
}

new Application();