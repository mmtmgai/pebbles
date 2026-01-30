# Pebbles Puzzles - Development Roadmap

## Current Version: 0.1.0 (POC)

### ✅ Completed
- [x] Core split mechanic
- [x] Multi-pebble simultaneous movement
- [x] Switch/pressure plate objectives
- [x] 21 levels across 7 worlds
- [x] Level select with world tabs
- [x] Progress saving (localStorage)
- [x] Tutorial overlay system
- [x] Lore/dialog system with typewriter effect
- [x] Placeholder synthesized sounds
- [x] Win detection and celebration
- [x] Move counter and timer

---

## Phase 1: Polish (v0.2.0)

### Visual Improvements
- [ ] Particle effects on split
- [ ] Trail effect when moving
- [ ] Screen shake on wall bump
- [ ] Better portal animation
- [ ] Animated background elements per world
- [ ] Smooth camera following (for larger levels)

### Audio
- [ ] Source or create music tracks (1 per world)
- [ ] Sound effects: move, split, switch, win, bump
- [ ] Ambient sounds per world
- [ ] Volume controls in settings menu

### UI/UX
- [ ] Settings menu (volume, controls display, reset progress)
- [ ] Pause menu
- [ ] Level complete stars (based on par moves/time)
- [ ] Hint system for stuck players
- [ ] Undo last move feature

---

## Phase 2: Content (v0.3.0)

### More Levels
- [ ] Expand to 50+ total levels
- [ ] Ensure smooth difficulty curve
- [ ] Add 3-5 challenge levels per world
- [ ] Secret/bonus levels unlocked by stars

### Story Integration
- [ ] Full Anu dialog sequences
- [ ] Character portraits/art
- [ ] Animated cutscenes at key moments
- [ ] The promise choice with real consequences
- [ ] Multiple endings implementation

### New Mechanics (Optional)
- [ ] Ice tiles (sliding)
- [ ] Pressure plates that require weight over time
- [ ] Teleporter tiles
- [ ] Light/dark areas (ties into light orb system from design doc)

---

## Phase 3: Polish & Share (v1.0.0)

### Accessibility
- [ ] Colorblind mode
- [ ] Screen reader support for menus
- [ ] Remappable controls
- [ ] Touch/mobile controls

### Sharing Features
- [ ] Share level completion on social media
- [ ] Level replay/ghost system
- [ ] Leaderboards (optional - requires backend)

### Platform Prep
- [ ] Responsive design for mobile browsers
- [ ] PWA manifest for "install as app"
- [ ] Electron wrapper for desktop build (optional)
- [ ] Itch.io page setup

---

## Future Ideas (Post 1.0)

- Level editor for user-created content
- Multiplayer/co-op mode (two players, one controls odd pebbles, one controls even)
- Daily challenge levels
- Speedrun mode with global leaderboards
- Integration with Game 2 (Pebbles Passage - the platformer)

---

## Asset Needs

### Art
| Asset | Priority | Status |
|-------|----------|--------|
| Pebble sprite/animation | High | Placeholder |
| Anu eyes/portrait | High | Placeholder |
| Wall tiles (per world) | Medium | Generated |
| Switch on/off states | Medium | Generated |
| Portal animation | Medium | Placeholder |
| Background per world | Low | Solid colors |
| UI icons | Low | Text-based |

### Audio
| Asset | Priority | Status |
|-------|----------|--------|
| Menu music | High | None |
| Gameplay music (7 tracks) | Medium | None |
| SFX: move | High | Synthesized |
| SFX: split | High | Synthesized |
| SFX: switch activate | High | Synthesized |
| SFX: win | High | Synthesized |
| SFX: bump/blocked | Medium | Synthesized |
| Ambient: The Void | Low | None |
| Anu voice (synth/effect) | Low | None |

---

## Technical Debt

- [ ] Add TypeScript for better code maintainability
- [ ] Implement proper state machine for game flow
- [ ] Add unit tests for level completion logic
- [ ] Optimize for mobile performance
- [ ] Add error boundaries/graceful failures

---

## How to Contribute

1. Pick an item from the roadmap
2. Create a branch: `feature/[item-name]`
3. Implement and test
4. Submit PR with description of changes

For level design:
- Create levels in `data/levels.js`
- Test thoroughly for solvability
- Aim for single elegant solution when possible
- Difficulty should feel fair, not frustrating
