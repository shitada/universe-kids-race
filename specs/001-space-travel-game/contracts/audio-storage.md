# Module Interface: Audio & Storage

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## AudioManager

Three.js Audio 機能を使ったサウンド管理。BGM と 3D 空間効果音を制御する。

```typescript
type SoundEffect = 'starCollect' | 'meteoriteHit' | 'stageClear' | 'boost';

interface AudioManager {
  /** AudioContext を初期化する（ユーザージェスチャー後に呼ぶ） */
  init(camera: THREE.Camera): Promise<void>;
  
  /** BGM を再生する */
  playBGM(): void;
  
  /** BGM を停止する */
  stopBGM(): void;
  
  /** 3D位置付き効果音を再生する */
  playSpatialSFX(effect: SoundEffect, position: THREE.Vector3): void;
  
  /** 非空間効果音を再生する（UI音など） */
  playSFX(effect: SoundEffect): void;
  
  /** 全サウンドを停止しリソースを解放する */
  dispose(): void;
}
```

**Details**:
- `init()` は iPad Safari の AudioContext 制約のため、最初のユーザータッチ後に呼ぶ
- BGM は `THREE.Audio` (非空間) で再生
- 効果音は `THREE.PositionalAudio` で3Dオブジェクトの位置にアタッチ
- 音源ファイルは MP3 形式、`THREE.AudioLoader` で読み込み

## SaveManager

localStorage によるセーブデータ管理。

```typescript
interface SaveData {
  clearedStage: number;  // 0-3
}

interface SaveManager {
  /** セーブデータを読み込む。データ破損時はデフォルト値を返す */
  load(): SaveData;
  
  /** セーブデータを保存する */
  save(data: SaveData): void;
  
  /** セーブデータを削除する（全クリア後のリセット） */
  clear(): void;
}
```

**Storage Details**:
- Key: `universe-kids-race-save`
- Format: JSON `{ "clearedStage": 0 }`
- `load()` は try-catch で JSON.parse し、失敗時は `{ clearedStage: 0 }` を返す
- `save()` は `JSON.stringify` して `localStorage.setItem` を呼ぶ
