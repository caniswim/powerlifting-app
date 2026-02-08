import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDOTS } from '../utils/calculations';
import {
  getProfile,
  saveProfile,
  getCurrentWeek,
  setCurrentWeek,
  exportAllData,
  importData,
  resetAllData,
} from '../services/storage';
import type { AthleteProfile } from '../types';

const APP_VERSION = '1.0.0';

export default function Settings() {
  const [profile, setProfile] = useState<AthleteProfile>(getProfile);
  const [week, setWeek] = useState<number>(getCurrentWeek);
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    saveProfile(updated);
    setCurrentWeek(week);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile, week]);

  const handleExport = () => {
    const data = exportAllData();
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
      const ok = importData(text);
      if (ok) {
        setProfile(getProfile());
        setWeek(getCurrentWeek());
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
    resetAllData();
    setProfile(getProfile());
    setWeek(getCurrentWeek());
    setShowResetModal(false);
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

        {/* Week Selector */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Semana de Treino
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-display text-text-secondary uppercase tracking-wider flex-shrink-0">
              Semana Atual
            </label>
            <input
              type="number"
              min={1}
              max={52}
              value={week}
              onChange={(e) => setWeek(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
              className="w-24 h-11 bg-bg-input border border-border-light rounded-md text-center
                         font-mono text-lg text-text-primary focus:outline-none focus:border-accent-gold
                         transition-colors"
            />
            <span className="text-xs text-text-muted font-mono">/ 52</span>
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
        <section className="bg-bg-card border border-border rounded-lg p-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider mb-2">
            Sobre
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-sm font-display text-text-secondary">Versão</span>
            <span className="text-sm font-mono text-text-muted">{APP_VERSION}</span>
          </div>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowResetModal(false)}
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
                onClick={() => setShowResetModal(false)}
                className="flex-1 h-11 bg-bg-input border border-border-light rounded-md
                           font-display text-sm text-text-primary uppercase tracking-wider
                           hover:border-text-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 h-11 bg-accent-red rounded-md font-display text-sm
                           text-white font-semibold uppercase tracking-wider
                           hover:bg-accent-red/90 active:scale-[0.98] transition-all"
              >
                Resetar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
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
