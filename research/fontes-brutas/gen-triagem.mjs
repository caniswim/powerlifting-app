import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const ROOT = '/Users/brunnovert/Documents/Dev/powerlifting-app';
const SCRATCH = '/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad';

const m = JSON.parse(readFileSync(`${ROOT}/research/corpus/blevins/manifest.json`, 'utf8'));
const pr = JSON.parse(readFileSync(`${SCRATCH}/prioridades.json`, 'utf8'));

const mmss = (s) => (s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
const esc = (t) => t.replace(/\|/g, '\\|');

const prio = (ref) => (pr.alta[ref] ? 'alta' : pr.media[ref] ? 'média' : 'baixa');
const why = (ref) => pr.alta[ref] ?? pr.media[ref] ?? '';

const rows = m.videos.map((v) => ({ ...v, p: prio(v.ref), why: why(v.ref) }));
const n = (p) => rows.filter((r) => r.p === p).length;
const hours = (p) => (rows.filter((r) => r.p === p).reduce((s, r) => s + (r.durationSec ?? 0), 0) / 3600).toFixed(1).replace('.', ',');
const words = (p) => rows.filter((r) => r.p === p).reduce((s, r) => s + (r.words ?? 0), 0);

const dated = rows.map((r) => r.date).filter(Boolean).sort();
const semLegenda = rows.filter((r) => !r.transcript);

const head = `# Triagem para extração — corpus \`G\` (Garrett Blevins)

> Gerado em ${new Date().toISOString().slice(0, 10)} a partir de \`research/corpus/blevins/manifest.json\`.
> **Isto não é extração.** Nenhuma claim foi emitida. É o orçamento de atenção:
> quais dos ${m.videoCount} vídeos merecem virar claim primeiro, e por quê.

| | |
|---|---|
| vídeos no canal | **${m.videoCount}** (\`G001\`–\`G${String(m.videoCount).padStart(3, '0')}\`) |
| duração total | **${(m.totalDurationSec / 3600).toFixed(1).replace('.', ',')} h** |
| transcrições obtidas | **${rows.filter((r) => r.transcript).length}** · sem legenda em inglês: **${semLegenda.length}** |
| palavras transcritas | **${rows.reduce((s, r) => s + (r.words ?? 0), 0).toLocaleString('pt-BR')}** |
| canal publica de | **${dated[0]}** a **${dated[dated.length - 1]}** |
| construído em | \`builtAt: ${m.builtAt}\` · \`channelItemCount: ${m.channelItemCount}\` |

## Por que este canal não é "mais do mesmo"

O corpus \`R\` é 100 % Matt Vena: um atleta que agacha 400 kg e **não compete
testado**. Blevins compete USAPL/IPF desde 2013, é medalhista de Mundial IPF na
classe 105 kg com total de 885,5 kg, e é o criador do Evolve — o app oficial da
Powerlifting America. Ele é, ao mesmo tempo, **contraponto** (federação testada,
classe de peso muito mais perto do atleta) e **cobertura de lacuna** (pico para
competição, autorregulação, e a análise explícita de programa de terceiros, que o
Vena não faz).

O canal tem duas eras separadas por um hiato de quatro anos, e elas não valem o
mesmo:

- **2013–2018 — ${rows.filter((r) => r.date < '2019').length} vídeos.** Vlog de sessão quase diário (\`C4W2D1\`,
  \`W7D3 KingRTS\`), com uma minoria de vídeos didáticos longos enterrados no meio.
  Densidade de claim baixa por hora, mas os poucos longos (\`G252\`, \`G257\`,
  \`G260\`–\`G263\`, \`G271\`) são as peças de programação mais completas do canal
  inteiro. É também a era em que ele estava competindo na USAPL rumo ao Mundial.
- **2022–2025 — ${rows.filter((r) => r.date >= '2019').length} vídeos.** Volta do hiato já como criador do Evolve.
  Traz a série *Professional Powerlifter Reviews* (2023–2024): ele pega um programa
  publicado (5/3/1, nSuns, Cube, Ph3, Candito, Texas Method) e disseca. Densidade
  de claim alta e, mais importante, **expõe o critério dele de julgar programa** —
  que é exatamente o que uma base de prescrição precisa e o que um vlog não dá.

### O problema de recência, dito antes de custar caro

A base resolve contradição por recência. Contra o corpus do Vena, que vai até
**2026-08-08**, o Blevins tem um problema estrutural: o vídeo mais novo dele é de
**${dated[dated.length - 1]}**, e **${Math.round((rows.filter((r) => r.date < '2019').length / m.videoCount) * 100)} %** do canal é de 2013–2018. Aplicada crua, a regra
de recência faz Blevins **perder quase todo empate**, e o corpus testado que ele
existe para trazer vira decoração.

Isso não é motivo para descartar a fonte — é motivo para não deixar a regra
decidir sozinha. Onde os dois discordam sobre **status testado, dose de volume
para natural, ou pico para IPF**, a credencial (medalhista IPF testado) e não a
data é que deveria pesar. Registrado aqui porque a alternativa é descobrir isso
depois, quando a contradição já estiver resolvida do jeito errado dentro de um
programa.

## O critério — explícito, e aplicado lendo título por título

O relatório de escopo (\`research/kb/FONTES-ADICIONAIS.md\`, seção 5) mediu que
filtro por regex de título **erra e erra em silêncio**: perdeu \`How to Powerbuild\`
e \`TEXAS METHOD Explained\`, que são centrais. Então a marca abaixo saiu de leitura
dos ${m.videoCount} títulos, um a um, não de padrão automático. A duração entra como sinal
secundário — um título metodológico em 1 min 30 s não tem prosa suficiente para
sustentar um verbatim de 12 caracteres com contexto — mas **nunca** como filtro
único.

**alta** — o assunto principal do vídeo é um método transferível:
programação e periodização, seleção de exercício, autorregulação e RPE, pico e
planejamento de competição, técnica ensinada de forma didática, ou algo
específico de **atleta testado**. É o que vira claim \`GERAL\` com procedência.

**média** — o método aparece, mas embutido: vlog de sessão cujo título nomeia um
conceito concreto (fadiga, volume, deload, forma, platô), programa dirigido a
novato (o método é explícito, o público é o errado para um intermediário de
87 kg), ou chamada de coaching aplicada a um caso. Rende claim, mas com menos
claim por minuto.

**baixa** — log de sessão puro (\`CxWyDz\` mais um número de PR), filmagem de
competição sem prosa, filmagem de terceiro, anúncio de canal ou oferta de
coaching, conversa de vida e fé, e clipes curtos sem fala. Despriorizado também
todo conteúdo de nutrição genérica.

**Nota sobre "reação a vídeo de terceiro".** A série *Professional Powerlifter
Reviews* **não** é reação a vídeo: é análise de um programa publicado, com o
raciocínio de avaliação à mostra. Reação de verdade — filmagem de outro atleta sem
comentário metodológico (\`G311\`, \`G312\`, \`G313\`, do Dan Green e do Jesse Norris) —
está em **baixa**, que é onde a instrução manda.

## Resultado

| prioridade | vídeos | horas | palavras |
|---|---|---|---|
| **alta** | **${n('alta')}** | ${hours('alta')} h | ${words('alta').toLocaleString('pt-BR')} |
| média | ${n('média')} | ${hours('média')} h | ${words('média').toLocaleString('pt-BR')} |
| baixa | ${n('baixa')} | ${hours('baixa')} h | ${words('baixa').toLocaleString('pt-BR')} |

Extrair só a faixa **alta** é ${hours('alta')} h e ${words('alta').toLocaleString('pt-BR')} palavras — cerca de
**${Math.round((words('alta') / 197203) * 100)} %** das 197.203 palavras do corpus do Vena inteiro. É o que eu faria
primeiro, e sozinho já dobra a diversidade de fonte da base.

**alta + média** dá ${n('alta') + n('média')} vídeos e ${(words('alta') + words('média')).toLocaleString('pt-BR')} palavras, acima do alvo de ~100
vídeos que o relatório de escopo estimou para esta fonte — o excedente está quase
todo em **média**, que é exatamente a faixa a cortar se o orçamento apertar.

A faixa **baixa** tem ${words('baixa').toLocaleString('pt-BR')} palavras e vale muito pouco por palavra: são
${n('baixa')} vídeos de log de sessão. **Não vale extrair, mas vale ter baixado** — a
transcrição já existe, então se uma claim precisar de contexto de um dia
específico de treino, a evidência está lá para consultar sem nova ida à rede.

## A lista inteira

Ordenada do mais recente para o mais antigo, como o corpus do Vena. \`sem legenda\`
marca o vídeo que não tem transcrição — ele não é citável, qualquer que seja a
prioridade.

| ref | data | dur | prio | título | por quê |
|---|---|---|---|---|---|
`;

const body = rows
  .map(
    (r) =>
      `| \`${r.ref}\` | ${r.date ?? '—'} | ${mmss(r.durationSec)} | ${r.p === 'alta' ? '**alta**' : r.p} | ${esc(r.title)}${r.transcript ? '' : ' _(sem legenda)_'} | ${esc(r.why)} |`,
  )
  .join('\n');

let tail = '\n';
if (semLegenda.length > 0) {
  tail += `\n## Sem legenda em inglês (${semLegenda.length})\n\nSem transcrição não há \`verbatim\`, e sem \`verbatim\` o \`check-claims.mjs\` recusa a\nclaim. Estes ficam fora da extração até alguém decidir pagar Whisper por eles:\n\n${semLegenda.map((r) => `- \`${r.ref}\` ${mmss(r.durationSec)} — ${r.title}`).join('\n')}\n`;
}

writeFileSync(`${ROOT}/research/corpus/blevins/TRIAGEM.md`, head + body + tail);
console.log(`alta ${n('alta')} · média ${n('média')} · baixa ${n('baixa')} · sem legenda ${semLegenda.length}`);
console.log(`datas ${dated[0]} → ${dated[dated.length - 1]}`);
