import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

/**
 * Configuração do Firebase por variáveis de ambiente.
 *
 * Nada aqui é segredo: a config web do Firebase é pública por desenho, e quem
 * protege o dado é `firestore.rules` + Auth. Ainda assim ela fica em `.env`
 * (fora do git) para o repositório não carimbar o projeto de ninguém.
 *
 * O SDK entra por **import dinâmico**: sem `.env` configurado, o bundle inicial
 * do PWA não carrega uma linha de Firebase.
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface FirebaseHandles {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

function readEnv(name: string): string {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function readFirebaseConfig(): FirebaseConfig | null {
  const apiKey = readEnv('VITE_FIREBASE_API_KEY');
  const authDomain = readEnv('VITE_FIREBASE_AUTH_DOMAIN');
  const projectId = readEnv('VITE_FIREBASE_PROJECT_ID');
  const appId = readEnv('VITE_FIREBASE_APP_ID');

  if (!apiKey || !authDomain || !projectId || !appId) return null;

  const storageBucket = readEnv('VITE_FIREBASE_STORAGE_BUCKET');
  const messagingSenderId = readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID');

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    ...(storageBucket ? { storageBucket } : {}),
    ...(messagingSenderId ? { messagingSenderId } : {}),
  };
}

export function isFirebaseConfigured(): boolean {
  return readFirebaseConfig() !== null;
}

let handles: Promise<FirebaseHandles | null> | null = null;

/**
 * Inicializa (uma vez) e devolve os handles. `null` quando não há configuração.
 *
 * Sem cache persistente do Firestore de propósito: a fonte de verdade offline é
 * o localStorage do app e a fila de sync — ligar o cache do SDK duplicaria o
 * mesmo dado num IndexedDB paralelo.
 */
export function getFirebase(): Promise<FirebaseHandles | null> {
  if (handles) return handles;

  const config = readFirebaseConfig();
  if (!config) return Promise.resolve(null);

  handles = (async () => {
    const [{ initializeApp, getApps, getApp }, { getAuth }, { getFirestore }] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    return { app, auth: getAuth(app), db: getFirestore(app) };
  })();

  return handles;
}
