# Research: わくせいずかん＆うちゅうのなかま（惑星図鑑 & エイリアンコンパニオン）

**Feature**: `007-encyclopedia-companions`
**Date**: 2026-03-15

## Research Task 1: 図鑑UIアプローチ — DOM オーバーレイ vs SceneType追加

### Decision
DOM オーバーレイ方式を採用する。既存の `TutorialOverlay` パターンを踏襲し、`EncyclopediaOverlay` クラスとして `src/ui/` に配置する。SceneType の追加は行わない。

**実装方針**:
- `EncyclopediaOverlay` クラスが `#ui-overlay` の子要素としてフルスクリーンDIVを生成
- 背景は `rgba(0, 0, 32, 0.95)` で宇宙テーマを維持
- ギャラリーは CSS Grid（3列 + 4列 + 4列 or 4-4-3）で11枚を1画面に収める。iPad横画面（1024x768以上）でスクロール不要
- カードタップで詳細モーダル（中央に拡大表示）、「もどる」ボタンでギャラリーに戻る
- 最上位の「もどる」ボタンでオーバーレイ全体を閉じてTitleSceneに戻る

### Rationale
- `TutorialOverlay` が同じパターンで実績があり、技術リスクが低い
- SceneType 追加は `SceneManager`、`main.ts` の変更が大きく、3Dシーンが不要な図鑑には過剰
- DOM要素はテキスト表示（ひらがな豆知識）に最適。Three.js の TextGeometry はフォント読み込みが重くカートゥーン感が出にくい
- `pointer-events: auto` でタップイベントを確実に捕捉できる（iPad Safari実績あり）

### Alternatives Considered
1. **SceneType 'encyclopedia' 追加** — SceneManager に登録してシーン遷移で切り替え。3Dシーンが必要ないのにScene インターフェース実装が必要で過剰。YAGNI違反。却下
2. **Three.js Sprite/TextGeometry ベース** — 3D空間内にカードを配置。テキスト表示が困難（日本語フォントのジオメトリ化が重い）。却下
3. **HTMLCanvasベース描画** — DOM要素と同等の機能をCanvas APIで実装。CSS FlexboxやGridが使えず実装コスト大。却下

---

## Research Task 2: SaveData拡張と後方互換性

### Decision
`SaveData` インターフェースに `unlockedPlanets: number[]` を追加する。`SaveManager.load()` のバリデーションを拡張して後方互換性を維持する。

**実装方針**:
- `SaveData` 拡張: `{ clearedStage: number; unlockedPlanets: number[] }`
- `DEFAULT_DATA` 更新: `{ clearedStage: 0, unlockedPlanets: [] }`
- `load()` バリデーション追加:
  - `unlockedPlanets` が配列でない → `[]` にフォールバック
  - 配列内の値が 1〜11 の範囲外 → フィルタリングで除外
  - 重複排除: `[...new Set(data.unlockedPlanets)]`
- 旧フォーマット（`unlockedPlanets` プロパティなし）の場合 → `unlockedPlanets: []` を自動補完
- `main.ts` のtransition handler: `saveManager.save()` 呼び出しで `unlockedPlanets` も含める

**コンパニオンとずかんの一体管理**: `unlockedPlanets` で両方の獲得状態を管理する。ステージXをクリア → stageNumber X が`unlockedPlanets` に追加 → 図鑑カードXもコンパニオンXもアンロック。別々の配列は不要（FR-003/FR-011が同じトリガー）。

### Rationale
- `unlockedPlanets` 1配列で図鑑とコンパニオン両方の獲得状態を管理でき、最もシンプル
- 旧フォーマットからの自動マイグレーションにより既存プレイヤーのデータを破壊しない
- `clearedStage` との一貫性: `clearedStage >= X` なら stageNumber X は `unlockedPlanets` に含まれるべき。ただし独立管理として扱い、`clearedStage` からの自動復元はしない（明示的なクリアイベントでのみ追加）

### Alternatives Considered
1. **図鑑とコンパニオンで別の配列** — `unlockedCards: number[]` + `unlockedCompanions: number[]`。両者は同じトリガー（ステージクリア）で同時にアンロックされるため冗長。YAGNI。却下
2. **ビットフィールド** — `unlockedPlanets: number`（ビットマスク）。可読性が低く、デバッグが困難。11ビットで足りるが配列の方が明快。却下
3. **clearedStageから自動導出** — `clearedStage >= X` ならカードXは獲得済みとみなす。ステージ飛ばしプレイ（将来のステージセレクト機能等）に対応できない。却下

