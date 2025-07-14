import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Game: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return; // Prevent multiple instances

    let player: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    // POSSIBLE CURSOR KEYS
    // up: Phaser.Input.Keyboard.Key;
    // down: Phaser.Input.Keyboard.Key;
    // left: Phaser.Input.Keyboard.Key;
    // right: Phaser.Input.Keyboard.Key;
    // space: Phaser.Input.Keyboard.Key;
    // shift: Phaser.Input.Keyboard.Key;

    // Scene lifecycle hooks
    const preload = function (this: Phaser.Scene) {
      this.load.image("player", "/assets/react.svg");
      this.load.image("background", "/assets/background.png");
      this.load.image("obstacle", "/assets/rock.png");
    };

    let background: Phaser.GameObjects.TileSprite;

    const create = function (this: Phaser.Scene) {
      background = this.add.tileSprite(400, 300, 800, 600, "background");
      player = this.physics.add.sprite(100, 450, "player");
      player.setCollideWorldBounds(true);

      cursors = this.input!.keyboard.createCursorKeys();

      // Create a static group of obstacles
      const obstacles = this.physics.add.staticGroup();
      // Enable collisions
      this.physics.add.collider(player, obstacles);
      this.physics.world.setBounds(0, 0, 5000, 600);
      this.cameras.main.setBounds(0, 0, 5000, 600);
      this.cameras.main.startFollow(player);

      // Place 5 random obstacles across the level
      for (let i = 0; i < 15; i++) {
        const x = Phaser.Math.Between(300, 5000); // spread them out horizontally
        const y = Phaser.Math.Between(550, 600); // ground level
        const scale = Phaser.Math.FloatBetween(0.05, 0.1);

        const obstacle = obstacles.create(x, y, "obstacle");
        obstacle.setScale(scale, scale).refreshBody(); // optional scale
      }

    };

    const update = function (this: Phaser.Scene) {
      if (!player || !cursors) return;

      player.setVelocityX(0);

      if (cursors.left?.isDown) {
        player.setVelocityX(-160);
        background.tilePositionX -= 220;
      } else if (cursors.right?.isDown) {
        player.setVelocityX(160);
        background.tilePositionX += 220;
        background.tilePositionX += 220;
      } else if (cursors.up?.isDown) {
        player.setVelocityY(-400);
      } else if (cursors.down?.isDown) {
        player.setVelocityY(160);
      }

      if (
        cursors.up.isDown &&
        player.body &&
        (player.body as Phaser.Physics.Arcade.Body).touching.down
      ) {
        player.setVelocityY(-330);
      }
    };

    // Phaser game config
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      //   backgroundColor: "#87ceeb",
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 1000 }, debug: true },
      },
      scene: { preload, create, update },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" />;
};

export default Game;
