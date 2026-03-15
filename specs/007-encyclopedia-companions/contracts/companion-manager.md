# Contract: コンパニオン管理・オービット

**Feature**: `007-encyclopedia-companions`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

ステージクリアで獲得したエイリアンコンパニオンの3Dメッシュ生成・オービット計算・宇宙船追従を管理する。各コンパニオンは惑星テーマカラーの幾何学体で表現され、宇宙船の周りを異なる軌道で周回飛行する。隕石との当たり判定は持たない。

## Interface

### `CompanionManager` クラス（新規）

**定義箇所**: `src/game/entities/CompanionManager.ts`

#### `constructor(unlockedPlanets: number[])`

アンロック済み惑星に対応するコンパニオンのメッシュを生成し、オービットパラメータを初期化する。

**引数**:
- `unlockedPlanets`: アンロック済み惑星の stageNumber 配列（例: `[1, 2, 5]`）

**事後条件**:
- `unlockedPlanets` の各 stageNumber に対応するコンパニオンメッシュが生成される
- 各コンパニオンに以下の軌道パラメータが割り当てられる:
  ```
  count = unlockedPlanets.length
  baseRadius = count <= 3 ? 2.0 : count <= 7 ? 2.5 : 3.0
  
  for i in 0..count-1:
    angleOffset = i * (2π / count)
    orbitRadius = baseRadius + (i % 3) * 0.15
    orbitSpeed = 1.0 + i * 0.05
    orbitTilt = (i - count/2) * 0.15
  ```
- 全コンパニオンメッシュが `this.group` に追加される
- `elapsedTime = 0`
- `unlockedPlanets` が空の場合、空の状態で生成される（コンパニオンなし）

#### `update(deltaTime: number, shipX: number, shipY: number, shipZ: number): void`

毎フレーム呼ばれ、各コンパニオンのオービット位置を更新する。

**引数**:
- `deltaTime`: フレーム間の経過時間（秒）
- `shipX, shipY, shipZ`: 宇宙船の現在位置

**事後条件**:
- `elapsedTime += deltaTime`
- 各コンパニオンの位置が以下で計算される:
  ```
  angle = companion.angleOffset + elapsedTime * companion.orbitSpeed
  x = shipX + companion.orbitRadius * Math.cos(angle)
  y = shipY + companion.orbitRadius * Math.sin(angle) * Math.cos(companion.orbitTilt)
  z = shipZ + companion.orbitRadius * Math.sin(angle) * Math.sin(companion.orbitTilt)
  companion.mesh.position.set(x, y, z)
  ```
- 各コンパニオンの自転が更新される:
  ```
  companion.mesh.rotation.y += deltaTime * 2
  ```

#### `getCount(): number`

現在のコンパニオン数（0〜11）を返す。

#### `getStarAttractionBonus(): number`

星の引き寄せ範囲のボーナス値を返す。

**計算式**: `this.companions.length * 0.2`

**範囲**: `0.0`（コンパニオンなし）〜 `2.2`（11体フル）

#### `getGroup(): THREE.Group`

シーンに追加するためのルートグループを返す。

**用途**: `StageScene.enter()` 内で `this.threeScene.add(companionManager.getGroup())`

#### `dispose(): void`

全コンパニオンのジオメトリ・マテリアルを破棄する。

**事後条件**:
- 各コンパニオンメッシュのジオメトリとマテリアルが `dispose()` される
- `this.companions` が空になる
- `this.group` の子要素が全て除去される

## コンパニオンメッシュ生成仕様

### `private createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group`

**マテリアル共通**: `MeshToonMaterial({ color: entry.planetColor })`

#### `basic`（月・水星・金星・木星・地球）
```
body: SphereGeometry(0.3, 6, 6) — 中心
ear1: ConeGeometry(0.12, 0.25, 6) — position(0.2, 0.35, 0), rotation.z = -0.3
ear2: ConeGeometry(0.12, 0.25, 6) — position(-0.2, 0.35, 0), rotation.z = 0.3
eye1: SphereGeometry(0.06, 4, 4), color: 0x111111 — position(0.1, 0.1, 0.25)
eye2: SphereGeometry(0.06, 4, 4), color: 0x111111 — position(-0.1, 0.1, 0.25)
```

#### `ringed`（土星）
```
[basic] + Ring: RingGeometry(0.4, 0.55, 12) — rotation.x = π/2 * 0.8
```

#### `radiant`（太陽）
```
body: SphereGeometry(0.3, 6, 6)
ray1: ConeGeometry(0.08, 0.25, 4) — position(0, 0.5, 0)
ray2: ConeGeometry(0.08, 0.25, 4) — position(0.4, 0.15, 0), rotation.z = -π/3
ray3: ConeGeometry(0.08, 0.25, 4) — position(-0.4, 0.15, 0), rotation.z = π/3
eye1, eye2: [basicと同じ]
```

#### `horned`（火星）
```
[basic] +
horn1: ConeGeometry(0.06, 0.35, 4) — position(0.15, 0.45, 0), rotation.z = -0.2
horn2: ConeGeometry(0.06, 0.35, 4) — position(-0.15, 0.45, 0), rotation.z = 0.2
（ear は省略 — 角が代わり）
```

#### `icy`（天王星・冥王星）
```
body: IcosahedronGeometry(0.3, 0) — 角張った体
ear1, ear2, eye1, eye2: [basicと同じ]
```

#### `bubble`（海王星）
```
body: SphereGeometry(0.3, 8, 8) — MeshToonMaterial with transparent: true, opacity: 0.7
bubble1: SphereGeometry(0.1, 4, 4) — position(0.3, 0.2, 0)
bubble2: SphereGeometry(0.08, 4, 4) — position(-0.25, 0.3, 0)
eye1, eye2: [basicと同じ]
```

## Integration with StageScene

```typescript
// StageScene.ts
private companionManager: CompanionManager | null = null;

enter(context: SceneContext): void {
  // ... existing setup ...
  
  // Companions (after spaceship creation)
  const saveData = this.saveManager.load();  // ← SaveManager 参照追加が必要
  this.companionManager = new CompanionManager(saveData.unlockedPlanets);
  this.threeScene.add(this.companionManager.getGroup());
}

update(deltaTime: number): void {
  // ... existing update ...
  
  // Companion orbit update
  this.companionManager?.update(
    deltaTime,
    this.spaceship.position.x,
    this.spaceship.position.y,
    this.spaceship.position.z,
  );
  
  // Collision with companion bonus
  const bonus = this.companionManager?.getStarAttractionBonus() ?? 0;
  const collisionResult = this.collisionSystem.check(
    this.spaceship, this.stars, this.meteorites, bonus,
  );
}

exit(): void {
  // ... existing cleanup ...
  this.companionManager?.dispose();
  this.companionManager = null;
}
```

## Performance Budget

| 項目 | 値 | 根拠 |
|------|-----|------|
| 最大コンパニオン数 | 11 | 全ステージクリア時 |
| 1体あたりの最大ポリゴン | ~50 | bubble/ringed形状 |
| 合計最大ポリゴン | ~550 | 既存シーンのポリゴン数に対+1%未満 |
| 毎フレームcos/sin呼び出し | 22 | 11体 × 2（cos + sin） |
| メモリ増加 | ~5KB | 11個のTHREE.Group + BufferGeometry |
