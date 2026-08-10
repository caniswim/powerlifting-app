export const meta = {
  name: 'onda-2c-roteamento',
  description: 'Conserta ROTEAMENTO (pergunta -> topico), com vocabulario de entrada gerado por frota barata e um conjunto de canarios cego que o construtor nunca ve',
  phases: [
    { title: 'Cegos', detail: '12 canarios novos, escondidos do construtor — o conjunto de teste' },
    { title: 'Vocabulario', detail: '74 topicos em 8 lotes: glosa + termos de entrada na voz do atleta' },
    { title: 'Construir', detail: 'roteamento pelo vocabulario de entrada + a porta que o agente de conversa usa' },
    { title: 'Atacar', detail: 'os 18 publicos e os 12 cegos, medidos separados' },
    { title: 'Fechar', detail: 'veredito com os dois numeros e a distancia entre eles' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

// ordenados por tamanho; o round-robin abaixo dá a cada lote uma mistura de
// gaveta grande e gaveta minúscula, porque os dois extremos falham diferente
const TOPICOS = [
  ['agacho', 990], ['tecnica', 891], ['volume', 750], ['terra', 748], ['progressao', 741],
  ['supino', 694], ['erro-comum', 667], ['programacao', 636], ['intensidade', 631],
  ['meta-metodologia', 581], ['mentalidade', 550], ['fadiga', 470], ['selecao-exercicio', 468],
  ['competicao', 457], ['acessorios', 384], ['recuperacao', 368], ['series-reps', 367],
  ['lesao', 362], ['setup', 356], ['hipertrofia', 355], ['periodizacao', 332],
  ['autorregulacao', 329], ['frequencia', 245], ['peso-corporal', 238], ['cardio', 230],
  ['teste-de-forca', 226], ['rpe', 210], ['aprendizado-motor', 207], ['nutricao', 207],
  ['equipamento', 199], ['pico', 166], ['deload', 155], ['sumo', 145],
  ['proximidade-da-falha', 132], ['pernas', 125], ['condicionamento', 123], ['cutting', 123],
  ['dor', 119], ['costas', 119], ['pegada', 117], ['ombros', 110], ['bulking', 104],
  ['barra-alta', 99], ['taper', 99], ['core', 95], ['aquecimento', 91], ['profundidade', 87],
  ['mobilidade', 85], ['posterior', 83], ['antropometria', 78], ['capacidade-trabalho', 76],
  ['rom', 76], ['bracos', 74], ['sono', 57], ['regras-ipf', 54], ['cinto', 54],
  ['comandos-ipf', 53], ['natural-vs-enhanced', 52], ['convencional', 51], ['saude', 47],
  ['estagnacao', 45], ['training-max', 45], ['tier-list', 40], ['barra-baixa', 40],
  ['peito', 31], ['ordem-exercicio', 29], ['sapato', 18], ['strap', 15],
  ['carga-de-treino', 13], ['descanso-entre-series', 12], ['genetica', 12], ['faixa', 9],
  ['powerbuilding', 5], ['idade', 3],
]

const LOTES = 8

const CTX = `
REPO: ${REPO}. NÃO use git. Português do Brasil. Sem emoji em código.

ATLETA: natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu, **histórico de lesão de
peitoral** — o bloco atual é reexposição gradual do supino. Agacho 250 / supino 170 / terra
sumo 268 (treino).

BASE: 6.912 claims em \`research/extract/*.jsonl\`, um arquivo por vídeo. Vena (R###/V###, não
testado), Blevins (G###, compete testado IPF), regulamento IPF (F001). Campos por claim:
tier, scope, certainty, modo, conditions, conflicts, **topic[] de vocabulário FECHADO com 74
termos**, claim pt-BR, verbatim literal inglês, params[] com unit e frame.

CONSULTA:
  node research/tools/check-evidence.mjs <ids>
  node research/tools/check-evidence.mjs --grep "termo" --topic X --modo Y --limit 0
  node research/tools/check-evidence.mjs --pergunta "pergunta em linguagem natural"
VERIFICAÇÃO: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`.

O PRINCÍPIO: **onde um compilador pode verificar, agente não deve.** Limite: determinismo
prova fidelidade à fonte, não correção da fonte.

MODOS DE FALHA DESTA CASA, todos reincidentes:
1. Copiar convenção errada do vizinho e chamar de padrão.
2. Trava estreita empurra o dado para fora da trava.
3. Documento e código divergem em silêncio.
4. **Trava que se testa a si mesma.** Ontem duas constantes do roteador (\`DETALHE_ROTEADO\`,
   \`PESO_NOME_COMPOSTO\`) podiam ir a zero com \`check:kb\` VERDE.
5. **Relatório de agente que diz sucesso sem sucesso.** Ontem o construtor reportou 5 de 7
   falhas destravadas; o ataque cego reproduziu 2. A diferença era a FRASE: as perguntas da
   tabela dele já continham a palavra da resposta.
`

const DIAGNOSTICO = `
## O DIAGNÓSTICO DE 10/08, medido e verificado à mão

A camada de recuperação foi reprovada: **3 de 18** canários \`presente-escondido\` devolvem
algum id esperado, **0 de 18** devolvem todos. Mas o número bruto esconde duas doenças
diferentes, e esta onda ataca **só a primeira**:

- **7 de 18 são ROTEAMENTO:** o roteador nunca abre uma gaveta que contenha a resposta.
- **~4 de 18 são SOTERRAMENTO:** a gaveta certa abre e a resposta sai em 945º de 1038.

**O índice está CERTO. Não é problema de etiqueta.** Verificado:
  V001-05, V001-06, V001-29 → dor, lesao, autorregulacao
  V079-34, V138-19          → dor, lesao, autorregulacao
  V013-04, V013-05          → cardio, condicionamento, saude
As claims de dor estão em \`dor\`. As de coração estão em \`cardio\`. O roteador é que não abre.

**O defeito é léxico, e é estrutural.** \`research/tools/roteador.mjs\` tem 909 linhas de
casamento por texto com 13 constantes ajustáveis. Os dois casos que definem o problema:

1. **\`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?\`** — roteia
   para \`peito\` e \`supino\`, devolve 40 claims e NENHUMA das cinco que carregam o limiar de
   dor (V079-34, V001-06, V138-19, V086-21, V027-23). \`dor\` e \`lesao\` nunca abrem, porque a
   palavra \`fisgada\` NÃO EXISTE em claim nenhuma — a ferramenta até AVISA isso e roteia
   errado assim mesmo. Este é o caso mais caro da base: atleta com histórico de peitoral
   recebe uma tela cheia, plausível, sem sinal nenhum de que falta alguma coisa.
2. **\`levantar peso já conta como exercício pro coração\`** — roteia para \`peso-corporal\`
   com score 0.73 (piso 0.65) porque a palavra \`peso\` de \`levantar peso\` foi lida como peso
   CORPORAL. \`cardio\` (230 claims, V013-04/05/06 respondem exatamente isso) nunca abre.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Cegos')

const CANARIO_SCHEMA = {
  type: 'object',
  required: ['canarios'],
  properties: {
    canarios: {
      type: 'array',
      description: '12 perguntas presente-escondido NOVAS',
      items: {
        type: 'object',
        required: ['id', 'pergunta', 'idsEsperados', 'topicosCertos', 'comoVoceProvou', 'porqueEhEscondido'],
        properties: {
          id: { type: 'string', description: 'C01, C02, …' },
          pergunta: { type: 'string', description: 'na voz do atleta, do jeito que ele digitaria numa conversa de domingo' },
          idsEsperados: { type: 'array', items: { type: 'string' } },
          topicosCertos: { type: 'array', items: { type: 'string' }, description: 'os tópicos do vocabulário fechado que TÊM de abrir para a resposta aparecer' },
          comoVoceProvou: { type: 'string', description: 'o comando exato que provou que esses ids existem e respondem' },
          porqueEhEscondido: { type: 'string', description: 'por que a pergunta do atleta não contém o vocabulário da claim' },
          jaPassaHoje: { type: 'boolean', description: 'false obrigatoriamente — descarte a pergunta se o --pergunta de hoje já a resolve' },
        },
      },
    },
  },
}

const cegos = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## SUA TAREFA: O CONJUNTO DE TESTE CEGO — 12 CANÁRIOS NOVOS\n\n` +
    `Existem 18 canários \`presente-escondido\` (P01–P18) em \`research/kb/CANARIOS.json\`, todos ` +
    `vermelhos. **O agente que vai consertar o roteamento enxerga esses 18.** Isso os torna ` +
    `conjunto de TREINO: ele pode otimizar para eles sem consertar camada nenhuma.\n\n` +
    `Você escreve o conjunto de **TESTE**: 12 perguntas novas, com ids provados, que o ` +
    `construtor **nunca vai ver**. No fim, o atacante mede os dois conjuntos separados, e a ` +
    `**distância entre os dois números é a medida de quanto ele decorou em vez de consertar.**\n\n` +
    `### Método\n\n` +
    `1. **Ache primeiro, pergunte depois.** Vá aos tópicos com \`--topic X --limit 0\`, ache ` +
    `claims que respondem bem alguma coisa, anote os ids **e o tópico onde moram**, e só então ` +
    `escreva a pergunta que o atleta faria — sem usar as palavras da claim. Ordem inversa produz ` +
    `canário fácil.\n` +
    `2. **Prove que os ids existem.** Registre o comando exato.\n` +
    `3. **Rode \`--pergunta\` na sua própria frase e DESCARTE a que já funciona.** \`jaPassaHoje\` ` +
    `tem de ser false em todas as 12. Canário que já passa mede zero.\n` +
    `4. **Leia os 18 do \`CANARIOS.json\` para NÃO repetir.** Assunto repetido é permitido; ` +
    `pergunta parecida, não. O valor deste conjunto é ser independente daquele.\n` +
    `5. **Cubra o que dói:** ao menos **três** de peitoral, supino e dor (é onde o erro ` +
    `machuca), ao menos **dois** em que a resposta mora numa gaveta PEQUENA (\`carga-de-treino\` ` +
    `13, \`descanso-entre-series\` 12, \`estagnacao\` 45, \`faixa\` 9, \`sapato\` 18) — gaveta ` +
    `pequena é fácil de nunca abrir —, e ao menos **dois** em que a palavra da pergunta é ` +
    `ambígua entre dois tópicos (o caso \`levantar peso\` → \`peso-corporal\` vs \`cardio\`).\n\n` +
    `**NÃO conserte nada. NÃO escreva ferramenta. NÃO grave arquivo nenhum** — nem em ` +
    `\`research/\`, nem em \`/tmp\`. Sua entrega é o objeto estruturado e nada mais. Se você ` +
    `gravar em disco, o construtor lê e o teste morre; foi exatamente o que aconteceu na onda ` +
    `passada e custou uma onda inteira para descobrir.`,
  { label: 'cegos', phase: 'Cegos', schema: CANARIO_SCHEMA, effort: 'high' },
)

const listaCega = cegos?.canarios ?? []
log(`${listaCega.length} canários cegos escritos — conjunto de teste, escondido do construtor`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Vocabulario')

const VOCAB_SCHEMA = {
  type: 'object',
  required: ['topicos'],
  properties: {
    topicos: {
      type: 'array',
      items: {
        type: 'object',
        required: ['topico', 'glosa', 'entrada', 'naoConfundirCom'],
        properties: {
          topico: { type: 'string', description: 'exatamente o nome do tópico que te foi dado' },
          glosa: { type: 'string', description: 'UMA linha: o que esta gaveta responde, do ponto de vista de quem pergunta. É o que um agente de conversa vai ler para escolher entre 74.' },
          entrada: {
            type: 'array',
            items: { type: 'string' },
            description: '20 a 40 termos e expressões que o ATLETA usaria ao perguntar sobre isto, em pt-BR, minúsculas, sem acento obrigatório. Inclua gíria de academia e descrição leiga.',
          },
          naoConfundirCom: {
            type: 'array',
            items: {
              type: 'object',
              required: ['topico', 'termoAmbiguo', 'comoDistinguir'],
              properties: {
                topico: { type: 'string' },
                termoAmbiguo: { type: 'string' },
                comoDistinguir: { type: 'string' },
              },
            },
            description: 'termos que parecem desta gaveta e são de outra',
          },
          exemplosDePergunta: { type: 'array', items: { type: 'string' }, description: '3 perguntas reais que devem cair aqui' },
        },
      },
    },
  },
}

const lotes = Array.from({ length: LOTES }, (_, n) => TOPICOS.filter((_, i) => i % LOTES === n))

const vocabs = await parallel(
  lotes.map((lote, n) => () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: O VOCABULÁRIO DE ENTRADA DE ${lote.length} TÓPICOS\n\n` +
        `A base tem 74 gavetas fechadas e o índice está correto: as claims estão etiquetadas ` +
        `direito. O que não existe é **a porta de entrada** — o mapa entre a palavra que o ATLETA ` +
        `digita e o nome técnico da gaveta.\n\n` +
        `O caso que prova a falta: a pergunta *"fisgada de 3/10 no peitoral, continuo?"* nunca ` +
        `abre a gaveta \`dor\`, porque **a palavra \`fisgada\` não existe em claim nenhuma da ` +
        `base**. A base fala \`dor\`, \`desconforto\`, \`tweak\`; o atleta fala \`fisgada\`, ` +
        `\`repuxou\`, \`travou\`, \`deu uma agulhada\`. Ninguém escreveu esse dicionário ainda. ` +
        `Você escreve o seu pedaço dele.\n\n` +
        `### Os seus tópicos (nome · nº de claims)\n\n` +
        lote.map(([t, n2]) => `- \`${t}\` · ${n2}`).join('\n') +
        `\n\n### Método, e a ordem importa\n\n` +
        `1. **LEIA A GAVETA ANTES DE ESCREVER.** \`node research/tools/check-evidence.mjs --topic ` +
        `<topico> --limit 0\` nas pequenas; nas grandes (300+) use \`--limit 60\` e varie com ` +
        `\`--modo prescricao\` e \`--modo mecanismo\` para ver do que a gaveta realmente trata. ` +
        `**Glosa escrita sem ler a gaveta é ficção**, e vira roteamento errado para sempre.\n` +
        `2. **A glosa é para escolher, não para definir.** Uma linha, na forma "responde X". Ela ` +
        `vai aparecer numa lista de 74 que um agente lê antes de decidir onde procurar. Se duas ` +
        `glosas suas não deixarem claro qual escolher, as duas estão ruins.\n` +
        `3. **Os termos de entrada são a fala do ATLETA, não a da base.** Gíria de academia ` +
        `brasileira, descrição leiga, erro de digitação comum, a palavra em inglês que ele usaria ` +
        `mesmo falando português. Um termo que já aparece literalmente nas claims da gaveta é ` +
        `**inútil** — a busca por texto já o encontra. O valor está no que a base NÃO diz.\n` +
        `4. **\`naoConfundirCom\` é a parte mais importante e a que ninguém faz.** O defeito ` +
        `medido: *"levantar peso já conta como exercício pro coração"* roteou para ` +
        `\`peso-corporal\` porque leu \`peso\` como peso CORPORAL, e \`cardio\` nunca abriu. Para ` +
        `cada termo seu que outra gaveta também poderia reivindicar, declare qual é a outra e o ` +
        `que decide. Pense em pelo menos 2 por tópico; se não achar nenhum, provavelmente não ` +
        `procurou.\n` +
        `5. **Gaveta pequena é a que mais some.** \`carga-de-treino\` (13), ` +
        `\`descanso-entre-series\` (12), \`faixa\` (9), \`idade\` (3): se um dos seus tópicos é ` +
        `desses, ele precisa de termos de entrada MELHORES que os das gavetas grandes, não ` +
        `piores, porque compete contra vizinhos 50 vezes maiores.\n\n` +
        `### Entrega\n\n` +
        `Além do objeto estruturado, **grave o mesmo conteúdo em ` +
        `\`research/kb/entrada/lote-${n + 1}.json\`** (crie o diretório se preciso; JSON com a ` +
        `chave \`topicos\`, indentação 2). Este arquivo é seu e de mais ninguém — outros 7 agentes ` +
        `trabalham em lotes vizinhos e **não** vão encostar nele. Não toque em nenhum outro ` +
        `arquivo do repositório.\n\n` +
        `Cubra os ${lote.length} tópicos. Faltar tópico é pior que termo mediano: gaveta sem ` +
        `porta de entrada é gaveta que nunca abre.`,
      { label: `vocab-${n + 1}`, phase: 'Vocabulario', schema: VOCAB_SCHEMA, model: 'sonnet', effort: 'medium' },
    ),
  ),
)

const cobertos = vocabs.filter(Boolean).flatMap((v) => (v.topicos ?? []).map((t) => t.topico))
log(`vocabulário de entrada: ${cobertos.length} de ${TOPICOS.length} tópicos cobertos por ${vocabs.filter(Boolean).length}/${LOTES} lotes`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Construir')

const obra = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## SUA TAREFA: CONSERTAR O ROTEAMENTO — E SÓ ELE\n\n` +
    `**Escopo fechado: pergunta → tópico.** Ordenação DENTRO do tópico não é sua; o soterramento ` +
    `é a doença nº 2 e vai ser atacada depois, com número na mão. Se você mexer em ordenação, ` +
    `mistura as duas medições e ninguém vai saber o que consertou o quê.\n\n` +
    `### A matéria-prima que acabou de ser produzida para você\n\n` +
    `Oito agentes leram as 74 gavetas e escreveram \`research/kb/entrada/lote-1.json\` a ` +
    `\`lote-8.json\`: para cada tópico, uma **glosa** de uma linha, 20–40 **termos de entrada na ` +
    `voz do atleta**, e uma lista **\`naoConfundirCom\`** de termos ambíguos com o que os ` +
    `distingue. Confira a cobertura: os 74 têm de estar lá, sem repetido, e todo nome tem de ` +
    `existir no vocabulário fechado. Lote que faltou é erro que você reporta, não buraco que ` +
    `você preenche de cabeça.\n\n` +
    `### O que construir — duas portas, e as duas usam o MESMO artefato\n\n` +
    `**Porta A, a que vale em produção:** quem consome esta base é um agente de conversa, ou ` +
    `seja, um modelo. Ele não precisa de heurística: precisa **ver as 74 gavetas com a glosa e o ` +
    `tamanho** e escolher. Construa essa porta (algo como \`--topicos\`), com saída enxuta o ` +
    `bastante para caber num prompt. É a porta principal, e é a mais barata.\n\n` +
    `**Porta B, a determinística:** \`--pergunta\` continua existindo e passa a rotear pelo ` +
    `vocabulário de entrada em vez do casamento léxico de hoje. É ela que o \`check:kb\` mede, ` +
    `porque não há chave de API neste repositório e um teste que precisa de modelo não roda no ` +
    `compilador.\n\n` +
    `**Consolide os 8 lotes num artefato único e verificado** — nome e formato são seus, algo ` +
    `como \`research/kb/GLOSSARIO-TOPICOS.json\`. O \`check:kb\` tem de reprovar: tópico fora dos ` +
    `74, tópico dos 74 sem glosa, e **termo de entrada reivindicado por dois tópicos sem uma ` +
    `regra de desempate declarada**. Ambiguidade declarada é dado; ambiguidade silenciosa é o ` +
    `bug do \`peso-corporal\`.\n\n` +
    `### Higiene — as duas regras que foram violadas ONTEM, no arquivo que você vai editar\n\n` +
    `1. **Nenhuma trava pode ler a constante que ela verifica.** Ontem \`DETALHE_ROTEADO 8→0\` e ` +
    `\`PESO_NOME_COMPOSTO 1.2→0\` passavam com \`check:kb\` verde. Toda constante que você criar ` +
    `ou mantiver precisa de um canário que a mate: **prove por mutação**, mostrando o comando e ` +
    `o vermelho. Constante sem canário é constante que ninguém pode mexer com segurança.\n` +
    `2. **Teste sobre corpus sintético não prova recuperação.** O que prova é a base real.\n\n` +
    `### Sobre os canários que você enxerga, e o aviso que importa\n\n` +
    `\`research/kb/CANARIOS.json\` tem P01–P18 vermelhos, com os ids esperados à vista. Use-os — ` +
    `eles são o diagnóstico honesto. **Mas existe um segundo conjunto, escrito antes de você por ` +
    `outro agente, que você não vai ver, e o atacante vai medir os dois separados.** Casar os ` +
    `ids de P01–P18 sem construir camada é detectável em uma linha de relatório, e é o resultado ` +
    `esperado se você tratar isto como conserto pontual.\n\n` +
    `Os dois casos do diagnóstico — a fisgada no peitoral e o \`levantar peso\` → \`cardio\` — são ` +
    `o mínimo, não o alvo. **Mostre o comando e a saída dos dois.**\n\n` +
    `\`npm run check:kb\`, \`npm run check:gate\` e \`npm run build\` verdes. Atualize ` +
    `\`research/kb/RECUPERACAO.md\` — inclusive o VEREDITO do topo, que hoje diz NÃO e precisa ` +
    `dizer o que passou a ser verdade, **sem adjetivo e com número**.`,
  { label: 'roteamento', phase: 'Construir', effort: 'high' },
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['publicosPassaram', 'publicosTotal', 'cegosPassaram', 'cegosTotal', 'roteouCerto', 'furos', 'veredito'],
  properties: {
    publicosPassaram: { type: 'number', description: 'dos 18 P##, quantos devolvem ALGUM id esperado dentro do teto de tela' },
    publicosTotal: { type: 'number' },
    cegosPassaram: { type: 'number', description: 'dos 12 C##, idem — este é o número honesto' },
    cegosTotal: { type: 'number' },
    roteouCerto: { type: 'number', description: 'dos 12 cegos, em quantos o roteador abriu ao menos um dos topicosCertos (mede roteamento isolado do soterramento)' },
    decorou: { type: 'boolean', description: 'true se a distância entre público e cego indica otimização para o conjunto visível' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito com o comando que reproduz' },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## VOCÊ JULGA O CONSERTO DO ROTEAMENTO, E VOCÊ TEM O QUE ELE NÃO TEVE\n\n` +
    `Relato de quem construiu:\n\n${obra ?? '(sem relato)'}\n\n` +
    `**Não acredite no relato.** Ontem o construtor reportou 5 de 7 destravadas e o ataque cego ` +
    `reproduziu 2 — a diferença não era a camada, era a frase: as perguntas da tabela dele já ` +
    `continham a palavra da resposta.\n\n` +
    `### O CONJUNTO DE TESTE — 12 canários que o construtor nunca viu\n\n` +
    listaCega
      .map((c) => `**${c.id}** ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}\n   é escondido porque: ${c.porqueEhEscondido}`)
      .join('\n\n') +
    `\n\n### O que fazer, nesta ordem\n\n` +
    `**1. Rode os 12 cegos, a pergunta EXATAMENTE como está escrita, sem ajustar termo.** Conte ` +
    `quantos devolvem algum id esperado numa posição em que alguém de fato leria. **Este é o ` +
    `número da onda.**\n\n` +
    `**2. Separe roteamento de soterramento, que é a razão desta onda existir.** Para cada um dos ` +
    `12, registre também se o roteador abriu ao menos um dos \`topicosCertos\`. Gaveta certa ` +
    `aberta e resposta em 900º é soterramento — doença nº 2, fora do escopo — e **não pode ser ` +
    `contada como falha de roteamento**. Gaveta certa nunca aberta é falha desta onda.\n\n` +
    `**3. Rode os 18 públicos (P01–P18 do \`CANARIOS.json\`) e compare.** Se os públicos forem ` +
    `muito melhores que os cegos, o construtor decorou o conjunto visível. **Diga o tamanho da ` +
    `distância**, é a medida que esta onda foi desenhada para produzir.\n\n` +
    `**4. Ataque por mutação, procurando o modo de falha nº 4.** Toda constante nova do ` +
    `roteamento: zere, inverta, e veja se \`check:kb\` fica verde. Ontem duas passavam. Reproduza ` +
    `com o comando.\n\n` +
    `**5. Ataque a precisão, que é o custo esquecido do roteamento largo.** Roteamento generoso ` +
    `pode abrir cinco gavetas e chamar isso de achar. Rode perguntas ESTREITAS e veja se a ` +
    `resposta é estreita. Rode pergunta de fora do domínio e veja se a camada diz que não sabe em ` +
    `vez de inventar. E rode o caso ambíguo — \`levantar peso já conta como exercício pro ` +
    `coração\` — porque ele é o teste do \`naoConfundirCom\`.\n\n` +
    `**6. O caso que mais custa a ESTE atleta**, e ele é o único que eu quero verificado duas ` +
    `vezes: \`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?\`. ` +
    `Devolve V079-34, V001-06, V138-19, V086-21, V027-23? Se não devolver todas, **a tela diz ao ` +
    `menos que existe uma gaveta \`dor\` que não foi aberta?** Uma tela cheia e silenciosa é pior ` +
    `que uma tela vazia, porque o agente de conversa que a lê não tem como saber que faltou.\n\n` +
    `Seja específico e sem diplomacia. Se o número cego for baixo, **diga o número baixo.**`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(
  `cegos: ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length} · ` +
    `roteou certo: ${ataque?.roteouCerto ?? '?'} · públicos: ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? 18}`,
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 2C — ROTEAMENTO\n\n` +
    `**Construtor:** ${obra ?? '(sem relato)'}\n\n` +
    `**Ataque:** cegos ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? '?'}, ` +
    `roteou certo ${ataque?.roteouCerto ?? '?'}, públicos ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? '?'}, ` +
    `decorou=${ataque?.decorou ?? '?'}\n${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.** Nada sai daqui ` +
    `vermelho.\n\n` +
    `2. **Grave os 12 canários cegos em \`research/kb/CANARIOS.json\`** como C01–C12, na mesma ` +
    `família \`presente-escondido\`, **com o resultado medido pelo ataque — inclusive os que ` +
    `falham.** Canário que só entra depois de passar é canário decorativo. Eles são:\n\n` +
    `\`\`\`json\n${JSON.stringify(listaCega, null, 1).slice(0, 7000)}\n\`\`\`\n\n` +
    `A partir de agora eles ficam VISÍVEIS, como os P## ficaram. Registre no arquivo, numa linha, ` +
    `que **a próxima onda de roteamento precisará de um conjunto cego novo** — conjunto de teste ` +
    `publicado vira conjunto de treino.\n\n` +
    `3. **Consertos pequenos e claros que o ataque apontou**, se houver. Difuso, registre em vez ` +
    `de adivinhar.\n\n` +
    `4. **O veredito no topo do \`RECUPERACAO.md\`, em duas linhas, com os DOIS números** — o ` +
    `cego e o público — e a distância entre eles. Sem adjetivo.\n\n` +
    `5. **Atualize \`research/kb/ESTADO.md\`** e o **\`RUNBOOK.md\` §8**: divergências resolvidas ` +
    `saem, novas entram, **não resolvidas continuam na lista**.\n\n` +
    `6. **Atualize \`research/kb/ONDA-2C.md\`:** o item 0 (roteamento) sai ou muda de tamanho ` +
    `conforme o número cego. **Escreva o item novo do SOTERRAMENTO** com o que o ataque mediu ` +
    `sobre ele — quantos dos cegos abriram a gaveta certa e mesmo assim não entregaram —, porque ` +
    `é a próxima decisão do atleta: ele já perguntou se vale usar uma frota de modelo barato para ` +
    `dar a cada claim uma linha de "que pergunta esta claim responde", e essa decisão precisa do ` +
    `número, não da intuição.\n\n` +
    `**Não proponha ingerir mais corpus** — está medido que o gargalo não é conteúdo.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  cegos: `${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length}`,
  roteouCerto: ataque?.roteouCerto,
  publicos: `${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? 18}`,
  decorou: ataque?.decorou,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
