# Research: 太陽系全惑星ステージ拡張・ブースト演出強化・タイトルBGM修正

**Feature**: `005-solar-stages-boost-fx`
**Date**: 2026-03-15

## Research Task 1: ステージ構成の拡張（8→11ステージ）

### Decision
STAGE_CONFIGSを8→11に拡張。水星をステージ2、金星をステージ3として挿入し、既存ステージ番号を+2シフト。地球をステージ11（最終ステージ）として追加。

**新ステージ構成**:

| 新番号 | 旧番号 | 目的地 | 絵文字 | ステージ長 | 隕石間隔(s) | 星密度 |
|--------|--------|--------|--------|-----------|------------|--------|
| 1 | 1 | 月 | 🌙 | 1000 | 3.0 | 5 |
| 2 | (新規) | 水星 | ⚫ | 1100 | 2.8 | 5 |
| 3 | (新規) | 金星 | 🟡 | 1150 | 2.6 | 5 |
| 4 | 2 | 火星 | 🔴 | 1200 | 2.5 | 5 |
| 5 | 3 | 木星 | 🟠 | 1400 | 2.0 | 6 |
| 6 | 4 | 土星 | 🪐 | 1600 | 1.7 | 6 |
| 7 | 5 | 天王星 | 🔵 | 1800 | 1.4 | 7 |
| 8 | 6 | 海王星 | 🫧 | 2000 | 1.1 | 8 |
| 9 | 7 | 冥王星 | ❄️ | 2200 | 0.8 | 9 |
| 10 | 8 | 太陽 | ☀️ | 2500 | 0.6 | 10 |
| 11 | (新規) | 地球 | 🌍 | 2700 | 0.5 | 10 |

### Rationale
- 太陽系の全惑星（+冥王星+太陽）を網羅することでゲームの教育的価値が向上
- 水星・金星は月と火星の間の難易度に設定し、序盤の難易度カーブをなだらかに
- 地球を最終ステージにすることで「宇宙から故郷に帰還する」物語性を創出
- 既存ステージの難易度パラメータは変更しない（シフトするだけ）

### Alternatives Considered
1. **既存ステージの間に挿入せず末尾に追加** — 太陽系の距離順にならない。却下
2. **ステージ番号を変えず惑星名だけ変更** — セーブデータ互換性は保てるが、太陽系順序が狂う。却下

---

## Research Task 2: 惑星3Dモデルのプロシージャル生成

### Decision
各惑星をThree.jsの標準ジオメトリ+マテリアルでプロシージャル生成する。テクスチャ画像は使用せず、canvasテクスチャ（CanvasTexture）でプロシージャルに模様を描く。

**惑星別の実装方針**:

| 惑星 | ジオメトリ | マテリアル | 特徴的要素 |
|------|-----------|-----------|-----------|
| 月 | SphereGeometry(15) | MeshToonMaterial(0xcccccc) | 既存のまま |
| 水星 | SphereGeometry(10) | MeshToonMaterial(0x888888) | 小さめ。canvasテクスチャでクレーター模様（円をランダム配置） |
| 金星 | SphereGeometry(14) | MeshToonMaterial(0xddaa44) | 黄色がかったオレンジ。canvasテクスチャで雲の渦巻きパターン |
| 火星 | SphereGeometry(15) | MeshToonMaterial(0xcc4422) | 既存のまま |
| 木星 | SphereGeometry(20) | MeshToonMaterial | 大きめ。canvasテクスチャでオレンジ〜茶色の縞模様（水平グラデーション帯） |
| 土星 | SphereGeometry(15) + RingGeometry | MeshToonMaterial(0xddaa44) | 既存のリング付き |
| 天王星 | SphereGeometry(16) + RingGeometry | MeshToonMaterial(0x66ccdd) | 水色。リングをX軸90度回転で横倒し表現 |
| 海王星 | SphereGeometry(16) | MeshToonMaterial(0x2244cc) | 既存のまま |
| 冥王星 | SphereGeometry(8) | MeshToonMaterial(0xbbaaaa) | 小さめ。既存のまま |
| 太陽 | SphereGeometry(25) | MeshToonMaterial(0xffcc00) | 大きめ。PointLight付き。emissive光。パルスアニメ（scale oscillation） |
| 地球 | SphereGeometry(15) | MeshToonMaterial | canvasテクスチャで青い海+茶色大陸。外側に半透明の雲レイヤー（SphereGeometry(15.5)） |

### Rationale
- CanvasTextureを使用することで外部画像ファイル不要。YAGNI原則と配信サイズ最小化に合致
- MeshToonMaterialでカートゥーン調を維持（Constitution II準拠）
- 各惑星のサイズ差で太陽系のスケール感を簡易的に表現

### Alternatives Considered
1. **画像テクスチャを使用** — リアルだが外部アセット追加が必要。配信サイズ増大。却下
2. **ShaderMaterialで高度なプロシージャル生成** — 美しいが実装コスト高・iPad Safari互換性リスク。却下
3. **全惑星を同じサイズ・色違いのみ** — シンプルだが視覚的に物足りない。仕様に反する。却下

