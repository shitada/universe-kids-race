# Tasks: セッション管理・ずかん永続化・全クリアお祝い演出

**Input**: Design documents from `/specs/010-session-encyclopedia-celebration/`
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

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor `CompanionManager` methods to `public static` — US3 (celebration animation) depends on this, and existing `CompanionManager` callers must be updated.

- [x] T001 Update existing CompanionManager unit tests to call static methods in tests/unit/entities/CompanionManager.test.ts — change instance method calls to `CompanionManager.createCompanionMesh(entry)` static calls and verify tests still pass
- [x] T002 Change `createCompanionMesh` to `public static` and all shape methods (`createBasic`, `createRinged`, `createRadiant`, `createHorned`, `createIcy`, `createBubble`) to `private static` in src/game/entities/CompanionManager.ts — update internal callers from `this.createCompanionMesh(entry)` to `CompanionManager.createCompanionMesh(entry)` and `this.create*()` to `CompanionManager.create*()`
- [x] T003 Run full test suite (`npm run test`) to verify CompanionManager refactor causes no regressions

**Checkpoint**: `CompanionManager.createCompanionMesh()` is callable as a static method. All existing tests pass.

---

## Phase 3: User Story 1 — Safari スワイプ終了時にゲームを最初から開始 (Priority: P1) 🎯 MVP

**Goal**: Safari スワイプ終了後の再起動でゲームがステージ1からリセットされる。sessionStorage フラグで新規セッションを検出し `saveManager.clear()` を実行する。

**Independent Test**: ゲームを数ステージ進める → Safari スワイプ終了 → 再起動 → ステージ1から開始されることを確認。タブ維持でホーム復帰した場合は進行が維持されることを確認。

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write session management unit tests in tests/unit/SaveManager.test.ts — test cases: (1) sessionStorage にフラグなし + localStorage にデータあり → clear() が呼ばれデータ削除, (2) sessionStorage にフラグあり + localStorage にデータあり → clear() が呼ばれずデータ維持, (3) sessionStorage にフラグなし + localStorage にデータなし → clear() が安全に呼ばれる, (4) チェック後に sessionStorage にフラグ `'active'` が設定される

### Implementation for User Story 1

- [x] T005 [US1] Add sessionStorage session check logic in src/main.ts — after `const saveManager = new SaveManager();` and before scene registration, add: `SESSION_KEY = 'universe-kids-race-session'` constant, check `sessionStorage.getItem(SESSION_KEY)`, if null call `saveManager.clear()`, then always call `sessionStorage.setItem(SESSION_KEY, 'active')`

**Checkpoint**: Safari スワイプ終了後の再起動でステージ1から開始。タブ維持時は進行データ保持。テスト全パス。

---

## Phase 4: User Story 2 — ずかん（図鑑）データの永続化 (Priority: P2)

**Goal**: 全クリア時に `clearedStage` のみ0にリセットし、`unlockedPlanets` は保持する。Safari スワイプ終了時は US1 の sessionStorage チェックにより全データリセット。

**Independent Test**: ゲームを全クリア → エンディング → タイトルに戻る → ずかんで全11惑星表示を確認。Safari スワイプ終了後はずかんが空。

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US2] Write selective reset unit tests in tests/unit/scenes/EndingScene.test.ts — test cases: (1) 全クリア（clearedStage=11, unlockedPlanets=[1..11]）→ enter() 後に clearedStage=0, unlockedPlanets=[1..11] が保存される, (2) 部分クリア（clearedStage=5, unlockedPlanets=[1..5]）→ enter() 後に clearedStage=0, unlockedPlanets=[1..5] が保存される, (3) エンディング後にタイトルに戻りずかんで全惑星が表示可能

### Implementation for User Story 2

- [x] T007 [US2] Replace `this.saveManager.clear()` with selective reset in src/game/scenes/EndingScene.ts — change to `const saveData = this.saveManager.load(); saveData.clearedStage = 0; this.saveManager.save(saveData);` in the `enter()` method

