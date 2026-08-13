export const meta = {
  name: 'peito-fecho',
  description: 'Refaz a exposicao que morreu por erro de API, confere os achados do ataque, e escreve o parecer que o atleta vai ler',
  phases: [
    { title: 'Exposicao', detail: 'a curva real de volume sobre o peitoral, semana a semana, contra o gerador' },
    { title: 'Conferir', detail: 'os numeros da exposicao batem? os achados do ataque se sustentam?' },
    { title: 'Fechar', detail: 'o parecer, e so os consertos que nao mudam treino' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. NÃO use git. Português do Brasil. Sem emoji em código.

ATLETA: natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu. **Histórico de lesão de
peitoral** — o Bloco 1 é reexposição gradual do supino. Agacho 250 / supino 170 / terra sumo
268 (treino).

**O FATO NOVO:** ele relata **dor leve presente no peitoral, do lado onde houve a lesão**.
Palavras dele: *"levemente dolorido"*, *"bem leve, não é nada sério"*. Não treinou esta semana.
**Não dramatize e não minimize** — a descrição é dele e é o dado.

BASE: 6.912 claims. Vena (R###/V###, não testado, ~120 kg — PESSOAL dele não transplanta),
Blevins (G###), regulamento IPF (F001). **Só \`modo: prescricao\` vira treino**; \`opiniao\`,
\`mecanismo\`, \`anedota\` e \`narrativa\` são contexto.

CONSULTA — a porta que funciona é a gaveta:
  node research/tools/check-evidence.mjs --topic dor --limit 0
  node research/tools/check-evidence.mjs <ids>
VERIFICAÇÃO: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`.

SCRIPTS: \`research/tools/auditoria-peito/\`. **Nunca /tmp.** Já existem lá, de uma rodada
anterior: \`exposicao-peito.mjs\`, \`eixos-degrau.mjs\`, \`conta-peito.mjs\`, \`filtra.mjs\`,
\`sonda-repouso.mjs\`. **Leia antes de escrever outro** — e desconfie deles: o ataque provou
que dois testes do \`sonda-repouso.mjs\` chegavam à conclusão certa por regex morto, que é a
classe de erro que mais custa aqui.

**LIMITE:** isto não é avaliação clínica e ninguém aqui é fisioterapeuta.
`

const ACHADOS = `
## O QUE JÁ FOI MEDIDO E ESTÁ EM DISCO — leia os três antes de começar

\`research/kb/peito-parcial/BASE.md\`, \`GATE.md\` e \`ATAQUE.md\` (commitados em \`fae8620\`).
O agente da exposição morreu por \`API Error\` no meio; os outros três terminaram.

**Achados que já passaram por ataque adversarial:**

1. **O recuo do gate não reduz carga.** \`PROGRAMA.md\` linhas 295-296:
   \`FP-SETS = 7 - SUP-V1\` e \`FP4-SETS = 5 - SUP-V4\`. A soma é **12 por construção**.
   Recuar um degrau de supino pausado ADICIONA uma série de floor press. Medido contra o
   gerador: **22 séries/semana sobre o peitoral em TODAS as S1-S16**. A base manda o oposto —
   V138-04 e V138-15 mandam DIVIDIR o volume, V001-09 diz *"less volume, too"*, V138-28 chama
   workload de *"the main controllable Factor"*.

   > ⚠️ **CORREÇÃO — 13/8/2026. O achado 1 acima está errado no número, e o texto original
   > fica onde está como registro do que foi briefado.** **DERRUBADO:** *"22 séries/semana
   > sobre o peitoral em TODAS as S1-S16"* e *"a soma é 12 por construção"*. Remedido no
   > gerado, contando as séries de trabalho de todo exercício com \`muscleMap.peito > 0\`
   > (supino pausado, floor press, supino inclinado com halter, peck deck), a curva S1-S16 é
   > **24,24,24,24,24,26,26,26,26,26,26,26,26,28,28,28** — o total **SOBE de 24 a 28** e
   > **não vale 22 em semana nenhuma**. O 22 é o subtotal só das duas linhas de **barra**,
   > esse sim invariante. **SOBREVIVEU:** \`FP-SETS + SUP-V1 = 7\` e \`FP4-SETS + SUP-V4 = 5\`
   > em todas as S1-S16 — são DOIS pares, cada um invariante, e por isso recuar supino
   > pausado troca a série por floor press **1:1** e não reduz carga sobre o peitoral. A
   > conclusão que governa a recomendação ao atleta não muda.
   > Reprodução: \`node research/tools/auditoria-peito/series-peito.mjs\`. Ver
   > \`research/RUNBOOK.md\` §8.78 e \`research/kb/PEITO-PARECER.md\` §2 e §8.1.
   > **Onde o texto abaixo disser "a invariante das 22 séries", leia "a invariante dos dois
   > pares".**

2. **Cinco endereços fabricados no §1.2:** \`[R79 @03:35]\`, \`[R1 @01:04]\` (duas vezes, para
   claims diferentes e com \`modo\` diferente), \`[R27 @05:08]\`, \`[R95 @03:10]\`,
   \`[R112 @02:10]\`. Nenhum timestamp existe. **E o motivo de sobreviverem seis ondas:**
   \`check-evidence.mjs\` só valida \`Vnnn-nn\` e **descarta \`[Rnn @mm:ss]\` em silêncio** — a
   trava não vê o formato que o programa usa.

3. **"9 séries semanais de floor press" reproduz em 3 de 16 semanas.** Da S9 em diante são 5.

4. **Dor em repouso é invisível para o app inteiro** — \`PreWorkoutSurvey\` e
   \`PostWorkoutSurvey\` exigem \`workoutId\`. A semana desta onda sai do app dizendo que não
   houve dor. O único contorno é abrir um treino falso, e ele gasta uma vaga da janela de 3
   sessões e polui a aderência.

5. **A regra do bíceps do §1.2** ("dor referida no bíceps entra no log de peitoral") está
   ancorada em \`mecanismo\` + \`opiniao\`, **zero prescrição**.

6. **A base prescreve TRAJETÓRIA entre sessões, e é isso que o app não mede:** V138-18
   (*"não nos sentirmos pior na sessão seguinte"*), V027-26, V086-21, V027-28 — todas
   \`GERAL\` + \`prescricao\`.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Exposicao')

const exposicao = await agent(
  `${CTX}\n${ACHADOS}\n\n` +
    `## SUA TAREFA: A CURVA REAL DE EXPOSIÇÃO DO PEITORAL, SEMANA A SEMANA\n\n` +
    `Um agente com esta tarefa morreu por erro de API depois de nove minutos. Ele deixou os ` +
    `scripts; faltou a análise. **Você não recomeça do zero — lê o que ele deixou, confere se ` +
    `presta, e produz o número.**\n\n` +
    `1. **A tabela do bloco inteiro:** por semana, toda linha que carrega peitoral — supino e ` +
    `variações, floor press, trabalho direto — com séries, reps, RPE ou %, e pausa. Some por ` +
    `semana. **Do gerador, não do documento.**\n` +
    `2. **Confirme ou derrube a invariante das 22 séries.** Se o total não cai nunca, mostre a ` +
    `linha do gerador que garante isso. Se cai em alguma semana, diga em qual e por quê — o ` +
    `achado é do ataque, não meu, e ele merece checagem independente.\n` +
    `3. **Onde está o pico de tensão sobre o tecido**, e ele não é só contagem de séries: carga, ` +
    `duração de pausa e proximidade da falha entram. A base diz que a tensão no tendão depende ` +
    `do peso E da velocidade (V089-25) — uma série pausada de 2 s a 80 % não é uma série de ` +
    `floor press a RPE 6.\n` +
    `4. **O eixo que mudou mais recentemente, semana a semana.** A tabela do §1.2 manda recuar ` +
    `justamente esse. Se não for possível dizer qual é em cada semana, **a regra do segundo ` +
    `degrau não é executável** e isso precisa estar escrito.\n` +
    `5. **Se o gate disparar HOJE**, na semana em que ele está: o que exatamente o app faz? ` +
    `Percorra o caminho e mostre o resultado, não a intenção.\n` +
    `6. **Documento contra código.** Onde divergem?\n\n` +
    `**Números com o comando que os reproduz.** Você NÃO muda nada de produção.`,
  { label: 'exposicao', phase: 'Exposicao', effort: 'high' },
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Conferir')

const CONFERE_SCHEMA = {
  type: 'object',
  required: ['numerosQueNaoReproduzem', 'invarianteConfirmada', 'furos', 'veredito'],
  properties: {
    invarianteConfirmada: { type: 'boolean', description: 'as 22 series por semana sao mesmo invariantes' },
    seriesPorSemana: { type: 'array', items: { type: 'number' }, description: 'a curva S1..S16 que VOCE mediu' },
    numerosQueNaoReproduzem: { type: 'array', items: { type: 'string' } },
    idsFabricados: { type: 'array', items: { type: 'string' } },
    seDispararHoje: { type: 'string', description: 'o que o app de fato faz se o gate disparar na semana atual' },
    furos: { type: 'array', items: { type: 'string' } },
    veredito: { type: 'string' },
  },
}

const confere = await agent(
  `${CTX}\n${ACHADOS}\n\n` +
    `## VOCÊ CONFERE A EXPOSIÇÃO ANTES DE ELA VIRAR PARECER\n\n` +
    `Relato de quem levantou:\n\n${exposicao ?? '(sem relato)'}\n\n` +
    `**Não acredite.** Nesta onda, o ataque anterior derrubou cinco números de dois pareceres, ` +
    `incluindo dois testes que davam a resposta CERTA por regex morto — o teste não casava nada ` +
    `e a conclusão saía por acaso. É a classe de erro mais cara aqui, porque parece verificação.\n\n` +
    `**1. Reproduza a curva semana a semana você mesmo**, contra o gerador, com o seu próprio ` +
    `script. Não rode o dele e confira a saída — escreva o seu e compare os dois. Divergiu, o ` +
    `achado é a divergência.\n\n` +
    `**2. A invariante das 22 séries** é o achado que vai governar a recomendação ao atleta. ` +
    `Ela é verdade? Existe alguma semana ou algum caminho de recuo em que o total cai? Teste o ` +
    `recuo de CADA um dos seis eixos nomeados e diga o que acontece com o total em cada caso.\n\n` +
    `**3. Se o gate disparar hoje**, o que o app faz? Rode pelo \`buildWeekDoc\` de produção, ` +
    `não por reimplementação.\n\n` +
    `**4. Todo id citado resolve e diz o que se afirmou?** Leia o verbatim, não a tradução, e ` +
    `confira \`modo\` e \`scope\`. E **procure endereços no formato \`[Rnn @mm:ss]\`** em ` +
    `qualquer coisa nova que tenha sido escrita: a trava não os vê, então eles passam.\n\n` +
    `**5. Procure o conforto e o alarme.** Recomendação tranquilizadora para alguém com dor no ` +
    `tecido lesionado precisa de evidência mais forte, não mais fraca — e alarme sem id que o ` +
    `sustente é ruído caro.\n\n` +
    `Scripts em \`research/tools/auditoria-peito/\`. Sem diplomacia.`,
  { label: 'conferir', phase: 'Conferir', schema: CONFERE_SCHEMA, effort: 'high' },
)

log(`invariante das 22 séries: ${confere?.invarianteConfirmada ?? '?'} · números que não reproduzem: ${(confere?.numerosQueNaoReproduzem ?? []).length}`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n${ACHADOS}\n\n## FECHAR — O PARECER QUE O ATLETA VAI LER\n\n` +
    `**Exposição:** ${exposicao ?? '(sem relato)'}\n\n` +
    `**Conferência:** invariante=${confere?.invarianteConfirmada ?? '?'}, curva=` +
    `${JSON.stringify(confere?.seriesPorSemana ?? [])}, se disparar hoje: ` +
    `${confere?.seDispararHoje ?? '?'}\n` +
    `números que não reproduzem: ${JSON.stringify(confere?.numerosQueNaoReproduzem ?? [])}\n` +
    `${confere?.veredito ?? ''}\n` +
    (confere?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **Escreva \`research/kb/PEITO-PARECER.md\`, para o ATLETA ler** — português direto, sem ` +
    `jargão de ferramenta. Estrutura:\n\n` +
    `   - **O que fazer nesta semana**, em três linhas no máximo, no topo. Se depender da semana ` +
    `do bloco em que ele está, **dê as versões** em vez de mandar ele voltar e perguntar.\n` +
    `   - **O defeito do recuo**, explicado em duas frases que ele entenda sem abrir código: hoje ` +
    `o gate troca supino pausado por floor press na proporção de um para um, então recuar um ` +
    `degrau não tira carga do peitoral. **Isto é o mais importante do documento** — é a diferença ` +
    `entre o app protegê-lo e o app parecer que protege.\n` +
    `   - **O que a base manda**, com id ao lado de cada afirmação e \`modo\`/\`scope\` quando ` +
    `importar.\n` +
    `   - **O que a base NÃO sabe** sobre o caso dele. Não pode ficar vazia: a base vem de um ` +
    `canal de um atleta não testado de 120 kg e ele é natural de 87 kg.\n` +
    `   - **Quando isto vira conversa com fisioterapeuta**, com critério concreto — prazo, ` +
    `tendência, sinal — nunca "se piorar".\n\n` +
    `2. **Consertos de instrumentação que NÃO mudam o treino:**\n` +
    `   - **\`check-evidence.mjs\` tem de enxergar \`[Rnn @mm:ss]\`** e acusar endereço que não ` +
    `existe. É a trava que faltou por seis ondas e é barata de fazer.\n` +
    `   - **Os cinco endereços fabricados do §1.2**: corrija para os ids reais, com \`modo\` e ` +
    `\`scope\` certos. Atenção: o §1.2 chama V079-34 de \`[PESSOAL]\` e ele é \`GERAL\`; e dá o ` +
    `mesmo endereço a duas claims com \`modo\` diferente.\n` +
    `   - **A regra do bíceps** ancorada em \`mecanismo\`+\`opiniao\`: ou ache a prescrição que a ` +
    `sustente, ou marque no documento que ela é decisão de desenho e não derivação.\n` +
    `   - **Dor em repouso**: proponha o campo, com o diff descrito. **Não implemente mudança de ` +
    `comportamento do gate.**\n\n` +
    `3. **A invariante das 22 séries é a única coisa que muda o TREINO dele, e você NÃO a ` +
    `conserta.** Escreva a proposta — o que teria de mudar em \`FP-SETS\`/\`FP4-SETS\` para o ` +
    `recuo de fato reduzir carga — e deixe a decisão para ele. Mexer nisso sem ele é mudar o ` +
    `treino de uma pessoa com lesão por conta própria.\n\n` +
    `4. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.**\n\n` +
    `5. **Atualize \`research/kb/DOR-E-TREINO.md\` e o \`RUNBOOK.md\` §8.** Não resolvido ` +
    `continua na lista. E apague \`research/kb/peito-parcial/\` **só** depois de o que importa ` +
    `dali estar no parecer ou no RUNBOOK — duas cópias divergem em silêncio.\n\n` +
    `6. **Uma linha honesta no fim:** este parecer foi produzido por agentes lendo uma base ` +
    `derivada de vídeos, atacado por um agente adversarial, e **não é avaliação clínica**.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  invarianteConfirmada: confere?.invarianteConfirmada,
  seriesPorSemana: confere?.seriesPorSemana,
  seDispararHoje: confere?.seDispararHoje,
  numerosQueNaoReproduzem: confere?.numerosQueNaoReproduzem ?? [],
  furos: confere?.furos ?? [],
  veredito: confere?.veredito,
  fecho,
}
