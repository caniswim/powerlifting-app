import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import {
  flushNow,
  getSyncStatus,
  markEverythingDirty,
  signIn,
  signOutCloud,
  subscribeSync,
  type SyncStatus,
} from '../../../services/sync/syncEngine';

function formatWhen(iso: string | null): string {
  if (!iso) return 'nunca';
  const d = new Date(iso);
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Estado e controle do sync com o Firestore.
 *
 * O app funciona inteiro sem esta seção — ela existe para (a) autenticar e
 * (b) dar visibilidade da fila, que é o que se quer ver quando algo não chegou
 * na revisão semanal.
 */
export function CloudSyncSection() {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribeSync(setStatus), []);

  if (!status.configured) {
    return (
      <section className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
        <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
          Nuvem
        </h2>
        <p className="text-[11px] text-text-muted font-display leading-relaxed">
          Firestore não configurado. O app está rodando 100% local. Para ligar a
          nuvem, preencha o <span className="font-mono">.env</span> seguindo
          <span className="font-mono"> docs/firebase-setup.md</span>.
        </p>
      </section>
    );
  }

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      setPassword('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const handleResync = async () => {
    setBusy(true);
    markEverythingDirty();
    await flushNow();
    setBusy(false);
  };

  return (
    <section className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
          Nuvem (Firestore)
        </h2>
        {status.signedIn
          ? <Cloud size={16} className="text-accent-green" />
          : <CloudOff size={16} className="text-text-muted" />}
      </div>

      {status.signedIn ? (
        <>
          <div className="space-y-1 text-xs font-mono text-text-secondary">
            <div className="flex justify-between">
              <span className="text-text-muted">Conta</span>
              <span>{status.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Última sincronização</span>
              <span>{formatWhen(status.lastSyncAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Na fila</span>
              <span className={status.pending > 0 ? 'text-accent-gold' : ''}>{status.pending}</span>
            </div>
          </div>

          {status.lastError && (
            <p className="text-[11px] font-mono text-accent-red break-words">{status.lastError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy || status.syncing}
              onClick={() => void flushNow()}
              className="flex-1 h-10 bg-bg-tertiary border border-border rounded-md font-display text-[11px] uppercase tracking-wider text-text-secondary disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={12} className={status.syncing ? 'animate-spin' : ''} />
              Sincronizar
            </button>
            <button
              type="button"
              disabled={busy || status.syncing}
              onClick={() => void handleResync()}
              className="flex-1 h-10 bg-bg-tertiary border border-border rounded-md font-display text-[11px] uppercase tracking-wider text-text-secondary disabled:opacity-40"
            >
              Reenviar tudo
            </button>
          </div>

          <button
            type="button"
            onClick={() => void signOutCloud()}
            className="text-[11px] font-display uppercase tracking-wider text-text-muted hover:text-accent-red"
          >
            Sair da conta
          </button>
        </>
      ) : (
        <>
          <p className="text-[11px] text-text-muted font-display">
            Entre com a conta do atleta. Os dados continuam gravados localmente
            de qualquer forma — a nuvem só recebe cópia.
          </p>
          <input
            type="email"
            autoComplete="username"
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 bg-bg-input border border-border-light rounded-md px-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-gold"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 bg-bg-input border border-border-light rounded-md px-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-gold"
          />
          {error && <p className="text-[11px] font-mono text-accent-red break-words">{error}</p>}
          <button
            type="button"
            disabled={busy || !email || !password}
            onClick={() => void handleSignIn()}
            className="w-full h-11 bg-accent-gold text-bg-primary rounded-md font-display font-semibold text-xs uppercase tracking-wider disabled:opacity-40"
          >
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </>
      )}
    </section>
  );
}
