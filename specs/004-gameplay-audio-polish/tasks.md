# Tasks: ゲーム体験改善第3弾 — HUDステージ番号・テキスト選択防止・BGM強化

**Input**: Design documents from `/specs/004-gameplay-audio-polish/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: spec.md の VI. 開発ワークフロー に TDD が記載されているため、テストタスクを含む。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Web app with index.html at repository root

---

## Phase 1: Setup

**Purpose**: ブランチ作成と既存テスト・ビルドの確認

- [x] T001 ブランチ `004-gameplay-audio-polish` を作成し、既存テスト全パス・ビルド成功を確認する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: BGMConfig の型定義拡張。US3/US4 が依存するデータ構造の準備

**⚠️ CRITICAL**: US3・US4 のBGM改修はこのフェーズ完了後に着手可能

- [x] T002 BGMConfig / BGMWaveforms / BGMVolumes のインターフェースを新構造に変更する in src/game/audio/AudioManager.ts（旧フィールド melody, waveform, volume, bassFrequency, bassVolume を削除し、tempo, beatsPerChord, chords, bassNotes, melodyNotes, waveforms, volumes に置き換え）
- [x] T003 BGM_CONFIGS の全10エントリ（stageNumber: -1, 0, 1〜8）を新BGMConfig構造で再定義する in src/game/audio/AudioManager.ts（contracts/bgm-layers.md のコード進行・波形・テンポ定義に従う）

**Checkpoint**: 型定義と定数データが確定。US1・US2 は Phase 2 に依存しないため並行着手可能

---

## Phase 3: User Story 1 — HUDにステージ番号を表示する (Priority: P1) 🎯 MVP

**Goal**: HUD上部のステージ名に「ステージN:」を付与し、進行度をひと目で把握可能にする

**Independent Test**: ステージ1〜8を順番にプレイし、HUD上部に「ステージN: [emoji] [目的地名]をめざせ！」形式で正しい番号と名前が表示されることを目視確認

### Tests for User Story 1

- [x] T004 [P] [US1] HUD.test.ts に「ステージ1: 🌙 月をめざせ！」形式の文字列を show() に渡して表示テキストを検証するテストを追加する in tests/unit/ui/HUD.test.ts

### Implementation for User Story 1

- [x] T005 [US1] StageScene.enter() で HUD.show() に渡す stageName を `ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}` に変更する in src/game/scenes/StageScene.ts

**Checkpoint**: ステージ1〜8でHUDに正しいステージ番号が表示される

---

## Phase 4: User Story 2 — テキスト選択とコンテキストメニューの無効化 (Priority: P1)

**Goal**: iPad タッチ操作中のテキスト選択・コンテキストメニューを無効化し、ゲーム操作の中断を防止

**Independent Test**: iPad でゲームを起動し、テキスト要素を長押し・ドラッグしてもテキスト選択やコンテキストメニューが表示されないことを確認

### Implementation for User Story 2

- [x] T006 [US2] index.html の html, body CSS ルールに `user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;` を追加する in index.html
- [x] T007 [US2] index.html の body 内、Vite モジュールスクリプトの前に `<script>document.addEventListener('contextmenu', function(e) { e.preventDefault(); });</script>` を追加する in index.html

**Checkpoint**: iPad Safari でテキスト選択・コンテキストメニューが表示されない

---

## Phase 5: User Story 3 — ステージBGMの和音・コード進行への強化 (Priority: P2)

**Goal**: ステージBGMを4レイヤー（メロディ・コードパッド・アルペジオ・ベース）構成に拡張し、各ステージで異なるコード進行を再生する

**Independent Test**: 各ステージを開始してBGMが再生され、和音（複数の音が同時に鳴る構成）が聞こえること、ステージごとに雰囲気が異なることを聴覚確認

### Tests for User Story 3

- [x] T008 [P] [US3] AudioManager.test.ts に playBGM() で4レイヤー（ベース持続OSC + パッド持続OSC + アルペジオ一時OSC + メロディ一時OSC）が生成されることを検証するテストを追加する in tests/unit/audio/AudioManager.test.ts
- [x] T009 [P] [US3] AudioManager.test.ts に stopBGM() で全 OscillatorNode が stop/disconnect され、bgmOscillators/bgmGains がクリアされることを検証するテストを追加する in tests/unit/audio/AudioManager.test.ts
- [x] T010 [P] [US3] AudioManager.test.ts に BGM_CONFIGS のステージ1〜8が全て異なるテンポ・キー（chords[0]）を持つことを検証するテストを追加する in tests/unit/audio/AudioManager.test.ts

### Implementation for User Story 3

- [x] T011 [US3] playBGM() を改修する: stopBGM() 後に新BGMConfigから (1) ベースOscillatorNode生成、(2) パッドOscillatorNode 3〜4つ生成、(3) シーケンサータイマーでメロディ・アルペジオを拍ごとにスケジューリング、(4) 8コードループ制御を実装する in src/game/audio/AudioManager.ts
- [x] T012 [US3] stopBGM() を確認・必要に応じ修正する: bgmOscillators の全ノードを stop/disconnect、bgmGains の全ノードを disconnect、bgmTimer を clearTimeout、配列クリアを実装する in src/game/audio/AudioManager.ts
- [x] T013 [US3] アルペジオ・メロディの一時ノート生成時に GainNode の linearRampToValueAtTime でフェードアウトし、クリックノイズを防止する in src/game/audio/AudioManager.ts
- [x] T014 [US3] BGM_CONFIGS[stageNumber] が見つからない場合に BGM_CONFIGS[0]（タイトル）にフォールバックするガード処理を追加する in src/game/audio/AudioManager.ts

**Checkpoint**: ステージ1〜8でそれぞれ異なるコード進行の和音BGMが再生される。ステージ遷移時に二重再生なし

---

## Phase 6: User Story 4 — タイトル画面BGMの強化 (Priority: P2)

**Goal**: タイトル画面BGMを和音構成に強化し、冒険の幕開けを感じさせる音楽にする

**Independent Test**: ゲーム起動時にタイトル画面で和音構成のBGMが再生され、「あそぶ」タップ後にステージBGMへスムーズに切り替わることを確認

### Tests for User Story 4

- [x] T015 [P] [US4] AudioManager.test.ts に playBGM(0) でタイトルBGM（Am キー、100 BPM）の4レイヤーが再生されることを検証するテストを追加する in tests/unit/audio/AudioManager.test.ts
- [x] T016 [P] [US4] AudioManager.test.ts に playBGM(-1) でエンディングBGM（C キー、108 BPM）の4レイヤーが再生されることを検証するテストを追加する in tests/unit/audio/AudioManager.test.ts

### Implementation for User Story 4

- [x] T017 [US4] BGM_CONFIGS[0]（タイトル）と BGM_CONFIGS[-1]（エンディング）の新構造定義が contracts/bgm-layers.md のコード進行・波形定義と一致していることを確認し、必要に応じ修正する in src/game/audio/AudioManager.ts

**Checkpoint**: タイトル画面・エンディング画面で和音BGMが再生される。ステージ遷移でスムーズに切り替わる

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 全体検証とクリーンアップ

- [x] T018 [P] 既存テスト全パスを確認する（npm run test）
- [x] T019 [P] ビルド成功を確認する（npm run build）
- [x] T020 quickstart.md の iPad 実機テスト手順に従い全項目を検証する in specs/004-gameplay-audio-polish/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS US3/US4 (BGM改修)
- **US1 (Phase 3)**: Depends on Setup only — **Phase 2 に非依存、即着手可能**
- **US2 (Phase 4)**: Depends on Setup only — **Phase 2 に非依存、即着手可能**
- **US3 (Phase 5)**: Depends on Phase 2 (BGMConfig 新構造)
- **US4 (Phase 6)**: Depends on Phase 5 (playBGM 4レイヤー実装完了)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1 (Setup)
  ├── Phase 2 (Foundational: BGMConfig型拡張)
  │     ├── Phase 5 (US3: ステージBGM和音化)
  │     │     └── Phase 6 (US4: タイトル/エンディングBGM和音化)
  │     └────────────────────────────────────────────┐
  ├── Phase 3 (US1: HUDステージ番号) ──────────────────┤
  ├── Phase 4 (US2: テキスト選択防止) ─────────────────┤
  └─────────────────────────────────────────────────── Phase 7 (Polish)
```

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **US1 (Phase 3) と US2 (Phase 4)**: ファイルが異なる（StageScene.ts vs index.html）ため完全並行可能
- **US1/US2 と Phase 2**: US1/US2 は BGMConfig に依存しないため Phase 2 と並行可能
- **T008, T009, T010**: 同一ファイル内だがテスト追加のため並行可能 [P]
- **T015, T016**: 同一ファイル内だがテスト追加のため並行可能 [P]
- **T018, T019**: テスト実行とビルド確認は並行可能 [P]

