# Data Model: セッション管理・ずかん永続化・全クリアお祝い演出

**Feature**: `010-session-encyclopedia-celebration`
**Date**: 2026-03-15

## Entities

### 1. セッションフラグ（新規 — main.ts 内ローカル定数）

Safari スワイプ終了の検出に使用するセッションストレージフラグ。

| 項目 | 値 |
|------|------|
| ストレージ | `sessionStorage` |
| キー | `'universe-kids-race-session'` |
| 値 | `'active'` |
| ライフサイクル | Safari タブ存続中は保持、スワイプ終了で自動クリア |

**定義箇所**: `src/main.ts`

**状態遷移**:
| 状態 | sessionStorage フラグ | アクション |
|------|---------------------|-----------|
| 初回アクセス／スワイプ終了後 | なし | `saveManager.clear()` → フラグ設定 |
| セッション継続中 | `'active'` | 何もしない |

---

### 2. SaveData（既存 — 変更なし）

ゲーム進行データとずかんデータを保持する型。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `clearedStage` | `number` | クリア済みステージ番号（0〜11）|
| `unlockedPlanets` | `number[]` | 解放済み惑星番号の配列（1〜11）|

**定義箇所**: `src/types/index.ts`  
**永続化**: `localStorage` キー `'universe-kids-race-save'`

**リセット挙動の変更**:
| タイミング | 変更前 | 変更後 |
|-----------|--------|--------|
| 全クリア（EndingScene） | `clear()` で全削除 | `clearedStage=0` のみリセット、`unlockedPlanets` 保持 |
| Safari スワイプ終了 | localStorage 残存 | `clear()` で全削除（sessionStorage フラグ不在時） |

---

### 3. EndingScene お祝い演出状態（新規 — EndingScene 内プロパティ）

エンディング画面のお祝い演出に必要な状態管理。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `companionMeshes` | `THREE.Group[]` | 全11体のエイリアンコンパニオンメッシュ |
| `companionGroup` | `THREE.Group` | 全コンパニオンを格納する親グループ |
| `celebrationElapsed` | `number` | 演出開始からの経過時間（秒） |
| `celebrationPhase` | `'popin' \| 'bounce'` | 現在の演出フェーズ |

**定義箇所**: `src/game/scenes/EndingScene.ts`

**演出パラメータ（定数）**:
| 定数 | 値 | 説明 |
|------|------|------|
| `CIRCLE_RADIUS` | `3.0` | 円形配置の半径 |
| `COMPANION_COUNT` | `11` | エイリアン数（PLANET_ENCYCLOPEDIA.length） |
| `POPIN_DELAY` | `0.2` | 各エイリアンのポップイン間隔（秒） |
| `POPIN_DURATION` | `0.3` | 1体のポップインアニメーション時間（秒） |
| `POPIN_TOTAL` | `2.2` | 全体のポップイン完了時間（0.2 × 10 + 0.3） |
| `BOUNCE_SPEED` | `3.0` | バウンスの周波数 |
| `BOUNCE_HEIGHT` | `0.5` | バウンスの高さ |
| `THANK_YOU_DELAY` | `2.5` | テキスト表示開始時間（秒） |

**ポップインアニメーション計算**:
```typescript
// i 番目のコンパニオン（i=0〜10）
const startTime = i * POPIN_DELAY;  // ポップイン開始時刻
const localT = (elapsed - startTime) / POPIN_DURATION;  // 0〜1 の進行度
const scale = localT < 0 ? 0 : localT >= 1 ? 1 : bounceEase(localT);

function bounceEase(t: number): number {
  // Overshoot bounce: 0→1.2→1.0
  if (t < 0.6) return t / 0.6 * 1.2;
  return 1.2 - (t - 0.6) / 0.4 * 0.2;
}
```

**バウンスアニメーション計算**:
```typescript
// 全コンパニオン共通（ポップイン完了後）
const bounceY = Math.abs(Math.sin(elapsed * BOUNCE_SPEED)) * BOUNCE_HEIGHT;
```

---

### 4. CompanionManager（既存 — メソッド可視性変更）

`createCompanionMesh` と各 shape 生成メソッドを `public static` に変更。

| メソッド | 変更前 | 変更後 |
|---------|--------|--------|
| `createCompanionMesh(entry)` | `private` | `public static` |
| `createBasic(color)` | `private` | `private static` |
| `createRinged(color)` | `private` | `private static` |
| `createRadiant(color)` | `private` | `private static` |
| `createHorned(color)` | `private` | `private static` |
| `createIcy(color)` | `private` | `private static` |
| `createBubble(color)` | `private` | `private static` |

**定義箇所**: `src/game/entities/CompanionManager.ts`

**影響**: 既存のインスタンス内呼び出し `this.createCompanionMesh(entry)` → `CompanionManager.createCompanionMesh(entry)` に変更が必要。

## Relationships

```
sessionStorage フラグ ──検出──→ SaveManager.clear()（全データリセット）
                                    │
SaveData ←──load/save──→ SaveManager
  ├── clearedStage     ←── EndingScene で 0 にリセット
  └── unlockedPlanets  ←── EndingScene で保持
                                    │
PLANET_ENCYCLOPEDIA ──参照──→ CompanionManager.createCompanionMesh()
                                    │
EndingScene ──生成──→ companionMeshes[11] ──配置──→ Three.js Scene
```
