# Contract: エイリアンお祝い演出

**Feature**: `010-session-encyclopedia-celebration`
**Date**: 2026-03-15
**Type**: Scene Animation System

## Overview

EndingScene に全11体のエイリアンコンパニオンを Three.js シーン上に円形配置し、順次ポップイン → バウンスアニメーション →「みんな ありがとう！」テキスト表示の一連のお祝い演出を実装する。

## Interface

### CompanionManager（既存 — 可視性変更）

**定義箇所**: `src/game/entities/CompanionManager.ts`

#### 変更: createCompanionMesh を public static に

```typescript
// 変更前
private createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {

// 変更後
public static createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {
```

各 shape 生成メソッドも static に変更:
```typescript
private static createBasic(color: number): THREE.Group { ... }
private static createRinged(color: number): THREE.Group { ... }
private static createRadiant(color: number): THREE.Group { ... }
private static createHorned(color: number): THREE.Group { ... }
private static createIcy(color: number): THREE.Group { ... }
private static createBubble(color: number): THREE.Group { ... }
```

既存のインスタンス内呼び出しも更新:
```typescript
// コンストラクタ内・addCompanion 内
const mesh = CompanionManager.createCompanionMesh(entry);
```

---

### EndingScene（既存 — 大幅追加）

**定義箇所**: `src/game/scenes/EndingScene.ts`

#### 新規プロパティ

```typescript
private companionMeshes: THREE.Group[] = [];
private companionGroup: THREE.Group | null = null;
private celebrationElapsed = 0;
private thankYouShown = false;
```

#### 新規定数

```typescript
private static readonly CIRCLE_RADIUS = 3.0;
private static readonly POPIN_DELAY = 0.2;      // 各コンパニオンの登場間隔（秒）
private static readonly POPIN_DURATION = 0.3;    // 1体のポップイン時間（秒）
private static readonly BOUNCE_SPEED = 3.0;      // バウンス周波数
private static readonly BOUNCE_HEIGHT = 0.5;     // バウンス高さ
private static readonly THANK_YOU_DELAY = 2.5;   // テキスト表示開始時間（秒）
```

#### enter() への追加

```typescript
enter(context: SceneContext): void {
  // ... 既存のシーンセットアップ ...

  // 選択的リセット（clear() の置き換え）
  const saveData = this.saveManager.load();
  saveData.clearedStage = 0;
  this.saveManager.save(saveData);

  // エンディング BGM
  this.audioManager.playBGM(-1);

  // お祝い演出セットアップ
  this.setupCelebration();

  this.createOverlay(totalScore, totalStarCount);
}
```

#### setupCelebration()（新規）

```typescript
private setupCelebration(): void {
  this.companionGroup = new THREE.Group();
  this.companionMeshes = [];
  this.celebrationElapsed = 0;
  this.thankYouShown = false;

  for (let i = 0; i < PLANET_ENCYCLOPEDIA.length; i++) {
    const entry = PLANET_ENCYCLOPEDIA[i];
    const mesh = CompanionManager.createCompanionMesh(entry);

    // 円形配置
    const angle = i * (2 * Math.PI / PLANET_ENCYCLOPEDIA.length);
    mesh.position.set(
      Math.cos(angle) * EndingScene.CIRCLE_RADIUS,
      0,
      Math.sin(angle) * EndingScene.CIRCLE_RADIUS,
    );

    // 初期状態: 非表示（scale 0）
    mesh.scale.set(0, 0, 0);

    this.companionMeshes.push(mesh);
    this.companionGroup.add(mesh);
  }

  this.threeScene.add(this.companionGroup);
}
```

#### update() の変更

```typescript
update(deltaTime: number): void {
  if (this.bgStars) {
    this.bgStars.rotation.y += deltaTime * 0.03;
  }

  // お祝い演出更新
  this.updateCelebration(deltaTime);
}
```

#### updateCelebration()（新規）

