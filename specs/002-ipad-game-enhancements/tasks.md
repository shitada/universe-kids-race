# Tasks: iPadゲーム体験改善 — サウンド・ステージ拡張・演出強化

**Input**: Design documents from `/specs/002-ipad-game-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: TDD approach specified in plan.md constitution. Test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions that all subsequent phases depend on

- [X] T001 Update type definitions in src/types/index.ts — add `emoji: string`, `displayName: string`, `planetColor: number` to `StageConfig` interface; add `SFXType` type alias `'starCollect' | 'rainbowCollect' | 'meteoriteHit' | 'boost' | 'stageClear'`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: StageConfig expansion to 8 stages — blocking for US1 (stage-specific BGM), US3 (8 stages), US4 (stage length), US5 (particle colors), US6 (HUD display names)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Rewrite src/game/config/StageConfig.ts — expand `STAGE_CONFIGS` from 3 to 8 entries with new fields per contracts/stage-config.md: 月(1000/3.0/5/🌙/0xCCCCCC), 火星(1200/2.5/5/🔴/0xCC4422), 木星(1400/2.0/6/🟠/0xDD8844), 土星(1600/1.7/6/🪐/0xDDAA44), 天王星(1800/1.4/7/🔵/0x66CCDD), 海王星(2000/1.1/8/🫧/0x2244CC), 冥王星(2200/0.8/9/❄️/0xBBAAAA), 太陽(2500/0.6/10/☀️/0xFFCC00)
- [X] T003 [P] Create tests/unit/config/StageConfig.test.ts — validate 8 configs exist, stageNumber 1-8 sequential, stageLength increasing, meteoriteInterval decreasing, all new fields non-empty, getStageConfig() returns correct config for each stage

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — ステージプレイ中にBGMが流れる (Priority: P1) 🎯 MVP

**Goal**: Web Audio API によるプログラム生成 BGM をタイトル画面・各ステージ・エンディングで自動再生。iPad Safari の自動再生制限に対応。

**Independent Test**: ステージを開始し、BGM が自動的に再生されること。ステージクリア時に BGM が停止・切り替わること。

### Tests for User Story 1

- [X] T004 [P] [US1] Create tests/unit/audio/AudioManager.test.ts — mock AudioContext/OscillatorNode/GainNode; test init() creates AudioContext and resumes; test playBGM(stageNumber) starts oscillators; test stopBGM() stops playback; test playSFX(type) creates short-lived oscillators; test dispose() closes context; test all methods are no-op when init fails

### Implementation for User Story 1

- [X] T005 [US1] Rewrite src/game/audio/AudioManager.ts — remove Three.js Audio dependency; use native Web Audio API (AudioContext + OscillatorNode + GainNode); implement init() with AudioContext.resume() for iPad Safari; implement playBGM(stageNumber) with per-stage BGMConfig (melody array, tempo, waveform per contracts/synth-audio.md); implement stopBGM(); implement playSFX(type: SFXType) with 5 sound definitions per research.md R4; implement dispose(); all methods no-op when initialized=false
- [X] T006 [US1] Update src/main.ts — create shared AudioManager instance; pass to TitleScene, StageScene, EndingScene constructors
- [X] T007 [US1] Update src/game/scenes/TitleScene.ts — receive AudioManager via constructor (remove internal instantiation); call audioManager.init() on 「あそぶ」button pointerdown (no camera param); call audioManager.playBGM(0) for title BGM after init
- [X] T008 [US1] Update src/game/scenes/StageScene.ts — receive AudioManager via constructor; call audioManager.playBGM(stageNumber) in enter(); call audioManager.stopBGM() in exit()
- [X] T009 [US1] Update src/game/scenes/EndingScene.ts — receive AudioManager via constructor; call audioManager.playBGM(-1) or dedicated ending music on enter(); call audioManager.stopBGM() in exit()

**Checkpoint**: BGM plays on title screen, during each stage, and on ending. Audio resumes on iPad Safari after first tap.

---

## Phase 4: User Story 2 — 星を取った時に効果音が鳴る (Priority: P1)

**Goal**: 星収集・隕石衝突・ブースト・ステージクリアの各イベントで効果音を再生。

**Independent Test**: ステージ中に星を取ると効果音が鳴る。隕石衝突・ブースト・クリア時にも異なる効果音が鳴る。

### Implementation for User Story 2

- [X] T010 [US2] Integrate SFX triggers in src/game/scenes/StageScene.ts — call audioManager.playSFX('starCollect') on normal star collision; call audioManager.playSFX('rainbowCollect') on rainbow star collision; call audioManager.playSFX('meteoriteHit') on meteorite collision; call audioManager.playSFX('boost') on boost activation; call audioManager.playSFX('stageClear') in onStageClear()

**Checkpoint**: All 5 SFX types play at correct game events. Multiple SFX can play simultaneously.

---

## Phase 5: User Story 3 — 8つのステージで太陽系を巡る (Priority: P1)

**Goal**: 月→火星→木星→土星→天王星→海王星→冥王星→太陽の8ステージを順にプレイし、全クリアでエンディング。

**Independent Test**: ステージ1（月）からステージ8（太陽）まで順にプレイ可能。全クリアでエンディング画面表示。

### Implementation for User Story 3

- [X] T011 [P] [US3] Update src/game/storage/SaveManager.ts — change clearedStage validation upper bound from `> 3` to `> 8` in load()
- [X] T012 [P] [US3] Update src/main.ts — change `saveManager.save({ clearedStage: 3 })` to `saveManager.save({ clearedStage: 8 })` in ending transition handler
- [X] T013 [P] [US3] Update src/game/scenes/TitleScene.ts — change `Math.min(saveData.clearedStage + 1, 3)` to `Math.min(saveData.clearedStage + 1, 8)` for start stage calculation
- [X] T014 [US3] Expand createDestinationPlanet() in src/game/scenes/StageScene.ts — add 5 new planet cases using StageConfig.planetColor: 木星(orange sphere), 天王星(cyan sphere), 海王星(blue sphere), 冥王星(gray-white sphere), 太陽(yellow sphere + PointLight for glow effect); keep existing 月/火星/土星; or refactor to use planetColor generically with special case for 土星(ring) and 太陽(PointLight)
- [X] T015 [US3] Update handleStageComplete() in src/game/scenes/StageScene.ts — change `this.stageNumber >= 3` to `this.stageNumber >= 8` for ending transition condition
- [X] T016 [P] [US3] Update tests/unit/SaveManager.test.ts — adjust test expectations for 8-stage clearedStage validation (valid range 0-8, reject values > 8)
- [X] T017 [US3] Update tests/integration/StageFlow.test.ts — test 8-stage progression flow, verify transition to ending after stage 8

**Checkpoint**: Full 8-stage progression works. Save/load handles 8 stages. All planets render correctly.

---

## Phase 6: User Story 4 — ステージが十分な長さで遊びごたえがある (Priority: P2)

**Goal**: 各ステージの stageLength が旧値（500〜900）の約2〜3倍に延長され、難易度が段階的に上昇。

**Independent Test**: 各ステージをプレイし、十分な時間と操作機会があることを確認。

### Implementation for User Story 4

- [X] T018 [US4] Verify and fine-tune difficulty progression in src/game/config/StageConfig.ts — confirm stageLength (1000→2500) represents 2-3x increase from original (500→900); confirm meteoriteInterval (3.0→0.6) creates gradual difficulty curve; confirm starDensity (5→10) scaling is balanced; adjust values based on play-testing if needed

**Checkpoint**: Stage lengths feel 2-3x longer than before. Difficulty ramps smoothly from 月(easy) to 太陽(challenging).

---

## Phase 7: User Story 5 — 星を取った時にパーティクルバーストが出る (Priority: P2)

**Goal**: 星収集時にパーティクルバースト演出。通常星は金色20個、虹色星は多色50個。0.5〜1秒で消滅。最大同時10バースト。

**Independent Test**: 通常/虹色の星を収集し、パーティクルが表示・消滅すること。連続収集時もパフォーマンス低下なし。

### Tests for User Story 5

- [X] T019 [P] [US5] Create tests/unit/effects/ParticleBurst.test.ts — test ParticleBurst init adds Points to scene; test update() moves particles and decreases lifetime; test isExpired() returns true after lifetime; test dispose() removes from scene; test ParticleBurstManager pool limit (max 10); test oldest burst is recycled on overflow

### Implementation for User Story 5

- [X] T020 [US5] Create src/game/effects/ParticleBurst.ts — implement ParticleBurst class (THREE.Points + BufferGeometry with position/color/size attributes; radial velocity; linear size/opacity decay; per contracts/particle-system.md); implement ParticleBurstManager class (emit/update/cleanup/clear methods; object pool max 10; recycle oldest on overflow); normal star: 20 particles, 0xFFDD00, speed 5-10, lifetime 0.5s; rainbow star: 50 particles, random HSL, speed 8-15, lifetime 0.8s; use AdditiveBlending + depthWrite:false
- [X] T021 [US5] Integrate ParticleBurstManager in src/game/scenes/StageScene.ts — instantiate ParticleBurstManager; in collision handling, call emit() for each starCollision with position/color/isRainbow from star; call manager.update(deltaTime) and manager.cleanup(scene) in update loop; call manager.clear(scene) in exit()

**Checkpoint**: Gold particles burst on normal star collection. Rainbow particles burst on rainbow star collection. Particles fade out within 1 second. No performance issue with rapid collection.

---

## Phase 8: User Story 6 — HUD上部に現在のステージ名が表示される (Priority: P2)

**Goal**: HUD 上部にステージの天体絵文字＋ひらがな表示名を表示。既存スコア/星表示と干渉しない。

**Independent Test**: 各ステージで HUD 上部に正しいステージ名（例: 「🌙 月をめざせ！」）が表示されること。

### Implementation for User Story 6

- [X] T022 [US6] Add stage name display to src/ui/HUD.ts — add stageNameEl (HTMLDivElement) above existing flex container in show(); accept stageName parameter in show(stageName?: string); style: text-align center, font-family 'Zen Maru Gothic', color #FFD700, font-size 1.2rem, font-weight 700, padding 0.5rem; update hide() to remove element
- [X] T023 [US6] Pass stage display name to HUD from src/game/scenes/StageScene.ts — in enter(), construct display string `${stageConfig.emoji} ${stageConfig.displayName}` and pass to hud.show()

**Checkpoint**: Each stage shows correct emoji + destination name at HUD top. Text doesn't overlap with score or star count.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validation and final quality checks

- [X] T024 [P] Run full test suite (`npm run test`) and fix any failures
- [X] T025 [P] Run build validation (`npm run build`) and fix any type errors
- [X] T026 Run quickstart.md validation — verify all development commands work, confirm all modified/new files match quickstart.md file list

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (type definitions) — BLOCKS all user stories
- **US1 BGM (Phase 3)**: Depends on Phase 2 — AudioManager rewrite is the core deliverable
- **US2 SFX (Phase 4)**: Depends on Phase 3 — uses AudioManager.playSFX() implemented in US1
- **US3 8 Stages (Phase 5)**: Depends on Phase 2 — can run in parallel with Phase 3/4
- **US4 Stage Length (Phase 6)**: Depends on Phase 2 — verification/tuning only
- **US5 Particles (Phase 7)**: Depends on Phase 2 — can run in parallel with Phase 3/4/5
- **US6 HUD Name (Phase 8)**: Depends on Phase 2 — can run in parallel with Phase 3/4/5
- **Polish (Phase 9)**: Depends on all user story phases

### User Story Dependencies

- **US1 (BGM)**: Depends on Foundational only. Must complete before US2.
- **US2 (SFX)**: Depends on US1 (AudioManager rewrite provides playSFX method).
- **US3 (8 Stages)**: Depends on Foundational only. Independent of US1/US2.
- **US4 (Stage Length)**: Depends on Foundational only. Independent of all other stories.
- **US5 (Particles)**: Depends on Foundational only. Independent of US1/US2/US3.
- **US6 (HUD Name)**: Depends on Foundational only. Independent of US1/US2/US3.

### Within Each User Story

- Tests written FIRST, verify they fail
- Core modules before integration
- Integration into scenes last
- Story complete before checkpoint

### Parallel Opportunities

After Phase 2 completes, the following can run in parallel:
- **Stream A**: US1 → US2 (sequential, SFX depends on AudioManager)
- **Stream B**: US3 (8 stages — independent)
- **Stream C**: US5 (particles — independent)
- **Stream D**: US6 (HUD name — independent)
- **US4**: Lightweight verification, can fit anywhere

---

## Parallel Example: After Foundational Phase

```
         ┌─ Stream A: US1 (BGM) ──→ US2 (SFX)
