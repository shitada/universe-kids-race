# Tasks: ブースト炎の持続保証＆フェードアウト演出

**Input**: Design documents from `/specs/009-boost-flame-fadeout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — TDD approach specified in plan.md constitution check. Contracts define explicit test requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup

No setup tasks required. This feature modifies existing files only — no new dependencies, project initialization, or file creation needed. All target files already exist in the repository.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add `getDurationProgress()` to `BoostSystem` — both user stories depend on this method or the emission fix.

- [X] T001 Add unit tests for `getDurationProgress()` in tests/unit/systems/BoostSystem.test.ts — test cases: non-active returns 1.0, immediately after activate() returns 0.0, after update(1.5) returns ≈0.5, after update(2.9) returns ≈0.967, after update(3.1) returns 1.0 (deactivated), after cancel() returns 1.0
- [X] T002 Implement `getDurationProgress(): number` method in src/game/systems/BoostSystem.ts — returns `1.0 - durationTimer / DURATION` when active, `1.0` when inactive

**Checkpoint**: `getDurationProgress()` tests pass. Ready to begin user story implementation.

---

## Phase 3: User Story 1 — ブースト中の炎が途切れず表示される (Priority: P1) 🎯 MVP

**Goal**: ブーストが有効な間、炎エフェクトが途切れなく安定して連続表示される

**Independent Test**: ブーストを発動し、3秒間の全持続時間にわたって炎エフェクトが途切れずに表示されることを目視確認できる

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [US1] Write unit test verifying flame emission depends only on `boostSystem.isActive()` (not `flameEmitting`) in tests/unit/systems/BoostSystem.test.ts or appropriate StageScene test — mock `boostSystem.isActive()` returning true and confirm `emitFlameParticles()` is called regardless of `flameEmitting` state

### Implementation for User Story 1

- [X] T004 [US1] Remove `flameEmitting` from emission condition in src/game/scenes/StageScene.ts — change `if (this.boostSystem.isActive() && this.flameEmitting)` to `if (this.boostSystem.isActive())` in the `update()` method (around line 525)
- [X] T005 [US1] Verify `flameEmitting` is retained for cleanup only in src/game/scenes/StageScene.ts — confirm `flameEmitting = false` on boost end (line 403) and `!this.flameEmitting && !hasLive` in `updateFlameParticles()` (line 678) remain unchanged

**Checkpoint**: ブースト中に炎が途切れず表示される。手動テスト: ブースト発動→3秒間炎が連続表示されることを確認。

---

## Phase 4: User Story 2 — ブースト終了時に炎が自然にフェードアウトする (Priority: P2)

**Goal**: ブースト残り0.5秒（progress ≥ 0.83）でパーティクル放出数・サイズが線形に減少し、自然な消滅演出を実現

**Independent Test**: ブーストを発動し、終了間際の約0.5秒間で炎が段階的に弱まり、唐突に消えないことを目視確認できる

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [US2] Write unit tests for fadeout calculation logic — test emitCount and sizeFraction values at progress thresholds: progress < 0.83 → emitCount=8, sizeFraction=1.0; progress=0.90 → emitCount≈5, sizeFraction≈0.59; progress=1.0 → emitCount=0, sizeFraction=0.0. Add tests in tests/unit/systems/BoostSystem.test.ts or a new tests/unit/scenes/StageScene.test.ts as appropriate

### Implementation for User Story 2

- [X] T007 [US2] Add fadeout logic to `emitFlameParticles()` in src/game/scenes/StageScene.ts — compute `progress = this.boostSystem.getDurationProgress()`, define `fadeStart = 0.83`, calculate `emitCount` (8 when progress < fadeStart, `Math.round(8 * (1.0 - progress) / (1.0 - fadeStart))` otherwise) and `sizeFraction` (1.0 when progress < fadeStart, `(1.0 - progress) / (1.0 - fadeStart)` otherwise)
- [X] T008 [US2] Apply `emitCount` to particle emission loop in src/game/scenes/StageScene.ts — replace hardcoded `8` in the for-loop with computed `emitCount`
- [X] T009 [US2] Apply `sizeFraction` to particle spread and material size in src/game/scenes/StageScene.ts — multiply position spread by `sizeFraction` and update `(this.boostFlame.material as THREE.PointsMaterial).size = 0.5 * sizeFraction` at end of `emitFlameParticles()`

**Checkpoint**: ブースト終了間際に炎が段階的に縮小・減少し、唐突な消滅が発生しない。手動テスト: ブースト発動→残り0.5秒で炎のサイズ・量が段階的に減少することを確認。

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T010 [P] Run full test suite (`npm run test`) and fix any regressions in tests/
- [X] T011 [P] Run build (`npm run build`) and verify no TypeScript errors
- [X] T012 Run quickstart.md manual test scenarios — US1: 3秒間炎途切れなし、US2: 最後の0.5秒でフェードアウト、Edge Cases: 隕石衝突で即座解放、連続ブースト正常動作

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A — no setup needed
- **Foundational (Phase 2)**: No dependencies — start immediately (T001 → T002)
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (T003 → T004 → T005)
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion; can run in parallel with US1 but touches same file (T006 → T007 → T008 → T009)
- **Polish (Phase 5)**: Depends on all user stories being complete (T010, T011 in parallel → T012)

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) — modifies `StageScene.ts` emission condition
- **User Story 2 (P2)**: Depends on Foundational (Phase 2) — modifies `StageScene.ts` `emitFlameParticles()`. Recommend sequential after US1 since both modify `StageScene.ts`

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Commit after each task or logical group

### Parallel Opportunities

- T001 and T003 can theoretically run in parallel (different test files/sections) but T003 depends on `getDurationProgress()` being designed
- T010 and T011 can run in parallel
- US1 and US2 modify the same file (`StageScene.ts`) — recommend sequential execution (P1 → P2)

---

## Parallel Example: Foundational Phase

```bash
# T001 and T002 are sequential (TDD: test first, then implement)
Task: T001 "Add unit tests for getDurationProgress() in tests/unit/systems/BoostSystem.test.ts"
Task: T002 "Implement getDurationProgress() in src/game/systems/BoostSystem.ts"
```

## Parallel Example: Polish Phase

```bash
# T010 and T011 can run in parallel:
Task: T010 "Run full test suite"
Task: T011 "Run build and verify no TypeScript errors"
# Then sequentially:
Task: T012 "Run quickstart.md manual test scenarios"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (`getDurationProgress()`)
2. Complete Phase 3: User Story 1 (emission fix)
3. **STOP and VALIDATE**: ブースト中に炎が途切れないことを確認
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → `getDurationProgress()` ready
2. Add User Story 1 → 炎途切れ修正 → Test independently → MVP!
3. Add User Story 2 → フェードアウト演出追加 → Test independently → Complete!
4. Polish → Full test suite, build validation, quickstart scenarios

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Total modified files: 2 source (`BoostSystem.ts`, `StageScene.ts`) + 1 test (`BoostSystem.test.ts`)
- No new files created — all changes are modifications to existing files
- `flameEmitting` flag is NOT deleted — its role is narrowed to cleanup only
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
