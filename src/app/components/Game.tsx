'use client';
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";


const getWindowSize = () => {
  if (typeof window === 'undefined') {
    return { width: 800, height: 600 }; // fallback values
  }
  return {
    width: "100%",
    height: "100%",
  };
};

const Game: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const { width, height } = getWindowSize();

    let player: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    const preload = function (this: Phaser.Scene) {
      this.load.image("obstacle", "/assets/rock.png");
      this.load.image("player", "/assets/pupa_game_final.png");
    };

    const create = function (this: Phaser.Scene) {
      // Add player
      player = this.physics.add.sprite(100, this.scale.height / 2, "player");
      player.setCollideWorldBounds(true);
      player.setScale(0.25).refreshBody();
      player?.body?.setSize(150, 280);

      // Input
      cursors = this.input?.keyboard?.createCursorKeys();

      // Set world bounds to support scrolling
      const worldWidth = this.scale.width * 4;
      const worldHeight = this.scale.height;
      this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
      this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
      this.cameras.main.startFollow(player);

      // Ground at bottom
      const ground = this.physics.add.staticGroup();
      const groundSegmentWidth = 200;
      const numSegments = Math.floor(worldWidth / groundSegmentWidth);
      const groundHeights: number[] = [];

      for (let i = 0; i < numSegments + 2; i++) {
        const x = i * groundSegmentWidth + groundSegmentWidth / 2;
        const groundY = this.scale.height - 100;

        groundHeights.push(groundY);

        const block = ground.create(x, groundY, "obstacle");
        block.setScale(2, 1).refreshBody();
        block.setDepth(1).refreshBody();
        block.body.setSize(200, 100).setOffset(0, 50);
      }

      this.physics.add.collider(player, ground);

      // Obstacles
      const obstacles = this.physics.add.staticGroup();

      for (let i = 0; i < numSegments; i++) {
        const x = Phaser.Math.Between(100, this.scale.width * 4 - 200);
        const y = groundHeights[i] - 190;

        const scale = Phaser.Math.FloatBetween(0.1, 0.2);
        const obstacle = obstacles.create(x, y, "obstacle");
        obstacle.setDepth(2).refreshBody();
        obstacle.setScale(scale, scale).refreshBody();
        obstacle.body.setSize(40, 40).setOffset(10, 10);
      }

      this.physics.add.collider(player, obstacles);
    };

    const update = function (this: Phaser.Scene) {
      if (!player || !cursors) return;

      player.setVelocityX(0);
      player.setDepth(3);

      if (cursors.left?.isDown) {
        player.setVelocityX(-160);
        // background.tilePositionX -= 1;
      } else if (cursors.right?.isDown) {
        player.setVelocityX(160);
        // background.tilePositionX += 1;
      } else if (cursors.up?.isDown) {
        player.setVelocityY(-320);
        // background.tilePositionX += 1;
      }

      if (
        cursors.up?.isDown &&
        player.body &&
        (player.body as Phaser.Physics.Arcade.Body).touching.down
      ) {
        player.setVelocityY(-400);
      }
    };

    // Initial game config
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      backgroundColor: "#62D5FB",
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 1000 } }, //, debug: true },
      },
      scene: { preload, create, update },
      scale: {
        mode: Phaser.Scale.RESIZE, // ensures canvas resizes
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    // window?.addEventListener("resize", resize);

    return () => {
      // window?.removeEventListener("resize", resize);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" style={{ width: "100%", height: "100vh" }} />;
};

export default Game;
