import type * as THREE from 'three';
import type { Scene, SceneType, SceneContext } from '../types';

type SceneFactory = () => Scene | Promise<Scene>;
type SceneModulePrefetcher = () => Promise<unknown>;

export class SceneManager {
  private scenes = new Map<SceneType, Scene>();
  private sceneFactories = new Map<SceneType, SceneFactory>();
  private sceneLoadPromises = new Map<SceneType, Promise<Scene>>();
  private sceneModulePrefetchers = new Map<SceneType, SceneModulePrefetcher>();
  private sceneModulePrefetchPromises = new Map<SceneType, Promise<unknown>>();
  private currentScene: Scene | null = null;
  private currentType: SceneType | null = null;
  private currentContext: SceneContext | null = null;
  private transitionRequestId = 0;
  private activeLoadStateRequestId: number | null = null;
  private activeLoadStateSceneType: SceneType | null = null;
  private onTransitionRequest:
    | ((sceneType: SceneType, context?: SceneContext) => void | Promise<void>)
    | null = null;
  private onTransitionError:
    | ((error: unknown, sceneType: SceneType, context: SceneContext) => void | Promise<void>)
    | null = null;
  private onLoadStateChange: ((isLoading: boolean, sceneType: SceneType) => void) | null = null;
  private inFlightTransition:
    | {
        sceneType: SceneType;
        context: SceneContext;
        promise: Promise<void>;
      }
    | null = null;
  private disposed = false;

  registerScene(type: SceneType, scene: Scene): void {
    this.scenes.set(type, scene);
  }

  registerSceneFactory(type: SceneType, factory: SceneFactory): void {
    this.sceneFactories.set(type, factory);
  }

  registerSceneModulePrefetch(type: SceneType, prefetcher: SceneModulePrefetcher): void {
    this.sceneModulePrefetchers.set(type, prefetcher);
  }

  setTransitionHandler(handler: (sceneType: SceneType, context?: SceneContext) => void | Promise<void>): void {
    this.onTransitionRequest = handler;
  }

  setLoadStateHandler(handler: (isLoading: boolean, sceneType: SceneType) => void): void {
    this.onLoadStateChange = handler;
  }

  setTransitionErrorHandler(
    handler: (error: unknown, sceneType: SceneType, context: SceneContext) => void | Promise<void>,
  ): void {
    this.onTransitionError = handler;
  }

  requestTransition(sceneType: SceneType, context: SceneContext = {}): Promise<void> {
    if (this.disposed) {
      return Promise.resolve();
    }

    const transitionPromise = this.onTransitionRequest
      ? Promise.resolve(this.onTransitionRequest(sceneType, context))
      : this.transitionTo(sceneType, context);

    return transitionPromise.catch((error: unknown) => {
      return Promise.resolve(this.onTransitionError?.(error, sceneType, context)).then(() => undefined);
    });
  }

  prefetchScene(sceneType: SceneType): Promise<void> {
    if (this.disposed) {
      return Promise.resolve();
    }

    return this.resolveScene(sceneType).then(() => undefined);
  }

  prefetchSceneModule(sceneType: SceneType): Promise<void> {
    if (this.disposed) {
      return Promise.resolve();
    }

    const existingPromise = this.sceneModulePrefetchPromises.get(sceneType);
    if (existingPromise) {
      return existingPromise.then(() => undefined);
    }

    const prefetcher = this.sceneModulePrefetchers.get(sceneType);
    if (!prefetcher) {
      return Promise.resolve();
    }

    const prefetchPromise = Promise.resolve(prefetcher()).catch((error: unknown) => {
      this.sceneModulePrefetchPromises.delete(sceneType);
      throw error;
    });

    this.sceneModulePrefetchPromises.set(sceneType, prefetchPromise);
    return prefetchPromise.then(() => undefined);
  }

  transitionTo(sceneType: SceneType, context: SceneContext = {}): Promise<void> {
    if (this.disposed) {
      return Promise.resolve();
    }

    if (
      this.inFlightTransition?.sceneType === sceneType &&
      this.hasSameContext(this.inFlightTransition.context, context)
    ) {
      return this.inFlightTransition.promise;
    }

    if (
      !this.inFlightTransition &&
      this.currentScene &&
      this.currentType === sceneType &&
      this.currentContext &&
      this.hasSameContext(this.currentContext, context)
    ) {
      return Promise.resolve();
    }

    const requestId = ++this.transitionRequestId;
    const promise = this.performTransition(sceneType, context, requestId);
    this.inFlightTransition = { sceneType, context, promise };
    return promise.finally(() => {
      if (this.inFlightTransition?.promise === promise) {
        this.inFlightTransition = null;
      }
    });
  }

