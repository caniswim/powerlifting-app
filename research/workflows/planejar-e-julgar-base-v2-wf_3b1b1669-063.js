export const meta = {
  name: 'planejar-e-julgar-base-v2',
  description: 'Define o que a base precisa responder, mede com julgamento independente e canários, e só então decide o que construir',
  phases: [
    { title: 'Enquadrar', detail: '4 enquadramentos independentes do que a base precisa fazer' },
    { title: 'Julgar plano', detail: 'painel critica e sintetiza num conjunto de avaliação' },
    { title: 'Medir', detail: 'responder só com a base; um julgador independente confere a evidência' },
    { title: 'Diagnosticar', detail: 'cada falha: falta conteúdo, está errado, ou não é recuperável?' },
    { title: 'Decidir', detail: 'o que é determinístico, o que é agente, o que exige fonte nova' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'
const BASELINE = '55f6807'

const ATLETA = `
O ATLETA. Homem, 28 anos, brasileiro, 87 kg, ~15% de gordura corporal (≈74 kg de massa magra),
powerlifter NATURAL. Pela regra da IPF é classe 93 kg (83,01–93,00) com folga; consegue chegar
a 83 kg sem sofrimento, mas o corte é discutível. Treina há anos, 5 dias por semana, 75–100 min
por sessão. Marcas DE TREINO, nunca sob comando de árbitro: agacho 250 kg, supino 170 kg, terra
sumo 268 kg (segurou 260 por 5 s no lockout). Total declarado 688 kg; descontado para padrão de
competição, estimados ~648 kg. Está mudando a técnica de agachamento. Nunca competiu.

O OBJETIVO DECLARADO: recorde mundial. Também se importa com estética — powerbuilding, com peso
~80/20 para força.

A REALIDADE MEDIDA (levantada e verificada, em research/kb/IPF-REALIDADE.md e ANTIDOPING-BR.md):
- Recorde mundial IPF clássico open 93 kg: total 927,5 kg (William Ball, 2026). Ele está a ~240 kg.
- Pódio do Campeonato Brasileiro 2025: 775 / 757,5 / 745 kg. Ele está a ~57 kg do terceiro lugar.
- 650 kg na 93 kg já é percentil 87 da CBLB. O campo cresceu 12x desde 2021.
- Gargalo real dos 12 meses é federativo, não físico: o Brasileiro exige ter competido um estadual
  no ano anterior, o que empurra um estadual para out/nov de 2026.
- Antidoping doméstico é praticamente inexistente (7 amostras de powerlifting no Brasil em 3 anos),
  MAS os dados do OpenPowerlifting mostram mediana idêntica entre meets testados e não testados na
  faixa 74–93 kg — a diferença só aparece no p99. A IPF internacional testa de verdade.
- A pesagem da IPF é até 2 h antes, não 24 h.
`

const BASE_FATOS = `
A BASE. \`research/extract/*.jsonl\`, 5.090 claims atômicas verificadas mecanicamente, no commit
${BASELINE}:
- 4.947 de 180 vídeos do canal Matt Vena (2015–2026, refs R001–R196), 197 mil palavras de transcrição
- 143 do IPF Technical Rulebook 2026 v3 (ref F001)
Cada claim: id, src, at (timestamp ou parágrafo §), tier de procedência (R corpus / O normativo /
E elite / L literatura / I interpretação / U usuário), scope (GERAL = ele prescreve para você /
PESSOAL = ele descreve o que faz), certainty, topic[] de vocabulário fechado, claim em português,
verbatim literal em inglês, params[] com unit e frame tipados.

DOCUMENTOS em \`research/kb/\`: SCHEMA.md, PROTOCOLO-EXTRACAO.md, IPF-REALIDADE.md, IPF-CHECKLIST.md
(comandos e critérios de anulação, com como aferir profundidade sozinho), ANTIDOPING-BR.md,
ROSTER-CURADO.md, FONTES-ADICIONAIS.md, AUDITORIA-FIDELIDADE.md, AUDITORIA-SCOPE.md,
PADROES-EXTERNOS.md. \`research/RUNBOOK.md\` mapeia o sistema. \`research/design.md\` é o contrato
do bloco de treino atual e \`research/baseline.md\` os números de partida.

FERRAMENTA DE CONSULTA — use, não improvise regex a esmo:
  node research/tools/check-evidence.mjs V014-03 V052-11     # resolve ids; diz se são fabricados
  node research/tools/check-evidence.mjs --grep "training max" --limit 20
  node research/tools/check-evidence.mjs --topic profundidade --scope GERAL
`

const FRAGILIDADES = `
O QUE JÁ SE SABE DE FRÁGIL (levantado por auditorias anteriores):
- A fonte principal é UM homem que agacha 400 kg, pesa ~120 kg e NÃO compete testado. A base é
  fiel a ele; ninguém verificou se ele está certo, nem se transfere para um natural de 87 kg.
- Só 17% do que está marcado scope:GERAL é prescrição de verdade; o resto é opinião, mecanismo,
  fato ou narração de estudo. O campo 'modo' existe no esquema e ainda não foi preenchido.
- Prescrição e a condição que a torna segura ficaram em registros separados: "supino 6x/semana"
  existe sem "nunca acima de RPE 5", que ele diz junto.
- Apenas 3 arestas de contradição registradas em 5.090 claims, contra 25 catalogadas na rodada
  anterior. Subregistro grosseiro.
- Não existe camada de síntese nem índice de recuperação. A base é consultável por grep.
- Corpus de Garrett Blevins (competidor IPF testado) está sendo transcrito NESTE MOMENTO, em
  paralelo; ainda não tem nenhuma claim extraída. Literatura (tier L) e elites (tier E) também
  não têm nenhuma claim.
`

// Planejamento e diagnóstico VEEM as fragilidades: são hipóteses de trabalho.
// A MEDIÇÃO não vê. Entregar ao medidor a lista de onde esperar falha é dizer a
// resposta antes da prova — ele confirma a hipótese e eu leio como descoberta.
const CTX_PLANEJAR = `REPO: ${REPO}\n${ATLETA}\n${BASE_FATOS}\n${FRAGILIDADES}`
const CTX_MEDIR = `REPO: ${REPO}\n${ATLETA}\n${BASE_FATOS}`

const SCRATCH = (k) => `research/tools/scan/${k}/`

// ─────────────────────────────────────────────────────────────────────────────
phase('Enquadrar')

const ENQUADRAMENTO_SCHEMA = {
  type: 'object',
  required: ['tese', 'perguntas', 'criterioSucesso', 'riscoDeConstruirErrado'],
  properties: {
    tese: { type: 'string', description: 'em 3-5 frases: para que esta base serve, sob o seu enquadramento' },
    perguntas: {
      type: 'array',
      description: '15 a 25 perguntas concretas que a base PRECISA responder bem. Perguntas de verdade, na voz do atleta, não categorias.',
      items: {
        type: 'object',
        required: ['pergunta', 'porque', 'oQueUmaBoaRespostaTem', 'consequenciaDeErrar', 'horizonte'],
        properties: {
          pergunta: { type: 'string' },
          porque: { type: 'string', description: 'por que esta pergunta importa para ESTE atleta, agora' },
          oQueUmaBoaRespostaTem: { type: 'string', description: 'que evidência e que forma a resposta precisa ter para ser útil' },
          consequenciaDeErrar: { type: 'string', enum: ['catastrofica', 'grave', 'moderada', 'leve'] },
          horizonte: { type: 'string', enum: ['proxima-sessao', 'proximo-bloco', 'proximo-ano', 'multi-ano'] },
        },
      },
    },
    criterioSucesso: { type: 'string', description: 'como se mede, objetivamente, que a base está pronta sob este enquadramento' },
    riscoDeConstruirErrado: { type: 'string', description: 'o jeito mais provável de esta base ficar impecável e inútil' },
  },
}

const ENQUADRAMENTOS = [
  {
    key: 'decisao',
    prompt: `ENQUADRAMENTO A — A BASE COMO MOTOR DE DECISÃO SEMANAL.

Parta da premissa de que o valor da base não está no que ela sabe, e sim nas DECISÕES que ela
melhora. O atleta vai conversar com ela toda semana com dados de treino em mãos. Enumere as
decisões reais que ele terá de tomar — subir carga ou segurar, trocar exercício, cortar volume,
mudar técnica, adiar competição, quando insistir e quando abortar — e derive daí o que a base
precisa conter.

Pense especialmente no que quase toda base de treino não tem: os critérios de PARADA e de
REVISÃO. "Como eu sei que este bloco NÃO está funcionando, antes de perder 18 semanas?" é a
pergunta que separa base útil de enciclopédia. Uma base que só sabe prescrever e nunca sabe
dizer "isto não está indo, mude" é um risco, não um ativo.`,
  },
  {
    key: 'transferencia',
    prompt: `ENQUADRAMENTO B — A BASE COMO FILTRO DE TRANSFERÊNCIA.

Parta do problema central e desconfortável: a fonte principal é um homem de ~120 kg que agacha
400 kg e não compete testado, e o consumidor é um natural de 87 kg que nunca competiu. Boa parte
do que funciona para o primeiro é inaplicável, inútil ou perigoso para o segundo.

Derive o que a base precisa para ser um FILTRO e não um megafone. Que perguntas ela tem de
responder sobre transferibilidade? Como distinguir o que é princípio geral do que é adaptação de
outlier? O que muda quando o atleta é natural — velocidade de recuperação, teto de volume
tolerável, taxa de progresso realista, resposta a frequência?

Considere também o oposto, e seja honesto: existe o risco de descartar coisa boa por preconceito
de "ele é enhanced". Que perguntas separam essas duas situações?`,
  },
  {
    key: 'trajetoria',
    prompt: `ENQUADRAMENTO C — A BASE COMO PLANO DE MÚLTIPLOS ANOS.

Parta dos números duros: ele está a ~240 kg do recorde mundial e a ~57 kg do pódio nacional. Isso
não é um projeto de 12 meses; é de muitos anos, e pode não ser alcançável. Uma base honesta tem
de saber tratar disso.

Derive o que ela precisa conter para orientar uma TRAJETÓRIA, não um bloco: taxa de progresso
realista para um natural treinado nesta faixa (existe dado sobre isso?), quanto vem de massa magra
nova versus técnica versus especificidade competitiva, quando faz sentido priorizar hipertrofia
sobre força, quanto tempo leva cada patamar, e — o mais difícil — quais sinais indicariam que o
objetivo precisa ser revisado.

Trate explicitamente a tensão entre o objetivo de recorde e o desejo de estética, e a decisão de
categoria (83 vs 93 kg) como decisão de trajetória, não de mês.`,
  },
  {
    key: 'ceticismo',
    prompt: `ENQUADRAMENTO D — A BASE COMO INSTRUMENTO DE CETICISMO.

Você é o mais adversarial dos quatro. Sua tese de partida: uma base de conhecimento construída a
partir de UM criador de conteúdo do YouTube é, por construção, um amplificador de vieses — e todo
o rigor de citação e verbatim do mundo não conserta isso, porque garante fidelidade à fonte e não
correção da fonte.

Derive o que a base precisa para se autocriticar. Que perguntas revelariam que ela está errada?
Onde as afirmações do corpus contradizem a literatura científica, ou a prática de competidores
testados? Quais afirmações são falseáveis com os dados de treino que este atleta vai gerar nos
próximos meses, e como registrar essa previsão ANTES de os dados chegarem?

Enumere também os pontos cegos estruturais: assuntos que nenhum canal de YouTube de powerlifting
cobre bem, e que este atleta vai precisar (regras de competição já entraram; o que mais?).

Não seja contrarian de graça: aponte também onde o rigor já construído é suficiente e mais
verificação seria desperdício.`,
  },
]

const enquadramentos = await parallel(
  ENQUADRAMENTOS.map((e) => () =>
    agent(
      `${CTX_PLANEJAR}\n\n${e.prompt}\n\n` +
        `MÉTODO. Leia o repositório de verdade antes de opinar — pelo menos \`research/RUNBOOK.md\`, ` +
        `\`research/kb/SCHEMA.md\`, \`research/design.md\` e dois ou três dos documentos de apoio ` +
        `pertinentes ao seu enquadramento. Amostre claims reais com \`check-evidence.mjs\` para saber ` +
        `do que a base é feita; não leia as 5.090.\n\n` +
        `AS PERGUNTAS SÃO O PRODUTO. Elas vão virar o conjunto de avaliação com que a base será medida, ` +
        `então precisam ser perguntas de verdade, na voz dele, do jeito que ele perguntaria numa ` +
        `conversa de domingo à noite — não títulos de capítulo. "Devo trocar sumo por convencional?" ` +
        `é pergunta. "Seleção de exercício" não é.\n\n` +
        `Cubra horizontes diferentes: coisas que decidem a próxima sessão e coisas que decidem os ` +
        `próximos cinco anos. E inclua pelo menos três perguntas cuja resposta errada seria ` +
        `CATASTRÓFICA — lesão, ou anos gastos na direção errada.\n\n` +
        `NÃO edite nada além de scripts descartáveis em \`${SCRATCH(e.key)}\` — este diretório é seu, ` +
        `e outros três agentes estão trabalhando ao mesmo tempo. NÃO use git. Português do Brasil.`,
      { label: `enquadrar:${e.key}`, phase: 'Enquadrar', schema: ENQUADRAMENTO_SCHEMA },
    ),
  ),
)

const vivos = enquadramentos.filter(Boolean)
if (vivos.length < 2) throw new Error(`só ${vivos.length} enquadramento(s) sobreviveram — sem base para sintetizar um conjunto de avaliação`)
log(`${vivos.length}/4 enquadramentos, ${vivos.reduce((n, e) => n + (e.perguntas?.length ?? 0), 0)} perguntas propostas`)

const dossieEnq = vivos
  .map(
    (e, i) =>
      `## ENQUADRAMENTO ${ENQUADRAMENTOS[i]?.key ?? i}\n**Tese:** ${e.tese}\n` +
      `**Critério de sucesso:** ${e.criterioSucesso}\n` +
      `**Risco de construir errado:** ${e.riscoDeConstruirErrado}\n\n` +
      (e.perguntas ?? [])
        .map((p) => `- [${p.consequenciaDeErrar}/${p.horizonte}] ${p.pergunta}\n    porquê: ${p.porque}\n    boa resposta: ${p.oQueUmaBoaRespostaTem}`)
        .join('\n'),
  )
  .join('\n\n')

// ─────────────────────────────────────────────────────────────────────────────
phase('Julgar plano')

const criticas = await parallel([
  () =>
    agent(
      `${CTX_PLANEJAR}\n\nQuatro agentes enquadraram, de forma independente, o que esta base precisa ` +
        `saber fazer:\n\n${dossieEnq}\n\n` +
        `VOCÊ É O CRÍTICO. Seu trabalho NÃO é escolher o melhor — é achar o que os quatro erraram JUNTOS.\n\n` +
        `Enquadramentos independentes convergem em pontos cegos comuns porque partilham as mesmas ` +
        `premissas de partida. Procure: o que nenhum deles perguntou? Que premissa todos aceitaram sem ` +
        `discutir? Há pergunta na lista que parece importante e na verdade não muda decisão nenhuma? ` +
        `Há pergunta cuja resposta o atleta já tem, ou que só ele pode responder e nenhuma base pode?\n\n` +
        `Ataque especialmente a premissa de que uma base de conhecimento é o instrumento certo para ` +
        `este problema. Se a resposta para "como levo um natural de 87 kg a um recorde" for ` +
        `majoritariamente "consistência por anos, comer, dormir e não se machucar", então uma base de ` +
        `5.000 claims pode ser sofisticação no lugar errado. Diga isso se for o caso, com argumento.\n\n` +
        `Entregue: os pontos cegos comuns, as perguntas que devem ser CORTADAS e por quê, e as que ` +
        `faltam. Português do Brasil, denso, sem diplomacia. NÃO use git.`,
      { label: 'critico', phase: 'Julgar plano' },
    ),
  () =>
    agent(
      `${CTX_PLANEJAR}\n\nQuatro agentes enquadraram o que esta base precisa saber fazer:\n\n${dossieEnq}\n\n` +
        `VOCÊ É O REALISTA DE EXECUÇÃO. Julgue cada pergunta proposta por um critério só: **a base pode ` +
        `responder isso a partir do material que existe ou é obtenível?**\n\n` +
        `Classifique cada uma: (a) respondível hoje com o corpus atual; (b) respondível com fonte que ` +
        `já sabemos existir e conseguimos ingerir (regulamento IPF já entrou; corpus de Garrett Blevins, ` +
        `competidor IPF testado, está sendo transcrito; literatura via PubMed; dados abertos do ` +
        `OpenPowerlifting); (c) respondível só com dados que o próprio atleta vai gerar treinando; ` +
        `(d) não respondível por ninguém no estado atual do conhecimento — e há muito disso em ciência ` +
        `do treinamento, então não force.\n\n` +
        `Para (b), diga QUAL fonte e estime o custo. Para (d), diga o que a base deve fazer no lugar de ` +
        `responder: registrar a incerteza é uma resposta legítima e muito melhor do que inventar.\n\n` +
        `Ataque também o inverso: alguma pergunta é fácil demais? Se a resposta cabe em duas linhas e ` +
        `todo mundo já sabe, ela não deveria ocupar espaço num conjunto de avaliação.\n\n` +
        `Português do Brasil, orientado a viabilidade e custo. NÃO use git.`,
      { label: 'realista', phase: 'Julgar plano' },
    ),
])

const AVAL_SCHEMA = {
  type: 'object',
  required: ['perguntas', 'principios', 'oQueNaoVamosFazer'],
  properties: {
    perguntas: {
      type: 'array',
      description: '20 a 30 perguntas finais, priorizadas, que formam o conjunto de avaliação da base',
      items: {
        type: 'object',
        required: ['id', 'pergunta', 'criterio', 'severidade', 'fonteEsperada'],
        properties: {
          id: { type: 'string', description: 'Q01, Q02, …' },
          pergunta: { type: 'string' },
          criterio: { type: 'string', description: 'o que uma resposta APROVADA precisa conter — evidência, ressalva, número, condição' },
          severidade: { type: 'string', enum: ['catastrofica', 'grave', 'moderada', 'leve'] },
          horizonte: { type: 'string' },
          fonteEsperada: { type: 'string', description: 'de onde a resposta deve vir: corpus, regulamento, literatura, elites, dados do atleta, ou combinação' },
        },
      },
    },
    principios: { type: 'array', items: { type: 'string' }, description: 'as regras de projeto que saem deste planejamento e devem governar o que for construído depois' },
    oQueNaoVamosFazer: { type: 'array', items: { type: 'string' }, description: 'o que foi deliberadamente cortado, com a razão — tão importante quanto o que entra' },
  },
}

const plano = await agent(
  `${CTX_PLANEJAR}\n\nQuatro enquadramentos independentes:\n\n${dossieEnq}\n\n` +
    `Crítica dos pontos cegos comuns:\n\n${criticas[0] ?? '(indisponível)'}\n\n` +
    `Julgamento de viabilidade:\n\n${criticas[1] ?? '(indisponível)'}\n\n` +
    `VOCÊ SINTETIZA. Produza \`research/kb/AVALIACAO.md\`: o conjunto de avaliação com que esta base ` +
    `será medida daqui para frente.\n\n` +
    `Não é média dos quatro. É seleção com critério, declarado. Onde os enquadramentos discordarem, ` +
    `escolha e diga por quê — e onde a discordância for irredutível, registre as duas posições em vez ` +
    `de fingir consenso.\n\n` +
    `O conjunto tem que ser EXECUTÁVEL: outro agente vai pegar cada pergunta, tentar respondê-la só ` +
    `com a base, e um terceiro vai julgar contra o seu critério. Então o critério de aprovação precisa ` +
    `ser específico o bastante para não virar opinião — "cita evidência" é fraco; "cita ao menos uma ` +
    `claim de tier R com o scope correto, mais a condição que a limita, e registra explicitamente se a ` +
    `fonte é um atleta não testado" é utilizável.\n\n` +
    `O critério tem de ser verificável por quem NÃO viu a resposta ser produzida, e citando ids de ` +
    `claim que resolvem em \`check-evidence.mjs\`. Critério que só o autor sabe aplicar não mede nada.\n\n` +
    `A seção **oQueNaoVamosFazer** é obrigatória e importa tanto quanto as perguntas: verificação sem ` +
    `escopo declarado cresce até consumir tudo, e o objetivo aqui não é uma base perfeita, é um atleta ` +
    `mais forte.\n\n` +
    `Escreva o arquivo E devolva o objeto estruturado. Português do Brasil. NÃO use git.`,
  { label: 'sintetizar-plano', phase: 'Julgar plano', schema: AVAL_SCHEMA },
)

// Sem conjunto de avaliação não há medição, e um veredito construído sobre zero
// medições é pior do que nenhum veredito: ele tem a forma de uma conclusão.
if (!plano?.perguntas?.length) {
  throw new Error('o sintetizador não devolveu conjunto de avaliação — abortando antes de fabricar um diagnóstico sobre nada')
}
log(`conjunto de avaliação: ${plano.perguntas.length} perguntas`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Medir')

/**
 * CANÁRIOS. Sem controle, um lote que reprova tudo é ambíguo: ou a base é ruim,
 * ou o avaliador grepou mal. Duas perguntas cuja resposta EU SEI estar na base e
 * duas cuja resposta EU SEI não estar entram misturadas, sem etiqueta. Se um
 * canário-presente reprova, o instrumento está quebrado e a medição não vale. Se
 * um canário-ausente é APROVADO, aconteceu a falha que destrói tudo: o agente
 * respondeu do próprio conhecimento em vez da base — e aí todo "responde-bem"
 * do relatório fica sob suspeita.
 */
const CANARIOS = [
  {
    id: 'C1',
    esperado: 'responde-bem',
    porque: 'o IPF Technical Rulebook 2026 está na base como F001 com 143 claims, e a profundidade é um dos critérios que ele define',
    pergunta: 'Qual é exatamente o critério de profundidade do agachamento segundo a regra da IPF, e como eu confiro isso sozinho filmando de casa?',
    criterio: 'cita claim de tier O (regulamento, ref F001) com o parágrafo, e descreve o critério como relação entre pontos anatômicos — não como "paralelo"',
    severidade: 'grave',
    fonteEsperada: 'regulamento',
  },
  {
    id: 'C2',
    esperado: 'responde-bem',
    porque: 'training max é conceito recorrente no corpus do Vena, com claims explícitas',
    pergunta: 'O que é training max e por que eu treinaria abaixo do meu pico absoluto em vez de usar o 1RM de verdade?',
    criterio: 'cita ao menos uma claim de tier R que resolve, com scope declarado, e distingue 1RM de treino de 1RM legal',
    severidade: 'moderada',
    fonteEsperada: 'corpus',
  },
  {
    id: 'C3',
    esperado: 'nao-responde',
    porque: 'a base tem ZERO claims de tier L — nenhuma literatura foi ingerida ainda. Qualquer resposta com PMID veio do agente, não da base',
    pergunta: 'O que os estudos revisados por pares mostram sobre a frequência semanal ótima de agachamento para atletas naturais treinados? Cite os PMIDs.',
    criterio: 'a base não contém literatura indexada; a única resposta aprovável é declarar a ausência',
    severidade: 'grave',
    fonteEsperada: 'literatura',
  },
  {
    id: 'C4',
    esperado: 'nao-responde',
    porque: 'o corpus do Blevins está sendo transcrito e ainda não tem uma única claim extraída',
    pergunta: 'Como o Garrett Blevins estrutura o peaking dele para uma competição da IPF, semana a semana?',
    criterio: 'nenhuma claim do corpus Blevins existe ainda; a única resposta aprovável é declarar a ausência',
    severidade: 'moderada',
    fonteEsperada: 'elites',
  },
]

const todas = [...CANARIOS, ...plano.perguntas]
const porQ = new Map(todas.map((q) => [q.id, q]))
const N_LOTES = 4
const LOTES = [...Array(N_LOTES).keys()].map((i) => todas.filter((_, j) => j % N_LOTES === i)).filter((l) => l.length > 0)

const RESPOSTA_SCHEMA = {
  type: 'object',
  required: ['respostas'],
  properties: {
    respostas: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'resposta', 'evidenciaIds', 'caminho', 'lacunaPercebida', 'perigo'],
        properties: {
          id: { type: 'string' },
          resposta: { type: 'string', description: 'a resposta que a base sustenta hoje. Se a base não sustenta nada, escreva exatamente: A BASE NÃO RESPONDE.' },
          evidenciaIds: { type: 'array', items: { type: 'string' }, description: 'ids de claim (V014-03) que sustentam a resposta. Serão conferidos um a um por outro agente. Id que não resolve é evidência fabricada.' },
          evidenciaOutra: { type: 'string', description: 'evidência que não é claim: arquivo e trecho de research/kb/ ou research/*.md' },
          caminho: { type: 'string', description: 'como você procurou: quais termos, em que línguas, quais tópicos, quantas tentativas' },
          lacunaPercebida: { type: 'string', enum: ['nenhuma', 'conteudo-ausente', 'conteudo-errado', 'nao-encontravel'] },
          perigo: { type: 'string', description: 'o que a base responderia aqui que seria nocivo a um natural de 87 kg. Se nada, escreva exatamente: nenhum.' },
        },
      },
    },
  },
}

const JULGAMENTO_SCHEMA = {
  type: 'object',
  required: ['julgamentos'],
  properties: {
    julgamentos: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'veredito', 'evidenciaConfere', 'justificativa', 'lacuna', 'perigo'],
        properties: {
          id: { type: 'string' },
          veredito: { type: 'string', enum: ['responde-bem', 'responde-parcial', 'responde-mal', 'nao-responde', 'responde-errado'] },
          evidenciaConfere: { type: 'string', enum: ['todos-resolvem', 'alguns-nao-resolvem', 'nenhum-id-citado', 'ids-fabricados'] },
          idsQueNaoResolvem: { type: 'array', items: { type: 'string' } },
          respondeuDeFora: { type: 'boolean', description: 'true se a resposta contém afirmação que a base não sustenta e o agente tirou do próprio conhecimento' },
          justificativa: { type: 'string' },
          lacuna: { type: 'string', enum: ['nenhuma', 'conteudo-ausente', 'conteudo-errado', 'nao-encontravel'] },
          perigo: { type: 'string', description: 'perigo confirmado por você, não copiado. Se nenhum, escreva: nenhum.' },
        },
      },
    },
  },
}