Phase 2 ─┤─ Stream B: US3 (8 Stages)
 Done    ├─ Stream C: US5 (Particles)
         └─ Stream D: US6 (HUD Name) + US4 (Verify Lengths)
                                              ↓
                                      Phase 9: Polish
```

---

## Implementation Strategy

1. **MVP (Phase 1-3)**: Type definitions → StageConfig 8 stages → AudioManager rewrite + BGM integration. After this, the game has music and 8-stage config ready.
2. **Core Gameplay (Phase 4-5)**: SFX integration + 8-stage planet rendering + stage limits update. After this, the full 8-stage experience with sound is playable.
3. **Visual Polish (Phase 6-8)**: Stage length tuning + particle effects + HUD stage name. After this, the full feature set is complete.
4. **Validation (Phase 9)**: Test suite + build + quickstart validation.

---

## Files Summary

### New Files (4)
| File | Phase | Purpose |
|------|-------|---------|
| src/game/effects/ParticleBurst.ts | US5 | パーティクルバースト + プールマネージャ |
| tests/unit/audio/AudioManager.test.ts | US1 | AudioManager ユニットテスト |
| tests/unit/effects/ParticleBurst.test.ts | US5 | ParticleBurst ユニットテスト |
| tests/unit/config/StageConfig.test.ts | Phase 2 | StageConfig バリデーションテスト |

### Modified Files (10)
| File | Phase(s) | Changes |
|------|----------|---------|
| src/types/index.ts | Phase 1 | StageConfig に 3 フィールド追加、SFXType 追加 |
| src/game/config/StageConfig.ts | Phase 2 | 3→8 ステージ拡張、新規フィールド値設定 |
| src/game/audio/AudioManager.ts | US1 | 完全書き換え: Web Audio API ネイティブ実装 |
| src/game/scenes/TitleScene.ts | US1, US3 | 共有 AudioManager 受取、init 変更、startStage 上限 8 |
| src/game/scenes/StageScene.ts | US1-US6 | BGM/SFX 統合、8 惑星、パーティクル統合、HUD ステージ名 |
| src/game/scenes/EndingScene.ts | US1 | 共有 AudioManager 受取、ending BGM |
| src/ui/HUD.ts | US6 | ステージ名表示 DOM 要素追加 |
| src/main.ts | US1, US3 | 共有 AudioManager 生成、clearedStage: 8 |
| src/game/storage/SaveManager.ts | US3 | clearedStage 上限 3→8 |
| tests/unit/SaveManager.test.ts | US3 | 8 ステージ対応テスト更新 |
| tests/integration/StageFlow.test.ts | US3 | 8 ステージフロー検証 |
