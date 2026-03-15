# Research: うちゅうの たび — 宇宙船キッズゲーム

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## R1: Three.js iPad Safari 60fps パフォーマンス

**Decision**: MeshToonMaterial + 低ポリゴンジオメトリでカートゥーン調3Dを実現し、描画負荷を抑える
**Rationale**:
- iPad Safari の WebGL 実装は 60fps 維持に十分な性能があるが、ポストエフェクトやシャドウ過多は避ける
- MeshToonMaterial はフラグメントシェーダーが軽量で、PBR マテリアルより描画コスト低
- ジオメトリは Three.js 組み込み（SphereGeometry, CylinderGeometry 等）を使用し、外部モデルファイル不要
- リアルタイムシャドウは無効にし、ベイクされた影 or シンプルな円形シャドウで代替
- オブジェクト数は画面内最大50程度（星30 + 隕石10 + 背景星10程度）に制限
**Alternatives considered**:
- glTF モデル読み込み → ファイルサイズ増加, ロード時間長, 外部依存 → 却下
- Shader Material カスタム → 開発コスト高、Constitution V「YAGNI」に反する → 却下

## R2: タッチ入力制御（iPad Safari）

**Decision**: `pointerdown` / `pointerup` / `pointermove` イベントでタッチ処理を実装
**Rationale**:
- Pointer Events は touch/mouse を統一的に扱え、iPad Safari でサポート済み
- 画面の左半分タッチ → 左移動、右半分タッチ → 右移動のシンプルな判定
- マルチタッチ（左右同時）は `pointerId` で追跡し、両方検出時は相殺（移動なし）
- ブーストボタンはHTML overlay の button 要素として配置（Three.js レンダラの上にCSS配置）
- `touch-action: none` を canvas に設定し、ブラウザデフォルトのピンチ・スクロールを無効化
**Alternatives considered**:
- Touch Events API → Pointer Events の方が汎用的で推奨 → 却下
- Three.js Raycaster でタッチ領域判定 → 3Dオブジェクトクリック不要、画面半分の判定にオーバーキル → 却下

## R3: ステートマシンによるシーン管理

**Decision**: 明示的な State パターンでシーン遷移を管理。各シーンは `enter()` / `update(dt)` / `exit()` インターフェースを実装
**Rationale**:
- 画面数が少ない（タイトル・ステージ×3・エンディング = 5画面）ためシンプルな実装で十分
- 各シーンクラスが Three.js の Scene オブジェクトを保持し、遷移時に入れ替え
- 外部ステートマシンライブラリは Constitution V「外部ライブラリ追加なし」に従い不使用
- 遷移: Title → Stage1 → Stage2 → Stage3 → Ending → Title のリニアフロー
**Alternatives considered**:
- XState ライブラリ → 外部依存追加、この規模では過剰 → 却下
- イベント駆動の画面切り替え → ステート管理が暗黙的になりバグの温床 → 却下

## R4: 当たり判定の方式

**Decision**: バウンディングスフィア（球体同士の距離判定）によるシンプルな衝突検出
**Rationale**:
- 宇宙船・星・隕石はいずれも概ね球に近い形状で、球同士の距離 < 半径の和 で判定可能
- Three.js の `Sphere` クラスの `intersectsSphere()` を活用可能
- フレームごとに全オブジェクトペアをチェック（星最大30 + 隕石最大10 = 40対象 vs 宇宙船1 = 40回の距離計算/フレーム）→ パフォーマンス問題なし
- 判定後のレスポンス：星→スコア加算＆消滅、隕石→スピードダウン＆無敵時間
**Alternatives considered**:
- Three.js の Box3 (AABB) → 球体の方が回転に依存せず安定 → 却下
- 物理エンジン (cannon-es) → 外部依存、この規模では過剰 → 却下

## R5: Web Audio API (Three.js Audio) による3D空間音響

**Decision**: Three.js の `AudioListener` + `PositionalAudio` で3D空間音響、`Audio` でBGM再生
**Rationale**:
- Three.js が Web Audio API をラップした Audio クラスを提供しており、追加ライブラリ不要
- `PositionalAudio` を星・隕石の3Dオブジェクトにアタッチすることで位置ベースの音の定位が自動計算される
- BGMは `Audio`（非空間音響）で再生、効果音は `PositionalAudio` で空間配置
- iPad Safari では `AudioContext` がユーザージェスチャー後に有効化される制約あり → タイトル画面の「あそぶ」ボタンタッチ時に `AudioContext.resume()` を呼ぶ
- 音源ファイルは MP3 形式（Safari 互換性最良）、小さいファイルサイズを維持
**Alternatives considered**:
- Howler.js → 外部依存、Three.js の Audio 機能で十分 → 却下
- 生の Web Audio API → Three.js が既にラップ提供、車輪の再発明 → 却下

