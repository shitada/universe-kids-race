# Tasks: iPadゲーム体験改善 第2弾 — UXポリッシュ

**Input**: Design documents from `/specs/003-ipad-ux-polish/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included（TDD — plan.md constitution check VI に基づく）

**Organization**: Tasks grouped by user story (6 stories: US1–US6). US1–US3 = P1, US4–US5 = P2, US6 = P3.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US6)
- Exact file paths included

---

## Phase 1: Setup

**Purpose**: ブランチ作成と既存プロジェクトの正常性確認

- [X] T001 Create feature branch `003-ipad-ux-polish` and verify existing project builds and all tests pass

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: ブロッキング要件なし — 本フィーチャーは既存の完全動作するコードベース（HUD, AudioManager, BoostSystem, SceneManager）に対する UI/UX 改善のみ。新規インフラ不要。

**⚠️ Note**: 複数ストーリーが `src/ui/HUD.ts` と `src/game/scenes/StageScene.ts` を修正するが、各ストーリーは異なるメソッド/DOM要素を対象とするため独立して実装可能。

**Checkpoint**: Phase 1 完了後、全ユーザーストーリーの実装を開始可能

---

## Phase 3: User Story 1 — iPad Safariでサウンドが確実に再生される (Priority: P1) 🎯 MVP

**Goal**: AudioContext.resume() をユーザージェスチャーの同期コールスタック内で実行し、iPad Safari で BGM・SFX が確実に再生されるようにする

**Independent Test**: iPad Safari でゲーム起動 →「あそぶ」タップ → BGM 再生開始、星収集・隕石衝突・ブースト・クリアの全 SFX が鳴ることを確認

**Contract**: `contracts/audio-init.md`

### Tests for User Story 1

- [X] T002 [P] [US1] Update AudioManager tests: initSync() success/failure cases, initialized flag behavior in tests/unit/audio/AudioManager.test.ts

### Implementation for User Story 1

- [X] T003 [US1] Replace async init() with synchronous initSync() method (new AudioContext + resume in sync callstack, try/catch for failure) in src/game/audio/AudioManager.ts
- [X] T004 [US1] Update TitleScene pointerdown handler to call audioManager.initSync() synchronously (remove async/await) in src/game/scenes/TitleScene.ts

**Checkpoint**: iPad Safari で「あそぶ」タップ後に BGM と全 SFX が再生される

---

## Phase 4: User Story 2 — HUD上部にステージ名が正しく表示される (Priority: P1)

**Goal**: ステージ名が iPad 実機で確実に視認可能な CSS 設定（z-index, font-size, text-shadow, safe-area）にする

**Independent Test**: 各ステージ開始時に HUD 上部中央にステージ名が表示され、スコア・星の数と重ならないことを iPad 実機で確認

**Contract**: `contracts/hud-ui.md`（DOM 配置マップ）

### Tests for User Story 2

- [X] T005 [P] [US2] Create HUD test file with stage name visibility tests: DOM element creation, font-size 1.5rem, text-shadow, z-index in tests/unit/ui/HUD.test.ts

### Implementation for User Story 2

- [X] T006 [US2] Fix stage name element CSS: font-size to 1.5rem, add text-shadow for contrast, add safe-area padding-top in src/ui/HUD.ts

**Checkpoint**: 全 8 ステージで HUD 上部にステージ名が iPad 上で視認可能に表示される

---

## Phase 5: User Story 3 — ゲーム中にタイトル画面に戻れるホームボタン (Priority: P1)

**Goal**: HUD 左上に🏠ホームボタンを配置し、タップでタイトル画面に安全に遷移する

**Independent Test**: ステージプレイ中にホームボタンタップ → タイトル画面遷移、クリア済みステージの進行状況が保持されていることを確認

**Contract**: `contracts/hud-ui.md`（ホームボタンデザインコントラクト）

### Tests for User Story 3

- [X] T007 [P] [US3] Write home button tests: DOM creation, position (top-left), callback invocation on pointerdown, pointer-events: auto in tests/unit/ui/HUD.test.ts

### Implementation for User Story 3

- [X] T008 [US3] Add home button (🏠) element and setHomeCallback() method to HUD (position: absolute, top: 0.8rem, left: 1rem, 3rem circle) in src/ui/HUD.ts
- [X] T009 [US3] Wire home button callback in StageScene.enter() to call SceneManager.requestTransition('title') in src/game/scenes/StageScene.ts

**Checkpoint**: ステージプレイ中にホームボタンタップでタイトル画面に遷移、進行状況保持

---

## Phase 6: User Story 4 — タイトル画面から操作方法を確認できるチュートリアル (Priority: P2)

**Goal**: タイトル画面に「あそびかた」ボタンを追加し、3 つの操作方法（移動・ブースト・目的）を CSS アニメーション付きカードで視覚的に説明するオーバーレイを表示する

**Independent Test**: タイトル画面で「あそびかた」タップ → チュートリアルオーバーレイ表示（3 カード + アニメーション）→「とじる」でタイトルに戻ることを確認

**Contract**: `contracts/hud-ui.md`（TutorialOverlay コントラクト）

### Tests for User Story 4

- [X] T010 [P] [US4] Write TutorialOverlay tests: show()/hide() DOM creation and removal, duplicate show() prevention, close button callback invocation in tests/unit/ui/TutorialOverlay.test.ts

### Implementation for User Story 4

- [X] T011 [US4] Create TutorialOverlay class with show(onClose)/hide(): fullscreen overlay with 3 cards (👆移動 translateX, 🚀ブースト translateY, ⭐目的 rotate+glow) and「とじる」button in src/ui/TutorialOverlay.ts
- [X] T012 [US4] Add「あそびかた」button to TitleScene createOverlay() and wire TutorialOverlay show/hide in src/game/scenes/TitleScene.ts

**Checkpoint**: タイトル画面で「あそびかた」ボタンタップ → チュートリアル表示 → 閉じてタイトルに戻れる

---

## Phase 7: User Story 5 — ブーストのクールダウン進捗がインジケーターで分かる (Priority: P2)

**Goal**: ブースト使用後にクールダウン進捗バーを表示し、完了時に光るエフェクトで再使用可能を知らせる

**Independent Test**: ブースト使用 → クールダウンバーが 0%→100% に進捗 → 完了時に glow エフェクト発生を確認

**Contract**: `contracts/hud-ui.md`（クールダウンインジケーター）

### Tests for User Story 5

- [X] T013 [P] [US5] Write getCooldownProgress() tests: returns 1.0 when available, 0.0 when active, 0.0→1.0 during cooldown in tests/unit/systems/BoostSystem.test.ts
- [X] T014 [P] [US5] Write cooldown indicator tests: updateCooldown() bar width percentage, glow class on progress=1.0 in tests/unit/ui/HUD.test.ts

### Implementation for User Story 5

- [X] T015 [US5] Add getCooldownProgress() method returning 0.0–1.0 to BoostSystem in src/game/systems/BoostSystem.ts
- [X] T016 [US5] Add cooldown indicator (container div + bar div + glow animation on completion) and updateCooldown(progress) method to HUD in src/ui/HUD.ts
- [X] T017 [US5] Wire cooldown progress: call hud.updateCooldown(boostSystem.getCooldownProgress()) each frame in StageScene.update() in src/game/scenes/StageScene.ts

**Checkpoint**: ブースト使用後にバーが進捗表示され、完了時に光るエフェクト発生

---

## Phase 8: User Story 6 — ブーストボタンが可愛くて派手なデザインになる (Priority: P3)

**Goal**: ブーストボタンをグラデーション + 絵文字🚀 + アニメーション付きの子供が押したくなるデザインに刷新する

**Independent Test**: ブーストボタンにグラデーション背景・🚀絵文字・待機中パルス・押下バウンス・クールダウン中グレーアウトが適用されていることを確認

**Contract**: `contracts/hud-ui.md`（ブーストボタンデザインコントラクト）

### Tests for User Story 6

- [X] T018 [P] [US6] Write boost button design tests: gradient background style, 🚀 emoji text content, press animation class toggle, cooldown disabled state (opacity, grayscale) in tests/unit/ui/HUD.test.ts

### Implementation for User Story 6

- [X] T019 [US6] Redesign boost button: gradient background (135deg #FF6B6B→#FFD93D→#6BCB77), 🚀 ブースト! text, border-radius 2rem, box-shadow, pulse animation (2s infinite) in src/ui/HUD.ts
- [X] T020 [US6] Add cooldown visual state to boost button: opacity 0.5, grayscale(0.8) filter, animation none during cooldown; glow flash on cooldown complete in src/ui/HUD.ts

**Checkpoint**: ブーストボタンが新デザインで表示され、クールダウン中は視覚的に使用不可と分かる

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: 全ストーリー統合後の品質確認と最終検証

- [X] T021 Run full test suite (`npm run test`) and verify all existing + new tests pass
- [X] T022 Execute quickstart.md iPad 実機テスト手順の全 7 項目を検証
- [X] T023 Verify 60fps performance on iPad Safari with all new UI enhancements active

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: N/A — no blocking prerequisites
- **US1 (Phase 3)**: After Phase 1 — independent
- **US2 (Phase 4)**: After Phase 1 — independent
- **US3 (Phase 5)**: After Phase 1 — independent
- **US4 (Phase 6)**: After Phase 1 — independent (new file TutorialOverlay.ts)
- **US5 (Phase 7)**: After Phase 1 — independent
- **US6 (Phase 8)**: After Phase 1 — benefits from US5 (updateCooldown) but can implement disabled state via isAvailable() independently
- **Polish (Phase 9)**: After all stories complete

### Shared File Coordination

| ファイル | 変更するストーリー | 競合リスク |
|---------|-------------------|-----------|
| `src/ui/HUD.ts` | US2, US3, US5, US6 | 低 — 各ストーリーが異なるメソッド/DOM 要素を変更 |
| `src/game/scenes/TitleScene.ts` | US1, US4 | 低 — US1 はハンドラ変更、US4 はボタン追加 |
| `src/game/scenes/StageScene.ts` | US3, US5 | 低 — US3 は enter()、US5 は update() |
| `tests/unit/ui/HUD.test.ts` | US2, US3, US5, US6 | 低 — 各ストーリーが独立した describe ブロック |

### Within Each User Story

- Tests FIRST → テストが FAIL することを確認 → 実装 → テストが PASS
- Models/Systems before UI
- UI before Scene wiring

### Parallel Opportunities

- **P1 ストーリー**: US1, US2, US3 は Phase 1 完了後に並行実行可能
- **P2 ストーリー**: US4, US5 は Phase 1 完了後に並行実行可能（US4 は新規ファイル、US5 は BoostSystem + HUD）
- **テストタスク**: 全ストーリーのテストタスク (T002, T005, T007, T010, T013, T014, T018) は並行実行可能
- **HUD.ts 順次推奨**: 同一ファイルを触るストーリーを 1 人で実行する場合 → US2 → US3 → US5 → US6 の順

---

## Parallel Example: P1 Stories

```bash
# All P1 stories can start in parallel after Phase 1:

# Developer A: US1 (AudioManager sync init)
Task T002: "Update AudioManager tests in tests/unit/audio/AudioManager.test.ts"
Task T003: "Replace init() with initSync() in src/game/audio/AudioManager.ts"
Task T004: "Update TitleScene handler in src/game/scenes/TitleScene.ts"

# Developer B: US2 + US3 (HUD fixes — same file, sequential)
Task T005: "Create HUD tests in tests/unit/ui/HUD.test.ts"
Task T006: "Fix stage name CSS in src/ui/HUD.ts"
Task T007: "Write home button tests in tests/unit/ui/HUD.test.ts"
Task T008: "Add home button to HUD in src/ui/HUD.ts"
Task T009: "Wire home button in src/game/scenes/StageScene.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: US1（AudioManager 同期化）
3. **STOP and VALIDATE**: iPad Safari で BGM 再生を検証
4. デプロイ可能な最小改善

### Incremental Delivery

1. Phase 1 → Setup complete
2. US1（AudioManager 同期化）→ iPad Safari 音声修正 ✅
3. US2（ステージ名修正）→ 視認性改善 ✅
4. US3（ホームボタン）→ ナビゲーション改善 ✅
5. US4（チュートリアル）→ 初心者サポート ✅
6. US5（クールダウン）→ ゲームフィードバック改善 ✅
7. US6（ボタンデザイン）→ 見た目の楽しさ向上 ✅
8. Phase 9 → 品質保証

Each story adds value without breaking previous stories.

---

## Notes

- [P] tasks = different files, no dependencies on other tasks in the same phase
- [Story] label maps task to specific user story for traceability
- 全 UI テキストはひらがな表記（子供向け 5〜10 歳）
- Three.js の 3D 描画には一切変更なし（DOM/CSS のみ）
- 外部ライブラリ追加不可（CSS + DOM API のみ）
- Commit after each task or logical group
