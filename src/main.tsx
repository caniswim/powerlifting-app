import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initStorage } from './services/storage'
import { StorageProvider } from './contexts/StorageContext'
import { LocalStorageService } from './services/LocalStorageService'
import { createFirestoreStorageService } from './services/FirestoreStorageService'
import { isFirebaseConfigured } from './services/firebase/config'
import { initSync } from './services/sync/syncEngine'

// Sem `.env` de Firebase o app roda exatamente como antes: local puro, offline,
// sem uma linha do SDK no bundle.
const storageService = isFirebaseConfigured()
  ? createFirestoreStorageService()
  : new LocalStorageService();

initStorage().then(() => {
  void initSync();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HashRouter>
        <StorageProvider service={storageService}>
          <App />
        </StorageProvider>
      </HashRouter>
    </StrictMode>,
  )
})
