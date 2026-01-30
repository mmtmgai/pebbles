/**
 * PEBBLES PUZZLES - Main Game Scene
 */

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelId = data.levelId || '1-1';
  }

  create() {
    this.level = LEVELS[this.levelId];
    if (!this.level) {
      console.error('Level not found:', this.levelId);
      this.scene.start('LevelSelectScene');
      return;
    }

    const gameState = this.game.gameState;

    // Reset session stats
    gameState.moves = 0;
    gameState.startTime = Date.now();

    // Calculate tile size based on grid
    this.calculateLayout();

    // Create game elements
    this.createBackground();
    this.createGrid();
    this.createPebbles();
    this.createUI();

    // Setup input
    this.setupInput();

    // Check for lore/tutorial
    this.checkLoreAndTutorial(gameState);

    // Track win state
    this.hasWon = false;
    this.isProcessingMove = false;
  }

  calculateLayout() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const gridWidth = this.level.grid[0].length;
    const gridHeight = this.level.grid.length;

    // Calculate tile size to fit grid with padding
    const maxTileWidth = (width - 100) / gridWidth;
    const maxTileHeight = (height - 150) / gridHeight;
    this.tileSize = Math.min(maxTileWidth, maxTileHeight, 50);

    // Center the grid
    this.gridOffsetX = (width - gridWidth * this.tileSize) / 2;
    this.gridOffsetY = (height - gridHeight * this.tileSize) / 2 + 30;
  }

  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const world = WORLDS[this.level.world];

    // World-specific background color
    this.add.rectangle(0, 0, width, height, world ? world.color : 0x1a1a2e).setOrigin(0);

    // Subtle grid pattern
    const gridPattern = this.add.graphics();
    gridPattern.lineStyle(1, 0xffffff, 0.03);

    for (let x = 0; x < width; x += 30) {
      gridPattern.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 30) {
      gridPattern.lineBetween(0, y, width, y);
    }
  }

  createGrid() {
    const grid = this.level.grid;
    this.tiles = [];
    this.switches = [];

    for (let y = 0; y < grid.length; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < grid[y].length; x++) {
        const tileType = grid[y][x];
        const screenX = this.gridOffsetX + x * this.tileSize;
        const screenY = this.gridOffsetY + y * this.tileSize;

        this.tiles[y][x] = { type: tileType, x, y };

        if (tileType === 1) {
          // Wall
          this.createWall(screenX, screenY);
        } else if (tileType === 2) {
          // Switch
          const switchObj = this.createSwitch(screenX, screenY, x, y);
          this.switches.push(switchObj);
        } else if (tileType === 5) {
          // Portal
          this.createPortal(screenX, screenY);
        } else if (tileType === 0) {
          // Floor (subtle)
          this.createFloor(screenX, screenY);
        }
      }
    }
  }

  createFloor(x, y) {
    const floor = this.add.graphics();
    floor.fillStyle(0xffffff, 0.02);
    floor.fillRoundedRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4, 4);
  }

  createWall(x, y) {
    const wall = this.add.graphics();

    // Main wall body
    wall.fillStyle(0x475569, 1);
    wall.fillRoundedRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2, 6);

    // Highlight
    wall.fillStyle(0x64748b, 0.5);
    wall.fillRoundedRect(x + 3, y + 3, this.tileSize - 8, 4, 2);

    // Shadow
    wall.fillStyle(0x1e293b, 0.5);
    wall.fillRoundedRect(x + 3, y + this.tileSize - 7, this.tileSize - 8, 4, 2);
  }

  createSwitch(x, y, gridX, gridY) {
    const centerX = x + this.tileSize / 2;
    const centerY = y + this.tileSize / 2;
    const radius = this.tileSize * 0.3;

    // Switch base (always visible)
    const base = this.add.graphics();
    base.fillStyle(0x334155, 1);
    base.fillCircle(centerX, centerY, radius + 4);
    base.lineStyle(2, 0x475569, 1);
    base.strokeCircle(centerX, centerY, radius + 4);

    // Switch indicator (changes when activated)
    const indicator = this.add.graphics();
    indicator.fillStyle(0x64748b, 1);
    indicator.fillCircle(centerX, centerY, radius);

    return {
      gridX,
      gridY,
      base,
      indicator,
      centerX,
      centerY,
      radius,
      isActive: false
    };
  }

  createPortal(x, y) {
    const centerX = x + this.tileSize / 2;
    const centerY = y + this.tileSize / 2;

    // Portal glow
    const glow = this.add.graphics();
    glow.fillStyle(0x4ade80, 0.3);
    glow.fillCircle(centerX, centerY, this.tileSize * 0.45);

    // Animate portal
    this.tweens.add({
      targets: glow,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  createPebbles() {
    this.pebbles = [];
    this.nextPebbleId = 0;

    this.level.startPos.forEach(pos => {
      const pebble = new Pebble(this, pos.x, pos.y, this.nextPebbleId++);
      pebble.container.x += this.gridOffsetX;
      pebble.container.y += this.gridOffsetY;
      this.pebbles.push(pebble);
    });

    this.updateSwitches();
  }

  createUI() {
    const width = this.cameras.main.width;

    // Level name
    this.add.text(width / 2, 20, `${this.level.worldName} - ${this.level.name}`, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#e2e8f0'
    }).setOrigin(0.5);

    // Pebble count
    this.pebbleCountText = this.add.text(20, 20, `Pebbles: ${this.pebbles.length}/4`, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '14px',
      color: '#4ade80'
    });

    // Move count
    this.moveCountText = this.add.text(20, 40, 'Moves: 0', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a3b8'
    });

    // Controls hint
    this.add.text(width / 2, this.cameras.main.height - 20, 'Arrow Keys: Move | Space: Split | R: Reset | Esc: Menu', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: '#64748b'
    }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(width - 20, 20, '✕', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '24px',
      color: '#64748b'
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#ef4444'));
    backBtn.on('pointerout', () => backBtn.setColor('#64748b'));
    backBtn.on('pointerdown', () => this.scene.start('LevelSelectScene'));
  }

  setupInput() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Space for split
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // R for reset
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Escape for menu
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update() {
    if (this.hasWon || this.isProcessingMove) return;

    // Check movement input
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
      this.movePebbles(0, -1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.wasd.down)) {
      this.movePebbles(0, 1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.wasd.left)) {
      this.movePebbles(-1, 0);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.wasd.right)) {
      this.movePebbles(1, 0);
    }

    // Check split
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.splitPebbles();
    }

    // Check reset
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.resetLevel();
    }

    // Check escape
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.start('LevelSelectScene');
    }
  }

  canMoveTo(x, y, excludePebbleId = null) {
    // Check bounds
    if (y < 0 || y >= this.level.grid.length) return false;
    if (x < 0 || x >= this.level.grid[0].length) return false;

    // Check wall
    if (this.level.grid[y][x] === 1) return false;

    // Check other pebbles
    for (const pebble of this.pebbles) {
      if (pebble.id !== excludePebbleId && pebble.gridX === x && pebble.gridY === y) {
        return false;
      }
    }

    return true;
  }

  movePebbles(dx, dy) {
    this.isProcessingMove = true;

    // Calculate target positions
    const moves = this.pebbles.map(pebble => {
      const newX = pebble.gridX + dx;
      const newY = pebble.gridY + dy;
      const canMove = this.canMoveTo(newX, newY, pebble.id);
      return { pebble, newX, newY, canMove };
    });

    // Check for conflicts (two pebbles trying to move to same spot)
    moves.forEach(move => {
      if (move.canMove) {
        const conflict = moves.some(other =>
          other !== move &&
          other.canMove &&
          other.newX === move.newX &&
          other.newY === move.newY
        );
        if (conflict) move.canMove = false;
      }
    });

    // Execute moves
    let anyMoved = false;
    let movesCompleted = 0;

    moves.forEach(move => {
      if (move.canMove) {
        anyMoved = true;
        move.pebble.moveTo(move.newX, move.newY, () => {
          movesCompleted++;
          if (movesCompleted === this.pebbles.length) {
            this.isProcessingMove = false;
            this.updateSwitches();
            this.checkWin();
          }
        });
      } else {
        move.pebble.bump(dx, dy);
        movesCompleted++;
        if (movesCompleted === this.pebbles.length) {
          this.isProcessingMove = false;
        }
      }
    });

    if (anyMoved) {
      this.game.gameState.moves++;
      this.moveCountText.setText(`Moves: ${this.game.gameState.moves}`);

      // Play move sound
      if (this.game.audioGenerator) {
        this.game.audioGenerator.playMove();
      }
    } else {
      // Play bump sound
      if (this.game.audioGenerator) {
        this.game.audioGenerator.playBump();
      }
    }
  }

  splitPebbles() {
    if (this.pebbles.length >= 4) return;

    const newPebbles = [];
    const gridWidth = this.level.grid[0].length;
    const gridHeight = this.level.grid.length;

    this.pebbles.forEach(pebble => {
      const directions = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
      ];

      directions.forEach(({ dx, dy }) => {
        const wallX = pebble.gridX + dx;
        const wallY = pebble.gridY + dy;
        const beyondX = pebble.gridX + dx * 2;
        const beyondY = pebble.gridY + dy * 2;

        // Check if there's a wall adjacent
        if (wallX >= 0 && wallX < gridWidth &&
            wallY >= 0 && wallY < gridHeight &&
            this.level.grid[wallY][wallX] === 1) {

          // Check if beyond the wall is valid
          if (beyondX >= 0 && beyondX < gridWidth &&
              beyondY >= 0 && beyondY < gridHeight &&
              this.level.grid[beyondY][beyondX] !== 1) {

            // Check if spot is occupied
            const occupied = [...this.pebbles, ...newPebbles].some(
              p => p.gridX === beyondX && p.gridY === beyondY
            );

            if (!occupied && this.pebbles.length + newPebbles.length < 4) {
              const newPebble = new Pebble(this, beyondX, beyondY, this.nextPebbleId++);
              newPebble.container.x += this.gridOffsetX;
              newPebble.container.y += this.gridOffsetY;
              newPebbles.push(newPebble);
            }
          }
        }
      });
    });

    if (newPebbles.length > 0) {
      this.pebbles.push(...newPebbles);
      this.pebbleCountText.setText(`Pebbles: ${this.pebbles.length}/4`);

      // Play split sound
      if (this.game.audioGenerator) {
        this.game.audioGenerator.playSplit();
      }

      this.updateSwitches();
    }
  }

  updateSwitches() {
    this.switches.forEach(switchObj => {
      const wasActive = switchObj.isActive;
      switchObj.isActive = this.pebbles.some(
        p => p.gridX === switchObj.gridX && p.gridY === switchObj.gridY
      );

      // Update visual
      switchObj.indicator.clear();
      if (switchObj.isActive) {
        switchObj.indicator.fillStyle(0xfbbf24, 1);
        switchObj.indicator.fillCircle(switchObj.centerX, switchObj.centerY, switchObj.radius);

        // Add glow effect
        switchObj.indicator.fillStyle(0xfbbf24, 0.3);
        switchObj.indicator.fillCircle(switchObj.centerX, switchObj.centerY, switchObj.radius + 5);

        if (!wasActive && this.game.audioGenerator) {
          this.game.audioGenerator.playSwitch();
        }
      } else {
        switchObj.indicator.fillStyle(0x64748b, 1);
        switchObj.indicator.fillCircle(switchObj.centerX, switchObj.centerY, switchObj.radius);
      }
    });
  }

  checkWin() {
    if (this.switches.length === 0) return;

    const allActive = this.switches.every(s => s.isActive);
    if (allActive) {
      this.hasWon = true;
      this.showWinScreen();
    }
  }

  showWinScreen() {
    // Play win animation
    this.pebbles.forEach(p => p.playWinAnimation());

    // Play win sound
    if (this.game.audioGenerator) {
      this.game.audioGenerator.playWin();
    }

    // Mark level complete
    this.game.gameState.completeLevel(this.levelId);

    // Show win overlay after animation
    this.time.delayedCall(800, () => {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Overlay
      const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

      // Win panel
      const panel = this.add.graphics();
      panel.fillStyle(0x1e293b, 1);
      panel.fillRoundedRect(width / 2 - 150, height / 2 - 100, 300, 200, 16);
      panel.lineStyle(3, 0x4ade80, 1);
      panel.strokeRoundedRect(width / 2 - 150, height / 2 - 100, 300, 200, 16);

      // Win text
      this.add.text(width / 2, height / 2 - 60, 'Level Complete!', {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#4ade80'
      }).setOrigin(0.5);

      // Stats
      this.add.text(width / 2, height / 2 - 20, `Moves: ${this.game.gameState.moves}`, {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '18px',
        color: '#e2e8f0'
      }).setOrigin(0.5);

      const elapsed = Math.floor((Date.now() - this.game.gameState.startTime) / 1000);
      this.add.text(width / 2, height / 2 + 5, `Time: ${elapsed}s`, {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '18px',
        color: '#e2e8f0'
      }).setOrigin(0.5);

      // Buttons
      this.createWinButton(width / 2 - 70, height / 2 + 50, 'Retry', () => {
        this.scene.restart({ levelId: this.levelId });
      });

      this.createWinButton(width / 2 + 70, height / 2 + 50, 'Next', () => {
        const currentIndex = LEVEL_ORDER.indexOf(this.levelId);
        if (currentIndex < LEVEL_ORDER.length - 1) {
          this.scene.restart({ levelId: LEVEL_ORDER[currentIndex + 1] });
        } else {
          this.scene.start('LevelSelectScene');
        }
      });
    });
  }

  createWinButton(x, y, text, callback) {
    const btn = this.add.graphics();
    btn.fillStyle(0x334155, 1);
    btn.fillRoundedRect(x - 50, y - 18, 100, 36, 8);
    btn.lineStyle(2, 0x4ade80, 1);
    btn.strokeRoundedRect(x - 50, y - 18, 100, 36, 8);

    const btnText = this.add.text(x, y, text, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '16px',
      color: '#e2e8f0'
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(x, y, 100, 36, 0x000000, 0).setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', () => {
      btn.clear();
      btn.fillStyle(0x4ade80, 1);
      btn.fillRoundedRect(x - 50, y - 18, 100, 36, 8);
      btnText.setColor('#1a1a2e');
    });

    hitArea.on('pointerout', () => {
      btn.clear();
      btn.fillStyle(0x334155, 1);
      btn.fillRoundedRect(x - 50, y - 18, 100, 36, 8);
      btn.lineStyle(2, 0x4ade80, 1);
      btn.strokeRoundedRect(x - 50, y - 18, 100, 36, 8);
      btnText.setColor('#e2e8f0');
    });

    hitArea.on('pointerdown', callback);
  }

  resetLevel() {
    this.scene.restart({ levelId: this.levelId });
  }

  checkLoreAndTutorial(gameState) {
    // Check for lore dialog
    if (this.level.loreId && !gameState.seenLore.includes(this.level.loreId)) {
      // Show lore - to be implemented with DialogScene
      gameState.seenLore.push(this.level.loreId);
      gameState.save();
    }

    // Check for tutorial
    if (this.level.tutorialId && !gameState.seenTutorials.includes(this.level.tutorialId)) {
      this.showTutorial(this.level.tutorialId);
      gameState.seenTutorials.push(this.level.tutorialId);
      gameState.save();
    }
  }

  showTutorial(tutorialId) {
    const tutorial = TUTORIALS[tutorialId];
    if (!tutorial) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Tutorial overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);
    overlay.setDepth(100);

    // Tutorial panel
    const panel = this.add.graphics();
    panel.setDepth(101);
    panel.fillStyle(0x1e293b, 0.95);
    panel.fillRoundedRect(width / 2 - 200, height / 2 - 60, 400, 120, 12);
    panel.lineStyle(2, 0x4ade80, 1);
    panel.strokeRoundedRect(width / 2 - 200, height / 2 - 60, 400, 120, 12);

    // Title
    const title = this.add.text(width / 2, height / 2 - 35, tutorial.title, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#4ade80'
    }).setOrigin(0.5).setDepth(102);

    // Text
    const text = this.add.text(width / 2, height / 2, tutorial.text, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '14px',
      color: '#e2e8f0',
      align: 'center'
    }).setOrigin(0.5).setDepth(102);

    // Dismiss text
    const dismiss = this.add.text(width / 2, height / 2 + 40, 'Press any key to continue', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: '#64748b'
    }).setOrigin(0.5).setDepth(102);

    // Close on any key
    const closeHandler = () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      text.destroy();
      dismiss.destroy();
      this.input.keyboard.off('keydown', closeHandler);
    };

    this.input.keyboard.on('keydown', closeHandler);
  }
}
