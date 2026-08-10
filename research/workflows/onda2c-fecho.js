export const meta = {
  name: 'onda-2c-fecho',
  description: 'Fecha a onda 2C: conjunto cego novo, verificacao do roteamento ja construido, ataque com os dois conjuntos medidos separados',
  phases: [
    { title: 'Cegos', detail: '12 canarios novos, escondidos de quem construiu — o conjunto de teste' },
    { title: 'Verificar', detail: 'o roteamento ja esta em disco e verde; achar o que ficou pela metade' },
    { title: 'Atacar', detail: 'os 18 publicos e os 12 cegos, medidos separados' },
    { title: 'Fechar', detail: 'veredito com os dois numeros e a distancia entre eles' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

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
4. **Trava que se testa a si mesma.** Duas constantes do roteador podiam ir a zero com
   \`check:kb\` VERDE.
5. **Relatório de agente que diz sucesso sem sucesso.** O construtor da onda passada reportou
   5 de 7 falhas destravadas; o ataque cego reproduziu 2. A diferença era a FRASE: as
   perguntas da tabela dele já continham a palavra da resposta.
`

const DIAGNOSTICO = `
## O DIAGNÓSTICO, medido em 10/08 e verificado à mão

A camada de recuperação foi reprovada: **3 de 18** canários \`presente-escondido\` devolviam
algum id esperado. O número bruto escondia duas doenças, e esta onda ataca **só a primeira**:

- **7 de 18 eram ROTEAMENTO:** o roteador nunca abria uma gaveta que contivesse a resposta.
- **~4 de 18 eram SOTERRAMENTO:** a gaveta certa abria e a resposta saía em 945º de 1038.

**O índice está CERTO. Não é problema de etiqueta.** Verificado:
  V001-05, V001-06, V001-29 → dor, lesao, autorregulacao
  V079-34, V138-19          → dor, lesao, autorregulacao
  V013-04, V013-05          → cardio, condicionamento, saude

Os dois casos que definem o problema:

1. **\`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?\`** — roteava
   para \`peito\` e \`supino\` e devolvia 40 claims, NENHUMA das cinco que carregam o limiar de
   dor (V079-34, V001-06, V138-19, V086-21, V027-23). A palavra \`fisgada\` NÃO EXISTE em claim
   nenhuma. Este é o caso mais caro da base: atleta com histórico de peitoral recebe uma tela
   cheia, plausível, sem sinal de que falta alguma coisa.
2. **\`levantar peso já conta como exercício pro coração\`** — roteava para \`peso-corporal\`
   porque leu \`peso\` como peso CORPORAL. \`cardio\` (230 claims) nunca abria.
`

const CONSTRUIDO = `
## O QUE JÁ FOI CONSTRUÍDO E ESTÁ COMMITADO (\`42fd97b\`)

Oito agentes leram as 74 gavetas e escreveram o **vocabulário de entrada** — o mapa entre a
palavra que o atleta digita e o nome técnico da gaveta, que era exatamente o que não existia:

- \`research/kb/entrada/lote-1..8.json\` — por tópico: glosa, 20–40 termos na voz do atleta,
  e \`naoConfundirCom\` (termos ambíguos com o que os distingue)
- \`research/kb/GLOSSARIO-TOPICOS.json\` — o artefato consolidado
- \`research/tools/glossario.mjs\`, \`build-glossario.mjs\`, \`check-glossario.mjs\` — novos
- \`roteador.mjs\`, \`check-canarios.mjs\`, \`check-rotas.mjs\`, \`check-evidence.mjs\`,
  \`roteador.test.mjs\`, \`RECUPERACAO.md\`, \`CANARIOS.json\` — modificados

\`check:kb\`, \`check:gate\` e \`build\` estão VERDES. O \`check:kb\` imprime hoje:

    0 de 18 devolvem TODOS os ids esperados
    8 de 18 devolvem ALGUM id esperado          (era 3)
    1 de 18 não roteia para gaveta nenhuma que contenha a resposta   (era 7)
   11 de 18 roteiam para o tópico em que a resposta está etiquetada

**Esses 18 são os canários que o construtor ENXERGAVA.** São conjunto de treino, não veredito.
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
        required: ['id', 'pergunta', 'idsEsperados', 'topicosCertos', 'comoVoceProvou', 'porqueEhEscondido', 'jaPassaHoje'],
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
    `Uma camada de roteamento nova acabou de ser construída (glossário de entrada por tópico). ` +
    `Quem a construiu **enxergava** os 18 canários \`presente-escondido\` (P01–P18) de ` +
    `\`research/kb/CANARIOS.json\`, com os ids esperados à vista. Isso os torna conjunto de ` +
    `TREINO: dá para casá-los sem construir camada nenhuma.\n\n` +
    `Você escreve o conjunto de **TESTE**: 12 perguntas novas, com ids provados, que ninguém ` +
    `otimizou. O atacante mede os dois conjuntos separados, e a **distância entre os dois ` +
    `números é a medida de quanto se decorou em vez de consertar.**\n\n` +
    `### Método\n\n` +
    `1. **Ache primeiro, pergunte depois.** Vá aos tópicos com \`--topic X --limit 0\`, ache ` +
    `claims que respondem bem alguma coisa, anote os ids **e o tópico onde moram**, e só então ` +
    `escreva a pergunta que o atleta faria — sem usar as palavras da claim. Ordem inversa produz ` +
    `canário fácil.\n` +
    `2. **Prove que os ids existem.** Registre o comando exato.\n` +
    `3. **Rode \`--pergunta\` na sua própria frase e DESCARTE a que já funciona.** \`jaPassaHoje\` ` +
    `tem de ser false nas 12. Canário que já passa mede zero — e a camada nova acabou de subir, ` +
    `então muita pergunta óbvia já passa. Seja duro: é isso que separa este conjunto de um ` +
    `teatro.\n` +
    `4. **Leia os P## do \`CANARIOS.json\` para NÃO repetir.** Assunto repetido é permitido; ` +
    `pergunta parecida, não.\n` +
    `5. **Cubra o que dói:** ao menos **três** de peitoral, supino e dor (é onde o erro ` +
    `machuca), ao menos **dois** em que a resposta mora numa gaveta PEQUENA (\`carga-de-treino\` ` +
    `13, \`descanso-entre-series\` 12, \`estagnacao\` 45, \`faixa\` 9, \`sapato\` 18) — gaveta ` +
    `pequena é fácil de nunca abrir, porque compete com vizinhas 50 vezes maiores —, e ao menos ` +
    `**dois** em que a palavra da pergunta é ambígua entre dois tópicos (o caso \`levantar peso\` ` +
    `→ \`peso-corporal\` vs \`cardio\`).\n` +
    `6. **Você PODE ler o \`GLOSSARIO-TOPICOS.json\`** — e devia, para escrever pergunta cuja ` +
    `palavra NÃO está na lista de entrada de ninguém. É assim que se testa a camada em vez de ` +
    `testar a lista.\n\n` +
    `**NÃO conserte nada. NÃO escreva ferramenta. NÃO grave arquivo nenhum** — nem em ` +
    `\`research/\`, nem em \`/tmp\`, nem no scratchpad. Sua entrega é o objeto estruturado e nada ` +
    `mais. Gravar em disco é como o teste morreu numa onda anterior, e custou uma onda inteira ` +
    `para descobrir.`,
  { label: 'cegos', phase: 'Cegos', schema: CANARIO_SCHEMA, effort: 'high' },
)

const listaCega = cegos?.canarios ?? []
log(`${listaCega.length} canários cegos escritos — conjunto de teste`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Verificar')

const obra = await agent(
  `${CTX}\n${DIAGNOSTICO}\n${CONSTRUIDO}\n\n` +
    `## SUA TAREFA: VERIFICAR O QUE JÁ ESTÁ EM DISCO — VOCÊ NÃO RECONSTRÓI\n\n` +
    `O agente que construiu tudo isso **morreu por falha do harness durante a verificação ` +
    `final**, não por defeito do trabalho. Sobrou o código, e faltou justamente a parte que ele ` +
    `estava rodando quando morreu — que é, por isso mesmo, a menos confiável de todas.\n\n` +
    `**NÃO reconstrua. NÃO reescreva o que já funciona.** O modo de falha nº 1 desta casa é ` +
    `refazer por cima do que já está certo; o nº 5 é dizer que está tudo bem sem conferir. Você ` +
    `escapa dos dois assim:\n\n` +
    `1. **Cobertura, de verdade:** os 74 tópicos estão no glossário, sem repetido, todo nome ` +
    `existe no vocabulário fechado, todo tópico tem glosa, e **todo termo de entrada reivindicado ` +
    `por dois tópicos tem desempate declarado**. Ambiguidade declarada é dado; ambiguidade ` +
    `silenciosa é o bug do \`peso-corporal\`. Lote que faltou é erro que você **reporta**.\n\n` +
    `2. **Ataque as constantes por mutação.** Toda constante do roteamento e do glossário: zere, ` +
    `inverta, e exija que \`check:kb\` fique VERMELHO. **Mostre o comando e o vermelho de cada ` +
    `uma.** Numa onda anterior duas constantes iam a zero com o build verde, e uma delas estava ` +
    `no arquivo que documenta esse modo de falha. Constante sem canário é constante que ninguém ` +
    `pode mexer com segurança.\n\n` +
    `3. **Ache o que ficou pela metade.** Ele foi morto no meio de uma edição de ` +
    `\`check-canarios.mjs\`. Procure função órfã, teste que não roda, documento que descreve ` +
    `código que não existe, constante declarada e nunca usada, e o \`_leia\` do ` +
    `\`GLOSSARIO-TOPICOS.json\` prometendo coisa que o código não faz.\n\n` +
    `4. **Rode os dois casos do diagnóstico e cole a saída:** a fisgada no peitoral e o ` +
    `\`levantar peso\` → \`cardio\`. Na fisgada, a pergunta que importa não é só se os cinco ids ` +
    `saem: é **se a tela avisa quando uma gaveta relevante não foi aberta.** Tela cheia e ` +
    `silenciosa é pior que tela vazia, porque quem a lê não tem como saber que faltou.\n\n` +
    `5. **A porta A existe mesmo?** Quem consome esta base em produção é um agente de conversa. ` +
    `Ele precisa de uma porta que liste as 74 gavetas com glosa e tamanho, enxuta o bastante para ` +
    `caber num prompt. Confira se ela existe, se está documentada, e se a saída é utilizável.\n\n` +
    `**Só conserte o que estiver de fato quebrado**, e diga o que consertou. Seu relatório é o ` +
    `que o atacante vai receber: descreva o que EXISTE, não o que você faria. E não toque em ` +
    `ordenação dentro do tópico — o soterramento é a doença nº 2 e está fora do escopo desta ` +
    `onda de propósito, para as duas medições não se misturarem.\n\n` +
    `\`npm run check:kb\`, \`npm run check:gate\` e \`npm run build\` verdes ao sair.`,
  { label: 'verificar', phase: 'Verificar', effort: 'high' },
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
    soterrados: { type: 'number', description: 'dos 12 cegos, em quantos a gaveta certa abriu e mesmo assim o id nao apareceu na tela — doenca no 2, fora do escopo' },
    decorou: { type: 'boolean', description: 'true se a distância entre público e cego indica otimização para o conjunto visível' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito com o comando que reproduz' },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n${DIAGNOSTICO}\n${CONSTRUIDO}\n\n` +
    `## VOCÊ JULGA O CONSERTO DO ROTEAMENTO, E VOCÊ TEM O QUE ELE NÃO TEVE\n\n` +
    `Relato de quem verificou:\n\n${obra ?? '(sem relato)'}\n\n` +
    `**Não acredite no relato.** Na onda passada o construtor reportou 5 de 7 destravadas e o ` +
    `ataque cego reproduziu 2 — a diferença não era a camada, era a frase: as perguntas da tabela ` +
    `dele já continham a palavra da resposta.\n\n` +
    `### O CONJUNTO DE TESTE — 12 canários que ninguém otimizou\n\n` +
    listaCega
      .map((c) => `**${c.id}** ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}\n   é escondido porque: ${c.porqueEhEscondido}`)
      .join('\n\n') +
    `\n\n### O que fazer, nesta ordem\n\n` +
    `**1. Rode os 12 cegos, a pergunta EXATAMENTE como está escrita, sem ajustar termo.** Conte ` +
    `quantos devolvem algum id esperado numa posição em que alguém de fato leria. **Este é o ` +
    `número da onda.**\n\n` +
    `**2. Separe roteamento de soterramento, que é a razão desta onda existir.** Para cada um dos ` +
    `12, registre se o roteador abriu ao menos um dos \`topicosCertos\`. Gaveta certa aberta e ` +
    `resposta em 900º é **soterramento** — doença nº 2, fora do escopo — e não pode ser contada ` +
    `como falha de roteamento. Gaveta certa nunca aberta é falha desta onda. Devolva os dois ` +
    `números, porque a próxima decisão do atleta depende exatamente dessa divisão.\n\n` +
    `**3. Rode os 18 públicos (P01–P18) e compare.** Se os públicos forem muito melhores que os ` +
    `cegos, otimizou-se o conjunto visível. **Diga o tamanho da distância.**\n\n` +
    `**4. Ataque por mutação, procurando o modo de falha nº 4.** Toda constante do roteamento e ` +
    `do glossário: zere, inverta, veja se \`check:kb\` fica verde. Reproduza com o comando. E ` +
    `confira o caso mais insidioso: **dá para esvaziar o \`GLOSSARIO-TOPICOS.json\` — ou um ` +
    `tópico dele — e o build continuar verde?**\n\n` +
    `**5. Ataque a precisão, que é o custo esquecido do roteamento largo.** Roteamento generoso ` +
    `abre cinco gavetas e chama isso de achar. Rode perguntas ESTREITAS e veja se a resposta é ` +
    `estreita. Rode pergunta de fora do domínio e veja se a camada diz que não sabe em vez de ` +
    `inventar. E rode \`levantar peso já conta como exercício pro coração\`, que é o teste do ` +
    `\`naoConfundirCom\`.\n\n` +
    `**6. O caso que mais custa a ESTE atleta**, e é o único que eu quero verificado duas vezes: ` +
    `\`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?\`. Devolve ` +
    `V079-34, V001-06, V138-19, V086-21, V027-23? Se não devolver todas, **a tela avisa que existe ` +
    `uma gaveta \`dor\` que não foi aberta?**\n\n` +
    `Seja específico e sem diplomacia. Se o número cego for baixo, **diga o número baixo.**`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(
  `cegos: ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length} · ` +
    `roteou certo: ${ataque?.roteouCerto ?? '?'} · soterrados: ${ataque?.soterrados ?? '?'} · ` +
    `públicos: ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? 18}`,
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n${CONSTRUIDO}\n\n## FECHAR A ONDA 2C — ROTEAMENTO\n\n` +
    `**Verificação:** ${obra ?? '(sem relato)'}\n\n` +
    `**Ataque:** cegos ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? '?'}, ` +
    `roteou certo ${ataque?.roteouCerto ?? '?'}, soterrados ${ataque?.soterrados ?? '?'}, ` +
    `públicos ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? '?'}, ` +
    `decorou=${ataque?.decorou ?? '?'}\n${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.** Nada sai daqui ` +
    `vermelho.\n\n` +
    `2. **Grave os 12 canários cegos em \`research/kb/CANARIOS.json\`** como C01–C12, na família ` +
    `\`presente-escondido\`, **com o resultado medido pelo ataque — inclusive os que falham.** ` +
    `Canário que só entra depois de passar é canário decorativo. Eles são:\n\n` +
    `\`\`\`json\n${JSON.stringify(listaCega, null, 1).slice(0, 7000)}\n\`\`\`\n\n` +
    `Registre no arquivo, numa linha, que **a próxima onda de roteamento precisará de um conjunto ` +
    `cego novo** — conjunto de teste publicado vira conjunto de treino. É a regra que esta onda ` +
    `comprou caro.\n\n` +
    `3. **Consertos pequenos e claros que o ataque apontou**, se houver. Difuso, registre em vez ` +
    `de adivinhar.\n\n` +
    `4. **O veredito no topo do \`RECUPERACAO.md\`, em duas linhas, com os DOIS números** — o ` +
    `cego e o público — e a distância entre eles. Sem adjetivo.\n\n` +
    `5. **Atualize \`research/kb/ESTADO.md\`** e o **\`RUNBOOK.md\` §8**: divergências resolvidas ` +
    `saem, novas entram, **não resolvidas continuam na lista**.\n\n` +
    `6. **Atualize \`research/kb/ONDA-2C.md\`:** o item 0 (roteamento) sai ou muda de tamanho ` +
    `conforme o número CEGO, nunca o público. E **escreva o item do SOTERRAMENTO com o número que ` +
    `o ataque mediu** — em quantos dos cegos a gaveta certa abriu e mesmo assim a resposta não ` +
    `apareceu. Essa é a próxima decisão do atleta: ele perguntou se vale usar uma frota de modelo ` +
    `barato para dar a cada claim uma linha de "que pergunta esta claim responde", e essa decisão ` +
    `precisa do número, não da intuição. Escreva o custo estimado junto (são ~6.912 claims).\n\n` +
    `7. **\`research/RETOMAR.md\`**: reescreva para o estado de agora, ou apague se não houver ` +
    `nada pendente que não esteja no \`ONDA-2C.md\`. Documento de retomada desatualizado é pior ` +
    `que nenhum.\n\n` +
    `**Não proponha ingerir mais corpus** — está medido que o gargalo não é conteúdo.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  cegos: `${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length}`,
  roteouCerto: ataque?.roteouCerto,
  soterrados: ataque?.soterrados,
  publicos: `${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? 18}`,
  decorou: ataque?.decorou,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