**Checkpoint**: 全クリア後にずかんデータが保持される。clearedStage のみ0にリセット。テスト全パス。

---

## Phase 5: User Story 3 — 全クリア時のエイリアンお祝い演出 (Priority: P3)

**Goal**: エンディング画面で全11体のエイリアンコンパニオンが円形配置 → 順次ポップイン → バウンス →「みんな ありがとう！」テキスト表示の一連のお祝い演出を Three.js シーン上で再生する。

**Independent Test**: ゲームを全クリアしてエンディング到達 → エイリアンが順番に登場 → バウンス → テキスト表示が完了まで再生されることを目視確認。

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US3] Write celebration animation unit tests in tests/unit/scenes/EndingScene.test.ts — test cases: (1) enter() 後に companionMeshes.length === 11, (2) 各メッシュの初期 scale が (0,0,0), (3) updateCelebration(elapsed=0.5) で最初の3体がポップイン中または完了, (4) updateCelebration(elapsed=2.5) で全11体が表示＋バウンス中＋テキスト表示, (5) exit() 後に companionGroup が除去されメッシュが dispose

### Implementation for User Story 3

- [x] T009 [US3] Add celebration properties and constants to EndingScene in src/game/scenes/EndingScene.ts — add `companionMeshes: THREE.Group[]`, `companionGroup: THREE.Group | null`, `celebrationElapsed: number`, `thankYouShown: boolean` properties and static constants `CIRCLE_RADIUS=3.0`, `POPIN_DELAY=0.2`, `POPIN_DURATION=0.3`, `BOUNCE_SPEED=3.0`, `BOUNCE_HEIGHT=0.5`, `THANK_YOU_DELAY=2.5`
- [x] T010 [US3] Implement `setupCelebration()` in src/game/scenes/EndingScene.ts — create companionGroup, iterate PLANET_ENCYCLOPEDIA to generate meshes via `CompanionManager.createCompanionMesh(entry)`, set circular positions (`cos/sin * CIRCLE_RADIUS`), set initial scale to (0,0,0), add to scene
- [x] T011 [US3] Implement `bounceEase(t)` private method in src/game/scenes/EndingScene.ts — overshoot easing: t<0.6 returns `(t/0.6)*1.2`, else returns `1.2 - ((t-0.6)/0.4)*0.2`
- [x] T012 [US3] Implement `updateCelebration(deltaTime)` in src/game/scenes/EndingScene.ts — increment celebrationElapsed, calculate POPIN_TOTAL, loop each mesh: set scale via bounceEase during popin phase, set scale (1,1,1) after popin, apply bounce Y offset after all popin complete, rotate meshes, trigger showThankYouText at THANK_YOU_DELAY
- [x] T013 [US3] Implement `showThankYouText()` in src/game/scenes/EndingScene.ts — create div with `'みんな ありがとう！'` text, Zen Maru Gothic font, gold color (#FFD700), text-shadow, insert before button in overlay, trigger fade-in via opacity transition
- [x] T014 [US3] Wire celebration into enter() and update() in src/game/scenes/EndingScene.ts — call `this.setupCelebration()` in enter() after selective reset, call `this.updateCelebration(deltaTime)` in update()
- [x] T015 [US3] Add celebration cleanup to exit() in src/game/scenes/EndingScene.ts — remove companionGroup from scene, traverse and dispose geometry/material for each mesh, reset companionMeshes and companionGroup to null

**Checkpoint**: エンディングで全11体のエイリアンがポップイン → バウンス →「みんな ありがとう！」テキスト表示。exit() で正常にクリーンアップ。テスト全パス。

---

## Phase 6: User Story 4 — ブースト炎の持続動作確認 (Priority: P4)

**Goal**: Feature 009 で実装済みのブースト炎持続表示・フェードアウトが正しく動作していることをテストで保証する。新規コード変更なし。

**Independent Test**: 既存のブースト炎テストスイートを実行し全パスを確認。

### Tests for User Story 4

- [x] T016 [P] [US4] Write boost flame integration test in tests/integration/BoostFlame.test.ts — test cases: (1) BoostSystem activate() 後 isActive() が true を返す間 getDurationProgress() が 0.0→1.0 に推移, (2) progress < 0.83 で emitCount=8・sizeFraction=1.0, (3) progress ≈ 0.90 で emitCount と sizeFraction が減少, (4) progress=1.0 で emitCount=0・sizeFraction=0.0, (5) deactivate 後 isActive() が false

**Checkpoint**: ブースト炎関連テストが全パス。Feature 009 の実装が仕様通りであることをテストで保証。

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 全体の品質確認

- [x] T017 [P] Run full test suite (`npm run test`) and fix any regressions in tests/
- [x] T018 [P] Run build (`npm run build`) and verify no TypeScript errors
- [ ] T019 Run quickstart.md manual test scenarios — US1: Safari スワイプ終了→ステージ1リセット, US2: 全クリア後ずかん全惑星表示, US3: エイリアンお祝い演出完走, US4: ブースト炎持続＆フェードアウト確認 *(requires manual iPad Safari testing)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A — no setup needed
- **Foundational (Phase 2)**: No dependencies — start immediately (T001 → T002 → T003)
- **User Story 1 (Phase 3)**: No dependency on Phase 2 — can start in parallel with Foundational (T004 → T005)
- **User Story 2 (Phase 4)**: No dependency on Phase 2 — can start in parallel. Touches EndingScene.ts (T006 → T007)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (CompanionManager static refactor) AND Phase 4 (selective reset in EndingScene) — T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
- **User Story 4 (Phase 6)**: No dependencies on other user stories — can run in parallel with any phase (T016)
- **Polish (Phase 7)**: Depends on all user stories being complete (T017, T018 in parallel → T019)

### User Story Dependencies

- **US1 (P1)**: Independent — modifies src/main.ts only
- **US2 (P2)**: Independent — modifies src/game/scenes/EndingScene.ts (selective reset portion)
- **US3 (P3)**: Depends on Phase 2 (CompanionManager static) + US2 (selective reset must be in place before adding celebration to enter())
- **US4 (P4)**: Fully independent — new test file only

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation follows contract specifications exactly
- Story complete before moving to next priority

### Parallel Opportunities

- **US1 + US2 + US4**: Can all start in parallel (different files, no dependencies)
- **Phase 2 + US1 + US4**: Can run concurrently
- **T017 + T018**: Build and test verification can run in parallel
- Within US3: T009/T010/T011 are sequential (same file), but tests (T008) can be written first in parallel with other US implementations

---

## Parallel Example: Early Parallel Batch

```bash
# These can all run in parallel (different files):
Task T001: "Update CompanionManager tests for static methods" (tests/unit/entities/CompanionManager.test.ts)
Task T004: "Session management unit tests" (tests/unit/SaveManager.test.ts)
Task T006: "Selective reset unit tests" (tests/unit/scenes/EndingScene.test.ts)
Task T016: "Boost flame integration test" (tests/integration/BoostFlame.test.ts)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CompanionManager refactor)
2. Complete Phase 3: US1 — Safari スワイプ終了リセット
3. **STOP and VALIDATE**: Test US1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Phase 2 (Foundational) → CompanionManager static refactor complete
2. US1 (Session management) → Test independently → Safari スワイプ終了で正常リセット
3. US2 (Selective reset) → Test independently → 全クリア後ずかん保持
4. US3 (Celebration animation) → Test independently → エイリアンお祝い演出
5. US4 (Boost flame verification) → Test passes → Feature 009 動作保証
6. Polish → Full validation

### Parallel Strategy

1. Start US1 (T004→T005) + Phase 2 (T001→T002→T003) + US4 (T016) in parallel
2. When Phase 2 completes: Start US2 (T006→T007)
3. When Phase 2 + US2 complete: Start US3 (T008→T009→...→T015)
4. Final: Polish (T017→T018→T019)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- CompanionManager static refactor is foundational because US3 depends on it, but US1/US2/US4 do not
