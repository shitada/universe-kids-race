# Tasks: デバイス互換性 & オーディオ修正

**Input**: Design documents from `/specs/011-device-compat-audio-fix/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — TDD approach specified in plan.md constitution check (VI. 開発ワークフロー).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup

No setup tasks required. This feature modifies existing files only — no new dependencies, project initialization, or configuration changes needed. All target files already exist in the repository.

---

## Phase 2: User Story 1 — Safari 復帰時の BGM 再生修正 (Priority: P1) 🎯 MVP

**Goal**: Safari をバックグラウンドから復帰した際に、AudioContext の suspended 状態を検出・再開し、BGM が 1 秒以内に確実に再生される。

**Independent Test**: iPad/iPhone Safari でゲームプレイ中にホーム画面に移動し、数秒後に戻る操作を 5 回繰り返す。毎回 BGM が 1 秒以内に再開されることを確認。BGM が再生されていない状態で復帰した場合は勝手に再生開始しないことも確認。

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T001 [P] [US1] Add unit tests for ensureResumed() in tests/unit/audio/AudioManager.test.ts — test cases: (1) ctx が null の場合は例外を投げない, (2) ctx.state === 'suspended' の場合に ctx.resume() が呼ばれる, (3) ctx.state === 'running' の場合に resume() が呼ばれない
- [X] T002 [P] [US1] Add unit tests for initSync() suspended handling in tests/unit/audio/AudioManager.test.ts — test cases: (1) 2回目の initSync() で ctx が suspended なら ensureResumed() 経由で resume が呼ばれる, (2) 2回目の initSync() で ctx が running なら resume は呼ばれない
- [X] T003 [P] [US1] Create integration test for Safari background/foreground resume in tests/integration/AudioResume.test.ts — test cases: (1) visibilitychange で !document.hidden 時に ensureResumed() が呼ばれる, (2) visibilitychange で document.hidden 時には ensureResumed() が呼ばれない

### Implementation for User Story 1

- [X] T004 [US1] Add ensureResumed() public method to AudioManager in src/game/audio/AudioManager.ts — ctx が null なら return、ctx.state !== 'suspended' なら return、ctx.state === 'suspended' なら ctx.resume() を fire-and-forget で呼ぶ
- [X] T005 [US1] Modify initSync() to call ensureResumed() when already initialized in src/game/audio/AudioManager.ts — if (this.initialized) ブロックの先頭で this.ensureResumed() を呼んで return
- [X] T006 [US1] Add ensureResumed() calls to playSFX() and startBoostSFX() in src/game/audio/AudioManager.ts — 各メソッドの冒頭（early return の前）に this.ensureResumed() を追加
- [X] T007 [P] [US1] Add visibilitychange listener with audioManager.ensureResumed() in src/main.ts — !document.hidden 時に gameLoop.resume() の後で audioManager.ensureResumed() を呼ぶ

**Checkpoint**: Safari でバックグラウンド→復帰を繰り返しても BGM が確実に再開される。テスト全パス。

---

## Phase 3: User Story 2 — BGM 重複再生の修正 (Priority: P1)

**Goal**: bgmGeneration カウンタでシーケンサーの世代管理を行い、playBGM() の二重呼び出しやシーン遷移時の BGM 重複を完全に防止する。TitleScene のオーバーレイ pointerdown から playBGM(0) を除去する。

**Independent Test**: タイトル画面でオーバーレイ→「あそぶ」ボタンを素早くタップして BGM が 1 つだけ再生されることを確認。シーン遷移を 20 回連続で行い、BGM の重複再生がないことを確認。

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US2] Add unit tests for bgmGeneration and bgmPlaying in tests/unit/audio/AudioManager.test.ts — test cases: (1) playBGM() 後に bgmPlaying が true, (2) stopBGM() 後に bgmPlaying が false, (3) playBGM() を 2 回連続呼び出しで 1 つ目の tick が世代不一致で停止, (4) stopBGM() 後に tick コールバックが再スケジュールされない
- [X] T009 [P] [US2] Add unit test for TitleScene overlay not calling playBGM in tests/unit/scenes/TitleScene.test.ts — overlay pointerdown で audioManager.playBGM が呼ばれないことを確認（initSync のみ呼ばれる）

### Implementation for User Story 2

- [X] T010 [US2] Add bgmPlaying flag and bgmGeneration counter fields to AudioManager in src/game/audio/AudioManager.ts — `private bgmPlaying = false` と `private bgmGeneration = 0` を追加
- [X] T011 [US2] Modify playBGM() with generation counter and tick closure guard in src/game/audio/AudioManager.ts — 冒頭で ensureResumed() + stopBGM() + bgmGeneration++ + bgmPlaying=true、tick クロージャに currentGen をキャプチャし bgmGeneration !== currentGen なら return
- [X] T012 [US2] Modify stopBGM() with generation increment and bgmPlaying reset in src/game/audio/AudioManager.ts — 冒頭で bgmGeneration++ と bgmPlaying = false を追加（既存の clearTimeout と oscillator クリーンアップの前）
- [X] T013 [P] [US2] Remove playBGM(0) from overlay pointerdown listener in src/game/scenes/TitleScene.ts — overlay の `pointerdown` `{ once: true }` リスナーから `this.audioManager.playBGM(0)` を除去し、`this.audioManager.initSync()` のみ残す

**Checkpoint**: タイトル画面でどのようなタップパターンでも BGM が 1 つだけ再生。シーン遷移で BGM 重複なし。テスト全パス。

---

## Phase 4: User Story 3 — iPhone 横画面対応 (Priority: P2)

**Goal**: viewport-fit=cover と CSS env(safe-area-inset-*) で iPhone のノッチ・Dynamic Island・ホームインジケータ領域から HUD・ボタンを退避させる。iPad の既存レイアウトに影響を与えない。

**Independent Test**: iPhone（ノッチ付き / Dynamic Island 付き）の実機で横画面にし、全 UI 要素がノッチ・ホームインジケータに重ならないことを確認。iPad で既存レイアウトが崩れないことを確認。

### Implementation for User Story 3

- [X] T014 [US3] Add viewport-fit=cover to viewport meta tag in index.html — 既存の `<meta name="viewport">` に `viewport-fit=cover` を追加
- [X] T015 [US3] Add safe area CSS with env(safe-area-inset-*) in index.html — `@supports (padding: env(safe-area-inset-left))` でプログレッシブエンハンスメント。HUD コンテナ・ボタン要素に safe-area-inset-left/right/bottom の padding を適用。Canvas は全画面維持
- [X] T016 [P] [US3] Apply safe area inset padding to HUD button positions in src/ui/HUD.ts — ボタン・HUD 要素の style.left / style.right / style.bottom に safe area inset を考慮した値を設定。clamp() でフォントサイズとボタンサイズを小画面（横画面時の高さ 375pt 以下）に対応

**Checkpoint**: iPhone 横画面で HUD・ボタンがノッチに重ならない。iPad 表示にリグレッションなし。

---

## Phase 5: User Story 4 — PC キーボード操作対応 (Priority: P2)

**Goal**: InputSystem に keydown/keyup リスナーを追加し、ArrowLeft/Right で左右移動、Space でブーストを実現する。既存のタッチ/ポインター操作との共存を保証する。

**Independent Test**: PC ブラウザで矢印キーによる左右移動とスペースキーによるブーストでステージ 1 をクリアできることを確認。タッチ操作も引き続き機能することを確認。

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [US4] Add unit tests for keyboard input handling in tests/unit/systems/InputSystem.test.ts — test cases: (1) ArrowLeft keydown で moveDirection が -1, (2) ArrowRight keydown で moveDirection が 1, (3) ArrowLeft+ArrowRight 同時押しで moveDirection が 0, (4) Space keydown で boostPressed が true, (5) ArrowLeft keyup で moveDirection が 0 に戻る, (6) e.repeat=true の keydown イベントは無視, (7) dispose() 後にキーボードイベントが反応しない, (8) ポインター左 + キーボード右で moveDirection が 0（マージ動作）

### Implementation for User Story 4

- [X] T018 [US4] Add pressedKeys Set and onKeyDown/onKeyUp event handlers to InputSystem in src/game/systems/InputSystem.ts — `private pressedKeys = new Set<string>()`、onKeyDown: repeat なら return、ArrowLeft/Right は pressedKeys.add + updateDirection、Space は boostPressed=true + preventDefault。onKeyUp: ArrowLeft/Right は pressedKeys.delete + updateDirection
- [X] T019 [US4] Modify updateDirection() to merge keyboard input with pointer input in src/game/systems/InputSystem.ts — ポインター方向計算後に pressedKeys.has('ArrowLeft')/has('ArrowRight') でキーボード方向をマージ。left && right → 0、left → -1、right → 1、else → 0
- [X] T020 [US4] Register keydown/keyup on window in setup() and clean up in dispose() in src/game/systems/InputSystem.ts — setup() で `window.addEventListener('keydown', this.onKeyDown)` と `window.addEventListener('keyup', this.onKeyUp)` を追加。dispose() で removeEventListener + pressedKeys.clear()

**Checkpoint**: PC ブラウザで矢印キー+スペースでステージ 1 クリア可能。タッチ操作にリグレッションなし。テスト全パス。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全ユーザーストーリーの統合確認とリグレッションテスト

- [X] T021 [P] Run full test suite (`npm run test`) and verify all tests pass with no regressions
- [X] T022 [P] Run production build (`npm run build`) and verify no errors
- [X] T023 Run quickstart.md manual validation scenarios for all 4 user stories — Safari BGM 復帰、BGM 重複、iPhone safe area、PC キーボード

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — nothing to do (existing project)
- **US1 (Phase 2)**: Can start immediately — introduces ensureResumed() to AudioManager
- **US2 (Phase 3)**: Depends on US1 — playBGM() changes build on ensureResumed() added in US1
- **US3 (Phase 4)**: Can start after Setup — independent (CSS/HTML/HUD only, no audio dependency)
- **US4 (Phase 5)**: Can start after Setup — independent (InputSystem only, no audio dependency)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — introduces ensureResumed() core mechanism
- **User Story 2 (P1)**: Depends on US1 — playBGM() 内で ensureResumed() を呼ぶため、US1 の AudioManager 変更が前提
- **User Story 3 (P2)**: No dependencies on other stories — CSS/HTML/HUD のみの変更、オーディオ・入力に影響なし
- **User Story 4 (P2)**: No dependencies on other stories — InputSystem のみの変更、オーディオ・UI に影響なし

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- AudioManager field additions before method modifications
- Core implementation before integration points
- Story complete before next priority

### Parallel Opportunities

- US1 tests (T001, T002, T003) can all run in parallel
- US2 tests (T008, T009) can run in parallel
- US1 and US3 can be worked on in parallel (different files entirely)
- US1 and US4 can be worked on in parallel (different files entirely)
- US3 and US4 can be worked on in parallel (different files entirely)
- Once US1 is complete, US2 can start while US3/US4 continue in parallel

---

## Parallel Example: User Stories 1 + 4

```bash
# Developer A: User Story 1 (Audio)
Task: "Add ensureResumed() to AudioManager in src/game/audio/AudioManager.ts"
Task: "Modify initSync() in src/game/audio/AudioManager.ts"
Task: "Add visibilitychange listener in src/main.ts"