---

## Research Task 3: Three.jsでの幾何学体コンパニオン実装

### Decision
各コンパニオンは `THREE.Group` で構成し、球体（体）+ コーン（頭/耳/角）+ オプション装飾（リング等）の組み合わせとする。`MeshToonMaterial` でカートゥーン調に統一。全体を `CompanionManager` クラスが管理する。

**実装方針**:
- `CompanionManager` クラス: `src/game/entities/CompanionManager.ts`
- 各コンパニオンのメッシュは `createCompanionMesh(config)` で生成
- ジオメトリは惑星ごとにバリエーション:
  - 基本構造: SphereGeometry(0.3) 体 + ConeGeometry(0.15, 0.3) 頭
  - 土星: 追加 RingGeometry
  - 太陽: 追加 ConeGeometry 放射（3本の小さなコーン）
  - その他: 基本構造のまま（耳の角度/サイズ変更で差別化）
- マテリアル: `MeshToonMaterial({ color: planetColor })` — 惑星テーマカラーで統一
- 各コンパニオン10〜50ポリゴン。11体同時で最大550ポリゴン

### Rationale
- `MeshToonMaterial` は既存の宇宙船・隕石と同じカートゥーン調で統一感がある
- SphereGeometry + ConeGeometry は Three.js 標準で外部依存なし
- 11体×50ポリゴン = 550ポリゴンは描画負荷として軽微（既存シーンに対して+1%未満）
- `THREE.Group` でまとめることで position/rotation を一括制御できる

### Alternatives Considered
1. **Sprite（2Dビルボード）** — テクスチャ画像でコンパニオンを表現。3D感が失われ、カートゥーン調のジオメトリベース世界観と合わない。却下
2. **GLTFモデルロード** — リッチな3Dモデル。外部アセット依存が発生し、ロード時間が増加。YAGNI + 技術スタック制約違反。却下
3. **パーティクルベース** — Points で表現。個体の形状差が表現できず「キャラクター感」が出ない。却下

---

## Research Task 4: オービット計算とパフォーマンス

### Decision
コンパニオンのオービットは極座標ベースで計算する。各コンパニオンに固有の軌道角度オフセット・軌道面傾斜を持たせ、三角関数で毎フレーム位置を更新する。

**実装方針**:
- 軌道パラメータ（コンパニオンごと）:
  - `orbitRadius`: 2.0〜3.5（コンパニオン数に応じて自動調整）
  - `orbitSpeed`: 1.0〜1.5 rad/s（各体でわずかに異なる）
  - `orbitTilt`: 軌道面の傾き（-0.3〜0.3 rad）
  - `angleOffset`: 配置の初期角度（`index * (2π / count)` で均等配分）
- 毎フレーム計算:
  ```
  angle = angleOffset + elapsedTime * orbitSpeed
  x = shipX + orbitRadius * cos(angle)
  y = shipY + orbitRadius * sin(angle) * cos(orbitTilt)
  z = shipZ + orbitRadius * sin(angle) * sin(orbitTilt)
  ```
- `orbitRadius` はコンパニオン数が増えると外側に広がる:
  - 1〜3体: radius = 2.0
  - 4〜7体: radius = 2.5
  - 8〜11体: radius = 3.0
  - 各体のradius内で微小にずらす（±0.3）

**パフォーマンス見積もり**:
- 11体のposition更新: cos/sin計算22回/フレーム → 無視できるCPU負荷
- Group.position.set(): Three.jsの行列更新は自動で最適化済み
- メモリ: 11個のTHREE.Group = 約数KB。無視できるメモリ使用量

### Rationale
- 極座標ベースは直感的で数学的に安定。オーバーフローやドリフトが発生しない
- 均等配分の `angleOffset` により、複数体が重なることを防止
- `orbitTilt` で軌道面を微妙にずらすことで、同一Zライン上での重なりを更に軽減
- iPad Safariでの三角関数はネイティブ最適化されており、11体分でも パフォーマンスに影響なし

