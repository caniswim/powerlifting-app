/**
 * O aviso de fim de descanso — o que faltava inteiro.
 *
 * Até esta revisão o `RestTimer` era PURAMENTE visual: uma varredura por
 * `new Audio`, `AudioContext`, `navigator.vibrate`, `Notification`,
 * `showNotification`, `wakeLock` e `requestPermission` em `src/` devolvia zero
 * ocorrências. O cronômetro chegava a zero, pintava de verde, e quem estava com
 * o celular no bolso não ficava sabendo.
 *
 * ⚠️ POR QUE NÃO É NOTIFICAÇÃO PUSH. Web Push funciona em PWA instalado no iOS,
 * mas exige servidor e rede — numa academia com sinal ruim, o alerta de um
 * cronômetro local dependeria de um round-trip que pode não voltar. E o iOS não
 * tem notificação agendada localmente: a API de Notification Triggers não existe
 * no Safari, e `setTimeout` dentro do service worker morre com ele. O caminho
 * que sobra e que de fato funciona é manter a tela acesa durante o descanso
 * (`useWakeLock`) e tocar som na própria página — com a tela acesa, o app fica
 * em primeiro plano, o JS não congela e o Web Audio dispara.
 *
 * ⚠️ LIMITE ACEITO E DECLARADO: com a tela BLOQUEADA, o iOS suspende Web Audio.
 * Nenhum som deste módulo atravessa o bloqueio. O desenho não tenta atravessar —
 * ele evita que a tela bloqueie durante os 3–4 min de descanso.
 */

/**
 * O `AudioContext` do app, criado uma vez só.
 *
 * O iOS nasce com ele `suspended` e só o libera dentro de um gesto do usuário.
 * Criar na hora do beep não funciona: o beep é disparado por um `setInterval`,
 * que não é gesto nenhum, e o contexto nasceria mudo.
 */
let ctx: AudioContext | null = null;
let unlocked = false;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Destrava o áudio. **Tem de ser chamado de dentro de um gesto do usuário.**
 *
 * O lugar natural é o toque que completa uma série — que é exatamente o gesto
 * que abre o cronômetro. Chamar em qualquer outro momento é desperdício, e não
 * chamar em nenhum é um cronômetro silencioso.
 *
 * Idempotente: chamar a cada série é barato e cobre o caso de o navegador ter
 * re-suspendido o contexto ao voltar do background.
 */
export function unlockRestAlert(): void {
  const c = getContext();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  if (unlocked) return;
  try {
    // Um buffer de silêncio: no iOS é o que efetivamente marca o contexto como
    // destravado dentro do gesto.
    const buf = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    src.start(0);
    unlocked = true;
  } catch {
    // Contexto indisponível: o alerta degrada para vibração/visual.
  }
}

/** Um bipe. `at` é tempo absoluto do contexto, em segundos. */
function beep(c: AudioContext, at: number, freq: number, durSec: number): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, at);
  // Envelope curto: sem ele o alto-falante estala no corte, e num ginásio o
  // estalo é o que se ouve em vez da nota.
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.6, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + durSec);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(at);
  osc.stop(at + durSec + 0.02);
}

/**
 * Toca o aviso de descanso concluído: três bipes ascendentes.
 *
 * Três e não um porque o primeiro se perde no barulho da academia, e ascendentes
 * porque a subida é o que distingue "acabou" de qualquer notificação genérica
 * que o celular emita.
 */
export function playRestDoneAlert(): void {
  const c = getContext();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  const t0 = c.currentTime + 0.02;
  beep(c, t0, 880, 0.12);
  beep(c, t0 + 0.18, 1108, 0.12);
  beep(c, t0 + 0.36, 1318, 0.22);
}

/**
 * Vibra, se o aparelho deixar.
 *
 * ⚠️ Suporte no iOS é INCERTO e as fontes de 2026 se contradizem — há relato de
 * `navigator.vibrate` passando a funcionar no Safari e documentação que ainda o
 * lista como ausente. Por isso é `feature-detect` e BÔNUS: nada no desenho do
 * alerta depende disto. Se funcionar, é ganho; se não, o bipe já resolveu.
 */
export function vibrateRestDone(): void {
  try {
    navigator.vibrate?.([120, 80, 120, 80, 240]);
  } catch {
    // Sem vibração: o bipe é o alerta.
  }
}

/** O alerta completo. Chamado UMA vez, no cruzamento do zero. */
export function fireRestDoneAlert(): void {
  playRestDoneAlert();
  vibrateRestDone();
}
