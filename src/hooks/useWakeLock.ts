import { useEffect, useRef } from 'react';

/**
 * Mantém a tela acesa enquanto `active` for verdadeiro.
 *
 * É a peça que faz o aviso de descanso funcionar de verdade num iPhone. Com a
 * tela apagada o iOS suspende o Web Audio e congela o JS da página; com a tela
 * acesa, o app fica em primeiro plano e o bipe do `restAlert` dispara na hora.
 * O desenho não tenta atravessar o bloqueio de tela — ele impede que o bloqueio
 * aconteça durante os 3–4 min de descanso, que é o problema real.
 *
 * ⚠️ HISTÓRICO QUE IMPORTA: a Screen Wake Lock API existe no Safari iOS desde a
 * 16.4, mas um defeito a quebrava DENTRO de PWA instalado — exatamente o modo em
 * que este app roda. A Apple corrigiu na 18.4 (mar/2025). Documentação e fóruns
 * anteriores a essa data afirmam que a API não funciona no iOS, e estão
 * desatualizados. Em aparelho atual, funciona.
 *
 * Degrada em silêncio: navegador sem a API simplesmente não acende nada, e o
 * cronômetro continua correto (ele é baseado em timestamp, não em acumulador).
 */
export function useWakeLock(active: boolean): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) return;
    if (!('wakeLock' in navigator)) return;

    let cancelled = false;

    const acquire = async () => {
      // `visibilityState` é obrigatório: pedir o lock com a página oculta
      // rejeita com NotAllowedError, e o `catch` engoliria um erro que não é
      // defeito nenhum.
      if (document.visibilityState !== 'visible') return;
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (cancelled) {
          void sentinel.release();
          return;
        }
        sentinelRef.current = sentinel;
      } catch {
        // Sem lock: o timer segue visual. Não é erro que valha interromper nada.
      }
    };

    /**
     * O iOS LIBERA o lock ao mandar o app para segundo plano e **não o devolve**
     * quando o app volta. Sem este listener, sair para o cronômetro do celular e
     * voltar deixaria a tela apagando no meio do descanso — que é justamente o
     * momento em que o alerta precisa dela acesa.
     */
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !sentinelRef.current) void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (sentinel) void sentinel.release().catch(() => {});
    };
  }, [active]);
}
