---
description: Puzzle game about a mysterious creature that splits through walls
status: active
version: 0.1.0
started: 2026-01-26
---

# Pebbles Puzzles

A puzzle game about a mysterious creature who can split through walls.

## Concept

You control **Pebble**, a small creature that can split itself when passing through walls. Each split creates another Pebble you control simultaneously. Activate all switches to complete levels.

Narrative involves **Anu**, a mysterious guide with deeper motives.

## Tech Stack

- **Engine:** Phaser 3 (CDN, no build step)
- **Format:** Single `index.html` + modules
- **Storage:** localStorage for progress

## Quick Start

```bash
# No build needed!
open game/index.html
```

## Controls

| Key | Action |
|-----|--------|
| Arrow/WASD | Move all Pebbles |
| Spacebar | Split through wall |
| R | Reset level |
| Escape | Return to menu |

## Project Structure

```
game/
├── index.html          # Main entry
├── data/
│   ├── levels.js       # 21 levels, 7 worlds
│   └── lore.js         # Dialog content
└── src/
    ├── main.js         # Game config
    ├── objects/Pebble.js
    └── scenes/*.js     # Boot, Menu, LevelSelect, Game, Dialog
```

## Current Status (v0.1.0 POC)

✅ Core split mechanic  
✅ Multi-pebble movement  
✅ Switch objectives  
✅ 21 levels across 7 worlds  
✅ Progress saving  
✅ Tutorial system  
✅ Lore/dialog with typewriter effect

## Roadmap

See `game/ROADMAP.md` for full plan.

**Phase 1 (v0.2.0):** Polish — particles, audio, settings  
**Phase 2 (v0.3.0):** Content — 50+ levels, story, new mechanics  
**Phase 3 (v1.0.0):** Release — accessibility, mobile, itch.io

## Asset Needs

- Pebble sprite animation
- Anu portrait
- Music (7 world tracks)
- SFX (move, split, switch, win)

---

*Last updated: 2026-01-28*