const medicoes = await pipeline(
  LOTES,
  (lote, _orig, i) =>
    agent(
      `${CTX_MEDIR}\n\n` +
        `Um conjunto de avaliação foi definido para esta base (o arquivo está em ` +
        `\`research/kb/AVALIACAO.md\`). Você recebeu estas perguntas:\n\n` +
        lote.map((q) => `**${q.id}** [${q.severidade}] ${q.pergunta}\n   critério de aprovação: ${q.criterio}\n   fonte esperada: ${q.fonteEsperada}`).join('\n\n') +
        `\n\nSEU TRABALHO: para cada pergunta, responda **usando apenas a base**, do jeito que um agente ` +
        `de conversa faria — \`check-evidence.mjs\` com \`--grep\`, \`--topic\`, \`--scope\`, leitura dos ` +
        `documentos de \`research/kb/\`, e as transcrições em \`research/corpus/transcripts/\` quando ` +
        `precisar de contexto.\n\n` +
        `VOCÊ NÃO JULGA A PRÓPRIA RESPOSTA. Outro agente, que não viu você trabalhar, vai julgar contra ` +
        `o critério e vai RODAR \`check-evidence.mjs\` em cada id que você citar. Id que não resolve é ` +
        `evidência fabricada e derruba a resposta inteira. Então cite só o que você abriu.\n\n` +
        `ISTO É UM TESTE DA BASE, NÃO DE VOCÊ. Não complete lacuna com o que você sabe de powerlifting. ` +
        `Se a base não sustenta, escreva "A BASE NÃO RESPONDE" e isso é um resultado valioso, não uma ` +
        `derrota sua. Preencher buraco com conhecimento próprio destrói a medição inteira: a base ` +
        `pareceria funcionar e não funcionaria na conversa real. Há perguntas neste lote cuja resposta ` +
        `certa é exatamente essa.\n\n` +
        `Antes de declarar ausência, esgote vocabulário: português, inglês, o termo técnico, a gíria de ` +
        `academia, o jeito que o canal fala. No mínimo três tentativas diferentes, e registre-as em ` +
        `\`caminho\` — é por ali que se distingue "ninguém disse" de "está lá e não achei", que exigem ` +
        `consertos opostos.\n\n` +
        `E preencha **perigo** com atenção: esta pergunta tem resposta na base que seria ativamente ` +
        `nociva para um natural de 87 kg? Prescrição de outlier sem ressalva, volume insustentável, ` +
        `conselho que ignora regra de competição? Este campo vale mais que todo o resto.\n\n` +
        `Scripts descartáveis só em \`${SCRATCH(`medir${i + 1}`)}\`. NÃO edite a base. NÃO use git.`,
      { label: `responder:lote${i + 1}`, phase: 'Medir', schema: RESPOSTA_SCHEMA },
    ),
  (resp, lote, i) => {
    const rs = resp?.respostas ?? []
    if (rs.length === 0) return null
    return agent(
      `${CTX_MEDIR}\n\n` +
        `VOCÊ É O JULGADOR. Outro agente tentou responder estas perguntas usando só a base. Você não o ` +
        `viu trabalhar e não deve ceder ao esforço dele: julgue a resposta, não a dedicação.\n\n` +
        rs
          .map((r) => {
            const q = porQ.get(r.id)
            return (
              `### ${r.id} — ${q?.pergunta ?? '(pergunta não encontrada)'}\n` +
              `**Critério de aprovação:** ${q?.criterio ?? '—'}\n` +
              `**Fonte esperada:** ${q?.fonteEsperada ?? '—'}\n` +
              `**Resposta dada:** ${r.resposta}\n` +
              `**Ids citados:** ${(r.evidenciaIds ?? []).join(' ') || '(nenhum)'}\n` +
              `**Outra evidência:** ${r.evidenciaOutra ?? '—'}\n` +
              `**Caminho de busca declarado:** ${r.caminho}\n` +
              `**Lacuna que ele percebeu:** ${r.lacunaPercebida}\n` +
              `**Perigo que ele apontou:** ${r.perigo}`
            )
          })
          .join('\n\n') +
        `\n\nPROCEDIMENTO, nesta ordem:\n\n` +
        `1. **Confira a evidência mecanicamente.** Rode ` +
        `\`node research/tools/check-evidence.mjs <todos os ids da pergunta>\`. Cada id ou resolve para ` +
        `uma claim de verdade ou é fabricado. Leia as claims que resolvem: elas dizem mesmo o que a ` +
        `resposta afirma? Uma claim que resolve mas não sustenta a afirmação é tão ruim quanto um id ` +
        `inventado, e mais difícil de ver.\n` +
        `2. **Procure resposta de fora.** A resposta contém afirmação — número, prescrição, mecanismo — ` +
        `que a base não sustenta e que só pode ter vindo do conhecimento próprio do agente? Isso é o ` +
        `defeito mais grave possível aqui, porque falsifica a medição. Marque \`respondeuDeFora\`.\n` +
        `3. **Julgue contra o critério**, não contra o que você acha da pergunta.\n` +
        `4. **Se ele declarou ausência, desconfie.** Repita a busca você mesmo com pelo menos dois ` +
        `vocabulários que ele não tentou. Informação que está na base e não foi achada é ` +
        `\`nao-encontravel\` — conserto barato, de índice — e é a falha mais fácil de confundir com ` +
        `\`conteudo-ausente\`, que exige fonte nova. Errar essa classificação manda a próxima fase ` +
        `construir a coisa errada.\n` +
        `5. **Confirme ou derrube o perigo.** Não copie o campo dele: abra as claims. Alarme falso ` +
        `custa caro, manda gente reescrever o que estava certo.\n\n` +
        `Reprove sem constrangimento. Um julgador generoso produz um relatório bonito e uma base que ` +
        `falha na primeira conversa de verdade.\n\n` +
        `Scripts descartáveis só em \`${SCRATCH(`julgar${i + 1}`)}\`. NÃO edite a base. NÃO use git.`,
      { label: `julgar:lote${i + 1}`, phase: 'Medir', schema: JULGAMENTO_SCHEMA },
    ).then((j) => ({ respostas: rs, julgamentos: j?.julgamentos ?? [] }))
  },
)

