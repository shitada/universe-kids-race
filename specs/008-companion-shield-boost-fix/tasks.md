# Tasks: コンパニオンタイミング修正・シールド楕円化・ブースト炎改善

**Input**: Design documents from `/specs/008-companion-shield-boost-fix/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — TDD approach specified in plan.md constitution check. Contracts define explicit test requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup

No setup tasks required. This feature modifies existing files only — no new dependencies, project initialization, or file creation needed. All target files already exist in the repository.

---

## Phase 2: Foundational (Blocking Prerequisites)

No foundational tasks required. All three user stories operate on independent files/methods with no shared infrastructure changes.

**Checkpoint**: Ready to begin user story implementation immediately.

---

## Phase 3: User Story 1 — 🛸 コンパニオンのタイミング修正と仲間演出 (Priority: P1) 🎯 MVP

**Goal**: ステージクリア時に新しいコンパニオンがスピン＋拡大アニメーションで登場し「なかまに なったよ！」テキストが表示される

**Independent Test**: ステージ1をクリアして「🌙 つきが なかまに なったよ！」テキストとスピン＋拡大アニメーションが表示されること、ステージ2開始時に月のコンパニオンがオービット表示されていること、ステージ1再クリア時に演出が表示されないことを確認

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T001 [US1] Write unit tests for `addCompanion()` and entrance animation in tests/unit/entities/CompanionManager.test.ts
  - `addCompanion(stageNumber)` returns `true` and increments companion count
  - `addCompanion(stageNumber)` adds mesh to group (`getGroup().children.length` +1)
  - `addCompanion(99)` returns `false` for invalid stageNumber (no matching PLANET_ENCYCLOPEDIA entry)
  - Added companion initial mesh scale is `(0, 0, 0)`
  - Added companion `entranceTimer` is `1.0`
  - After `update(0.5, ...)`: scale progresses toward 1.0 (≈ 0.5)
  - After `update(1.0, ...)` total: entranceTimer ≤ 0, scale ≈ 1.0, normal orbit rotation resumes
  - During entrance (entranceTimer > 0): rotation.y increases at `deltaTime * 8` (4× normal speed)

### Implementation for User Story 1

- [X] T002 [US1] Add `entranceTimer: number` field to `CompanionData` interface (default 0 for existing companions) in src/game/entities/CompanionManager.ts
- [X] T003 [US1] Implement `addCompanion(stageNumber: number): boolean` method — lookup PLANET_ENCYCLOPEDIA, create mesh via `createCompanionMesh()`, calculate orbit params based on current count, set initial scale to (0,0,0) and entranceTimer to 1.0, add to companions array and group in src/game/entities/CompanionManager.ts
- [X] T004 [US1] Update `update()` method to handle entrance animation — when `entranceTimer > 0`: decrement timer, set `scale = 1 - entranceTimer`, apply high-speed spin `deltaTime * 8`; when timer ≤ 0: normal orbit rotation in src/game/entities/CompanionManager.ts
- [X] T005 [US1] Add new-companion detection in `onStageClear()` — check `!saveManager.load().unlockedPlanets.includes(stageNumber)`, call `companionManager.addCompanion(stageNumber)` if new in src/game/scenes/StageScene.ts
- [X] T006 [US1] Add "{emoji} {name}が なかまに なったよ！" text (Zen Maru Gothic, 1.2rem, font-weight 700, color #FFD700) below existing encyclopedia card text in `showClearMessage()` for newly acquired companions in src/game/scenes/StageScene.ts
- [X] T007 [US1] Add `companionManager.update(deltaTime, shipX, shipY, shipZ)` call inside `isCleared` block in `update()`, before `handleStageComplete()` check, to keep entrance animation progressing during clear screen in src/game/scenes/StageScene.ts

**Checkpoint**: ステージクリア時にコンパニオン登場アニメーション（スピン＋拡大）となかまテキストが表示される。再クリア時は通常クリア演出のみ。次ステージ開始時に獲得済みコンパニオンがオービット表示される。

---

## Phase 4: User Story 2 — 🛡️ エアシールドをブースト専用の楕円形に変更 (Priority: P1)

**Goal**: 通常飛行時はシールド非表示、ブースト時のみ楕円形 (1.0, 0.8, 2.0) で表示しスピード感を演出

**Independent Test**: 通常走行中にシールドが見えないこと、ブースト発動で楕円シールドが表示されること、ブースト終了で非表示に戻ることを確認

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US2] Write/update unit tests for default hidden, elliptical scale, boost-only visibility, and removed normal pulse in tests/unit/effects/AirShield.test.ts
  - Constructor: `mesh.visible === false`
  - `setBoostMode(true)`: `mesh.visible === true`, `scale === (1.0, 0.8, 2.0)`, color `0x88ddff`
  - `setBoostMode(false)`: `mesh.visible === false`, color `0x44aaff`
  - `update()` when `!isBoosting`: no opacity change (early return)
  - `update()` when `isBoosting`: opacity pulses in range 0.25〜0.35
  - `update()` when `isBoosting`: scale remains fixed at (1.0, 0.8, 2.0) — no scale pulse

### Implementation for User Story 2

- [X] T009 [P] [US2] Set `this.mesh.visible = false` in constructor to make shield hidden by default in src/game/effects/AirShield.ts
- [X] T010 [US2] Update `setBoostMode()` — on `true`: set `mesh.visible = true` and `mesh.scale.set(1.0, 0.8, 2.0)`; on `false`: set `mesh.visible = false` in src/game/effects/AirShield.ts
- [X] T011 [US2] Update `update()` — add early return when `!isBoosting` (remove normal pulse animation), keep opacity-only pulse (0.25 + pulse * 0.10) for boost mode, remove scale pulse animation in src/game/effects/AirShield.ts

**Checkpoint**: 通常時シールド非表示。ブースト発動で楕円シールド表示、終了で非表示に戻る。opacity のみがパルスし、スケールは固定。

---

## Phase 5: User Story 3 — 🔥 ブースト炎エフェクトの持続保証・改善 (Priority: P1)

**Goal**: パーティクル密度を高めて途切れない豪華な噴射感を実現 (MAX 100→150, 放出数 5→8/frame, 寿命 0.5→0.7秒)

**Independent Test**: ブースト発動から終了まで炎パーティクルが途切れなく連続放出され、以前より密度が高く尾が長いことを確認

### Implementation for User Story 3

- [X] T012 [P] [US3] Update `MAX_FLAME_PARTICLES` from 100 to 150 in src/game/scenes/StageScene.ts
- [X] T013 [US3] Update `emitFlameParticles()` — change emit loop count from 5 to 8 (`for (let p = 0; p < 8; p++)`) and particle lifetime from 0.5 to 0.7 (`this.flameLifetimes[idx] = 0.7`) in src/game/scenes/StageScene.ts

**Checkpoint**: ブースト炎がより密度高く、長い尾を引いて途切れなく表示される。initBoostFlame() / updateFlameParticles() は MAX_FLAME_PARTICLES を参照するため自動対応。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全体検証とクロスカッティング確認

- [X] T014 [P] Run all unit tests (`npm run test`) and verify all pass
- [X] T015 [P] Run build (`npm run build`) and verify no errors
- [X] T016 Execute quickstart.md manual test scenarios (US1: コンパニオン登場, US2: 楕円シールド, US3: ブースト炎) on iPad Safari
- [X] T017 Verify edge cases: re-clear shows no companion animation, boost + clear no conflict, all 11 companions owned + clear no error, shield + flame visual overlap correct

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — skip
- **Foundational (Phase 2)**: No tasks — skip
- **US1 (Phase 3)**: Can start immediately — core feature, most complex
- **US2 (Phase 4)**: Can start in parallel with Phase 3 (different file: AirShield.ts)
- **US3 (Phase 5)**: Can start after US1 StageScene tasks (T005-T007) or in parallel with US2 (different methods in StageScene.ts)
- **Polish (Phase 6)**: After all user stories complete

### User Story Dependencies

- **US1 (Companion Timing)**: Independent — CompanionManager.ts + StageScene.ts (onStageClear / showClearMessage / update isCleared block)
- **US2 (Elliptical Shield)**: Independent — AirShield.ts only. **Can run fully in parallel with US1**
- **US3 (Boost Flame)**: Independent — StageScene.ts (MAX_FLAME_PARTICLES / emitFlameParticles only). Shares file with US1 but modifies completely different methods/sections

### Within Each User Story

- Tests written FIRST (TDD), verify they FAIL before implementation
- Interface/data model changes before behavior changes (US1: CompanionData → addCompanion → update)
- CompanionManager.ts changes before StageScene.ts integration (US1)
- Constructor changes before method changes (US2: constructor → setBoostMode → update)
- Constants before method changes (US3: MAX → emit params)

### Parallel Opportunities

- **US2 (T008-T011)** can execute fully in parallel with **US1 (T001-T007)** — completely different files
- **US3 (T012-T013)** can execute in parallel with **US2 (T008-T011)** — different files
- Within US1: T001 (tests) → T002-T004 (CompanionManager.ts, sequential) → T005-T007 (StageScene.ts, sequential)
- Within US2: T008 (tests) → T009-T011 (AirShield.ts, sequential)
- Within US3: T012 → T013 (StageScene.ts, sequential)

---

## Parallel Example: US1 + US2 Concurrent Execution

```bash
# Stream A (US1 — CompanionManager + StageScene):
T001 → T002 → T003 → T004 → T005 → T006 → T007

