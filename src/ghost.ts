import { Direction } from "./types/direction";

export default class Ghost {
  public ghost: Phaser.Physics.Arcade.Sprite;
  physics: Phaser.Physics.Arcade.ArcadePhysics;
  anims: Phaser.Animations.AnimationManager;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  spawnPoint = { x: 200, y: 200 };
  currentDirection: Direction = Direction.Down;

  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    anims: Phaser.Animations.AnimationManager,
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  ) {
    this.physics = physics;
    this.anims = anims;
    this.cursors = cursors;
    this.ghost = this.physics.add.sprite(
      this.spawnPoint.x,
      this.spawnPoint.y,
      "ghost_idle"
    );
    this.init();
  }

  init() {
    this.createIdleAnimations();
    this.createMoveAnimations();

    this.ghost.setScale(2);
    this.ghost.play("idle_down");
  }

  createMoveAnimations() {
    this.anims.create({
      key: "move_up",
      frames: this.anims.generateFrameNumbers("player_move", {
        start: 32,
        end: 35,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "move_down",
      frames: this.anims.generateFrameNumbers("player_move", {
        start: 43,
        end: 46,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "move_left",
      frames: this.anims.generateFrameNumbers("player_move", {
        start: 36,
        end: 39,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "move_right",
      frames: this.anims.generateFrameNumbers("player_move", {
        start: 24,
        end: 27,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  createIdleAnimations() {
    this.anims.create({
      key: "idle_down",
      frames: [{ key: "player_idle", frame: 7 }],
    });
    this.anims.create({
      key: "idle_left",
      frames: [{ key: "player_idle", frame: 6 }],
    });
    this.anims.create({
      key: "idle_right",
      frames: [{ key: "player_idle", frame: 4 }],
    });
    this.anims.create({
      key: "idle_up",
      frames: [{ key: "player_idle", frame: 5 }],
    });
  }

  handleMovement() {
    const speed = 100;
    let moved = false;

    this.ghost.setVelocity(0);

    const setMoved = (direction: Direction) => {
      this.currentDirection = direction;
      moved = true;
    };

    if (this.cursors?.left.isDown) {
      this.ghost.setVelocityX(-speed);
      setMoved(Direction.Left);
    } else if (this.cursors?.right.isDown) {
      this.ghost.setVelocityX(speed);
      setMoved(Direction.Right);
    }

    if (this.cursors?.up.isDown) {
      this.ghost.setVelocityY(-speed);
      setMoved(Direction.Up);
    } else if (this.cursors?.down.isDown) {
      this.ghost.setVelocityY(speed);
      setMoved(Direction.Down);
    }

    this.handleAnimationChange(moved);
  }

  handleAnimationChange(moved: boolean) {
    const currentAnim = this.ghost.anims.currentAnim?.key;
    const idleKey = "idle_" + this.currentDirection;
    const moveKey = "move_" + this.currentDirection;
    const key = moved ? moveKey : idleKey;

    if (currentAnim !== key) {
      this.ghost.play(moveKey);
    }
  }
}