### Alternatives Considered
1. **物理シミュレーション（バネ・減衰）** — よりリアルな追従だが、11体の相互作用計算が複雑。ゲームバランスに影響する場合がある。YAGNI。却下
2. **Bezier曲線パス** — 自由な軌道が可能だが、パス定義が冗長。円軌道で十分な見た目。却下
3. **固定位置（オービットなし）** — 宇宙船の周囲に固定配置。「飛んでいる」感がなく、コンパニオンの魅力が半減。却下

---

## Research Task 5: 星の引き寄せ範囲拡大の実装方式

### Decision
`CollisionSystem.check()` に `companionBonus: number` 引数を追加し、星の衝突判定距離を拡大する。

**実装方針**:
- `CollisionSystem.check(spaceship, stars, meteorites, companionBonus = 0)` — 引数追加（デフォルト0で後方互換）
- 星の衝突判定:
  ```typescript
  const collisionDist = 1.0 + star.radius + companionBonus;
  ```
- `companionBonus` の計算は呼び出し側（StageScene）で行う:
  ```typescript
  const companionBonus = companionManager.getCount() * 0.2;
  ```
- 隕石の衝突判定は変更なし（コンパニオンは防御効果なし）

**ゲームバランス確認**:
- 現在の星の衝突距離: `1.0 + 0.6 = 1.6`（spaceship radius + star radius）
- 最大ボーナス: `11 × 0.2 = 2.2`
- 最大時の衝突距離: `1.6 + 2.2 = 3.8`（約2.4倍）
- 宇宙船の横幅（翼含む）が約2.4なので、最大2.2のボーナスは翼の外側約0.9まで引き寄せが効く計算。ゲームバランスを大きく崩さない範囲

### Rationale
- CollisionSystem に引数追加するだけで最小限の変更量
- デフォルト引数0により既存の呼び出し元に影響なし
- ボーナス計算をStageSceneに集約し、CollisionSystemは純粋な距離計算のみ担当（単一責任原則維持）

### Alternatives Considered
1. **CollisionSystem内でコンパニオン数を参照** — CollisionSystem にCompanionManager依存が発生。テストが複雑化。却下
2. **星のradiusを変更** — Star エンティティの radius を増やす方式。Star 側の変更が必要で影響範囲が大きい。却下
3. **磁石的な引き寄せ（星の移動）** — 星が宇宙船に向かって移動。SpawnSystemの変更が大きく、視覚的にも意図と異なる。却下

---

## Research Task 6: 図鑑ギャラリーレイアウトとカード獲得演出

### Decision
ギャラリーは CSS Grid 4列で配置（4-4-3）。iPad横画面（1024×768）で全11枚がスクロールなしで一覧可能。カード獲得演出はステージクリアメッセージ内に統合する（新規画面遷移なし）。

**ギャラリーレイアウト**:
- Grid: `grid-template-columns: repeat(4, 1fr)` → 3行（4+4+3）
- カードサイズ: 約150×180px。惑星絵文字（大）+ 名前 + 状態表示
- ロックカード: グレー背景 `#444`、テキスト「？？？」、opacity 0.6
- アンロックカード: 惑星テーマカラー背景、絵文字 + 名前
- タップでカード詳細（中央モーダル）: 絵文字大きく、名前、豆知識全文

**カード獲得演出**:
- 既存の `showClearMessage()` を拡張
- 「やったね！」の下に `「🌙 つきの ずかんカード ゲット！」` のテキストを追加表示
- 新規カード獲得時のみ表示（再クリア時は表示しない）
- シンプルなフェードイン（CSS transition 0.5s）。アニメーションライブラリ不使用

### Rationale
- CSS Grid は iPad Safari で安定動作（iOS 10.3+でフルサポート）
- 4列配置により各カードが十分な大きさを確保（44×44pt のタップターゲット基準を大幅に超える）
- 獲得演出を既存のクリアメッセージに統合することで、新規UI要素の追加を最小限に抑える
- フェードインのみのシンプルな演出でゲームテンポを阻害しない

### Alternatives Considered
1. **3列配置** — カードが大きくなるが3行目に5枚入り幅が狭くなる。4列の方がバランス良い。却下
2. **専用の獲得画面** — ステージクリアとは別画面でカード獲得を演出。画面遷移が増えてテンポが悪い。YAGNI。却下
3. **カードフリップアニメーション** — CSS transformでカード裏面→表面の反転アニメーション。実装コストに対して効果が限定的。YAGNI。却下