### Implementation Detail

```typescript
// canvasテクスチャ生成例（地球）
function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  // 青い海
  ctx.fillStyle = '#2266aa';
  ctx.fillRect(0, 0, 256, 128);
  // 茶色い大陸（ランダムな楕円）
  ctx.fillStyle = '#886633';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * 256, Math.random() * 128, 30 + Math.random() * 40, 15 + Math.random() * 25, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// 木星の縞模様
function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const colors = ['#dd8844', '#cc6633', '#bb7744', '#aa5522', '#dd9955'];
  const bandHeight = 128 / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, i * bandHeight, 256, bandHeight);
  });
  return new THREE.CanvasTexture(canvas);
}
```

---

## Research Task 3: Web Audio API ホワイトノイズ噴射音

### Decision
AudioManagerに`startBoostSFX()`/`stopBoostSFX()`メソッドを追加。ホワイトノイズを`AudioBufferSourceNode`で生成し、`BiquadFilterNode`（ローパス、カットオフ800Hz）でフィルタリングして噴射音を模倣する。

**アーキテクチャ**:
```
AudioBufferSourceNode (ホワイトノイズ)
  → BiquadFilterNode (lowpass, 800Hz)
    → GainNode (音量制御、フェードアウト用)
      → AudioContext.destination
```

**開始時**:
1. AudioBufferにホワイトノイズ（ランダム値 -1〜1）を充填（1秒分、ループ再生）
2. AudioBufferSourceNodeを作成し`loop = true`でループ再生
3. BiquadFilterNode (lowpass, frequency=800) を接続
4. GainNodeを作成し音量0.15で開始

**停止時（フェードアウト）**:
1. `gain.linearRampToValueAtTime(0, currentTime + 0.3)` で0.3秒フェードアウト
2. setTimeout(300ms)後にsource.stop()とノード切断

### Rationale
- AudioBufferSourceNodeのループ再生は途切れのない持続音に最適
- ホワイトノイズ + ローパスフィルタは風切り音/噴射音の定番手法
- BiquadFilterNodeは軽量でiPad Safariでも問題なく動作
- linearRampToValueAtTimeで滑らかなフェードアウト

### Alternatives Considered
1. **OscillatorNode（ノコギリ波）で噴射音** — 音がtonal（音程感がある）でホワイトノイズの方がよりリアル。却下
2. **ConvolverNodeでエフェクト** — 過剰な複雑さ。YAGNI。却下
3. **オフラインでWAVファイルを用意** — 外部アセット追加不要の方針に反する。却下

---

## Research Task 4: ブースト炎パーティクルの実装方式

### Decision
StageScene内で専用のTHREE.Pointsオブジェクトを管理する。既存のParticleBurstManager（爆発的な単発エフェクト用）とは別に、ブースト中に毎フレーム新規パーティクルを追加する持続放出型パーティクルをStageSceneが直接管理する。

**パーティクル仕様**:
- 色: オレンジ(0xff6600)〜赤(0xff2200)のランダム
- ブレンディング: AdditiveBlending（炎の重なりで明るく光る）
- 放出位置: ロケットの後方（z + 2）周辺にランダムオフセット
- 移動: 後方（+z方向）に緩やかに広がりながら移動
- 寿命: 各パーティクルは0.5秒でフェードアウト
- 最大数: 100パーティクル（古いものから順に再利用）
- 停止時: 新規放出を停止し、残存パーティクルはフェードアウト後にクリア

**パフォーマンス考慮**:
- 単一のBufferGeometryで全パーティクル管理（drawcall = 1）
- Float32Arrayの事前確保でGC回避
- 固定サイズバッファにリングバッファ方式で書き込み

### Rationale
- ParticleBurstManagerは単発爆発用で、毎フレーム放出には不向き
- StageScene内の専用ロジックで完結し、他モジュールへの影響なし
- THREE.PointsのAdditiveBlendingは炎表現の定番
- リングバッファ方式でメモリ確保を最小化しGCスパイク回避

### Alternatives Considered
1. **ParticleBurstManagerを拡張** — 単発爆発と持続放出はライフサイクルが異なる。混在すると複雑化。却下
2. **SpriteMaterialで個別メッシュ** — drawcall増大でパフォーマンス懸念。却下
3. **GPUParticleSystem（カスタムシェーダー）** — YAGNI。THREE.Pointsで十分。却下

---

## Research Task 5: タイトルBGM初期化のブラウザ互換性

### Decision
TitleScene.enter()でオーバーレイ全体にpointerdownリスナーを`{once: true}`で登録。最初のタッチで`AudioManager.initSync()`→`playBGM(0)`を呼ぶ。既存の「あそぶ」ボタンのpointerdownハンドラではAudioContextが初期化済みの場合は再初期化しない（initSync()内で既にinitialized=trueならreturn）。

**タッチ→BGM再生フロー**:
```
ユーザーがオーバーレイをタッチ
  → pointerdown (overlay, {once: true})
    → AudioManager.initSync()  // AudioContext生成
    → AudioManager.playBGM(0)  // タイトルBGM再生
```

