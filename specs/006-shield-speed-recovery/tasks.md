# Tasks: エアシールドエフェクト追加・隕石衝突後の速度緩やか回復

**Input**: Design documents from `/specs/006-shield-speed-recovery/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/air-shield.md, contracts/speed-recovery.md

**Tests**: Included (TDD — plan.md Constitution Check で指定)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: 共有型定義の拡張。全ユーザーストーリーに先立って完了が必要

- [X] T001 Add 'RECOVERING' to SpeedState type union in src/types/index.ts

**Checkpoint**: SpeedState 型が 'NORMAL' | 'BOOST' | 'SLOWDOWN' | 'RECOVERING' に拡張済み

---

## Phase 2: User Story 1 — 宇宙船が常時エアシールドに包まれて見える (Priority: P1) 🎯 MVP

**Goal**: 宇宙船の周囲に青白い半透明のエアシールドエフェクトを常時表示。通常時はパルスアニメーション、ブースト時は明るく大きく強調

**Independent Test**: ステージを開始し、宇宙船の周りにエアシールドが表示されていることを確認。ブースト発動でエアシールドと炎パーティクルの両方が同時表示されることを確認

### Tests for User Story 1 (TDD — write first, verify FAIL)

- [X] T002 [P] [US1] Write AirShield unit tests (constructor initial state, update pulse animation, setBoostMode color/parameter switch, dispose cleanup) in tests/unit/effects/AirShield.test.ts

### Implementation for User Story 1

- [X] T003 [US1] Create AirShield class with SphereGeometry(1.5,16,16), MeshBasicMaterial(color:0x44aaff, transparent, AdditiveBlending, depthWrite:false), pulse animation (opacity 0.10–0.20 / scale 1.00–1.05 at 3Hz normal, opacity 0.25–0.35 / scale 1.25–1.35 at 5Hz boost), setBoostMode, setPosition, getMesh, dispose in src/game/effects/AirShield.ts
- [X] T004 [US1] Integrate AirShield into StageScene: instantiate in enter(), sync position + boost mode + update in update(), dispose in exit() in src/game/scenes/StageScene.ts

**Checkpoint**: エアシールドが宇宙船を包んで常時表示。ブースト中は強調。炎パーティクルと同時表示。テスト green

---

## Phase 3: User Story 2 — 隕石衝突後に速度が緩やかに回復する (Priority: P1)

**Goal**: 隕石衝突後の3秒間の減速期間終了後、速度が40%→100%へイーズアウト補間で約1秒かけて段階的に回復

**Independent Test**: 隕石に衝突し、3秒間の減速後に速度が瞬時ではなく徐々に回復することを体感確認

### Tests for User Story 2 (TDD — write first, verify FAIL)

- [X] T005 [P] [US2] Write RECOVERING state unit tests in tests/unit/entities/Spaceship.test.ts: SLOWDOWN→RECOVERING transition, easeOutQuad speed curve (progress 0→0.4x, progress 0.5→0.85x, progress 1.0→1.0x), RECOVERING→NORMAL transition on timer expiry, re-hit during RECOVERING resets to SLOWDOWN, boost during RECOVERING switches to BOOST
- [X] T006 [P] [US2] Write RECOVERING collision behavior test in tests/unit/systems/CollisionSystem.test.ts: verify RECOVERING state is not treated as invincible (collision triggers SLOWDOWN)

### Implementation for User Story 2

- [X] T007 [US2] Add RECOVERY_DURATION=1.0 constant, add RECOVERING case to getForwardSpeed() with easeOutQuad interpolation (multiplier = 0.4 + 0.6 * easeOutQuad(progress)), modify update() to transition SLOWDOWN→RECOVERING(1s)→NORMAL in src/game/entities/Spaceship.ts

**Checkpoint**: 隕石衝突→3秒減速→1秒イーズアウト回復→通常速度。回復中の再衝突・ブーストも正しく動作。テスト green

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: 全体検証とパフォーマンス確認

- [X] T008 Run full test suite (`npm run test`) and verify all tests pass
- [X] T009 Run quickstart.md validation: manual testing checklist (7 steps) on dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Phase 1 (型定義のみ。US1自体はRECOVERINGを使わないが、コンパイル一貫性のため)
- **User Story 2 (Phase 3)**: Depends on Phase 1 (RECOVERING型が必要)
- **US1 and US2 are independent**: Can proceed in parallel after Phase 1
- **Polish (Phase 4)**: Depends on Phase 2 and Phase 3 both complete

### User Story Dependencies

- **User Story 1 (Air Shield)**: Phase 1完了後すぐ開始可能。US2に依存しない
- **User Story 2 (Speed Recovery)**: Phase 1完了後すぐ開始可能。US1に依存しない

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- AirShield class (T003) before StageScene integration (T004)
- Spaceship speed recovery logic (T007) depends on SpeedState type (T001)

### Parallel Opportunities

- T002, T005, T006 can all run in parallel (different test files)
- T003 and T007 can run in parallel (different source files, no cross-dependency)
- US1 and US2 can be worked on in parallel after Phase 1

---

## Parallel Example: User Story 1 + User Story 2

```
Phase 1:  T001 (SpeedState type)
              |
         ┌────┴────┐
Phase 2:  │         │          Phase 3:
         T002 [US1] T005 [US2] + T006 [US2]  ← tests in parallel
          │         │
         T003 [US1] T007 [US2]  ← implementation in parallel
          │         │
         T004 [US1] │           ← StageScene integration
          │         │
         └────┬────┘
Phase 4:  T008, T009 (validation)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Foundational (T001)
2. Complete Phase 2: User Story 1 (T002→T003→T004)
3. **STOP and VALIDATE**: エアシールドが正しく表示されることを確認
4. Proceed to User Story 2

### Incremental Delivery

1. T001 → SpeedState 型拡張完了
2. US1 完了 → エアシールドが動作 → 視覚確認可能
3. US2 完了 → 速度回復が動作 → プレイ感確認可能
4. Polish → 全体検証

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 と US2 は独立しているため、どちらからでも着手可能
- TDD: テストを先に書いて FAIL を確認してから実装
- Commit after each task or logical group
- AirShield のパフォーマンス: SphereGeometry(1.5,16,16)=624頂点、MeshBasicMaterial → iPad Safari 60fps維持に問題なし