## R6: localStorage によるセーブデータ管理

**Decision**: `localStorage` に JSON 形式でステージ進行状況を保存
**Rationale**:
- 保存データは最小限（クリア済みステージ番号のみ）で、localStorage の容量制限（5MB）に対して十分小さい
- キー: `universe-kids-race-save`、値: `{ "clearedStage": 0 | 1 | 2 | 3 }`
- ステージクリア時に保存、アプリ起動時に読み込み
- エンディング後にセーブデータをリセット（clearedStage = 0）
- JSON.parse の try-catch でデータ破損時にはデフォルト値にフォールバック
**Alternatives considered**:
- IndexedDB → この小さなデータ量には過剰 → 却下
- Cookie → 容量制限が厳しくAPI扱いづらい → 却下

## R7: ゲームループ設計

**Decision**: `requestAnimationFrame` ベースの固定タイムステップゲームループ
**Rationale**:
- `requestAnimationFrame` は iPad Safari で最適化されており、60fps に同期
- 各フレームでデルタタイム（dt）を計算し、物理・移動をdt依存にすることでフレームレート変動に対応
- ゲームループの処理順序: Input → Update（移動・生成・衝突判定・スコア） → Render
- `document.visibilitychange` イベントでバックグラウンド移行時にループを一時停止
**Alternatives considered**:
- setInterval ベース → ブラウザ最適化なし、バッテリー消費大 → 却下
- 固定タイムステップ + 補間 → この規模のゲームでは不要な複雑さ → 却下

## R8: GitHub Pages デプロイ

**Decision**: Vite ビルド出力を `gh-pages` ブランチにデプロイ
**Rationale**:
- `vite build` で `dist/` に静的ファイルを出力
- GitHub Actions で main ブランチへの push 時に自動ビルド＆デプロイ
- `vite.config.ts` で `base` をリポジトリ名に設定（GitHub Pages のパスに対応）
**Alternatives considered**:
- Netlify / Vercel → 追加サービス不要、GitHub Pages で十分 → 却下

## R9: ステージ別パラメータ設計

**Decision**: ステージ設定を `StageConfig` オブジェクトとして定義し、隕石頻度・星密度・ステージ長をパラメータ化
**Rationale**:
- 3ステージの難易度差は隕石の出現頻度のみで表現（spec要件に準拠）
- パラメータ例:
  - Stage 1（月）: 隕石頻度=低（3秒に1個）、ステージ長=短
  - Stage 2（火星）: 隕石頻度=中（2秒に1個）、ステージ長=中
  - Stage 3（土星）: 隕石頻度=高（1秒に1個）、ステージ長=長
- 虹色星の出現確率: 全星の10%程度
- ブースト持続時間: 3秒、クールダウン: 5秒
- スピードダウン回復時間: 3秒
- スコア: 通常星=100点、虹色星=500点
**Alternatives considered**:
- レベルエディタ的な外部ファイル定義 → YAGNI、3ステージなら直接コード定義で十分 → 却下

## R10: カートゥーン調3Dビジュアル

**Decision**: Three.js 組み込みジオメトリ + MeshToonMaterial + アウトラインエフェクトでカートゥーン調を実現
**Rationale**:
- 宇宙船: CylinderGeometry + ConeGeometry の結合、明るい色の MeshToonMaterial
- 星: OctahedronGeometry or IcosahedronGeometry、黄色い発光表現（emissive）
- 虹色星: 同形状 + 色のアニメーション（hue cycling）
- 隕石: DodecahedronGeometry、灰色〜茶色の MeshToonMaterial
- 目的地惑星: SphereGeometry、各惑星の特徴色（月=灰白、火星=赤、土星=黄+リング）
- 背景: 星空テクスチャ or 小さな PointsMaterial でパーティクル星
- MeshToonMaterial の gradientMap で2〜3段階のトゥーンシェーディング
**Alternatives considered**:
- MeshStandardMaterial + ポストプロセス → GPU負荷高、60fps維持困難 → 却下
- 2Dスプライト → Constitution IV「3D冒険体験」に反する → 却下
