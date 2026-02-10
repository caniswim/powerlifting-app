import { KEYS, scheduleSyncToOPFS } from './core';

export function getApiKey(): string {
  return localStorage.getItem(KEYS.API_KEY) ?? '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEYS.API_KEY, key);
  scheduleSyncToOPFS();
}
