import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDOTS } from '../utils/calculations';
import { useStorage } from '../contexts/StorageContext';
import type { AthleteProfile, PercentRef } from '../types';
import { getSessionData, getTotalSessions, getTotalWeeks } from '../services/scheduling';
import { localDateKey } from '../services/storage/bodyweightRepository';
import { listPrograms } from '../data/program/programs';
import { BodyweightSection } from '../features/settings/components/BodyweightSection';
import { CloudSyncSection } from '../features/settings/components/CloudSyncSection';
import { AnthropometrySection } from '../features/settings/components/AnthropometrySection';

const APP_VERSION = '1.3.0';

export default function Settings() {
  const storage = useStorage();
  const [programId, setProgramId] = useState<string>(() => storage.getActiveProgramId());
  const [profile, setProfile] = useState<AthleteProfile>(() => storage.getProfile());
  const [sessionIdx, setSessionIdx] = useState<number>(() => storage.getSessionIndex());
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'updating' | 'up-to-date' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSessions = getTotalSessions(programId);
  const totalWeeks = getTotalWeeks(programId);
  const derivedSession = getSessionData(Math.min(sessionIdx, totalSessions - 1), programId);
  const derivedWeek = derivedSession?.weekNumber ?? 1;
  const derivedDayIndex = derivedSession?.dayIndex ?? 0;
  const derivedDaysInWeek = derivedSession?.week.days.length ?? 0;

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

  // Máximo técnico: mora fora dos campos de 1RM de propósito. Não entra no
  // total nem no DOTS — é só a âncora dos percentuais prescritos.
  const handleTrainingMaxChange = (lift: PercentRef, value: string) => {
    const num = parseFloat(value) || 0;
    setProfile((prev) => ({
      ...prev,
      trainingMax: { ...prev.trainingMax, [lift]: num > 0 ? num : undefined },
      // Digitar o número À MÃO é o gate sendo cumprido: deixa de ser seed de
      // migração e passa a ser máximo técnico medido. Enquanto for `seed`, a
      // trava de `trainingMaxGuard` o trata como ausente e bloqueia a sugestão.
      trainingMaxOrigin: num > 0 ? 'calibrado' : prev.trainingMaxOrigin,
    }));
  };

  const handleSave = useCallback(() => {
    const total = profile.squat1RM + profile.bench1RM + profile.deadlift1RM;
    const dots = calculateDOTS(profile.bodyweight, total);
    const updated = { ...profile, total, dots };
    storage.saveProfile(updated);
    // Mudou o peso no perfil? A série temporal recebe o mesmo ponto — o DOTS
    // histórico não pode depender de o atleta lembrar de usar a outra seção.
    if (updated.bodyweight > 0 && storage.getLatestBodyweight()?.weightKg !== updated.bodyweight) {
      storage.saveBodyweightEntry({ date: localDateKey(), weightKg: updated.bodyweight });
    }
    storage.setActiveProgramId(programId);
    storage.setSessionIndex(sessionIdx, programId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile, sessionIdx, programId, storage]);

  const handleProgramChange = (id: string) => {
    setProgramId(id);
    // Cada programa guarda a própria posição — troca não perde o progresso.
    setSessionIdx(storage.getSessionIndex(id));
  };

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

      // With autoUpdate + clientsClaim, the new SW activates and claims immediately.
      // controllerchange fires when a new SW takes over — reload to use new assets.
      let updated = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        updated = true;
        setUpdateStatus('updating');
        window.location.reload();
      }, { once: true });

      await registration.update();

      // Allow time for SW lifecycle (install → activate → claim → controllerchange)
      setTimeout(() => {
        if (!updated) {
          setUpdateStatus('up-to-date');
          setTimeout(() => setUpdateStatus('idle'), 3000);
        }
      }, 2000);
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
            {/* O Powerbuilding 2.0 prescreve o desenvolvimento em %1RM (75%, 77.5-82.5%). */}
            <InputField
              label="Desenvolvimento"
              unit="kg"
              value={profile.ohp1RM ?? 0}
              onChange={(v) => handleProfileChange('ohp1RM', v)}
            />
            <p className="text-[10px] font-display text-text-muted -mt-1">
              O desenvolvimento não entra no total, mas é usado nas cargas prescritas em %1RM.
            </p>

            <div className="border-t border-border pt-3">
              <span className="text-[10px] font-display text-text-muted uppercase tracking-wider">
                Máximo Técnico (padrão de competição)
              </span>
            </div>
            <p className="text-[10px] font-display text-text-muted leading-relaxed">
              O maior peso que você move <strong>sem degradar a técnica</strong>, na execução
              que o juiz aceitaria: agachamento na profundidade legal, supino com pausa real,
              terra sem strap e com parada morta.{' '}
              <strong className="text-text-secondary">Não é o mesmo que o 1RM de academia</strong> —
              costuma ficar bem abaixo dele. É este número que ancora todas as cargas prescritas
              em %1RM. Deixe em 0 para usar o 1RM.
            </p>
            <InputField
              label="Agachamento"
              unit="kg"
              value={profile.trainingMax?.squat ?? 0}
              onChange={(v) => handleTrainingMaxChange('squat', v)}
            />
            <InputField
              label="Supino"
              unit="kg"
              value={profile.trainingMax?.bench ?? 0}
              onChange={(v) => handleTrainingMaxChange('bench', v)}
            />
            <InputField
              label="Terra"
              unit="kg"
              value={profile.trainingMax?.deadlift ?? 0}
              onChange={(v) => handleTrainingMaxChange('deadlift', v)}
            />
            <p className="text-[10px] font-display text-text-muted -mt-1 leading-relaxed">
              As semanas 1–3 do Bloco 1 existem para descobrir estes três números por teto de
              RPE. Atualize-os a cada re-ancoragem — o 1RM histórico acima fica intacto.
            </p>

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

        {/* Program selector + position */}
        <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
            Programa
          </h2>
          <div className="space-y-2">
            {listPrograms().map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProgramChange(p.id)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  programId === p.id
                    ? 'bg-accent-gold/10 border-accent-gold/40'
                    : 'bg-bg-tertiary border-border hover:border-accent-gold/30'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-sm font-display font-semibold ${
                    programId === p.id ? 'text-accent-gold' : 'text-text-primary'
                  }`}>
                    {p.name}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted flex-shrink-0">
                    {p.weeks.length} sem · {getTotalSessions(p.id)} sessões
                  </span>
                </div>
                {p.author && (
                  <div className="text-[10px] font-display text-text-muted">{p.author}</div>
                )}
                <p className="text-[11px] font-display text-text-secondary leading-relaxed mt-1">
                  {p.description}
                </p>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-display text-text-secondary uppercase tracking-wider flex-shrink-0">
                Sessão
              </label>
              <input
                type="number"
                min={0}
                max={totalSessions - 1}
                value={sessionIdx}
                onChange={(e) => setSessionIdx(Math.max(0, Math.min(totalSessions - 1, parseInt(e.target.value) || 0)))}
                className="w-24 h-11 bg-bg-input border border-border-light rounded-md text-center
                           font-mono text-lg text-text-primary focus:outline-none focus:border-accent-gold
                           transition-colors"
              />
              <span className="text-xs text-text-muted font-mono">/ {totalSessions - 1}</span>
            </div>
            <div className="text-xs font-mono text-text-muted">
              Semana {derivedWeek} / {totalWeeks} — Dia {derivedDayIndex + 1} de {derivedDaysInWeek}
            </div>
            <button
              type="button"
              onClick={() => setSessionIdx(0)}
              className="text-[11px] font-display uppercase tracking-wider text-text-muted hover:text-accent-gold"
            >
              Recomeçar programa do zero
            </button>
          </div>
        </section>

        <BodyweightSection />

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

        <CloudSyncSection />

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
          <AnthropometrySection />
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
