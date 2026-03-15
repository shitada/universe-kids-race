# Tasks: 太陽系全惑星ステージ拡張・ブースト演出強化・タイトルBGM修正

**Input**: Design documents from `/specs/005-solar-stages-boost-fx/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: TDD — plan.md Constitution VIでTDD指定。テストを先に記述し失敗を確認してから実装する。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 既存プロジェクトへの機能追加のため、新規セットアップ不要。

> ※ 新規ファイル追加なし。既存ファイルの修正のみ。

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 複数ユーザーストーリーが依存する型定義の拡張

**⚠️ CRITICAL**: US5（クールダウン完了音）がこの型変更に依存

- [X] T001 Add 'boostReady' to SFXType union type in src/types/index.ts

**Checkpoint**: 型定義更新完了。ユーザーストーリー実装を開始可能。

---

## Phase 3: User Story 1 - 太陽系全惑星を旅するステージ構成 (Priority: P1) 🎯 MVP

**Goal**: ステージ数を8→11に拡張。水星(2)・金星(3)を追加し既存を+2シフト、地球(11)を最終ステージに。各惑星を特徴的な3Dモデルで描画。BGMリマップと新BGM追加。SaveManager上限変更。

**Independent Test**: ステージ1〜11を順にプレイし、各ステージで正しい惑星名が表示され、惑星モデルが特徴的な外観で描画され、ステージ11クリアでエンディングに遷移することを確認。

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T002 [P] [US1] TDD: Update tests for 11-stage STAGE_CONFIGS (length=11, destination順序、難易度カーブ検証) in tests/unit/config/StageConfig.test.ts
- [X] T003 [P] [US1] TDD: Update tests for clearedStage validation upper limit 11 (0〜11有効、12以上リセット) in tests/unit/SaveManager.test.ts
- [X] T004 [P] [US1] TDD: Add tests for remapped BGM_CONFIGS (14 entries: 0〜11 + -1) and new BGM definitions for 水星(2)/金星(3)/地球(11) in tests/unit/audio/AudioManager.test.ts
- [X] T005 [P] [US1] TDD: Update 11-stage sequential flow test (stage 11 clear → ending transition) in tests/integration/StageFlow.test.ts

### Implementation for User Story 1

- [X] T006 [P] [US1] Expand STAGE_CONFIGS array to 11 entries: insert 水星(stageNumber=2, stageLength=1100, meteoriteInterval=2.8) at index 1, 金星(stageNumber=3, stageLength=1150, meteoriteInterval=2.6) at index 2, shift existing stages +2 (火星→4, 木星→5, ..., 太陽→10), add 地球(stageNumber=11, stageLength=2700, meteoriteInterval=0.5) at index 10 in src/game/config/StageConfig.ts
- [X] T007 [P] [US1] Change clearedStage validation upper limit from 8 to 11 in src/game/storage/SaveManager.ts
- [X] T008 [P] [US1] Remap BGM_CONFIGS keys (旧2→4, 旧3→5, 旧4→6, 旧5→7, 旧6→8, 旧7→9, 旧8→10) and add new BGM definitions: 水星(2, Dm, 112BPM), 金星(3, Eb, 115BPM), 地球(11, C, 145BPM, square波メロディ) in src/game/audio/AudioManager.ts
- [X] T009 [US1] Add 水星 planet model (SphereGeometry(10), gray 0x888888, canvas texture with random circle craters) and 金星 planet model (SphereGeometry(14), yellow-orange 0xddaa44, canvas texture with swirl pattern) to createDestinationPlanet() in src/game/scenes/StageScene.ts
- [X] T010 [US1] Add 木星 planet model (SphereGeometry(20), canvas texture with orange-brown horizontal stripe bands) and 天王星 planet model (SphereGeometry(16), cyan 0x66ccdd, RingGeometry(21,28) with rotation.z=PI/2 for sideways ring) to createDestinationPlanet() in src/game/scenes/StageScene.ts
- [X] T011 [US1] Add 太陽 planet model (SphereGeometry(25), gold 0xffcc00, MeshToonMaterial with emissive, PointLight, pulse scale animation 1.0+sin(time*2)*0.05 in update()) and 地球 planet model (SphereGeometry(15), canvas texture with blue ocean + brown continents, cloud layer SphereGeometry(15.5) with opacity=0.3) to createDestinationPlanet() in src/game/scenes/StageScene.ts
- [X] T012 [US1] Change handleStageComplete() ending transition threshold from stageNumber >= 8 to stageNumber >= 11 in src/game/scenes/StageScene.ts
- [X] T013 [US1] Change startStage calculation from Math.min(clearedStage + 1, 8) to Math.min(clearedStage + 1, 11) in src/game/scenes/TitleScene.ts

**Checkpoint**: 11ステージ構成が完成。各惑星の特徴的な3Dモデル表示、BGM再生、ステージ11クリアでエンディング遷移を独立テスト可能。

---

## Phase 4: User Story 2 - タイトル画面でBGMが流れる (Priority: P1)

**Goal**: タイトル画面でユーザーの最初のタッチでAudioContextを初期化し、タイトルBGMを再生開始する。

**Independent Test**: ゲーム起動→タイトル画面表示→画面タッチ→タイトルBGM再生開始を確認。「あそぶ」ボタン押下でもBGMが開始されることを確認。

### Implementation for User Story 2

- [X] T014 [P] [US2] Add idempotency guard to initSync() — insert `if (this.initialized) return;` at method start in src/game/audio/AudioManager.ts
- [X] T015 [US2] Add pointerdown event listener ({once: true}) to overlay element that calls audioManager.initSync() then audioManager.playBGM(0) on first touch in src/game/scenes/TitleScene.ts

**Checkpoint**: タイトル画面のタッチでBGM再生開始。「あそぶ」ボタンでも初期化+再生。二重再生・二重初期化なし。

---

## Phase 5: User Story 3 - ブースト中に迫力ある噴射音が鳴り続ける (Priority: P2)

**Goal**: ブースト発動中にホワイトノイズベースの持続噴射音を再生し、終了時にフェードアウト停止する。

**Independent Test**: ブースト発動→噴射音が3秒間途切れなく持続→ブースト終了→0.3秒でフェードアウト停止を確認。

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US3] TDD: Add tests for startBoostSFX() (AudioBufferSourceNode creation, loop=true, lowpass filter 800Hz, gain 0.15) and stopBoostSFX() (fadeout + node cleanup + null reset) in tests/unit/audio/AudioManager.test.ts

### Implementation for User Story 3

- [X] T017 [US3] Implement startBoostSFX() (create 1s white noise AudioBuffer, AudioBufferSourceNode loop=true → BiquadFilterNode lowpass 800Hz → GainNode 0.15 → destination) and stopBoostSFX() (linearRampToValueAtTime 0.3s fadeout, setTimeout 300ms for source.stop() + disconnect + null reset) with private fields boostNoiseSource/boostNoiseGain/boostNoiseFilter in src/game/audio/AudioManager.ts
- [X] T018 [US3] Integrate boost SFX: call startBoostSFX() on boost activation, call stopBoostSFX() on boost deactivation (wasActive→!isActive transition), meteorite collision, and stage clear in src/game/scenes/StageScene.ts

**Checkpoint**: ブースト噴射音がブースト発動中に途切れなく持続し、終了時にフェードアウトして停止。衝突・ステージクリア時もクリーンアップ。

---

## Phase 6: User Story 4 - ブースト中にロケットが炎に包まれる (Priority: P2)

**Goal**: ブースト発動中にロケット周囲にオレンジ〜赤の炎パーティクルを持続放出し、ブースト終了時にフェードアウトで消滅させる。

**Independent Test**: ブースト発動→ロケット周囲にオレンジ〜赤パーティクルが揺らめき表示→ブースト終了→パーティクルがフェードアウトして消滅を確認。

### Implementation for User Story 4

- [X] T019 [US4] Implement boost flame particle system in StageScene: create THREE.Points with BufferGeometry (MAX_FLAME_PARTICLES=100), Float32Array positions/colors/sizes/lifetimes as ring buffer, AdditiveBlending, PointsMaterial with vertexColors and transparent. Add initBoostFlame()/emitFlameParticles()/updateFlameParticles()/removeBoostFlame() methods. Emit 5 particles per frame at rocket position (z+2, x/y ±0.5 random), orange(0xff6600)〜red(0xff2200) random colors, lifetime 0.5s, move +z direction speed 3〜5 with y ±0.5 wobble in src/game/scenes/StageScene.ts
- [X] T020 [US4] Integrate flame particles: call initBoostFlame() on boost activation, updateFlameParticles() every frame during boost, stop emission on boost end with fadeout of remaining particles, call removeBoostFlame() on meteorite collision and stage exit cleanup in src/game/scenes/StageScene.ts

**Checkpoint**: ブースト中にロケット後方からオレンジ〜赤の炎パーティクルが揺らめき、ブースト終了後1秒以内に全消滅。

---

## Phase 7: User Story 5 - ブーストクールダウン完了時に通知音が鳴る (Priority: P3)

**Goal**: ブーストクールダウン完了の瞬間に短い「ピコーン！」通知音を再生し、プレイヤーに再使用可能を聴覚で伝える。

**Independent Test**: ブースト使用→クールダウン中待機→クールダウン完了時に短い通知音が1回鳴ることを確認。

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T021 [P] [US5] TDD: Add test for playSFX('boostReady') (sine wave oscillator 880→1760Hz, duration 0.2s, gain 0.15) in tests/unit/audio/AudioManager.test.ts

### Implementation for User Story 5

- [X] T022 [US5] Add 'boostReady' case to playSFX() method: create OscillatorNode sine wave with frequency ramp 880→1760Hz over 0.2s, GainNode 0.15, auto-stop after 0.2s in src/game/audio/AudioManager.ts
- [X] T023 [US5] Add cooldown completion detection in StageScene.update(): capture wasAvailable = boostSystem.isAvailable() before boostSystem.update(), then check !wasAvailable && boostSystem.isAvailable() after update to call audioManager.playSFX('boostReady') in src/game/scenes/StageScene.ts

**Checkpoint**: クールダウン完了時に「ピコーン！」通知音が1回だけ再生される。

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 全機能の統合テスト確認と手動検証

- [X] T024 [P] Run full test suite (npm run test) and fix any regressions across all modified test files
- [X] T025 Verify all quickstart.md manual testing scenarios (タイトルBGM、11ステージ順次プレイ、惑星モデル確認、噴射音、炎パーティクル、通知音、ステージ11クリア→エンディング)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — 型定義の拡張のみ
- **US1 (Phase 3)**: Depends on Phase 2 (SFXType for later phases). BLOCKS nothing directly but provides stage infrastructure.
- **US2 (Phase 4)**: Independent of US1. Depends on AudioManager existing.
- **US3 (Phase 5)**: Independent of US1/US2. Depends on Phase 2 completion.
- **US4 (Phase 6)**: Independent of US1/US2/US3. StageScene internal only.
- **US5 (Phase 7)**: Depends on Phase 2 (SFXType 'boostReady'). Independent of US3/US4.
- **Polish (Phase 8)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US3 (P2)**: Can start after Phase 2 — No dependencies on US1/US2
- **US4 (P2)**: Can start after Phase 2 — No dependencies on other stories
- **US5 (P3)**: Can start after Phase 2 — No dependencies on US3/US4

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Config/type changes before scene changes
- AudioManager changes before StageScene integration
- Core implementation before cleanup/integration logic

### Parallel Opportunities

- **Phase 3 Tests**: T002, T003, T004, T005 can all run in parallel (different test files)
- **Phase 3 Implementation**: T006, T007, T008 can run in parallel (StageConfig, SaveManager, AudioManager are different files)
- **Phase 3 → Phase 4**: US1 and US2 can run in parallel (different concerns)
- **Phase 5 → Phase 6**: US3 and US4 can run in parallel (audio vs visual, though both touch StageScene)
- **Cross-story**: T014 (US2 AudioManager) can run in parallel with T009-T013 (US1 StageScene)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for US1 together (TDD - write failing tests first):
Task T002: "Update 11-stage config tests in tests/unit/config/StageConfig.test.ts"
Task T003: "Update clearedStage upper limit tests in tests/unit/SaveManager.test.ts"
Task T004: "Add BGM remap tests in tests/unit/audio/AudioManager.test.ts"
Task T005: "Update stage flow tests in tests/integration/StageFlow.test.ts"

# Launch config/data changes in parallel (different files):
Task T006: "Expand STAGE_CONFIGS in src/game/config/StageConfig.ts"
Task T007: "Update SaveManager limit in src/game/storage/SaveManager.ts"
Task T008: "Remap BGM_CONFIGS in src/game/audio/AudioManager.ts"

# Then sequential StageScene planet model work:
Task T009: "水星/金星 models in src/game/scenes/StageScene.ts"
Task T010: "木星/天王星 models in src/game/scenes/StageScene.ts"
Task T011: "太陽/地球 models in src/game/scenes/StageScene.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (SFXType)
2. Complete Phase 3: User Story 1 (11ステージ構成 + 惑星モデル)
3. **STOP and VALIDATE**: 11ステージ順次プレイで各惑星表示・エンディング遷移を確認
4. この時点でゲームのコアコンテンツ拡張は完了

### Incremental Delivery

1. Phase 2 → Foundational ready
2. Phase 3 (US1) → 11ステージ構成完成 → テスト → **MVP!**
3. Phase 4 (US2) → タイトルBGM → テスト → Deploy
4. Phase 5 (US3) + Phase 6 (US4) → ブースト演出強化 → テスト → Deploy
5. Phase 7 (US5) → クールダウン通知音 → テスト → Deploy
6. Phase 8 → 全体検証 → Final Deploy

### Suggested MVP Scope

US1（太陽系全惑星ステージ構成）のみでMVPとして成立。ゲームのコアコンテンツ拡張が完了し、11ステージの冒険を体験可能。

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 全惑星モデルはcreateDestinationPlanet()内で分岐実装（新規ファイル追加なし）
- 炎パーティクルはStageScene内部で管理（ParticleBurstManagerとは別）
- initSync()の冪等化は「あそぶ」ボタンとオーバーレイタッチの競合回避に必須
- 既存セーブデータ互換性: clearedStage値はそのまま読み込み可能（上限変更のみ）
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