---

## Parallel Example: US1 + US2 Simultaneous

```bash
# These can run in parallel (different files, no dependencies):
Task T004: HUD.test.ts にステージ番号テスト追加
Task T006: index.html に CSS user-select 追加
Task T007: index.html に contextmenu preventDefault 追加

# Then sequentially:
Task T005: StageScene.ts のstageName変更 (depends on T004 test written)
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 3: US1 (HUDステージ番号) — 1ファイル変更のみ
3. Complete Phase 4: US2 (テキスト選択防止) — 1ファイル変更のみ
4. **STOP and VALIDATE**: US1 + US2 を iPad で独立検証
5. Deploy/demo if ready — ゲームプレイの基本改善が完了

### Incremental Delivery

1. Setup → US1 + US2 並行完了 → iPad 検証（MVP!）
2. Phase 2 (BGMConfig型拡張) → US3 (ステージBGM和音化) → 聴覚検証
3. US4 (タイトル/エンディングBGM) → 全体検証
4. Polish → quickstart.md 全項目検証 → 完了

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1/US2 は P1（最優先）、US3/US4 は P2
- AudioManager.ts の変更が最も大きく、US3 の T011 が核心タスク
- 全 BGM 定義（10パターン）は contracts/bgm-layers.md に詳細あり
- 周波数定数は data-model.md の周波数定数テーブル参照
- Commit after each task or logical group