  private hasSameContext(left: SceneContext, right: SceneContext): boolean {
    const leftEntries = Object.entries(left);
    const rightEntries = Object.entries(right);

    if (leftEntries.length !== rightEntries.length) {
      return false;
    }

    return leftEntries.every(([key, value]) => Object.is(right[key as keyof SceneContext], value));
  }

  private resolveScene(sceneType: SceneType): Promise<Scene | null> {
    if (this.disposed) {
      return Promise.resolve(null);
    }

    const cachedScene = this.scenes.get(sceneType);
    if (cachedScene) {
      return Promise.resolve(cachedScene);
    }

    const existingPromise = this.sceneLoadPromises.get(sceneType);
    if (existingPromise) {
      return existingPromise;
    }

    const factory = this.sceneFactories.get(sceneType);
    if (!factory) {
      return Promise.resolve(null);
    }

    const scenePromise = Promise.resolve(factory()).then((scene) => {
      this.scenes.set(sceneType, scene);
      this.sceneLoadPromises.delete(sceneType);
      return scene;
    }).catch((error: unknown) => {
      this.sceneLoadPromises.delete(sceneType);
      throw error;
    });

    this.sceneLoadPromises.set(sceneType, scenePromise);
    return scenePromise;
  }

  private isLatestTransitionRequest(requestId: number): boolean {
    return this.transitionRequestId === requestId;
  }

  private setActiveLoadState(requestId: number, sceneType: SceneType): void {
    this.activeLoadStateRequestId = requestId;
    this.activeLoadStateSceneType = sceneType;
    this.onLoadStateChange?.(true, sceneType);
  }

  private clearActiveLoadState(requestId: number): void {
    if (this.activeLoadStateRequestId !== requestId || !this.activeLoadStateSceneType) {
      return;
    }

    const sceneType = this.activeLoadStateSceneType;
    this.activeLoadStateRequestId = null;
    this.activeLoadStateSceneType = null;
    this.onLoadStateChange?.(false, sceneType);
  }

  private clearSupersededLoadState(nextRequestId: number): void {
    if (
      this.activeLoadStateRequestId === null ||
      this.activeLoadStateRequestId >= nextRequestId ||
      !this.activeLoadStateSceneType
    ) {
      return;
    }

    const sceneType = this.activeLoadStateSceneType;
    this.activeLoadStateRequestId = null;
    this.activeLoadStateSceneType = null;
    this.onLoadStateChange?.(false, sceneType);
  }

  private performTransition(sceneType: SceneType, context: SceneContext, requestId: number): Promise<void> {
    const isLazyLoadNeeded =
      !this.scenes.has(sceneType) &&
      (this.sceneLoadPromises.has(sceneType) || this.sceneFactories.has(sceneType));

    if (isLazyLoadNeeded) {
      this.setActiveLoadState(requestId, sceneType);
    } else {
      this.clearSupersededLoadState(requestId);
    }

    return this.resolveScene(sceneType)
      .then((nextScene) => {
        if (this.disposed || !nextScene || !this.isLatestTransitionRequest(requestId)) return;

        if (this.currentScene) {
          this.currentScene.exit();
        }

        this.currentScene = nextScene;
        this.currentType = sceneType;
        this.currentContext = context;
        this.currentScene.enter(context);
      })
      .finally(() => {
        if (isLazyLoadNeeded && this.isLatestTransitionRequest(requestId)) {
          this.clearActiveLoadState(requestId);
        }
      });
  }

  update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  getCurrentThreeScene(): THREE.Scene | null {
    return this.currentScene?.getThreeScene() ?? null;
  }

  getCurrentCamera(): THREE.Camera | null {
    return this.currentScene?.getCamera() ?? null;
  }

  getCurrentType(): SceneType | null {
    return this.currentType;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.transitionRequestId++;
    this.inFlightTransition = null;

    if (this.activeLoadStateSceneType) {
      this.onLoadStateChange?.(false, this.activeLoadStateSceneType);
    }

    this.activeLoadStateRequestId = null;
    this.activeLoadStateSceneType = null;
    this.currentScene?.exit();
    this.currentScene = null;
    this.currentType = null;
    this.currentContext = null;
    this.scenes.clear();
    this.sceneFactories.clear();
    this.sceneLoadPromises.clear();
    this.sceneModulePrefetchers.clear();
    this.sceneModulePrefetchPromises.clear();
    this.onTransitionRequest = null;
    this.onTransitionError = null;
    this.onLoadStateChange = null;
  }
}
