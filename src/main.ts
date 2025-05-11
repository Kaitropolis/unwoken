import Phaser from "phaser";
import Player from "./player";
import type { Keys } from "./types/keys";
import "./style.css";

const screen = { width: 960, height: 640 };

export default class GameScene extends Phaser.Scene {
  player!: Player;
  keys!: Keys;

  constructor() {
    super("scene-game");
  }

  preload() {
    this.load.image("tiles", "assets/maps/factory/tiles.png");
    this.load.spritesheet("player_idle", "assets/sprites/player_idle.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("player_move", "assets/sprites/player_run.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.tilemapTiledJSON("map", "assets/maps/factory/factory-map.tmj");

    this.keys = this.input.keyboard!.addKeys(
      "W,S,A,D,UP,DOWN,LEFT,RIGHT"
    ) as Keys;
  }

  create() {
    const map = this.add.tilemap("map");
    const tiles = map.addTilesetImage("factory", "tiles")!;
    const groundLayer = map.createLayer("ground", tiles!)!;
    const obstaclesLayer = map.createLayer("obstacles", tiles!)!;

    this.player = new Player(this.physics, this.anims, this.keys);

    this.physics.add.collider(this.player.player, obstaclesLayer);
    obstaclesLayer.setCollisionBetween(0, 500);
  }

  update(time: number, delta: number): void {
    this.player.handleMovement();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: screen.width,
  height: screen.height,
  canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
game.scene.resume("scene-game");
