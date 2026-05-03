export function createRetryableModuleLoader<TModule>(
  loadModule: () => Promise<TModule>,
): () => Promise<TModule> {
  let modulePromise: Promise<TModule> | null = null;

  return () => {
    if (modulePromise) {
      return modulePromise;
    }

    modulePromise = loadModule().catch((error: unknown) => {
      modulePromise = null;
      throw error;
    });

    return modulePromise;
  };
}
