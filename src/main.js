/**
 * PEBBLES PUZZLES - Main Game Configuration
 */

const CONFIG = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  pixelArt: false,
  roundPixels: true,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: [
    BootScene,
    MenuScene,
    LevelSelectScene,
    GameScene,
    DialogScene
  ]
};

// Game state management
const GameState = {
  // Player progress
  currentLevel: null,
  completedLevels: [],
  unlockedWorlds: [1],

  // Current session stats
  moves: 0,
  startTime: 0,
  deaths: 0,

  // Seen tutorials/lore (don't repeat)
  seenTutorials: [],
  seenLore: [],

  // Settings
  settings: {
    musicVolume: 0.7,
    sfxVolume: 1.0,
    showTimer: true,
    showMoves: true
  },

  // Save/Load functionality
  save() {
    const data = {
      completedLevels: this.completedLevels,
      unlockedWorlds: this.unlockedWorlds,
      seenTutorials: this.seenTutorials,
      seenLore: this.seenLore,
      settings: this.settings
    };
    localStorage.setItem('pebbles_save', JSON.stringify(data));
  },

  load() {
    try {
      const data = JSON.parse(localStorage.getItem('pebbles_save'));
      if (data) {
        this.completedLevels = data.completedLevels || [];
        this.unlockedWorlds = data.unlockedWorlds || [1];
        this.seenTutorials = data.seenTutorials || [];
        this.seenLore = data.seenLore || [];
        this.settings = { ...this.settings, ...data.settings };
      }
    } catch (e) {
      console.log('No save data found or error loading');
    }
  },

  reset() {
    this.completedLevels = [];
    this.unlockedWorlds = [1];
    this.seenTutorials = [];
    this.seenLore = [];
    this.save();
  },

  completeLevel(levelId) {
    if (!this.completedLevels.includes(levelId)) {
      this.completedLevels.push(levelId);

      // Check if next world should unlock
      const level = LEVELS[levelId];
      if (level) {
        const worldLevels = LEVEL_ORDER.filter(id => LEVELS[id].world === level.world);
        const completedWorldLevels = worldLevels.filter(id => this.completedLevels.includes(id));

        // Unlock next world if all levels in current world are done
        if (completedWorldLevels.length === worldLevels.length) {
          const nextWorld = level.world + 1;
          if (!this.unlockedWorlds.includes(nextWorld) && WORLDS[nextWorld]) {
            this.unlockedWorlds.push(nextWorld);
          }
        }
      }

      this.save();
    }
  },

  isLevelUnlocked(levelId) {
    const level = LEVELS[levelId];
    if (!level) return false;

    // World must be unlocked
    if (!this.unlockedWorlds.includes(level.world)) return false;

    // First level in world is always available
    const worldLevels = LEVEL_ORDER.filter(id => LEVELS[id].world === level.world);
    if (worldLevels[0] === levelId) return true;

    // Otherwise, previous level must be completed
    const levelIndex = LEVEL_ORDER.indexOf(levelId);
    if (levelIndex <= 0) return true;
    return this.completedLevels.includes(LEVEL_ORDER[levelIndex - 1]);
  }
};

// Initialize game
window.onload = () => {
  GameState.load();
  const game = new Phaser.Game(CONFIG);
  game.gameState = GameState;
};
