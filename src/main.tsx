import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initStorage } from './services/storage'
import { StorageProvider } from './contexts/StorageContext'
import { LocalStorageService } from './services/LocalStorageService'

const storageService = new LocalStorageService();

initStorage().then(() => {
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
