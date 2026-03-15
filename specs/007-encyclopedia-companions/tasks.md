# Tasks: わくせいずかん＆うちゅうのなかま（惑星図鑑 & エイリアンコンパニオン）

**Input**: Design documents from `/specs/007-encyclopedia-companions/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/encyclopedia-overlay.md, contracts/companion-manager.md, contracts/save-data-extension.md

**Tests**: Included (TDD — plan.md Constitution Check で指定)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 型定義の拡張と惑星データの作成。全ユーザーストーリーに先立って完了が必要

- [X] T001 Add PlanetEncyclopediaEntry interface, CompanionShape type, and extend SaveData with unlockedPlanets: number[] in src/types/index.ts
- [X] T002 Create PLANET_ENCYCLOPEDIA array with all 11 planet entries (stageNumber, name, emoji, trivia, planetColor, companionShape) in src/game/config/PlanetEncyclopedia.ts

**Checkpoint**: 型定義と惑星図鑑データが利用可能。コンパイルエラーなし

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: SaveData 永続化基盤の拡張。全ユーザーストーリーの前提

**⚠️ CRITICAL**: US1・US2 いずれも Phase 2 完了なしに開始不可

### Tests (TDD — write first, verify FAIL)

- [X] T003 [P] Write PlanetEncyclopedia data validation tests (11 entries exist, unique stageNumbers 1-11, trivia is hiragana only, valid CompanionShape for each entry, planetColor is number) in tests/unit/config/PlanetEncyclopedia.test.ts
- [X] T004 [P] Write SaveManager unlockedPlanets validation tests (default empty array, backward compat with old format, array type fallback, range filter 1-11, integer filter, dedup, JSON parse error returns default) in tests/unit/storage/SaveManager.test.ts

### Implementation

- [X] T005 Extend SaveManager.load() with unlockedPlanets validation (array check, range filter, integer filter, dedup via Set) and update DEFAULT_DATA to include unlockedPlanets: [] in src/game/storage/SaveManager.ts
- [X] T006 Update transition handler to load-modify-save pattern: on stage clear push stageNumber to unlockedPlanets (with includes() guard), on ending push 11, persist via saveManager.save() in src/main.ts

**Checkpoint**: SaveData に unlockedPlanets が永続化される。旧フォーマットのセーブデータも正常に読み込まれる。テスト green

---

## Phase 3: User Story 1 — 🪐 わくせいずかん（惑星図鑑） (Priority: P1) 🎯 MVP

**Goal**: タイトル画面の「ずかん」ボタンから惑星図鑑を開き、クリア済み惑星のカードを閲覧できる。未クリア惑星はロック表示。全11惑星のひらがな豆知識カード

**Independent Test**: ステージ1をクリアして月のずかんカードを獲得し、タイトル画面の「ずかん」ボタンから図鑑を開いて、月のカードが豆知識とともに表示されること、未クリアのステージがロック表示されることを確認する

### Tests for User Story 1 (TDD — write first, verify FAIL)

- [X] T007 [P] [US1] Write EncyclopediaOverlay unit tests (show creates fullscreen DOM in #ui-overlay, card grid renders 11 slots, unlocked card shows emoji+name with theme color, locked card shows ??? with opacity 0.6, detail modal on unlocked card tap shows trivia, hideDetail returns to gallery, hide removes DOM, double-show prevention, back button calls onClose) in tests/unit/ui/EncyclopediaOverlay.test.ts

### Implementation for User Story 1

- [X] T008 [US1] Create EncyclopediaOverlay class with show(unlockedPlanets, onClose)/hide/showDetail/hideDetail methods, CSS Grid 4-column card gallery, lock/unlock card rendering, detail modal with trivia text per contracts/encyclopedia-overlay.md in src/ui/EncyclopediaOverlay.ts
- [X] T009 [US1] Add 「ずかん」button to TitleScene createOverlay(), wire pointerdown to encyclopediaOverlay.show(saveData.unlockedPlanets, onClose), call hide() in exit() in src/game/scenes/TitleScene.ts
- [X] T010 [US1] Add card acquisition text (「{emoji} {name}の ずかんカード ゲット！」) to stage clear message for newly unlocked planets only in src/game/scenes/StageScene.ts

**Checkpoint**: 「ずかん」ボタンから図鑑画面を開き、クリア済みカードの豆知識を閲覧、未クリアカードはロック表示。ステージクリア時にカード獲得テキスト表示。テスト green

---

## Phase 4: User Story 2 — 🛸 うちゅうのなかま（エイリアンコンパニオン） (Priority: P1)

**Goal**: ステージクリアで獲得した惑星テーマのエイリアンコンパニオンが宇宙船の周りをオービット飛行。仲間が増えるたびに星の引き寄せ範囲が拡大（base + count × 0.2）

**Independent Test**: ステージ1をクリアして月テーマのエイリアンを獲得し、ステージ2で宇宙船の周りにエイリアンが周回飛行していること、星の引き寄せ範囲が拡大していることを確認する

### Tests for User Story 2 (TDD — write first, verify FAIL)

- [X] T011 [P] [US2] Write CompanionManager unit tests (constructor creates meshes for unlockedPlanets, orbit position calculation with cos/sin, ship position tracking, getCount returns companion count, getStarAttractionBonus returns count×0.2, orbit radius auto-adjust by count, dispose cleans up geometry/material, empty unlockedPlanets creates no meshes) in tests/unit/entities/CompanionManager.test.ts
- [X] T012 [P] [US2] Write CollisionSystem companionBonus tests (star collision distance expanded by bonus value, meteorite collision distance unaffected by bonus, default companionBonus=0 maintains backward compat) in tests/unit/systems/CollisionSystem.test.ts

### Implementation for User Story 2

- [X] T013 [P] [US2] Create CompanionManager class with createCompanionMesh (basic/ringed/radiant/horned/icy/bubble shapes using MeshToonMaterial), orbit parameter auto-calculation, update() for orbit position + self-rotation, getCount/getStarAttractionBonus/getGroup/dispose per contracts/companion-manager.md in src/game/entities/CompanionManager.ts
- [X] T014 [US2] Add companionBonus parameter (default 0) to CollisionSystem.check(), expand star collision distance by companionBonus, keep meteorite collision unchanged in src/game/systems/CollisionSystem.ts
- [X] T015 [US2] Integrate CompanionManager into StageScene: create with saveData.unlockedPlanets in enter(), add group to threeScene, update orbit with spaceship position in update(), pass getStarAttractionBonus() to CollisionSystem.check(), dispose in exit() in src/game/scenes/StageScene.ts

**Checkpoint**: コンパニオンが宇宙船周りをオービット飛行。仲間数に応じて星の引き寄せ範囲拡大。11体同時でiPad Safari 60fps維持。テスト green

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 全体検証とパフォーマンス確認

- [X] T016 Run full test suite (`npm run test`) and verify all tests pass
- [X] T017 Run quickstart.md validation: manual testing checklist (14 steps) on dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (型定義が必要) — **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion
- **US1 and US2 are independent**: Can proceed in parallel after Phase 2
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4 both complete

### User Story Dependencies

- **User Story 1 (惑星図鑑)**: Phase 2 完了後すぐ開始可能。US2 に依存しない
- **User Story 2 (エイリアンコンパニオン)**: Phase 2 完了後すぐ開始可能。US1 に依存しない
- **StageScene**: US1 (T010) と US2 (T015) が同じファイルを変更するため、同時編集を避ける。US1 → US2 の順で実施推奨

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- US1: Tests (T007) → EncyclopediaOverlay (T008) → TitleScene integration (T009) → StageScene clear message (T010)
- US2: Tests (T011, T012) → CompanionManager (T013) + CollisionSystem (T014, parallel) → StageScene integration (T015)

### Parallel Opportunities

- T003, T004 can run in parallel (different test files)
- T007 can start as soon as Phase 2 completes
- T011, T012 can run in parallel (different test files)
- T013 and T014 can run in parallel (different source files, no cross-dependency)
- US1 and US2 can be worked on in parallel after Phase 2 (different files except StageScene)

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: T011 "CompanionManager unit tests in tests/unit/entities/CompanionManager.test.ts"
Task: T012 "CollisionSystem companionBonus tests in tests/unit/systems/CollisionSystem.test.ts"

# Launch parallel implementation tasks:
Task: T013 "CompanionManager class in src/game/entities/CompanionManager.ts"
Task: T014 "CollisionSystem companionBonus in src/game/systems/CollisionSystem.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (型定義 + 惑星データ)
2. Complete Phase 2: Foundational (SaveManager + main.ts)
3. Complete Phase 3: User Story 1 (惑星図鑑)
4. **STOP and VALIDATE**: 「ずかん」ボタン → 図鑑画面 → カード閲覧が動作することを確認
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → SaveData 基盤完成
2. Add User Story 1 → 惑星図鑑が動作 → Deploy/Demo (MVP!)
3. Add User Story 2 → コンパニオンオービット + 星ボーナスが動作 → Deploy/Demo
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- unlockedPlanets 1配列で図鑑・コンパニオン両方の獲得状態を管理（Research Task 2 決定事項）
- コンパニオン1体あたり最大50ポリゴン、11体合計最大550ポリゴン（既存シーン比+1%未満）
- EncyclopediaOverlay は TutorialOverlay パターンを踏襲（Research Task 1 決定事項）
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
