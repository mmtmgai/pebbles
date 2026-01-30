/**
 * PEBBLES PUZZLES - Boot Scene
 * Handles initial loading and asset preparation
 */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: '24px',
      color: '#4ade80'
    }).setOrigin(0.5);

    // Progress bar background
    const progressBarBg = this.add.graphics();
    progressBarBg.fillStyle(0x1e293b, 1);
    progressBarBg.fillRoundedRect(width / 2 - 150, height / 2 - 10, 300, 20, 10);

    // Progress bar fill
    const progressBar = this.add.graphics();

    // Update progress bar as assets load
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x4ade80, 1);
      progressBar.fillRoundedRect(width / 2 - 148, height / 2 - 8, 296 * value, 16, 8);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBarBg.destroy();
      loadingText.destroy();
    });

    // For now, we're using generated graphics instead of loaded assets
    // When you have audio files, load them here:
    // this.load.audio('music_menu', 'assets/audio/menu.mp3');
    // this.load.audio('sfx_move', 'assets/audio/move.wav');
    // this.load.audio('sfx_split', 'assets/audio/split.wav');
    // this.load.audio('sfx_switch', 'assets/audio/switch.wav');
    // this.load.audio('sfx_win', 'assets/audio/win.wav');

    // Placeholder - load a tiny data URL to trigger the loading system
    this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  }

  create() {
    // Generate placeholder sounds using Web Audio API
    this.generatePlaceholderAudio();

    // Transition to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }

  generatePlaceholderAudio() {
    // This creates simple synthesized sounds as placeholders
    // These will be replaced with actual sound files later

    const audioContext = this.sound.context;
    if (!audioContext) return;

    // Store audio generation functions for later use
    this.game.audioGenerator = {
      playMove: () => this.playTone(audioContext, 440, 0.05, 'sine'),
      playSplit: () => this.playTone(audioContext, 660, 0.1, 'square'),
      playSwitch: () => this.playTone(audioContext, 880, 0.15, 'sine'),
      playWin: () => {
        this.playTone(audioContext, 523, 0.1, 'sine');
        setTimeout(() => this.playTone(audioContext, 659, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(audioContext, 784, 0.2, 'sine'), 200);
      },
      playBump: () => this.playTone(audioContext, 150, 0.05, 'square')
    };
  }

  playTone(context, frequency, duration, type) {
    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (e) {
      // Audio might not be available
    }
  }
}