```
ユーザーが「あそぶ」をタッチ
  → pointerdown (button, stopPropagation)
    → AudioManager.initSync()  // 初期化済みなら何もしない
    → AudioManager.playBGM(0)  // 既に再生中ならstopBGM→再playBGM
    → sceneManager.requestTransition('stage', ...)
```

**重要**: `initSync()` を冪等にする。すでにinitialized=trueなら何もしない。

### Rationale
- iPad Safari はユーザージェスチャー内でのAudioContext生成を要求
- `{once: true}` で2回目以降のタッチで不要な初期化を防止
- pointerdownはtouchstartよりクロスブラウザ。既存コードでも使用済み
- e.stopPropagation()で「あそぶ」ボタン押下時にオーバーレイリスナーが発火しないよう制御

### Alternatives Considered
1. **touchstartイベント** — pointerdownの方がクロスブラウザ。既存コードとの一貫性。却下
2. **clickイベント** — iPadではpointerdownの方がレスポンスが早い（click遅延300ms問題）。却下

---

## Research Task 6: クールダウン完了検知の実装方式

### Decision
StageSceneのupdate()内で、BoostSystem.update()呼び出し前後の`isAvailable()`を比較し、false→trueの遷移（=クールダウン完了）を検知してAudioManager.playSFX('boostReady')を呼ぶ。

**検知ロジック**:
```typescript
const wasAvailable = this.boostSystem.isAvailable();
this.boostSystem.update(deltaTime);
if (!wasAvailable && this.boostSystem.isAvailable()) {
  this.audioManager.playSFX('boostReady');
}
```

**boostReady SFX**:
上昇スイープ音（sine波、880Hz→1760Hz、0.2秒）。短く明るい「ピコーン！」感。

### Rationale
- BoostSystemの内部にAudioManager依存を持ち込まない（関心の分離）
- StageSceneが既にBoostSystemとAudioManagerの両方を保持している
- update()前後の比較は最もシンプルで確実な状態遷移検知

### Alternatives Considered
1. **BoostSystemにコールバック/イベント機構を追加** — 過剰な設計。YAGNI。却下
2. **BoostSystemにonCooldownComplete()メソッドを追加** — AudioManager依存をSystemに持ち込む。却下

---

## Research Task 7: SaveManager セーブデータ互換性

### Decision
clearedStage上限を8→11に変更。既存のセーブデータ（clearedStage: 0〜8）はそのまま読み込み可能。旧データのステージ番号は新ステージ構成では異なる惑星を指すが、ゲーム進行的には「ステージN+1から開始」ロジックが変わらないため、実害はない。

**例**: 旧データ clearedStage=3 → 新構成ではステージ4から開始（旧:木星の次=土星、新:火星の次=木星）。プレイヤーは多少巻き戻るが、再プレイの楽しみとして許容。

**TitleSceneのstartStage計算**: `Math.min(saveData.clearedStage + 1, 11)` に変更。

### Rationale
- 子供向けゲームでセーブデータの精密なマイグレーションは不要（やり直しが楽しい）
- clearedStage値の上限変更のみで互換性が保たれる
- 複雑なマイグレーションロジックはYAGNI

### Alternatives Considered
1. **マイグレーション関数で旧ステージ番号→新ステージ番号に変換** — 複雑で旧ステージ2の完了が新ステージ4の完了にマッピングされるなど直感に反する。却下
2. **セーブデータをクリアして最初からやり直し** — 既存プレイヤーの進捗が失われる。最悪のUX。却下

---

## Research Task 8: BGM定義の追加（水星・金星・地球）

### Decision
BGM_CONFIGSの既存ステージ番号を新番号にリマップし、水星(2)・金星(3)・地球(11)の新BGMを追加する。

**BGM番号のリマップ**:

| 新番号 | 内容 | 旧番号 |
|--------|------|--------|
| 0 | タイトル | 0（変更なし） |
| 1 | 月 | 1（変更なし） |
| 2 | 水星（新規） | — |
| 3 | 金星（新規） | — |
| 4 | 火星 | 旧2 |
| 5 | 木星 | 旧3 |
| 6 | 土星 | 旧4 |
| 7 | 天王星 | 旧5 |
| 8 | 海王星 | 旧6 |
| 9 | 冥王星 | 旧7 |
| 10 | 太陽 | 旧8 |
| 11 | 地球（新規） | — |
| -1 | エンディング | -1（変更なし） |

**新規BGMの設計方針**:
- **水星(2)**: Dm, 112 BPM。月より少しテンポアップ。静寂と灼熱のコントラスト
- **金星(3)**: Eb, 115 BPM。金星の厚い大気をイメージした重厚感。sine主体
- **地球(11)**: C, 145 BPM。最終ステージ。全楽器フル。勝利目前の高揚感。square波メロディ

### Rationale
- 既存BGMの音楽的品質を維持しつつ、新惑星に合った雰囲気を付与
- テンポはステージ進行に応じて段階的に上昇する既存パターンを踏襲
- 地球BGMはステージ10（太陽）より高テンポで最終決戦感を演出
