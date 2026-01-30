/**
 * PEBBLES PUZZLES - Main Menu Scene
 */

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Animated background
    this.createBackground();

    // Title
    this.titleText = this.add.text(width / 2, height * 0.25, 'PEBBLES', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '72px',
      fontStyle: 'bold',
      color: '#4ade80',
      stroke: '#166534',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtitle
    this.subtitleText = this.add.text(width / 2, height * 0.35, 'PUZZLES', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '32px',
      color: '#94a3b8',
      letterSpacing: 8
    }).setOrigin(0.5);

    // Floating animation for title
    this.tweens.add({
      targets: this.titleText,
      y: height * 0.25 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Menu buttons
    this.createButton(width / 2, height * 0.55, 'Play', () => {
      this.scene.start('LevelSelectScene');
    });

    this.createButton(width / 2, height * 0.65, 'Settings', () => {
      this.showSettings();
    });

    // Version info
    this.add.text(width - 10, height - 10, 'v0.1.0 - POC', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: '#475569'
    }).setOrigin(1, 1);

    // Credits
    this.add.text(10, height - 10, 'Original concept by [Author]', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: '#475569'
    }).setOrigin(0, 1);
  }

  createBackground() {
    // Animated floating particles in background
    const graphics = this.add.graphics();

    // Create grid of subtle dots
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 15; y++) {
        const dotX = x * 50 + 25;
        const dotY = y * 50 + 25;
        const dot = this.add.circle(dotX, dotY, 2, 0x334155, 0.3);

        // Subtle pulse animation
        this.tweens.add({
          targets: dot,
          alpha: 0.1,
          duration: 2000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2000
        });
      }
    }

    // Floating pebble decorations
    for (let i = 0; i < 5; i++) {
      this.createFloatingPebble(
        100 + Math.random() * 600,
        100 + Math.random() * 400,
        0.3 + Math.random() * 0.3
      );
    }
  }

  createFloatingPebble(x, y, alpha) {
    const size = 15 + Math.random() * 15;
    const pebble = this.add.graphics();

    pebble.fillStyle(0x4ade80, alpha);
    pebble.fillCircle(0, 0, size);
    pebble.x = x;
    pebble.y = y;

    // Float animation
    this.tweens.add({
      targets: pebble,
      y: y - 20 - Math.random() * 20,
      x: x + (Math.random() - 0.5) * 40,
      duration: 3000 + Math.random() * 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Rotation
    this.tweens.add({
      targets: pebble,
      angle: 360,
      duration: 10000 + Math.random() * 5000,
      repeat: -1
    });
  }

  createButton(x, y, text, callback) {
    const buttonWidth = 200;
    const buttonHeight = 50;

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x1e293b, 1);
    bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);

    // Button border
    bg.lineStyle(2, 0x4ade80, 1);
    bg.strokeRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);

    // Button text
    const buttonText = this.add.text(x, y, text, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '20px',
      color: '#e2e8f0'
    }).setOrigin(0.5);

    // Make interactive
    const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x334155, 1);
      bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);
      bg.lineStyle(2, 0x4ade80, 1);
      bg.strokeRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);
      buttonText.setColor('#4ade80');
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x1e293b, 1);
      bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);
      bg.lineStyle(2, 0x4ade80, 1);
      bg.strokeRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 12);
      buttonText.setColor('#e2e8f0');
    });

    hitArea.on('pointerdown', callback);

    return { bg, buttonText, hitArea };
  }

  showSettings() {
    // TODO: Implement settings overlay
    console.log('Settings clicked - to be implemented');
  }
}
