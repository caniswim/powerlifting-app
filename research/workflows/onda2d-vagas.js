export const meta = {
  name: 'onda-2d-vagas',
  description: 'Conserta SOTERRAMENTO: as 40 vagas da tela sao alocadas por ranking global e a gaveta grande come tudo. Mais a divida de mutacao: 26 de 74 gavetas tem vocabulario que nada testa',
  phases: [
    { title: 'Cegos', detail: '12 canarios novos — P## e C## viraram publicos' },
    { title: 'Construir', detail: 'alocacao de vagas por gaveta + as travas que faltam' },
    { title: 'Atacar', detail: 'os tres conjuntos medidos separados, e a divida de mutacao remedida' },
    { title: 'Fechar', detail: 'veredito com os tres numeros' },
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
4. **Trava que se testa a si mesma.** Ontem: 26 de 74 gavetas podiam ter o vocabulário de
   entrada trocado por lixo com \`check:kb\` VERDE.
5. **Relatório de agente que diz sucesso sem sucesso.** Quatro ondas seguidas. Na última, o
   relatório de verificação disse "2 das 5 chegam à tela" e a medição do atacante deu 1.
`

const DIAGNOSTICO = `
## O DIAGNÓSTICO DE 10/08 — medido pelo ataque cego, e eu verifiquei o caso central à mão

A onda anterior consertou ROTEAMENTO e **entregou zero ao atleta**: 0 de 12 canários cegos
devolvem qualquer id esperado. Os públicos dão 8 de 18, e das 8 só 2 sobrevivem a uma
paráfrase — o número público é frágil.

**A doença agora é SOTERRAMENTO, e ela é 10 dos 12.** Em 10 dos 12 cegos o roteador ABRIU uma
gaveta que contém a resposta e a resposta não chegou à tela. Só 2 são falha de roteamento.

**O mecanismo, medido:** as 40 vagas da tela são distribuídas pelo **ranking global**, então a
gaveta grande come tudo e a gaveta pequena que tem a resposta fica com 0 a 5 vagas:

    C11       supino(694):26   agacho(990):24   ordem-exercicio(29):1   <- as 2 respostas
    C07       competicao(457):36   equipamento(199):4                   <- F001-94 esta aqui
    C12       agacho(990):39
    FISGADA   supino(694):33   dor(119):5                               <- as 5 estao aqui

**O caso da fisgada, que é o mais caro desta base** (atleta com histórico de peitoral):

    node research/tools/check-evidence.mjs --pergunta "fisgada de 3/10 no peitoral na
      terceira serie de supino pausado, continuo?"
      -> a gaveta \`dor\` ABRE em 3o lugar, score 1,64, e leva 5 das 40 vagas
      -> V079-34 sai em 36o; V027-23 em 56o, alem do teto; as outras tres nao saem

    ... a MESMA pergunta com --topic dor
      -> devolve as CINCO: V001-06, V027-23, V079-34, V086-21, V138-19

O conteúdo está a um comando de distância. Forçando a gaveta, **9 dos 12 cegos devolvem na
hora**. Não é problema de conteúdo, nem de etiqueta, nem de roteamento: é de alocação.
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
          id: { type: 'string', description: 'D01, D02, …' },
          pergunta: { type: 'string' },
          idsEsperados: { type: 'array', items: { type: 'string' } },
          topicosCertos: { type: 'array', items: { type: 'string' } },
          comoVoceProvou: { type: 'string' },
          porqueEhEscondido: { type: 'string' },
          jaPassaHoje: { type: 'boolean', description: 'false obrigatoriamente' },
          gavetaPequena: { type: 'boolean', description: 'true se a resposta mora numa gaveta com menos de 60 claims' },
        },
      },
    },
  },
}

const cegos = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## SUA TAREFA: O CONJUNTO DE TESTE CEGO — 12 CANÁRIOS NOVOS (D01–D12)\n\n` +
    `\`research/kb/CANARIOS.json\` já tem P01–P18 e C01–C12, todos **públicos** — quem conserta ` +
    `os enxerga, e por isso viraram conjunto de treino. É a regra que esta casa comprou caro: ` +
    `**conjunto de teste publicado vira conjunto de treino.** Você escreve o teste novo.\n\n` +
    `### Método\n\n` +
    `1. **Ache primeiro, pergunte depois.** \`--topic X --limit 0\`, ache claims que respondem ` +
    `bem, anote ids **e o tópico onde moram**, e só então escreva a pergunta do atleta, sem as ` +
    `palavras da claim.\n` +
    `2. **Prove que os ids existem.** Comando exato.\n` +
    `3. **Rode \`--pergunta\` na sua frase e DESCARTE a que já funciona.** \`jaPassaHoje\` false ` +
    `nas 12.\n` +
    `4. **Leia P## e C## para não repetir pergunta.** Assunto repetido pode; frase parecida, ` +
    `não.\n` +
    `5. **Esta onda ataca SOTERRAMENTO, então calibre o conjunto para medi-lo.** Pelo menos ` +
    `**seis** dos 12 devem ter a resposta numa gaveta pequena (<60 claims) cujo assunto também é ` +
    `reivindicado por uma gaveta grande — \`ordem-exercicio\`(29) contra \`agacho\`(990), ` +
    `\`descanso-entre-series\`(12) contra \`volume\`(750), \`sapato\`(18) contra \`equipamento\`(199), ` +
    `\`carga-de-treino\`(13) contra \`programacao\`(636), \`faixa\`(9) contra \`competicao\`(457), ` +
    `\`estagnacao\`(45) contra \`progressao\`(741). É exatamente onde a alocação por ranking global ` +
    `mata a resposta. Marque \`gavetaPequena\`.\n` +
    `6. **Pelo menos três de peitoral, supino e dor**, que é onde o erro machuca este atleta.\n` +
    `7. **Ao menos dois casos de resposta ESTREITA** — pergunta de sim/não cuja resposta é uma ` +
    `claim só, tipo regulamento. Hoje 32 de 33 perguntas devolvem exatamente 40 claims: a camada ` +
    `não sabe responder pouco, e isso também é defeito.\n` +
    `8. **Você PODE e DEVE ler o \`GLOSSARIO-TOPICOS.json\`** — para escrever pergunta cuja ` +
    `palavra NÃO está na lista de entrada de ninguém. Senão você testa a lista, não a camada. A ` +
    `onda passada mostrou que a vitrine dependia da palavra literal \`coração\` e caía inteira ` +
    `trocando para \`cardiovascular\`.\n\n` +
    `**NÃO conserte nada. NÃO grave arquivo nenhum** — nem em \`research/\`, nem em \`/tmp\`, nem ` +
    `no scratchpad. Sua entrega é o objeto estruturado e nada mais.`,
  { label: 'cegos', phase: 'Cegos', schema: CANARIO_SCHEMA, effort: 'high' },
)

const listaCega = cegos?.canarios ?? []
log(`${listaCega.length} canários cegos (D##) — ${listaCega.filter((c) => c.gavetaPequena).length} com resposta em gaveta pequena`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Construir')

const obras = await parallel([
  () =>
    agent(
      `${CTX}\n${DIAGNOSTICO}\n\n` +
        `## SUA TAREFA: ALOCAÇÃO DE VAGAS POR GAVETA\n\n` +
        `**Escopo fechado: como as vagas da tela são distribuídas entre as gavetas roteadas.** ` +
        `Roteamento não é seu — está consertado, 10 de 12 abrem a gaveta certa. Glossário não é ` +
        `seu. Se você mexer neles, as medições se misturam e ninguém saberá o que consertou o ` +
        `quê.\n\n` +
        `### O que está errado\n\n` +
        `\`ordenarNoTopico\` e o caminho de \`responder()\` em \`research/tools/roteador.mjs\` ` +
        `ordenam o conjunto inteiro e cortam no teto. Ordenar tudo junto e cortar é o mesmo que ` +
        `dar as vagas por tamanho de gaveta: \`agacho\` tem 990 bilhetes e ` +
        `\`ordem-exercicio\` tem 29.\n\n` +
        `### O que fazer\n\n` +
        `Desenhe a alocação. A forma é sua, mas ela precisa de três propriedades, e a terceira é a ` +
        `que costuma ser esquecida:\n\n` +
        `1. **Gaveta que o roteador abriu tem vaga garantida.** Se \`dor\` pontuou alto o bastante ` +
        `para abrir, ela não pode aparecer com 5 vagas contra 33 de \`supino\`. A pergunta que ` +
        `você tem de conseguir responder por escrito é: *quantas vagas uma gaveta merece, e por ` +
        `quê?* Proporcional ao score da rota, igual entre as abertas, ou um piso por gaveta mais ` +
        `sobra distribuída — escolha e **justifique com medição**, não com gosto.\n` +
        `2. **Gaveta pequena não pode ser punida por ser pequena.** É o defeito central: a ` +
        `resposta de \`ordem-exercicio\` (29 claims) perdeu para o volume de \`agacho\`. Gaveta ` +
        `pequena que pontua é sinal FORTE, não fraco — ela é específica.\n` +
        `3. **A tela tem de saber devolver POUCO.** Hoje 32 de 33 perguntas devolvem exatamente ` +
        `40 claims, inclusive *"o cinto pode ter mais de 13 mm de espessura na IPF"*, que tem uma ` +
        `resposta só. Tela sempre cheia é indistinguível de tela que achou, e foi assim que o caso ` +
        `da fisgada virou perigoso: cheia, plausível e silenciosa.\n\n` +
        `### Como você sabe que funcionou — e o alvo mínimo é este\n\n` +
        `**Forçando a gaveta, 9 dos 12 cegos devolvem na hora.** Então o alvo não é sutil: as ` +
        `mesmas perguntas, SEM \`--topic\`, têm de devolver o mesmo. Rode e cole a saída de:\n\n` +
        `- \`--pergunta "fisgada de 3/10 no peitoral na terceira série de supino pausado, ` +
        `continuo?"\` — as CINCO (V079-34, V001-06, V138-19, V086-21, V027-23) têm de chegar à ` +
        `tela, sem \`--topic\`. Este é o caso que mais custa a este atleta e é inegociável.\n` +
        `- \`--pergunta "quando cai agacho e supino na mesma sessão, tanto faz qual eu faço ` +
        `primeiro"\` — G014-10 e G016-10, que moram em \`ordem-exercicio\` (29 claims).\n` +
        `- \`--pergunta "o cinto pode ter mais de 13 mm de espessura na IPF"\` — resposta ` +
        `ESTREITA, não 40 claims.\n\n` +
        `**E cuide da precisão do outro lado:** dar vaga a toda gaveta aberta pode encher a tela ` +
        `de lixo relevante-por-pouco. Meça os dois lados, e diga qual você piorou — sempre se ` +
        `piora um.\n\n` +
        `### Higiene, e as duas foram violadas nesta casa esta semana\n\n` +
        `1. **Nenhuma trava pode ler a constante que ela verifica.** Toda constante nova precisa ` +
        `de um canário que a mate **nos dois sentidos** — apertar E afrouxar. Ontem 5 de 56 ` +
        `mutações sobreviveram, e **todas no sentido de afrouxar** (\`DETALHE_ROTEADO 8→80\`, ` +
        `\`TETO_PARAM 12→120\`): o teste só cobria o lado que aperta. Prove por mutação e cole o ` +
        `vermelho.\n` +
        `2. **Teste sobre corpus sintético não prova recuperação.** O que prova é a base real.\n\n` +
        `Existe um conjunto de 12 canários novos que você **não vai ver**, escrito antes de você. ` +
        `Os P## e C## do \`CANARIOS.json\` você enxerga e pode usar — mas casá-los sem consertar a ` +
        `alocação aparece em uma linha do relatório do atacante.\n\n` +
        `\`npm run check:kb\`, \`npm run check:gate\` e \`npm run build\` verdes. Atualize ` +
        `\`research/kb/RECUPERACAO.md\`.`,
      { label: 'vagas', phase: 'Construir', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n${DIAGNOSTICO}\n\n` +
        `## SUA TAREFA: A DÍVIDA DE MUTAÇÃO — 26 DE 74 GAVETAS NÃO SÃO TESTADAS POR NADA\n\n` +
        `O ataque cego de ontem provou, contra o gate real: **trocar a lista \`entrada\` inteira de ` +
        `um tópico por 10 strings sem sentido deixa \`check:kb\` e \`check:gate\` VERDES em 26 dos ` +
        `74 tópicos.** Entre eles \`descanso-entre-series\` — **o caso cuja falha criou esta camada ` +
        `inteira** — e também \`genetica\`, \`cinto\`, \`sono\`, \`rpe\`, \`mobilidade\`, ` +
        `\`profundidade\`, \`training-max\`, \`recuperacao\`, \`terra\`, \`intensidade\`, ` +
        `\`comandos-ipf\`.\n\n` +
        `É o modo de falha nº 4 sobre 35 % do artefato que a onda passada produziu. Um vocabulário ` +
        `que ninguém testa apodrece em silêncio: o próximo agente edita, o build fica verde, e a ` +
        `recuperação piora sem que nada acuse.\n\n` +
        `### O que fazer\n\n` +
        `**Faça toda gaveta ser cobrada por alguma coisa.** O desenho é seu, mas cuidado com a ` +
        `saída fácil: exigir "todo termo de entrada tem de aparecer no texto das claims" ` +
        `**destruiria o artefato**, porque o valor dele está exatamente nos termos que a base NÃO ` +
        `diz — \`fisgada\` não existe em claim nenhuma, e é por isso que ela precisava entrar. Uma ` +
        `trava que force ancoragem literal empurra o dado para fora da trava, que é o modo de ` +
        `falha nº 2.\n\n` +
        `Pense no que de fato prova que o vocabulário de uma gaveta serve: que ele **roteia** para ` +
        `ela. Um termo de entrada que não faz nenhuma pergunta plausível cair naquela gaveta é ` +
        `decorativo, e isso é verificável sem modelo nenhum.\n\n` +
        `**Meça o resultado do jeito que o atacante mediu:** para cada um dos 74, substitua a ` +
        `lista \`entrada\` por lixo, regere o artefato, rode o gate, e exija VERMELHO. Reporte o ` +
        `número final — *"de 74 gavetas, N são cobradas"* — e **se sobrar gaveta descoberta, diga ` +
        `quais e por quê**, em vez de arredondar para cima. Uma dívida declarada é dado; uma ` +
        `dívida arredondada é o modo de falha nº 5.\n\n` +
        `### A segunda dívida, menor\n\n` +
        `**5 de 56 mutações de constante sobrevivem**, todas no sentido de AFROUXAR: ` +
        `\`DETALHE_ROTEADO 8→80\`, \`DIFERENCA_MAXIMA_GLOSSARIO 5→50\`, \`MIN_TERMOS 10→0\`, ` +
        `\`PESO_NOME_COMPOSTO 1.2→12\`, \`TETO_PARAM 12→120\`. O padrão é o diagnóstico: os testes ` +
        `só cobrem o lado que aperta. Cubra o lado que afrouxa.\n\n` +
        `### Fronteira de propriedade, e ela é rígida\n\n` +
        `Outro agente está trabalhando **na alocação de vagas dentro de ` +
        `\`research/tools/roteador.mjs\`** e vai mexer em \`ordenarNoTopico\`, em \`responder()\` e ` +
        `nas constantes de teto. **Você não edita \`roteador.mjs\` nem \`glossario.mjs\`.** Se uma ` +
        `constante deles precisa de canário, você escreve o canário no arquivo de teste ou de ` +
        `check — nunca mexendo na fonte. Seus arquivos são os de verificação: ` +
        `\`check-glossario.mjs\`, \`check-canarios.mjs\`, \`roteador.test.mjs\`, ` +
        `\`check-rotas.mjs\`, e o que você criar.\n\n` +
        `\`npm run check:kb\`, \`npm run check:gate\` e \`npm run build\` verdes ao sair.`,
      { label: 'travas', phase: 'Construir', effort: 'high' },
    ),
])

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['cegosPassaram', 'cegosTotal', 'publicosPassaram', 'publicosTotal', 'soterrados', 'gavetasCobertas', 'furos', 'veredito'],
  properties: {
    cegosPassaram: { type: 'number', description: 'dos 12 D##, quantos devolvem ALGUM id esperado — o número da onda' },
    cegosTotal: { type: 'number' },
    cegosCompletos: { type: 'number', description: 'dos 12 D##, quantos devolvem TODOS os ids esperados' },
    publicosPassaram: { type: 'number', description: 'dos 30 públicos (P01-P18 + C01-C12) juntos' },
    publicosTotal: { type: 'number' },
    soterrados: { type: 'number', description: 'dos 12 cegos, em quantos a gaveta certa abriu e a resposta nao chegou a tela — o defeito desta onda' },
    fisgadaCompleta: { type: 'boolean', description: 'as CINCO claims do limiar de dor chegam a tela sem --topic' },
    gavetasCobertas: { type: 'number', description: 'de 74, quantas ficam VERMELHAS ao ter a entrada trocada por lixo' },
    mutacoesSobreviventes: { type: 'number' },
    telaEstreita: { type: 'boolean', description: 'pergunta de resposta unica devolve poucos, nao 40' },
    decorou: { type: 'boolean' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito com o comando que reproduz' },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## VOCÊ JULGA O CONSERTO DA ALOCAÇÃO — E VOCÊ TEM O QUE ELE NÃO TEVE\n\n` +
    `Relato de quem mexeu nas vagas:\n\n${obras[0] ?? '(sem relato)'}\n\n` +
    `Relato de quem mexeu nas travas:\n\n${obras[1] ?? '(sem relato)'}\n\n` +
    `**Não acredite em nenhum dos dois.** Quatro ondas seguidas de relatório otimista: a última ` +
    `disse "2 das 5 chegam à tela" e a medição deu 1.\n\n` +
    `### O CONJUNTO DE TESTE — 12 canários que ninguém viu\n\n` +
    listaCega
      .map((c) => `**${c.id}**${c.gavetaPequena ? ' [gaveta pequena]' : ''} ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}`)
      .join('\n\n') +
    `\n\n### O que fazer, nesta ordem\n\n` +
    `**1. Rode os 12 cegos, a pergunta EXATAMENTE como escrita, sem \`--topic\`, sem ajustar ` +
    `termo.** Quantos devolvem algum id esperado numa posição em que alguém leria? Quantos ` +
    `devolvem TODOS? **Estes são os números da onda.** Diga por qual definição de tela você ` +
    `mediu — ontem havia duas (o \`telaDe()\` do \`check-canarios.mjs\` corta em 40, o CLI ` +
    `imprime 68) e a divergência produziu um erro de relatório.\n\n` +
    `**2. Separe soterramento de roteamento.** Para cada cego: a gaveta certa abriu? A resposta ` +
    `chegou? Gaveta aberta e resposta ausente é soterramento não consertado — **é o defeito que ` +
    `esta onda existiu para matar**, e o número tem de cair de 10.\n\n` +
    `**3. O caso da fisgada, verificado duas vezes.** \`--pergunta "fisgada de 3/10 no peitoral ` +
    `na terceira série de supino pausado, continuo?"\` **sem \`--topic\`**: chegam as CINCO ` +
    `(V079-34, V001-06, V138-19, V086-21, V027-23)? Em que posições? Se não chegam todas, a tela ` +
    `avisa que uma gaveta relevante ficou de fora?\n\n` +
    `**4. Precisão, que é o que se paga por alocação generosa.** Perguntas estreitas devolvem ` +
    `pouco, ou continuam devolvendo 40? Pergunta fora de domínio ainda diz que não sabe? E o ` +
    `topo da tela piorou — entrou lixo relevante-por-pouco empurrando claim boa para baixo? ` +
    `**Meça, não estime.**\n\n` +
    `**5. Remeça a dívida de mutação, do jeito que foi medida ontem:** para cada um dos 74 ` +
    `tópicos, troque a lista \`entrada\` por lixo, regere, rode o gate, conte quantos ficam ` +
    `VERMELHOS. Ontem eram 48 de 74. E remeça as 56 mutações de constante — sobrevivem quantas? ` +
    `Ataque especialmente o sentido de AFROUXAR, que é onde as 5 escaparam.\n\n` +
    `**6. Os 30 públicos (P01–P18, C01–C12).** Se eles subirem muito mais que os cegos, ` +
    `otimizou-se o visível. Diga a distância. E teste **paráfrase**: reescreva as que passam ` +
    `preservando o sentido — ontem só 2 de 8 sobreviveram.\n\n` +
    `Seja específico e sem diplomacia. Se o número cego continuar zero, **diga zero.**`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(
  `cegos: ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length} · ` +
    `soterrados: ${ataque?.soterrados ?? '?'} (era 10) · fisgada completa: ${ataque?.fisgadaCompleta ?? '?'} · ` +
    `gavetas cobertas: ${ataque?.gavetasCobertas ?? '?'}/74 (era 48)`,
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 2D — ALOCAÇÃO DE VAGAS\n\n` +
    `**Vagas:** ${obras[0] ?? '(sem relato)'}\n\n` +
    `**Travas:** ${obras[1] ?? '(sem relato)'}\n\n` +
    `**Ataque:** cegos ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? '?'} ` +
    `(completos ${ataque?.cegosCompletos ?? '?'}), soterrados ${ataque?.soterrados ?? '?'} (era 10), ` +
    `públicos ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? '?'}, ` +
    `fisgada completa=${ataque?.fisgadaCompleta ?? '?'}, tela estreita=${ataque?.telaEstreita ?? '?'}, ` +
    `gavetas cobertas ${ataque?.gavetasCobertas ?? '?'}/74 (era 48), ` +
    `mutações sobreviventes ${ataque?.mutacoesSobreviventes ?? '?'} (era 5), decorou=${ataque?.decorou ?? '?'}\n` +
    `${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.**\n\n` +
    `2. **Grave os 12 cegos em \`research/kb/CANARIOS.json\`** como D01–D12, **com o resultado ` +
    `medido pelo ataque, inclusive os que falham.** Eles são:\n\n` +
    `\`\`\`json\n${JSON.stringify(listaCega, null, 1).slice(0, 7000)}\n\`\`\`\n\n` +
    `3. **O veredito no topo do \`RECUPERACAO.md\`, com os três números** — cego, público, e ` +
    `soterrados — e a distância entre cego e público. Sem adjetivo.\n\n` +
    `4. **Atualize \`ESTADO.md\` e o \`RUNBOOK.md\` §8.** Divergências resolvidas saem, novas ` +
    `entram, **não resolvidas continuam na lista**.\n\n` +
    `5. **Atualize \`research/kb/ONDA-2C.md\`** — o item do soterramento sai ou muda conforme o ` +
    `número CEGO. **E responda por escrito, com o número, a pergunta que o atleta fez:** vale ` +
    `pagar uma frota de modelo barato para dar a cada uma das 6.912 claims uma linha de "que ` +
    `pergunta esta claim responde"? Se a alocação por gaveta resolveu, a resposta é não, e o ` +
    `dinheiro vai para outro lugar. Se sobrou soterramento DENTRO da gaveta certa, a resposta ` +
    `muda. **Diga qual é, com a medição na frente.**\n\n` +
    `6. **\`research/RETOMAR.md\`**: reescreva para o estado de agora, ou apague se tudo que ` +
    `importa já está no \`ONDA-2C.md\`.\n\n` +
    `**Não proponha ingerir mais corpus.** Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  cegos: `${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length}`,
  cegosCompletos: ataque?.cegosCompletos,
  soterrados: ataque?.soterrados,
  fisgadaCompleta: ataque?.fisgadaCompleta,
  publicos: `${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? 30}`,
  gavetasCobertas: ataque?.gavetasCobertas,
  mutacoesSobreviventes: ataque?.mutacoesSobreviventes,
  decorou: ataque?.decorou,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