```typescript
private updateCelebration(deltaTime: number): void {
  if (this.companionMeshes.length === 0) return;
  this.celebrationElapsed += deltaTime;

  const POPIN_TOTAL = EndingScene.POPIN_DELAY * (this.companionMeshes.length - 1)
    + EndingScene.POPIN_DURATION;

  for (let i = 0; i < this.companionMeshes.length; i++) {
    const mesh = this.companionMeshes[i];
    const startTime = i * EndingScene.POPIN_DELAY;

    if (this.celebrationElapsed < startTime) {
      // まだ登場していない
      mesh.scale.set(0, 0, 0);
    } else if (this.celebrationElapsed < startTime + EndingScene.POPIN_DURATION) {
      // ポップインアニメーション中
      const localT = (this.celebrationElapsed - startTime) / EndingScene.POPIN_DURATION;
      const s = this.bounceEase(localT);
      mesh.scale.set(s, s, s);
    } else {
      // ポップイン完了
      mesh.scale.set(1, 1, 1);
    }

    // バウンス（全体ポップイン完了後）
    if (this.celebrationElapsed > POPIN_TOTAL) {
      const angle = i * (2 * Math.PI / this.companionMeshes.length);
      const bounceY = Math.abs(Math.sin(this.celebrationElapsed * EndingScene.BOUNCE_SPEED))
        * EndingScene.BOUNCE_HEIGHT;
      mesh.position.set(
        Math.cos(angle) * EndingScene.CIRCLE_RADIUS,
        bounceY,
        Math.sin(angle) * EndingScene.CIRCLE_RADIUS,
      );
    }

    // 常に回転
    mesh.rotation.y += deltaTime * 2;
  }

  // 「みんな ありがとう！」テキスト表示
  if (!this.thankYouShown && this.celebrationElapsed >= EndingScene.THANK_YOU_DELAY) {
    this.showThankYouText();
    this.thankYouShown = true;
  }
}
```

#### bounceEase()（新規）

```typescript
private bounceEase(t: number): number {
  // Overshoot: 0 → 1.2 → 1.0
  if (t < 0.6) return (t / 0.6) * 1.2;
  return 1.2 - ((t - 0.6) / 0.4) * 0.2;
}
```

#### showThankYouText()（新規）

```typescript
private showThankYouText(): void {
  if (!this.overlay) return;

  const thankYou = document.createElement('div');
  thankYou.textContent = 'みんな ありがとう！';
  thankYou.style.cssText = `
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    margin-bottom: 1.5rem;
    opacity: 0;
    transition: opacity 0.5s ease-in;
  `;

  // ボタンの前に挿入
  const button = this.overlay.querySelector('button');
  if (button) {
    this.overlay.insertBefore(thankYou, button);
  } else {
    this.overlay.appendChild(thankYou);
  }

  // フェードイン
  requestAnimationFrame(() => {
    thankYou.style.opacity = '1';
  });
}
```

#### exit() の変更

```typescript
exit(): void {
  this.audioManager.stopBGM();

  // お祝い演出クリーンアップ
  if (this.companionGroup) {
    this.threeScene.remove(this.companionGroup);
    for (const mesh of this.companionMeshes) {
      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    this.companionMeshes = [];
    this.companionGroup = null;
  }

  if (this.overlay) {
    this.overlay.remove();
    this.overlay = null;
  }
}
```

## 演出タイムライン

```
0.0s ─── 第1エイリアン ポップイン開始
0.2s ─── 第2エイリアン ポップイン開始
0.4s ─── 第3エイリアン ポップイン開始
  :       :
2.0s ─── 第11エイリアン ポップイン開始
2.3s ─── 全エイリアン ポップイン完了 → バウンス開始
2.5s ─── 「みんな ありがとう！」テキスト フェードイン
  :    ─── バウンス継続（タップまでループ）
```

## カメラ配置

- カメラ位置: `(0, 0, 5)` — 既存設定を維持
- 円形配置（radius=3, z 平面）がカメラの視野（FOV=60°）内に収まることを確認済み
- 全11体 + 中心付近のオーバーレイテキストが同時に視認可能

## テスト要件

| テストケース | 期待結果 |
|------------|---------|
| enter() 呼び出し後に companionMeshes.length === 11 | 全11体のメッシュが生成される |
| 各メッシュの初期 scale が (0,0,0) | ポップイン前は非表示 |
| updateCelebration で elapsed=0.5 | 最初の3体がポップイン中または完了 |
| updateCelebration で elapsed=2.5 | 全11体が表示、バウンス中、テキスト表示 |
| exit() 後の cleanup | companionGroup が除去、メッシュが dispose |