const resp = medicoes.filter(Boolean).flatMap((m) => m.respostas)
const julg = medicoes.filter(Boolean).flatMap((m) => m.julgamentos)
const porResp = new Map(resp.map((r) => [r.id, r]))
const porJulg = new Map(julg.map((j) => [j.id, j]))

// Calibração antes de qualquer conclusão: o instrumento mediu, ou mediu a si mesmo?
const canarios = CANARIOS.map((c) => {
  const j = porJulg.get(c.id)
  const bateu = c.esperado === 'responde-bem' ? j?.veredito === 'responde-bem' : j?.veredito === 'nao-responde'
  return { ...c, obtido: j?.veredito ?? '(não avaliado)', bateu, deFora: j?.respondeuDeFora === true }
})
const canariosOk = canarios.filter((c) => c.bateu).length
const vazamento = canarios.filter((c) => c.esperado === 'nao-responde' && !c.bateu)
log(`canários: ${canariosOk}/${CANARIOS.length} bateram. ${vazamento.length > 0 ? `VAZAMENTO em ${vazamento.map((c) => c.id).join(', ')} — resposta veio de fora da base` : 'sem vazamento detectado'}`)

const reais = julg.filter((j) => !CANARIOS.some((c) => c.id === j.id))
const reprovadas = reais.filter((j) => j.veredito !== 'responde-bem')
const fabricadas = reais.filter((j) => j.evidenciaConfere === 'ids-fabricados' || j.evidenciaConfere === 'alguns-nao-resolvem')
const deFora = reais.filter((j) => j.respondeuDeFora)
log(`${reais.length} perguntas medidas · ${reprovadas.length} abaixo de "responde bem" · ${fabricadas.length} com evidência que não resolve · ${deFora.length} respondidas de fora da base`)

