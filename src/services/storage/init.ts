import { requestPersistentStorage, readFromOPFS } from '../opfs';
import { ALL_KEYS } from './core';
import { runMigrations } from './sessionManager';

export async function initStorage(): Promise<void> {
  await requestPersistentStorage();

  const hasData = ALL_KEYS.some((k) => localStorage.getItem(k) !== null);
  if (!hasData) {
    const backup = await readFromOPFS();
    if (backup) {
      try {
        const snapshot = JSON.parse(backup) as Record<string, string | null>;
        for (const key of ALL_KEYS) {
          const value = snapshot[key];
          if (value != null) {
            localStorage.setItem(key, value);
          }
        }
      } catch {
        // corrupt backup — ignore
      }
    }
  }

  runMigrations();
}
