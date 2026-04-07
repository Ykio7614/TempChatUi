const resetters = new Set<() => void>();

export function registerStoreResetter(resetter: () => void) {
  resetters.add(resetter);
}

export function resetAllStores() {
  resetters.forEach((reset) => reset());
}
