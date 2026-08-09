#!/usr/bin/env node
// Parte 3: acrescenta os tópicos que entraram no vocabulário depois dos lotes.
// SÓ acrescenta. Nunca remove um tópico existente.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const D = '/Users/brunnovert/Documents/Dev/powerlifting-app/research/extract/';

const RX = {
  rom: /\b(amplitude|range of motion|\brom\b|parcial|parciais|partial reps|lengthened|encurtad|alongad|stretch(ed)? position|full rom|meia amplitude)\b/i,
  'capacidade-trabalho': /\b(work capacity|capacidade de trabalho|aguentar volume|tolerar volume|tolerância a volume|tolerancia a volume|gpp|base aeróbi|condicionamento geral|aguenta mais volume)\b/i,
  'aprendizado-motor': /(aprendizado motor|motor learning|padrão motor|padrao motor|habilidade motora|memória muscular|memoria muscular|groove|automatiz|prática delib|skill|motor pattern|motor skill|practic|aprendizado|aprendizagem motora|prática de habilidade|prática de técnica|praticar)/i,
};

// Falsos positivos do regex: "na prática" como locução, "freak out", "é parcial"
// no sentido de incompleto, "alavanca" como metáfora de variável a puxar.
const EXCLUDE = {
  rom: new Set(['V129-08', 'V158-12']),
  'capacidade-trabalho': new Set(['V062-21', 'V119-40']),
  'aprendizado-motor': new Set([
    'V018-11', 'V091-12', 'V120-01', 'V141-09', 'V161-06', 'V171-27',
    'V169-01', 'V139-20', 'V139-21',
  ]),
};

// Onde o regex não separa o sentido, a lista é nominal.
const EXPLICIT = {
  'ordem-exercicio': ['V053-22', 'V067-01', 'V067-02', 'V067-12', 'V067-19', 'V076-23', 'V093-08'],
  antropometria: [
    'V011-11', 'V011-14', 'V011-15', 'V016-11', 'V016-13', 'V016-15', 'V019-21', 'V020-35',
    'V039-18', 'V057-26', 'V058-02', 'V058-03', 'V058-04', 'V058-06', 'V066-09', 'V066-19',
    'V071-07', 'V080-09', 'V080-23', 'V082-03', 'V091-22', 'V091-25', 'V091-26', 'V095-20',
    'V095-21', 'V096-21', 'V097-01', 'V098-10', 'V110-30', 'V116-30', 'V122-26', 'V140-11',
    'V142-10', 'V142-21', 'V142-22', 'V146-24', 'V155-06', 'V159-28', 'V159-29', 'V159-31',
    'V159-32', 'V159-33', 'V159-35', 'V162-23', 'V165-17',
  ],
  saude: [
    'V013-01', 'V013-02', 'V013-03', 'V013-04', 'V013-05', 'V013-06', 'V013-08', 'V013-14',
    'V013-15', 'V013-17', 'V013-18', 'V013-21', 'V013-25', 'V013-26', 'V013-28',
    'V034-03', 'V034-06', 'V034-08', 'V034-09',
    'V043-03', 'V043-08', 'V043-12', 'V043-21',
    'V044-03', 'V044-06', 'V044-08', 'V044-09', 'V044-10', 'V044-11', 'V044-12', 'V044-13',
    'V044-17', 'V044-19', 'V044-21', 'V044-23', 'V044-25', 'V044-26',
    'V087-18', 'V102-25', 'V120-26',
  ],
};

const explicitById = new Map();
for (const [topic, ids] of Object.entries(EXPLICIT)) {
  for (const id of ids) explicitById.set(`${id}|${topic}`, topic);
}

const tally = new Map();
let touched = 0;
const applied = new Set();

for (const file of readdirSync(D).filter((f) => f.endsWith('.jsonl')).sort()) {
  if (file === 'F001.jsonl') continue;
  const path = D + file;
  const lines = readFileSync(path, 'utf8').split('\n');
  let dirty = false;
  const out = lines.map((line) => {
    if (!line.trim()) return line;
    const c = JSON.parse(line);
    const text = `${c.claim ?? ''} ~~ ${c.verbatim ?? ''}`;
    const add = [];
    for (const [topic, rx] of Object.entries(RX)) {
      if (EXCLUDE[topic]?.has(c.id)) continue;
      if (rx.test(text) && !(c.topic ?? []).includes(topic)) add.push(topic);
    }
    for (const topic of Object.keys(EXPLICIT)) {
      if (explicitById.has(`${c.id}|${topic}`) && !(c.topic ?? []).includes(topic)) {
        add.push(topic);
        applied.add(`${c.id}|${topic}`);
      }
    }
    if (add.length === 0) return line;
    c.topic = [...(c.topic ?? []), ...add];
    for (const t of add) tally.set(t, (tally.get(t) ?? 0) + 1);
    touched++;
    dirty = true;
    return JSON.stringify(c);
  });
  if (dirty) writeFileSync(path, out.join('\n'));
}

const total = [...tally.values()].reduce((a, b) => a + b, 0);
console.log(`\n${total} tópico(s) acrescentado(s) em ${touched} claim(s)\n`);
for (const [t, n] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${t}`);
const missed = [...explicitById.keys()].filter((k) => !applied.has(k));
if (missed.length) console.log('\n  já tinham o tópico ou id não encontrado:', missed.join(', '));