# Stream B (US2 — AirShield, fully independent):
T008 → T009 → T010 → T011

# Stream C (US3 — StageScene flame params, after Stream A or parallel with Stream B):
T012 → T013

# Final: Polish
T014 → T015 → T016 → T017
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: US1 — コンパニオン登場演出
2. **STOP and VALIDATE**: ステージクリアしてコンパニオン演出を確認
3. Deploy/demo if ready (最も価値の高い達成感演出が動作)

### Incremental Delivery

1. US1 → コンパニオン登場演出が動作 → 確認 (MVP!)
2. US2 → 楕円シールドが動作 → 確認
3. US3 → 炎パーティクル改善 → 確認
4. Polish → 全体テスト + iPad Safari 検証 → 完了

### Parallel Strategy

1. Stream A: US1 (T001-T007) — CompanionManager + StageScene integration
2. Stream B: US2 (T008-T011) — AirShield (fully independent, start simultaneously)
3. Stream C: US3 (T012-T013) — Flame params (start after US1 or with US2)
4. All streams converge at Polish phase

---

## Notes

- All changes are modifications to 3 existing source files + 2 existing test files — no new files created
- US3 is the simplest (3 constant changes) — lowest risk, highest confidence
- US1 is the most complex (new method + animation logic + scene integration) — implement with TDD
- US2 is moderate (behavior change + test updates) — straightforward
- All three user stories are P1 priority; execution order follows complexity/dependency
- Commit after each completed user story for safe incremental progress
- Performance: 150 particles + companion animation + elliptical shield all within iPad Safari 60fps budget
