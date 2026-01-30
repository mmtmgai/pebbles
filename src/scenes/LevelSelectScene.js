/**
 * PEBBLES PUZZLES - Level Select Scene
 */

class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const gameState = this.game.gameState;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title
    this.add.text(width / 2, 40, 'Select Level', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#4ade80'
    }).setOrigin(0.5);

    // Back button
    this.createBackButton();

    // Create world tabs
    this.currentWorld = 1;
    this.createWorldTabs(gameState);

    // Create level grid for current world
    this.levelContainer = this.add.container(0, 0);
    this.showWorld(this.currentWorld, gameState);
  }

  createBackButton() {
    const backBtn = this.add.text(20, 20, '← Back', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '18px',
      color: '#94a3b8'
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#4ade80'));
    backBtn.on('pointerout', () => backBtn.setColor('#94a3b8'));
    backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  createWorldTabs(gameState) {
    const width = this.cameras.main.width;
    const tabY = 90;
    const tabWidth = 100;
    const startX = (width - (Object.keys(WORLDS).length * tabWidth)) / 2;

    this.worldTabs = {};

    Object.keys(WORLDS).forEach((worldNum, index) => {
      const world = WORLDS[worldNum];
      const x = startX + index * tabWidth + tabWidth / 2;
      const isUnlocked = gameState.unlockedWorlds.includes(parseInt(worldNum));

      // Tab background
      const tab = this.add.graphics();
      const isActive = parseInt(worldNum) === this.currentWorld;

      this.drawTab(tab, x - tabWidth / 2 + 5, tabY, tabWidth - 10, 35, isActive, isUnlocked);

      // Tab text
      const tabText = this.add.text(x, tabY + 17, `W${worldNum}`, {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '16px',
        color: isUnlocked ? (isActive ? '#4ade80' : '#94a3b8') : '#475569'
      }).setOrigin(0.5);

      // Store reference
      this.worldTabs[worldNum] = { tab, tabText };

      // Make interactive if unlocked
      if (isUnlocked) {
        const hitArea = this.add.rectangle(x, tabY + 17, tabWidth - 10, 35, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });
        hitArea.on('pointerdown', () => {
          this.currentWorld = parseInt(worldNum);
          this.refreshTabs(gameState);
          this.showWorld(this.currentWorld, gameState);
        });
      }
    });
  }

  drawTab(graphics, x, y, w, h, isActive, isUnlocked) {
    graphics.clear();
    if (isActive) {
      graphics.fillStyle(0x334155, 1);
      graphics.lineStyle(2, 0x4ade80, 1);
    } else if (isUnlocked) {
      graphics.fillStyle(0x1e293b, 1);
      graphics.lineStyle(1, 0x475569, 1);
    } else {
      graphics.fillStyle(0x0f172a, 1);
      graphics.lineStyle(1, 0x1e293b, 1);
    }
    graphics.fillRoundedRect(x, y, w, h, 8);
    graphics.strokeRoundedRect(x, y, w, h, 8);
  }

  refreshTabs(gameState) {
    Object.keys(this.worldTabs).forEach(worldNum => {
      const { tab, tabText } = this.worldTabs[worldNum];
      const isActive = parseInt(worldNum) === this.currentWorld;
      const isUnlocked = gameState.unlockedWorlds.includes(parseInt(worldNum));

      this.drawTab(tab, tab.x, tab.y, 90, 35, isActive, isUnlocked);
      tabText.setColor(isUnlocked ? (isActive ? '#4ade80' : '#94a3b8') : '#475569');
    });
  }

  showWorld(worldNum, gameState) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Clear existing level cards
    this.levelContainer.removeAll(true);

    // Get levels for this world
    const worldLevels = LEVEL_ORDER.filter(id => LEVELS[id].world === worldNum);
    const world = WORLDS[worldNum];

    // World title
    const worldTitle = this.add.text(width / 2, 150, world.name, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '24px',
      color: '#e2e8f0'
    }).setOrigin(0.5);
    this.levelContainer.add(worldTitle);

    // World description
    const worldDesc = this.add.text(width / 2, 175, world.description, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '14px',
      color: '#64748b'
    }).setOrigin(0.5);
    this.levelContainer.add(worldDesc);

    // Level cards grid
    const cardsPerRow = 5;
    const cardWidth = 120;
    const cardHeight = 100;
    const cardGap = 15;
    const startX = (width - (Math.min(worldLevels.length, cardsPerRow) * (cardWidth + cardGap) - cardGap)) / 2;
    const startY = 220;

    worldLevels.forEach((levelId, index) => {
      const level = LEVELS[levelId];
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = startX + col * (cardWidth + cardGap);
      const y = startY + row * (cardHeight + cardGap);

      this.createLevelCard(x, y, cardWidth, cardHeight, level, gameState);
    });
  }

  createLevelCard(x, y, w, h, level, gameState) {
    const isCompleted = gameState.completedLevels.includes(level.id);
    const isUnlocked = gameState.isLevelUnlocked(level.id);

    // Card background
    const card = this.add.graphics();
    if (isCompleted) {
      card.fillStyle(0x166534, 1);
      card.lineStyle(2, 0x4ade80, 1);
    } else if (isUnlocked) {
      card.fillStyle(0x1e293b, 1);
      card.lineStyle(2, 0x475569, 1);
    } else {
      card.fillStyle(0x0f172a, 0.8);
      card.lineStyle(1, 0x1e293b, 1);
    }
    card.fillRoundedRect(x, y, w, h, 10);
    card.strokeRoundedRect(x, y, w, h, 10);
    this.levelContainer.add(card);

    // Level number
    const levelNum = level.id.split('-')[1];
    const numText = this.add.text(x + w / 2, y + 25, levelNum, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: isUnlocked ? '#e2e8f0' : '#475569'
    }).setOrigin(0.5);
    this.levelContainer.add(numText);

    // Level name
    const nameText = this.add.text(x + w / 2, y + 55, level.name, {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: isUnlocked ? '#94a3b8' : '#334155'
    }).setOrigin(0.5);
    this.levelContainer.add(nameText);

    // Difficulty stars
    const starsText = this.add.text(x + w / 2, y + 75, '★'.repeat(level.difficulty) + '☆'.repeat(5 - level.difficulty), {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '12px',
      color: isUnlocked ? '#fbbf24' : '#475569'
    }).setOrigin(0.5);
    this.levelContainer.add(starsText);

    // Completed checkmark
    if (isCompleted) {
      const check = this.add.text(x + w - 15, y + 10, '✓', {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '16px',
        color: '#4ade80'
      }).setOrigin(0.5);
      this.levelContainer.add(check);
    }

    // Lock icon for locked levels
    if (!isUnlocked) {
      const lock = this.add.text(x + w / 2, y + h / 2, '🔒', {
        fontSize: '24px'
      }).setOrigin(0.5);
      this.levelContainer.add(lock);
    }

    // Make clickable if unlocked
    if (isUnlocked) {
      const hitArea = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000, 0);
      hitArea.setInteractive({ useHandCursor: true });
      this.levelContainer.add(hitArea);

      hitArea.on('pointerover', () => {
        card.clear();
        card.fillStyle(isCompleted ? 0x22c55e : 0x334155, 1);
        card.lineStyle(2, 0x4ade80, 1);
        card.fillRoundedRect(x, y, w, h, 10);
        card.strokeRoundedRect(x, y, w, h, 10);
      });

      hitArea.on('pointerout', () => {
        card.clear();
        card.fillStyle(isCompleted ? 0x166534 : 0x1e293b, 1);
        card.lineStyle(2, isCompleted ? 0x4ade80 : 0x475569, 1);
        card.fillRoundedRect(x, y, w, h, 10);
        card.strokeRoundedRect(x, y, w, h, 10);
      });

      hitArea.on('pointerdown', () => {
        this.game.gameState.currentLevel = level.id;
        this.scene.start('GameScene', { levelId: level.id });
      });
    }
  }
}