const CALIBRACAO =
  `CALIBRAÇÃO DO INSTRUMENTO. Quatro perguntas-canário entraram misturadas às reais, sem etiqueta.\n` +
  canarios
    .map((c) => `- ${c.id} esperado=${c.esperado} obtido=${c.obtido} ${c.bateu ? 'OK' : '⚠️ DIVERGIU'} — ${c.porque}`)
    .join('\n') +
  (vazamento.length > 0
    ? `\n\n⚠️ ATENÇÃO: ${vazamento.map((c) => c.id).join(', ')} deveria(m) ser impossível(is) de responder pela base e ` +
      `foi(ram) aprovado(s). Isso significa que o avaliador respondeu do próprio conhecimento — e portanto ` +
      `TODO veredito "responde-bem" deste relatório está sob suspeita. Trate os números abaixo como teto ` +
      `otimista, não como medida.`
    : `\n\nNenhum canário-ausente foi aprovado: não há evidência de que os avaliadores tenham preenchido ` +
      `lacunas com conhecimento próprio. A medição pode ser lida de frente.`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Diagnosticar')

// O dossiê carrega a PERGUNTA e a SEVERIDADE, não só o id: pedir a um agente que
// "priorize por consequência" sem lhe dar a consequência é pedir chute.
const dossieFalhas = reprovadas
  .map((j) => {
    const q = porQ.get(j.id)
    const r = porResp.get(j.id)
    return (
      `### ${j.id} [severidade: ${q?.severidade ?? '?'}] [veredito: ${j.veredito}] [lacuna: ${j.lacuna}]\n` +
      `**Pergunta:** ${q?.pergunta ?? '(não encontrada)'}\n` +
      `**Critério que ela deveria cumprir:** ${q?.criterio ?? '—'}\n` +
      `**O que a base respondeu:** ${r?.resposta ?? '—'}\n` +
      `**Evidência:** ${(r?.evidenciaIds ?? []).join(' ') || '(nenhuma)'} — conferência: ${j.evidenciaConfere}` +
      (j.idsQueNaoResolvem?.length ? ` (não resolvem: ${j.idsQueNaoResolvem.join(' ')})` : '') +
      `\n**Busca tentada:** ${r?.caminho ?? '—'}\n` +
      `**Julgamento:** ${j.justificativa}\n` +
      `**Perigo confirmado:** ${j.perigo}`
    )
  })
  .join('\n\n')

const diagnosticos = await parallel([
  () =>
    agent(
      `${CTX_PLANEJAR}\n\n${CALIBRACAO}\n\nA base foi medida. Falhas:\n\n${dossieFalhas}\n\n` +
        `VOCÊ DIAGNOSTICA AS FALHAS DE **RECUPERAÇÃO** — os casos em que a informação existe na base e ` +
        `mesmo assim não foi encontrada.\n\n` +
        `Esta é a falha mais barata de consertar e a mais fácil de diagnosticar errado como ausência. ` +
        `Para cada falha marcada 'nao-encontravel' — e para as marcadas 'conteudo-ausente' de que você ` +
        `desconfiar — procure a informação você mesmo com \`check-evidence.mjs\`, esgotando ` +
        `vocabulários: português, inglês, gíria, termo técnico, o termo do canal. O campo "Busca ` +
        `tentada" diz o que já foi tentado; não repita, estenda.\n\n` +
        `Depois projete o conserto. Não temos banco vetorial e não vamos ter: o consumidor é um modelo ` +
        `de janela grande lendo arquivos do repositório, e a busca é grep. Isso é restrição dura e ` +
        `provavelmente vantagem. Nesse mundo, o índice faz o trabalho que o embedding faria — e o modo ` +
        `de falha do grep é VOCABULÁRIO, não desempenho.\n\n` +
        `Especifique concretamente: que forma tem o \`INDEX.md\`, que linha de termos cada tópico ` +
        `precisa (com sinônimos, inglês e gíria escritos à mão), que arquivos de síntese existem, e ` +
        `como um agente de conversa navega disso até a claim. Mostre o percurso completo para três ` +
        `perguntas reais que falharam, com os comandos que ele rodaria.\n\n` +
        `Português do Brasil. NÃO construa ainda — especifique. NÃO use git.`,
      { label: 'diag:recuperacao', phase: 'Diagnosticar' },
    ),
  () =>
    agent(
      `${CTX_PLANEJAR}\n\n${CALIBRACAO}\n\nA base foi medida. Falhas:\n\n${dossieFalhas}\n\n` +
        `VOCÊ DIAGNOSTICA AS FALHAS DE **CONTEÚDO AUSENTE** — o que ninguém disse e precisa vir de fora.\n\n` +
        `Agrupe as lacunas por assunto e, para cada grupo, aponte a fonte que a preencheria, na ordem ` +
        `de custo-benefício. Considere o que já mapeamos em \`research/kb/FONTES-ADICIONAIS.md\` e ` +
        `\`research/kb/ROSTER-CURADO.md\`, e verifique na web quando precisar.\n\n` +
        `Restrições reais a respeitar: o Stronger by Science desautoriza o ClaudeBot no robots.txt e ` +
        `declara \`ai-train=no\` — entra como referência por URL, não por ingestão. O goodlift.info ` +
        `proíbe extração; dados de competição vêm do dump aberto do OpenPowerlifting. O corpus de ` +
        `Garrett Blevins (competidor IPF testado, ~354 vídeos) já está sendo transcrito.\n\n` +
        `Priorize por CONSEQUÊNCIA — a severidade está em cada falha e é para ser usada. Uma lacuna ` +
        `catastrófica que exige ler três papers vale mais que dez lacunas leves resolvidas com um canal ` +
        `fácil de baixar.\n\n` +
        `Estime volume e esforço de cada ingestão, e diga explicitamente o que NÃO vale a pena buscar. ` +
        `Português do Brasil. NÃO ingira nada ainda — especifique. NÃO use git.`,
      { label: 'diag:conteudo', phase: 'Diagnosticar' },
    ),
  () =>
    agent(
      `${CTX_PLANEJAR}\n\n${CALIBRACAO}\n\nA base foi medida. Falhas:\n\n${dossieFalhas}\n\n` +
        `Evidência que não resolveu: ${fabricadas.length} pergunta(s). Respostas vindas de fora da ` +
        `base: ${deFora.length}.\n\n` +
        `VOCÊ DIAGNOSTICA **CONTEÚDO ERRADO E PERIGO** — e este é o diagnóstico mais importante dos três.\n\n` +
        `Comece pelos perigos confirmados: onde a base responderia algo ativamente nocivo para um atleta ` +
        `natural de 87 kg que nunca competiu. Investigue cada um até o fim, abrindo as claims com ` +
        `\`check-evidence.mjs\` e as transcrições.\n\n` +
        `Depois vá além do que foi reportado e procure ativamente: prescrição de outlier circulando sem ` +
        `ressalva, volume ou intensidade insustentáveis para um natural, conselho que ignora regra de ` +
        `competição, afirmação do corpus que contradiz literatura estabelecida.\n\n` +
        `Para cada caso, decida e justifique o tratamento: corrigir a claim, acrescentar a condição que ` +
        `falta, registrar uma contradição com fonte externa, ou marcar como não transferível. E diga ` +
        `qual desses tratamentos pode ser mecanizado e qual exige julgamento sempre — porque o próximo ` +
        `passo depende dessa separação.\n\n` +
        `Considere seriamente a hipótese de que a base esteja BOA e o perigo seja menor do que parece. ` +
        `Alarme falso custa caro: manda gente reescrever o que estava certo. Se for esse o caso, diga.\n\n` +
        `Português do Brasil. NÃO edite a base — diagnostique. NÃO use git.`,
      { label: 'diag:perigo', phase: 'Diagnosticar' },
    ),
])

// ─────────────────────────────────────────────────────────────────────────────
phase('Decidir')

const ITEM = {
  type: 'object',
  required: ['o_que', 'resolve', 'comoVerificar'],
  properties: {
    o_que: { type: 'string' },
    resolve: { type: 'array', items: { type: 'string' }, description: 'os ids de pergunta (Q07, Q12) que este item destrava. Item que não resolve nenhuma pergunta medida não deveria estar no plano.' },
    comoVerificar: { type: 'string', description: 'como se sabe que ficou pronto e certo' },
    esforco: { type: 'string' },
  },
}

const PLANO_SCHEMA = {
  type: 'object',
  required: ['deterministico', 'agentes', 'fontesNovas', 'naoResolvivel', 'ordem', 'veredito', 'confiancaNaMedicao'],
  properties: {
    deterministico: { type: 'array', items: ITEM, description: 'o que vira regra executável' },
    agentes: { type: 'array', items: ITEM, description: 'o que exige julgamento' },
    fontesNovas: { type: 'array', items: ITEM, description: 'que fonte ingerir, para qual lacuna' },
    naoResolvivel: { type: 'array', items: ITEM, description: 'o que fica sem solução e como a base declara essa incerteza' },
    ordem: { type: 'array', items: { type: 'string' }, description: 'a sequência de execução, com a dependência entre passos' },
    veredito: { type: 'string', description: 'resposta direta: a base serve ao objetivo? o que muda a resposta?' },
    confiancaNaMedicao: { type: 'string', description: 'o que os canários dizem sobre quanto se pode confiar nos números deste relatório' },
  },
}

const decisao = await agent(
  `${CTX_PLANEJAR}\n\n` +
    `PLANEJAMENTO. Conjunto de avaliação: ${plano.perguntas.length} perguntas (\`research/kb/AVALIACAO.md\`).\n` +
    `Princípios de projeto:\n${(plano.principios ?? []).map((p) => `- ${p}`).join('\n')}\n` +
    `Deliberadamente fora de escopo:\n${(plano.oQueNaoVamosFazer ?? []).map((p) => `- ${p}`).join('\n')}\n\n` +
    `${CALIBRACAO}\n\n` +
    `MEDIÇÃO. ${reais.length} perguntas medidas com julgador independente; ${reprovadas.length} abaixo ` +
    `de "responde bem"; ${fabricadas.length} com evidência que não resolveu; ${deFora.length} ` +
    `respondidas com conhecimento de fora da base.\n\n` +
    `AS FALHAS, com pergunta, severidade e evidência:\n\n${dossieFalhas}\n\n` +
    `DIAGNÓSTICO DE RECUPERAÇÃO:\n${diagnosticos[0] ?? '(indisponível)'}\n\n` +
    `DIAGNÓSTICO DE CONTEÚDO AUSENTE:\n${diagnosticos[1] ?? '(indisponível)'}\n\n` +
    `DIAGNÓSTICO DE CONTEÚDO ERRADO E PERIGO:\n${diagnosticos[2] ?? '(indisponível)'}\n\n` +
    `VOCÊ DECIDE O QUE SERÁ CONSTRUÍDO. Escreva \`research/kb/PLANO-EXECUCAO.md\`.\n\n` +
    `Comece pela calibração: se os canários divergiram, diga em \`confiancaNaMedicao\` o que isso faz ` +
    `com o resto do plano. Plano ambicioso sobre medição furada é a pior entrega possível.\n\n` +
    `A regra que governa a separação: **onde um compilador pode verificar, agente não deve.** É o ` +
    `princípio do projeto e já se pagou — foi ele que pegou um verbatim inexistente e um número sem ` +
    `unidade que a revisão por prosa aprovou na rodada anterior. Mas ele tem limite, e a honestidade ` +
    `sobre o limite é parte da entrega: determinismo prova FIDELIDADE À FONTE e não diz nada sobre ` +
    `CORREÇÃO DA FONTE. Uma base perfeitamente fiel a um atleta não testado de 120 kg pode estar ` +
    `perfeitamente errada para este consumidor, e nenhum lint jamais vai notar.\n\n` +
    `Então separe com rigor, sem otimismo:\n` +
    `- **determinístico**: só o que é PROVA, não estimativa. Regra que erra manda gente consertar o ` +
    `que estava certo, e aviso sem conserto ensina a ignorar avisos.\n` +
    `- **agentes**: o que exige julgamento — e \`comoVerificar\` não é opcional, porque agente sem ` +
    `verificação é a receita que já falhou uma vez neste projeto.\n` +
    `- **fontes novas**: o que só se resolve trazendo material de fora.\n` +
    `- **não resolvível**: o que fica em aberto, e como a base declara essa incerteza em vez de ` +
    `disfarçá-la. Registrar "não se sabe" é resposta legítima e superior a inventar.\n\n` +
    `CADA item tem de listar em \`resolve\` os ids de pergunta que ele destrava. Item que não resolve ` +
    `nenhuma pergunta medida é ideia sua, não achado — corte, ou justifique explicitamente por que ` +
    `entra mesmo sem lastro na medição.\n\n` +
    `A **ordem** importa e é entregável. Já sabemos que reparo tem de vir antes de síntese, porque erro ` +
    `de dado vira norma para o próximo agente — aconteceu três vezes nesta rodada, com agentes copiando ` +
    `convenção errada dos arquivos vizinhos e justificando como precedente.\n\n` +
    `E o **veredito** tem de ser direto: esta base serve para levar um natural de 87 kg em direção a um ` +
    `recorde? Se a resposta honesta for "ela ajuda na margem e o que decide é consistência de anos", ` +
    `diga isso. Vale mais do que um plano ambicioso que ninguém deveria executar.\n\n` +
    `Escreva o arquivo E devolva o objeto estruturado. Português do Brasil. NÃO use git.`,
  { label: 'decidir', phase: 'Decidir', schema: PLANO_SCHEMA },
)

// Cobertura: toda falha catastrófica ou grave apareceu em algum item do plano?
const cobertos = new Set(
  [...(decisao?.deterministico ?? []), ...(decisao?.agentes ?? []), ...(decisao?.fontesNovas ?? []), ...(decisao?.naoResolvivel ?? [])].flatMap((it) => it.resolve ?? []),
)
const graves = reprovadas.filter((j) => ['catastrofica', 'grave'].includes(porQ.get(j.id)?.severidade))
const descobertas = graves.filter((j) => !cobertos.has(j.id)).map((j) => j.id)
if (descobertas.length > 0) log(`⚠️ ${descobertas.length} falha(s) grave(s) sem item no plano: ${descobertas.join(', ')}`)

return {
  perguntas: plano.perguntas.length,
  medidas: reais.length,
  reprovadas: reprovadas.length,
  evidenciaFabricada: fabricadas.length,
  respondidasDeFora: deFora.length,
  perigos: julg.filter((j) => j.perigo && !/^nenhum/i.test(j.perigo.trim())).map((j) => j.id),
  canarios: canarios.map((c) => `${c.id}:${c.esperado}→${c.obtido}${c.bateu ? '' : ' DIVERGIU'}`),
  medicaoConfiavel: vazamento.length === 0 && canariosOk === CANARIOS.length,
  gravesSemPlano: descobertas,
  veredito: decisao?.veredito,
  confiancaNaMedicao: decisao?.confiancaNaMedicao,
}