# Developer B: User Story 4 (Keyboard) — simultaneously
Task: "Add keyboard input tests in tests/unit/systems/InputSystem.test.ts"
Task: "Add pressedKeys and handlers to InputSystem in src/game/systems/InputSystem.ts"
Task: "Merge keyboard input in updateDirection() in src/game/systems/InputSystem.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: User Story 1 — Safari BGM 復帰
2. **STOP and VALIDATE**: Safari バックグラウンド復帰テスト (5回繰り返し)
3. Deploy/demo if ready — BGM 品質問題が最も影響大

### Incremental Delivery

1. US1 (Safari BGM 復帰) → Test → Deploy (MVP!)
2. US2 (BGM 重複防止) → Test → Deploy (オーディオ品質完了)
3. US3 (iPhone safe area) → Test → Deploy (iPhone 対応完了)
4. US4 (PC キーボード) → Test → Deploy (全プラットフォーム対応完了)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A: US1 → US2 (sequential, same AudioManager)
2. Developer B: US3 or US4 (independent, can start immediately)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US3 (iPhone safe area) は手動テストのみ — CSS/HTML の safe area は jsdom では検証不可
- US1 と US2 は同じ AudioManager.ts を修正するため sequential 実行推奨
- US3 と US4 はオーディオ変更と完全に独立しており、US1/US2 と並行実行可能
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
