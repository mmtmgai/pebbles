/**
 * PEBBLES PUZZLES - Pebble Character Class
 */

class Pebble {
  constructor(scene, gridX, gridY, id) {
    this.scene = scene;
    this.gridX = gridX;
    this.gridY = gridY;
    this.id = id;
    this.isMoving = false;

    // Create visual representation
    this.createGraphics();
  }

  createGraphics() {
    const tileSize = this.scene.tileSize;
    const x = this.gridX * tileSize + tileSize / 2;
    const y = this.gridY * tileSize + tileSize / 2;

    // Main container for all pebble graphics
    this.container = this.scene.add.container(x, y);

    // Shadow
    this.shadow = this.scene.add.ellipse(2, 4, tileSize * 0.7, tileSize * 0.3, 0x000000, 0.3);
    this.container.add(this.shadow);

    // Main body - clean vector style
    const bodyRadius = tileSize * 0.35;
    this.body = this.scene.add.graphics();
    this.drawBody(bodyRadius);
    this.container.add(this.body);

    // Eyes
    const eyeOffset = bodyRadius * 0.3;
    const eyeSize = bodyRadius * 0.25;

    this.leftEye = this.scene.add.circle(-eyeOffset, -eyeOffset * 0.5, eyeSize, 0x1a1a2e);
    this.rightEye = this.scene.add.circle(eyeOffset, -eyeOffset * 0.5, eyeSize, 0x1a1a2e);
    this.container.add(this.leftEye);
    this.container.add(this.rightEye);

    // Eye highlights
    this.leftHighlight = this.scene.add.circle(-eyeOffset + 2, -eyeOffset * 0.5 - 2, eyeSize * 0.3, 0xffffff);
    this.rightHighlight = this.scene.add.circle(eyeOffset + 2, -eyeOffset * 0.5 - 2, eyeSize * 0.3, 0xffffff);
    this.container.add(this.leftHighlight);
    this.container.add(this.rightHighlight);

    // Set depth so pebbles appear above tiles
    this.container.setDepth(10);

    // Add subtle idle animation
    this.addIdleAnimation();
  }

  drawBody(radius) {
    this.body.clear();

    // Gradient effect using multiple circles
    const colors = [0x4ade80, 0x22c55e, 0x16a34a];

    this.body.fillStyle(colors[2], 1);
    this.body.fillCircle(0, 2, radius);

    this.body.fillStyle(colors[1], 1);
    this.body.fillCircle(0, 0, radius);

    this.body.fillStyle(colors[0], 0.6);
    this.body.fillCircle(-radius * 0.3, -radius * 0.3, radius * 0.4);
  }

  addIdleAnimation() {
    // Subtle floating animation
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 2,
      duration: 1000 + Math.random() * 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtle scale pulse
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.02,
      scaleY: 0.98,
      duration: 800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  moveTo(newGridX, newGridY, onComplete) {
    if (this.isMoving) return;

    this.isMoving = true;
    this.gridX = newGridX;
    this.gridY = newGridY;

    const tileSize = this.scene.tileSize;
    const targetX = newGridX * tileSize + tileSize / 2;
    const targetY = newGridY * tileSize + tileSize / 2;

    // Stop idle animation during move
    this.scene.tweens.killTweensOf(this.container);

    // Movement tween with squash/stretch
    this.scene.tweens.add({
      targets: this.container,
      x: targetX,
      y: targetY,
      duration: 120,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.isMoving = false;
        this.addIdleAnimation();
        if (onComplete) onComplete();
      }
    });

    // Squash on start
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 60,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  bump(dx, dy) {
    // Play bump animation when hitting wall
    const bumpDistance = 3;
    const originalX = this.container.x;
    const originalY = this.container.y;

    this.scene.tweens.add({
      targets: this.container,
      x: originalX + dx * bumpDistance,
      y: originalY + dy * bumpDistance,
      duration: 50,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  split(newGridX, newGridY, newId) {
    // Create split effect
    const tileSize = this.scene.tileSize;

    // Flash effect on original
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 2
    });

    // Create and return new pebble
    return new Pebble(this.scene, newGridX, newGridY, newId);
  }

  playWinAnimation() {
    // Happy bounce
    this.scene.tweens.killTweensOf(this.container);
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 20,
      duration: 200,
      yoyo: true,
      repeat: 2,
      ease: 'Quad.easeOut'
    });

    // Spin
    this.scene.tweens.add({
      targets: this.container,
      angle: 360,
      duration: 600,
      ease: 'Quad.easeOut'
    });
  }

  destroy() {
    this.scene.tweens.killTweensOf(this.container);
    this.container.destroy();
  }
}
