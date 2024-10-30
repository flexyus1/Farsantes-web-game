# TODOs

## High Priority (Essential for Site Launch)
- [x] Migrate to farsant.es domain
- [x] Implement automatic daily puzzle generation
  - [ ] Create 90-game database (30 each: easy, medium, hard)
- [x] Add button to create new empty saveState
- [x] Add button to reset all saveState
- [x] Update saveState's Copy button to create one below existing one
- [ ] Add solution submission and validation
- [ ] Implement daily challenge
- [ ] Add puzzle sharing (copy-paste mechanism)

## Medium Priority (Improvements)
- [x] Create SaveState system
  - [x] Auto-update on changes
  - [x] Color-code based on solution status
- [ ] Add hint system
- [ ] Implement player statistics tracking
- [ ] Develop tutorial levels for new players

- [ ] Enhance light mode for better visibility
- [x] Redesign board layout for better readability (mobile focus)
- [x] Improve touch controls and responsiveness (mobile focus)
- [x] Implement blob targeting indicator for mobile
- [x] Adjust X and V icons to scale with blob size

- [ ] Add colorblind mode
- [ ] Implement scoring for clue types
  - [ ] Penalize redundant clues (e.g., "Horse: Horse is Legit")
  - [ ] Reward more informative clues (e.g., "John: All Oranges say the truth")
- [x] Remove clues that only reference themselves
- [ ] Use solve process to determine level difficulty
  - [ ] Reward combination tests
  - [ ] Penalize simple hypothesis tests
- [ ] Reduce score for repeated clues
- [ ] Award points for clue diversity
  - [ ] Balance color, side, and LiarAmount clues
- [ ] Implement time-based scoring
- [ ] Create achievements system
- [ ] Implement puzzle categories
- [ ] Implement undo/redo functionality

## Low Priority (Maybe)
- [ ] Handle multiple solutions
  - [ ] Valorize levels with different liars across solutions
  - [ ] Reward levels with diverse truthful blob tips
- [x] Expand SaveState system
  - [x] Add clone and create new SaveState options
  - [ ] Make available in expert mode or by configuration
- [ ] Create leaderboard for daily puzzles
- [ ] Implement custom puzzle creator
- [ ] Add localization for multiple languages:
  - Portuguese (Brazil)
  - English
  - Spanish
  - French
- [ ] Develop account system
- [ ] Create mobile app version
- [ ] Implement timed challenge mode