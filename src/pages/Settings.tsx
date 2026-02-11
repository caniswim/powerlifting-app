import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { calculateDOTS } from '../utils/calculations';
import { useStorage } from '../contexts/StorageContext';
import type { AthleteProfile } from '../types';

const APP_VERSION = '1.1.0';

export default function Settings() {
  const storage = useStorage();
  const [profile, setProfile] = useState<AthleteProfile>(() => storage.getProfile());
  const [sessionIdx, setSessionIdx] = useState<number>(() => storage.getSessionIndex());
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'updating' | 'up-to-date' | 'error'>('idle');
  const [apiKey, setApiKeyState] = useState(() => storage.getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const derivedWeek = Math.floor(sessionIdx / 6) + 1;
  const derivedDayIndex = sessionIdx % 6;

  // Auto-calculate total and DOTS when profile values change
  useEffect(() => {
    const total = profile.squat1RM + profile.bench1RM + profile.deadlift1RM;
    const dots = calculateDOTS(profile.bodyweight, total);
    if (total !== profile.total || dots !== profile.dots) {
      setProfile((prev) => ({ ...prev, total, dots }));
    }
  }, [profile.bodyweight, profile.squat1RM, profile.bench1RM, profile.deadlift1RM, profile.total, profile.dots]);

  const handleProfileChange = (field: keyof AthleteProfile, value: string) => {
    const num = parseFloat(value) || 0;
    setProfile((prev) => ({ ...prev, [field]: num }));
  };

  const handleSave = useCallback(() => {
    const total = profile.squat1RM + profile.bench1RM + profile.deadlift1RM;
    const dots = calculateDOTS(profile.bodyweight, total);
    const updated = { ...profile, total, dots };
    storage.saveProfile(updated);
    storage.setSessionIndex(sessionIdx);
    storage.setCurrentWeek(Math.floor(sessionIdx / 6) + 1);
    storage.setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile, sessionIdx, apiKey, storage]);

  const handleExport = () => {
    const data = storage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerlifting-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = storage.importData(text);
      if (ok) {
        setProfile(storage.getProfile());
        setSessionIdx(storage.getSessionIndex());
        setImportStatus('success');
      } else {
        setImportStatus('error');
      }
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    storage.resetAllData();
    setProfile(storage.getProfile());
    setSessionIdx(0);
    setShowResetModal(false);
  };

  const handleUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 3000);
      return;
    }

    setUpdateStatus('checking');

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setUpdateStatus('error');
        setTimeout(() => setUpdateStatus('idle'), 3000);
        return;
      }

      await registration.update();

      const waiting = registration.waiting;
      if (waiting) {
        setUpdateStatus('updating');
        waiting.postMessage({ type: 'SKIP_WAITING' });
        // Reload after the new SW takes over
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
        // Fallback reload if controllerchange doesn't fire
        setTimeout(() => window.location.reload(), 2000);
      } else if (registration.installing) {
        setUpdateStatus('updating');
        registration.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'installed') {
            sw.postMessage({ type: 'SKIP_WAITING' });
            setTimeout(() => window.location.reload(), 1000);
          }
        });
      } else {
        setUpdateStatus('up-to-date');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      }
    } catch {
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-28">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold font-display text-accent-gold tracking-wider uppercase">
          Configurações
        </h1>

        {/* Profile Section */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Perfil do Atleta
          </h2>

          <div className="space-y-3">
            <InputField
              label="Peso Corporal"
              unit="kg"
              value={profile.bodyweight}
              onChange={(v) => handleProfileChange('bodyweight', v)}
            />

            <div className="border-t border-border pt-3">
              <span className="text-[10px] font-display text-text-muted uppercase tracking-wider">
                1RM Atual
              </span>
            </div>

            <InputField
              label="Agachamento"
              unit="kg"
              value={profile.squat1RM}
              onChange={(v) => handleProfileChange('squat1RM', v)}
            />
            <InputField
              label="Supino"
              unit="kg"
              value={profile.bench1RM}
              onChange={(v) => handleProfileChange('bench1RM', v)}
            />
            <InputField
              label="Terra"
              unit="kg"
              value={profile.deadlift1RM}
              onChange={(v) => handleProfileChange('deadlift1RM', v)}
            />

            {/* Calculated values */}
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-sm font-display text-text-secondary uppercase tracking-wider">
                Total
              </span>
              <span className="text-lg font-mono font-bold text-text-primary">
                {profile.total} <span className="text-xs text-text-muted">kg</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-display text-text-secondary uppercase tracking-wider">
                DOTS
              </span>
              <span className="text-lg font-mono font-bold text-accent-gold">
                {profile.dots.toFixed(1)}
              </span>
            </div>
          </div>
        </section>

        {/* Session Index Selector */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Posição no Programa
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-display text-text-secondary uppercase tracking-wider flex-shrink-0">
              Sessão
            </label>
            <input
              type="number"
              min={0}
              max={311}
              value={sessionIdx}
              onChange={(e) => setSessionIdx(Math.max(0, Math.min(311, parseInt(e.target.value) || 0)))}
              className="w-24 h-11 bg-bg-input border border-border-light rounded-md text-center
                         font-mono text-lg text-text-primary focus:outline-none focus:border-accent-gold
                         transition-colors"
            />
            <span className="text-xs text-text-muted font-mono">/ 311</span>
          </div>
          <div className="text-xs font-mono text-text-muted">
            Semana {derivedWeek} / 52 — Dia {derivedDayIndex + 1} de 6
          </div>
        </section>

        {/* API Key Section */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Feedback com IA
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-display text-text-secondary uppercase tracking-wider">
              Chave API OpenRouter
            </label>
            <div className="flex gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="sk-or-..."
                className="flex-1 h-11 bg-bg-input border border-border-light rounded-md px-3
                           font-mono text-sm text-text-primary focus:outline-none focus:border-accent-gold
                           transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="w-11 h-11 bg-bg-input border border-border-light rounded-md
                           text-text-muted hover:text-text-primary transition-colors
                           flex items-center justify-center"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-text-muted font-display">
              Para feedback de IA após cada sessão (opcional)
            </p>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full h-12 rounded-lg font-display font-semibold text-sm uppercase tracking-wider
                     transition-all duration-200 ${
                       saved
                         ? 'bg-accent-green text-white'
                         : 'bg-accent-gold text-bg-primary hover:bg-accent-gold-bright active:scale-[0.98]'
                     }`}
        >
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>

        {/* Data Management */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Gerenciamento de Dados
          </h2>

          <button
            onClick={handleExport}
            className="w-full h-11 bg-bg-input border border-border-light rounded-md
                       font-display text-sm text-text-primary uppercase tracking-wider
                       hover:border-accent-gold transition-colors active:scale-[0.98]"
          >
            Exportar Dados (JSON)
          </button>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-11 bg-bg-input border border-border-light rounded-md
                         font-display text-sm text-text-primary uppercase tracking-wider
                         hover:border-accent-gold transition-colors active:scale-[0.98]"
            >
              Importar Dados (JSON)
            </button>
            {importStatus === 'success' && (
              <p className="text-xs text-accent-green font-mono mt-1">Dados importados com sucesso.</p>
            )}
            {importStatus === 'error' && (
              <p className="text-xs text-accent-red font-mono mt-1">Erro ao importar. Verifique o arquivo.</p>
            )}
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="w-full h-11 bg-bg-input border border-accent-red-dim rounded-md
                       font-display text-sm text-accent-red uppercase tracking-wider
                       hover:bg-accent-red-dim/20 transition-colors active:scale-[0.98]"
          >
            Resetar Todos os Dados
          </button>
        </section>

        {/* App Info */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Sobre
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-sm font-display text-text-secondary">Versão</span>
            <span className="text-sm font-mono text-text-muted">{APP_VERSION}</span>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updateStatus === 'checking' || updateStatus === 'updating'}
            className={`w-full h-11 rounded-md font-display text-sm uppercase tracking-wider
                       transition-colors active:scale-[0.98] ${
                         updateStatus === 'checking' || updateStatus === 'updating'
                           ? 'bg-bg-tertiary text-text-muted border border-border'
                           : updateStatus === 'up-to-date'
                           ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                           : updateStatus === 'error'
                           ? 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                           : 'bg-bg-input border border-border-light text-text-primary hover:border-accent-gold'
                       }`}
          >
            {updateStatus === 'checking' ? 'Verificando...'
              : updateStatus === 'updating' ? 'Atualizando...'
              : updateStatus === 'up-to-date' ? 'App atualizado!'
              : updateStatus === 'error' ? 'Erro ao verificar'
              : 'Verificar Atualização'}
          </button>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <ResetModal onClose={() => setShowResetModal(false)} onReset={handleReset} />
      )}
    </div>
  );
}

function ResetModal({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  // Lock body scroll on iOS when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={onClose}
        >
          <div
            className="bg-bg-card border border-border rounded-lg p-6 max-w-sm w-full space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-display font-bold text-accent-red uppercase tracking-wider">
              Confirmar Reset
            </h3>
            <p className="text-sm text-text-secondary font-display leading-relaxed">
              Isso vai apagar <span className="text-text-primary font-semibold">todos</span> os seus dados:
              treinos, recordes e perfil. Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 h-11 bg-bg-input border border-border-light rounded-md
                           font-display text-sm text-text-primary uppercase tracking-wider
                           hover:border-text-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onReset}
                className="flex-1 h-11 bg-accent-red rounded-md font-display text-sm
                           text-white font-semibold uppercase tracking-wider
                           hover:bg-accent-red/90 active:scale-[0.98] transition-all"
              >
                Resetar Tudo
              </button>
            </div>
          </div>
        </div>
  );
}

// Reusable input field component
function InputField({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-display text-text-secondary uppercase tracking-wider flex-shrink-0">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 h-11 bg-bg-input border border-border-light rounded-md text-right pr-2
                     font-mono text-lg text-text-primary focus:outline-none focus:border-accent-gold
                     transition-colors"
        />
        <span className="text-xs text-text-muted font-mono w-6">{unit}</span>
      </div>
    </div>
  );
}
