# Contract: ブースト噴射音・炎パーティクル・クールダウン完了音

**Feature**: `005-solar-stages-boost-fx`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

ブースト発動中の視聴覚フィードバックを強化する3つの演出を追加。(1) ホワイトノイズ噴射音の持続再生、(2) オレンジ〜赤の炎パーティクル放出、(3) クールダウン完了時の通知音。

## Interface

### `AudioManager.startBoostSFX(): void`（新規）

ブースト噴射音のループ再生を開始する。

**前提条件**:
- `this.initialized === true` かつ `this.ctx !== null`
- ブースト噴射音が再生中でないこと（再生中の場合は何もしない）

**事後条件**:
- ホワイトノイズ（1秒AudioBuffer、ループ再生）がローパスフィルタ（800Hz）を経由して再生される
- 音量は0.15で開始
- `boostNoiseSource`, `boostNoiseGain`, `boostNoiseFilter` にノードが格納される

**オーディオグラフ**:
```
AudioBufferSourceNode (white noise, loop=true)
  → BiquadFilterNode (type='lowpass', frequency=800)
    → GainNode (gain=0.15)
      → AudioContext.destination
```

### `AudioManager.stopBoostSFX(): void`（新規）

ブースト噴射音をフェードアウトして停止する。

**前提条件**:
- ブースト噴射音が再生中であること（再生中でない場合は何もしない）

**事後条件**:
- gainが0.3秒かけて0にフェードアウト
- フェードアウト完了後にsource.stop()とノード切断
- `boostNoiseSource`, `boostNoiseGain`, `boostNoiseFilter` がnullにリセットされる

**フェードアウト実装**:
```typescript
this.boostNoiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
setTimeout(() => {
  this.boostNoiseSource?.stop();
  this.boostNoiseSource?.disconnect();
  this.boostNoiseFilter?.disconnect();
  this.boostNoiseGain?.disconnect();
  this.boostNoiseSource = null;
  this.boostNoiseGain = null;
  this.boostNoiseFilter = null;
}, 300);
```

### `AudioManager.playSFX('boostReady'): void`（既存メソッドの新分岐）

クールダウン完了通知音。短い上昇スイープ。

**仕様**:
- 波形: sine
- 周波数: 880Hz → 1760Hz
- 持続: 0.2秒
- 音量: 0.15

### ブースト炎パーティクル（StageScene内部）

StageScene内部でTHREE.Pointsとして管理。パブリックインターフェースなし。

**パーティクル仕様**:
- 最大100粒（リングバッファ、固定サイズ Float32Array）
- 色: オレンジ(0xff6600)〜赤(0xff2200)のランダム
- サイズ: 0.3〜0.5
- ブレンディング: THREE.AdditiveBlending
- 放出位置: ロケット後方（z + 2、x/y ±0.5 ランダムオフセット）
- 移動: +z方向に速度3〜5、y方向に±0.5のランダム揺らぎ
- 寿命: 0.5秒（アルファフェードアウト）
- 放出レート: ブースト中毎フレーム5粒

**ライフサイクル**:
```
ブースト開始 (activate):
  → initBoostFlame() — THREE.Points生成、Float32Array確保

ブーースト中 (update, isActive=true):
  → emitFlameParticles() — リングバッファに新規粒追加
  → updateFlameParticles() — 位置更新、寿命減算、フェードアウト

ブースト終了 (isActive=false):
  → 新規放出停止
  → 残存パーティクルのフェードアウト完了後にremoveBoostFlame()

ステージ終了 (exit):
  → removeBoostFlame() // クリーンアップ
```

### クールダウン完了検知（StageScene.update() 内部）

```typescript
// update()内
const wasAvailable = this.boostSystem.isAvailable();
this.boostSystem.update(deltaTime);
if (!wasAvailable && this.boostSystem.isAvailable()) {
  this.audioManager.playSFX('boostReady');
}
```

## Integration Points

### StageScene.update() でのブースト関連フロー

```typescript
// 1. ブースト発動
if (input.boostPressed && this.boostSystem.activate()) {
  this.audioManager.playSFX('boost');        // 既存: 短いスイープ
  this.audioManager.startBoostSFX();         // 新規: 噴射音開始
}

// 2. クールダウン完了検知
const wasAvailable = this.boostSystem.isAvailable();
this.boostSystem.update(deltaTime);
if (!wasAvailable && this.boostSystem.isAvailable()) {
  this.audioManager.playSFX('boostReady');   // 新規: 通知音
}

// 3. ブースト終了検知（active→inactive遷移）
if (wasActive && !this.boostSystem.isActive()) {
  this.audioManager.stopBoostSFX();          // 新規: 噴射音停止
}

// 4. 炎パーティクル更新
this.updateBoostFlame(deltaTime);

// 5. 隕石衝突時のクリーンアップ
if (collisionResult.meteoriteCollision) {
  this.audioManager.stopBoostSFX();          // 噴射音停止
  // 炎パーティクルもクリア
}
```

## Validation Rules

- ブースト噴射音はブースト発動から終了まで途切れなく再生されること
- 噴射音のフェードアウトは0.3秒以内に完了すること
- 炎パーティクルはブースト終了後1秒以内に全消滅すること
- クールダウン完了通知音は1回だけ再生されること（連打されないこと）
- 音声がないデバイスでもゲームプレイに支障がないこと（try-catchで保護）
