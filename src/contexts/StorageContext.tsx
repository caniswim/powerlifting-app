import { createContext, useContext } from 'react';
import type { IStorageService } from '../services/storage.types';

const StorageContext = createContext<IStorageService | null>(null);

export function useStorage(): IStorageService {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
}

export function StorageProvider({ service, children }: { service: IStorageService; children: React.ReactNode }) {
  return <StorageContext.Provider value={service}>{children}</StorageContext.Provider>;
}
