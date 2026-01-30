/**
 * PEBBLES PUZZLES - Dialog Scene
 * Handles lore/story dialog sequences
 */

class DialogScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogScene' });
  }

  init(data) {
    this.loreId = data.loreId;
    this.returnScene = data.returnScene || 'GameScene';
    this.returnData = data.returnData || {};
  }

  create() {
    const lore = LORE[this.loreId];
    if (!lore) {
      this.scene.start(this.returnScene, this.returnData);
      return;
    }

    this.lore = lore;
    this.currentLine = 0;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add.rectangle(0, 0, width, height, 0x0a0a14).setOrigin(0);

    // Speaker portrait area (if applicable)
    if (lore.portrait) {
      this.createPortrait(lore.portrait);
    }

    // Dialog box
    this.dialogBox = this.add.graphics();
    this.dialogBox.fillStyle(0x1e293b, 0.9);
    this.dialogBox.fillRoundedRect(50, height - 180, width - 100, 150, 16);
    this.dialogBox.lineStyle(2, 0x4ade80, 0.5);
    this.dialogBox.strokeRoundedRect(50, height - 180, width - 100, 150, 16);

    // Speaker name
    if (lore.speaker) {
      this.speakerText = this.add.text(80, height - 170, lore.speaker, {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#4ade80'
      });
    }

    // Dialog text
    this.dialogText = this.add.text(80, height - 140, '', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '16px',
      color: '#e2e8f0',
      wordWrap: { width: width - 160 }
    });

    // Continue indicator
    this.continueText = this.add.text(width - 80, height - 50, '▼', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '16px',
      color: '#4ade80'
    }).setAlpha(0);

    // Animate continue indicator
    this.tweens.add({
      targets: this.continueText,
      y: height - 45,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Skip text
    if (lore.skipable) {
      this.add.text(width - 80, 20, 'ESC to skip', {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '12px',
        color: '#64748b'
      }).setOrigin(1, 0);
    }

    // Setup input
    this.input.keyboard.on('keydown-SPACE', () => this.advanceDialog());
    this.input.keyboard.on('keydown-ENTER', () => this.advanceDialog());
    this.input.on('pointerdown', () => this.advanceDialog());

    if (lore.skipable) {
      this.input.keyboard.on('keydown-ESC', () => this.endDialog());
    }

    // Start first line
    this.showLine(0);
  }

  createPortrait(portraitId) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // For now, create a simple placeholder based on portrait type
    const centerX = width / 2;
    const centerY = height / 2 - 50;

    if (portraitId.includes('anu')) {
      // Anu's eyes
      const eyeGroup = this.add.container(centerX, centerY);

      // Glow
      const glow = this.add.graphics();
      glow.fillStyle(0x4ade80, 0.2);
      glow.fillCircle(0, 0, 80);
      eyeGroup.add(glow);

      // Left eye
      const leftEye = this.add.graphics();
      leftEye.fillStyle(0x4ade80, 1);
      leftEye.fillEllipse(-30, 0, 20, 30);
      eyeGroup.add(leftEye);

      // Right eye
      const rightEye = this.add.graphics();
      rightEye.fillStyle(0x4ade80, 1);
      rightEye.fillEllipse(30, 0, 20, 30);
      eyeGroup.add(rightEye);

      // Pulse animation
      this.tweens.add({
        targets: glow,
        alpha: 0.5,
        duration: 2000,
        yoyo: true,
        repeat: -1
      });

      // Blink animation
      this.time.addEvent({
        delay: 3000 + Math.random() * 2000,
        callback: () => {
          this.tweens.add({
            targets: [leftEye, rightEye],
            scaleY: 0.1,
            duration: 100,
            yoyo: true
          });
        },
        loop: true
      });
    }
  }

  showLine(index) {
    if (index >= this.lore.lines.length) {
      this.endDialog();
      return;
    }

    const line = this.lore.lines[index];
    this.currentLine = index;

    // Clear and type out text
    this.dialogText.setText('');
    this.continueText.setAlpha(0);
    this.isTyping = true;

    // Typewriter effect
    let charIndex = 0;
    this.typeTimer = this.time.addEvent({
      delay: 30,
      callback: () => {
        charIndex++;
        this.dialogText.setText(line.text.substring(0, charIndex));

        if (charIndex >= line.text.length) {
          this.isTyping = false;
          this.continueText.setAlpha(1);
          this.typeTimer.remove();
        }
      },
      repeat: line.text.length - 1
    });
  }

  advanceDialog() {
    if (this.isTyping) {
      // Skip to end of current line
      this.typeTimer.remove();
      this.dialogText.setText(this.lore.lines[this.currentLine].text);
      this.isTyping = false;
      this.continueText.setAlpha(1);
    } else {
      // Go to next line
      this.showLine(this.currentLine + 1);
    }
  }

  endDialog() {
    // Check for choice
    if (this.lore.choice) {
      this.showChoice();
      return;
    }

    // Check for action
    if (this.lore.action) {
      this.executeAction(this.lore.action);
      return;
    }

    // Return to previous scene
    this.scene.start(this.returnScene, this.returnData);
  }

  showChoice() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const choice = this.lore.choice;

    // Hide continue indicator
    this.continueText.setAlpha(0);

    // Show question
    this.dialogText.setText(choice.question);

    // Create choice buttons
    choice.options.forEach((option, index) => {
      const y = height - 100 + index * 40;

      const btn = this.add.graphics();
      btn.fillStyle(0x334155, 1);
      btn.fillRoundedRect(100, y - 15, width - 200, 35, 8);

      const btnText = this.add.text(width / 2, y, option.text, {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '16px',
        color: '#e2e8f0'
      }).setOrigin(0.5);

      const hitArea = this.add.rectangle(width / 2, y, width - 200, 35, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      hitArea.on('pointerover', () => {
        btn.clear();
        btn.fillStyle(0x4ade80, 1);
        btn.fillRoundedRect(100, y - 15, width - 200, 35, 8);
        btnText.setColor('#1a1a2e');
      });

      hitArea.on('pointerout', () => {
        btn.clear();
        btn.fillStyle(0x334155, 1);
        btn.fillRoundedRect(100, y - 15, width - 200, 35, 8);
        btnText.setColor('#e2e8f0');
      });

      hitArea.on('pointerdown', () => {
        if (option.next) {
          // Go to next dialog
          this.scene.restart({ loreId: option.next, returnScene: this.returnScene, returnData: this.returnData });
        } else {
          this.scene.start(this.returnScene, this.returnData);
        }
      });
    });
  }

  executeAction(action) {
    switch (action) {
      case 'restart_world':
        // Restart from beginning of current world
        this.scene.start('LevelSelectScene');
        break;
      case 'restart_game':
        this.game.gameState.reset();
        this.scene.start('MenuScene');
        break;
      case 'show_credits':
        // TODO: Implement credits scene
        this.scene.start('MenuScene');
        break;
      default:
        this.scene.start(this.returnScene, this.returnData);
    }
  }
}
