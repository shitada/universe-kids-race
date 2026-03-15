# Tasks: うちゅうの たび — 宇宙船キッズゲーム

**Input**: Design documents from `/specs/001-space-travel-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — plan.md Constitution VI specifies TDD (Vitest)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, Vite + TypeScript + Three.js 環境構築

- [X] T001 Create project structure per plan.md (src/game/, src/ui/, src/types/, tests/unit/, tests/integration/)
- [X] T002 Initialize Vite + TypeScript project with Three.js dependency in package.json
- [X] T003 [P] Configure Vitest, tsconfig.json (ES2022 target), and vite.config.ts (base path for GitHub Pages)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: ゲームループ、シーン管理、入力システムなど全ユーザーストーリーが依存するコアインフラ

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define shared types (SceneType, SceneContext, SpeedState, StarType, InputState, StageConfig type, SaveData) in src/types/index.ts
- [X] T005 [P] Implement GameLoop (requestAnimationFrame, delta time calculation, pause/resume) in src/game/GameLoop.ts
- [X] T006 [P] Implement SceneManager (state machine, transitionTo, update, getCurrentThreeScene/Camera per scene-interface.md contract) in src/game/SceneManager.ts
- [X] T007 [P] Implement InputSystem (pointerdown/pointerup on canvas left/right half, touch-action:none, multi-touch cancel per game-systems.md contract) in src/game/systems/InputSystem.ts
- [X] T008 [P] Define StageConfig (3 stages: Moon/Mars/Saturn, meteoriteInterval, starDensity, stageLength per data-model.md) in src/game/config/StageConfig.ts
- [X] T009 Setup main.ts with Three.js WebGLRenderer, canvas, landscape viewport, and GameLoop/SceneManager initialization in src/main.ts

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — タイトル画面からステージ1を遊ぶ (Priority: P1) 🎯 MVP

**Goal**: ゲーム起動 → タイトル画面 → 「あそぶ」タッチ → ステージ1開始 → 宇宙船が自動前進 → 左右タッチ操作 → 月に到着 → クリア演出表示

**Independent Test**: タイトル画面の「あそぶ」ボタンをタッチし、左右操作で宇宙船を動かし、月に到着してクリア演出が表示されることを確認する

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Unit test for Spaceship (position, speed, boundary clamping, move left/right) in tests/unit/entities/Spaceship.test.ts
- [X] T011 [P] [US1] Unit test for SceneManager (scene transitions title→stage→ending) in tests/unit/SceneManager.test.ts

### Implementation for User Story 1

- [X] T012 [P] [US1] Create Spaceship entity (position, speed, moveLeft/moveRight, update with auto-forward, boundary clamping x min/max per data-model.md) in src/game/entities/Spaceship.ts
- [X] T013 [P] [US1] Implement TitleScene (3D starfield background, 「うちゅうの たび」title text, 「あそぶ」button, enter/update/exit/getThreeScene/getCamera per scene-interface.md) in src/game/scenes/TitleScene.ts
- [X] T014 [US1] Implement StageScene basics (create Three.js scene, place Spaceship, read InputSystem for left/right movement, auto-forward, progress tracking toward goal, destination planet rendering for Moon) in src/game/scenes/StageScene.ts
- [X] T015 [US1] Add clear effect display to StageScene (「やったね！」message with star count, transition to next scene after delay) in src/game/scenes/StageScene.ts
- [X] T016 [US1] Wire main.ts to launch TitleScene on startup and connect SceneManager scene transitions in src/main.ts

**Checkpoint**: At this point, User Story 1 should be fully functional — title → stage 1 → moon arrival → clear screen

---

## Phase 4: User Story 2 — 星を集めてスコアを稼ぐ (Priority: P1)

**Goal**: ステージ中に星が出現し、宇宙船が触れるとスコア加算。虹色のレア星はボーナス。HUD にスコアと星数を常時表示

**Independent Test**: ステージをプレイし、通常の星と虹色の星に接触してスコアと星の数が正しく加算されることを確認する

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [P] [US2] Unit test for Star (normal/rainbow types, scoreValue, isCollected flag) in tests/unit/entities/Star.test.ts
- [X] T018 [P] [US2] Unit test for CollisionSystem (bounding sphere star collisions, skip collected stars) in tests/unit/systems/CollisionSystem.test.ts
- [X] T019 [P] [US2] Unit test for ScoreSystem (addStarScore, getStageScore, getStarCount, finalizeStage, reset) in tests/unit/systems/ScoreSystem.test.ts
- [X] T020 [P] [US2] Unit test for SpawnSystem (star generation at correct density and position) in tests/unit/systems/SpawnSystem.test.ts

### Implementation for User Story 2

- [X] T021 [P] [US2] Create Star entity (position, radius, starType NORMAL/RAINBOW, scoreValue 100/500, isCollected, 3D mesh with MeshToonMaterial, rainbow hue animation) in src/game/entities/Star.ts
- [X] T022 [P] [US2] Implement ScoreSystem (addStarScore, stageScore/totalScore/starCount/totalStarCount tracking, finalizeStage, reset per game-systems.md contract) in src/game/systems/ScoreSystem.ts
- [X] T023 [US2] Implement SpawnSystem (spawn stars ahead of spaceship based on starDensity, 10% rainbow probability, deactivate passed objects per game-systems.md contract) in src/game/systems/SpawnSystem.ts
- [X] T024 [US2] Implement CollisionSystem (bounding sphere distance check between spaceship and stars, mark collected per game-systems.md contract) in src/game/systems/CollisionSystem.ts
- [X] T025 [US2] Implement HUD (DOM overlay displaying current score and star count at screen top, hiragana labels, large font per FR-012/FR-013) in src/ui/HUD.ts
- [X] T026 [US2] Integrate star spawning, collision detection, score tracking, and HUD into StageScene update loop in src/game/scenes/StageScene.ts

**Checkpoint**: At this point, stars appear in stages, collection works, score and star count display correctly

---

## Phase 5: User Story 3 — 隕石を避ける (Priority: P1)

**Goal**: 隕石が飛来し、宇宙船に当たるとスピード一時低下（ゲームオーバーなし）。数秒後に回復。かわいいダメージ演出

**Independent Test**: ステージ中に意図的に隕石に当たり、スピードダウン → 回復の挙動を確認する。ゲームが終了しないことを確認する

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T027 [P] [US3] Unit test for Meteorite (position, radius, isActive) in tests/unit/entities/Meteorite.test.ts
- [X] T028 [P] [US3] Unit test for CollisionSystem meteorite collisions (detect hit, skip during SLOWDOWN invincibility) in tests/unit/systems/CollisionSystem.test.ts

### Implementation for User Story 3

- [X] T029 [P] [US3] Create Meteorite entity (position, radius, isActive, 3D mesh DodecahedronGeometry + MeshToonMaterial gray/brown) in src/game/entities/Meteorite.ts
- [X] T030 [US3] Add meteorite spawning to SpawnSystem (spawn based on meteoriteInterval from StageConfig, deactivate passed meteorites) in src/game/systems/SpawnSystem.ts
- [X] T031 [US3] Add meteorite collision detection to CollisionSystem (bounding sphere check, invincibility during SLOWDOWN state) in src/game/systems/CollisionSystem.ts
- [X] T032 [US3] Implement slowdown mechanic in Spaceship (NORMAL→SLOWDOWN on hit, speedStateTimer 3s recovery, no game over per data-model.md SpeedState) in src/game/entities/Spaceship.ts
- [X] T033 [US3] Add cute damage reaction animation (gentle visual feedback, not scary, e.g. wobble + flash) in StageScene in src/game/scenes/StageScene.ts

**Checkpoint**: At this point, meteorites appear, slowdown/recovery works, no game over, full P1 core loop complete

---

## Phase 6: User Story 4 — ブーストで加速する (Priority: P2)

**Goal**: ブーストボタンタッチで一時加速、エフェクト表示、制限時間後に通常速度復帰。隕石接触でブースト解除

**Independent Test**: ブーストボタンを押して加速を確認し、一定時間後に通常速度に戻ることを確認する

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T034 [P] [US4] Unit test for BoostSystem (activate, update timer, cancel on meteorite, cooldown, isAvailable/isActive per game-systems.md) in tests/unit/systems/BoostSystem.test.ts

### Implementation for User Story 4

- [X] T035 [US4] Implement BoostSystem (activate, 3s duration, 5s cooldown, cancel on meteorite, 2x speed multiplier per game-systems.md contract) in src/game/systems/BoostSystem.ts
- [X] T036 [US4] Add boost button UI overlay (HTML button element above canvas, touch handler setting boostPressed in InputSystem) in src/ui/HUD.ts
- [X] T037 [US4] Add boost visual effects (speed lines, glow, or trail particles during BOOST state) in StageScene in src/game/scenes/StageScene.ts
- [X] T038 [US4] Integrate BoostSystem into StageScene (connect InputSystem boostPressed → activate, meteorite hit → cancel, update Spaceship speed state NORMAL→BOOST→COOLDOWN) in src/game/scenes/StageScene.ts

**Checkpoint**: At this point, boost feature is fully functional with effects and meteorite interaction

---

## Phase 7: User Story 5 — 3ステージを順にクリアしてエンディングを見る (Priority: P2)

**Goal**: ステージ1(月)→2(火星)→3(土星)を順にクリア。段階的難易度上昇。エンディング画面で総スコア表示

**Independent Test**: ステージ1からステージ3まで順番にクリアし、各ステージ間の遷移とエンディング画面の表示を確認する

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T039 [P] [US5] Integration test for stage flow (title → stage1 → stage2 → stage3 → ending → title) in tests/integration/StageFlow.test.ts

### Implementation for User Story 5

- [X] T040 [US5] Add stage-specific 3D backgrounds and destination planets (Moon=gray/white SphereGeometry, Mars=red SphereGeometry, Saturn=yellow SphereGeometry + ring) to StageScene in src/game/scenes/StageScene.ts
- [X] T041 [US5] Implement stage transition logic in SceneManager (stage N clear → stage N+1, stage 3 clear → ending, pass totalScore/totalStarCount via SceneContext) in src/game/SceneManager.ts
- [X] T042 [US5] Implement EndingScene (「うちゅうの たびは おしまい！」message, total score display, total star count, return to title button per scene-interface.md) in src/game/scenes/EndingScene.ts
- [X] T043 [US5] Verify difficulty progression (Stage1: meteoriteInterval=3s, Stage2: 2s, Stage3: 1s per StageConfig) and adjust StageScene to use stageNumber-specific config in src/game/scenes/StageScene.ts

**Checkpoint**: At this point, full 3-stage game flow with ending is playable

---

## Phase 8: User Story 6 — サウンドとBGMで没入感を得る (Priority: P3)

**Goal**: ポップなBGM再生、星取得・隕石接触・クリア・ブースト時の効果音。iPad Safari AudioContext 制約対応

**Independent Test**: 各場面（BGM、星取得、隕石接触、クリア）で適切な音が再生されることを確認する

### Implementation for User Story 6

- [X] T044 [P] [US6] Implement AudioManager (init with AudioContext.resume on user gesture, THREE.Audio for BGM, THREE.PositionalAudio for spatial SFX, MP3 loading per audio-storage.md contract) in src/game/audio/AudioManager.ts
- [X] T045 [US6] Initialize AudioContext on 「あそぶ」button touch in TitleScene (iPad Safari requires user gesture) in src/game/scenes/TitleScene.ts
- [X] T046 [US6] Add BGM playback start/stop on stage enter/exit in StageScene in src/game/scenes/StageScene.ts
- [X] T047 [US6] Add sound effects triggers (starCollect on star collision, meteoriteHit on meteorite collision, stageClear on goal, boost on activate) in StageScene in src/game/scenes/StageScene.ts

**Checkpoint**: At this point, all audio is functional — BGM and sound effects play at appropriate moments

---

## Phase 9: User Story 7 — 進行状況が保存される (Priority: P3)

**Goal**: ステージクリア状況を localStorage に保存。再起動時に続きから。エンディング後リセット

**Independent Test**: ステージ1クリア後にアプリを終了し、再起動してステージ2から始まることを確認する

### Tests for User Story 7

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T048 [P] [US7] Unit test for SaveManager (load with fallback, save, clear, JSON parse error handling) in tests/unit/SaveManager.test.ts

### Implementation for User Story 7

- [X] T049 [US7] Implement SaveManager (load/save/clear with localStorage key 'universe-kids-race-save', JSON parse try-catch fallback per audio-storage.md contract) in src/game/storage/SaveManager.ts
- [X] T050 [US7] Save clearedStage on each stage clear in SceneManager in src/game/SceneManager.ts
- [X] T051 [US7] Load saved progress on app start and pass to TitleScene to determine starting stage (clearedStage+1) in src/game/scenes/TitleScene.ts
- [X] T052 [US7] Reset save data (clearedStage=0) after ending display in EndingScene in src/game/scenes/EndingScene.ts

**Checkpoint**: At this point, progress persistence is fully functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: エッジケース対応、パフォーマンス最適化、最終検証

- [X] T053 [P] Implement auto-pause on background (document.visibilitychange → GameLoop pause/resume per FR-019) in src/game/GameLoop.ts
- [X] T054 [P] Handle edge case: star and meteorite overlap (apply both effects per spec Edge Cases) in src/game/systems/CollisionSystem.ts
- [X] T055 Performance optimization for iPad Safari 60fps (object pooling, draw call reduction, confirm max 50 objects per R1) across src/game/
- [X] T056 Verify iPad Safari landscape-only layout and touch-action:none on canvas in src/main.ts and index.html
- [X] T057 Run quickstart.md validation (npm run dev, npm run build, npm run test all pass)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–9)**: All depend on Foundational phase completion
  - P1 stories (US1 → US2 → US3) should be done sequentially as each builds on prior
  - P2 stories (US4, US5) can start after US1–US3, can be parallel with each other
  - P3 stories (US6, US7) can start after Foundational, independent of each other
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependencies on other stories. Establishes core game loop
- **US2 (P1)**: After US1 — needs StageScene and Spaceship from US1 to integrate star collisions
- **US3 (P1)**: After US2 — extends SpawnSystem and CollisionSystem created in US2
- **US4 (P2)**: After US3 — needs Spaceship speed states and meteorite interaction from US3
- **US5 (P2)**: After US1 — needs basic StageScene and SceneManager transitions. Can parallel with US4
- **US6 (P3)**: After Foundational — AudioManager is independent, but integration needs StageScene from US1
- **US7 (P3)**: After Foundational — SaveManager is independent, but integration needs SceneManager from US1

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Entities before systems
- Systems before scene integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks T005–T008 marked [P] can run in parallel
- Within US1: T010–T011 (tests) in parallel, then T012–T013 (entities/scenes) in parallel
- Within US2: T017–T020 (tests) in parallel, then T021–T022 (entity/system) in parallel
- Within US3: T027–T028 (test/entity) in parallel
- US4 and US5 can proceed in parallel after US3
- US6 and US7 can proceed in parallel
- Polish tasks T053–T054 can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all tests for US2 together:
Task T017: "Unit test for Star in tests/unit/entities/Star.test.ts"
Task T018: "Unit test for CollisionSystem in tests/unit/systems/CollisionSystem.test.ts"
Task T019: "Unit test for ScoreSystem in tests/unit/systems/ScoreSystem.test.ts"
Task T020: "Unit test for SpawnSystem in tests/unit/systems/SpawnSystem.test.ts"

# Then launch independent entity/system implementations:
Task T021: "Create Star entity in src/game/entities/Star.ts"
Task T022: "Implement ScoreSystem in src/game/systems/ScoreSystem.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: タイトル→ステージ1→月到着→クリア演出が動作するか確認
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → タイトル→ステージ1→クリア (MVP!) → Deploy/Demo
3. US2 → 星の収集とスコア表示追加 → Deploy/Demo
4. US3 → 隕石と障害物追加（P1コアループ完成） → Deploy/Demo
5. US4 → ブースト機能追加 → Deploy/Demo
6. US5 → 全3ステージ+エンディング → Deploy/Demo
7. US6 → BGM・効果音追加 → Deploy/Demo
8. US7 → セーブ機能追加 → Deploy/Demo
9. Polish → パフォーマンス最適化・エッジケース → Final Release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 → US2 → US3 (P1 core loop, sequential)
   - Developer B: US5 (after US1 done) + US6
   - Developer C: US4 (after US3 done) + US7
3. Stories integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per Constitution VI)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tech stack: Three.js + TypeScript 5.x + Vite + Vitest (no additional libraries per Constitution V)
- Target: iPad Safari landscape, 60fps
- All text in hiragana, large font for ages 5–10
