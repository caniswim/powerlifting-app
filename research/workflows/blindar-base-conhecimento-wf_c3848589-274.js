export const meta = {
  name: 'blindar-base-conhecimento',
  description: 'Caça classes de defeito na base de claims e converte cada uma em checagem determinística',
  phases: [
    { title: 'Caçar', detail: '8 lentes adversariais buscando CLASSES de defeito, não instâncias' },
    { title: 'Mecanizar', detail: 'converter cada classe em regra executável de lint' },
    { title: 'Varrer', detail: 'rodar as regras novas sobre as 5.090 claims' },
    { title: 'Reparar', detail: 'corrigir violações e preencher modo/conditions por faixa' },
    { title: 'Medir', detail: 'cobertura das classes e red team contra as travas' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CONTEXTO = `
REPO: ${REPO}

A BASE. \`research/extract/*.jsonl\` tem 5.090 claims atômicas (181 arquivos, um por vídeo).
4.947 vêm de 180 vídeos do canal Matt Vena (refs R001-R196) e 143 do regulamento técnico
da IPF 2026 (ref F001). Cada claim tem: id, src (ref do vídeo), at (timestamp ou parágrafo),
tier de procedência, scope (GERAL/PESSOAL), certainty, topic[], claim (português),
verbatim (trecho literal em inglês da transcrição), params[] com unit e frame.

Leia ANTES de trabalhar: \`research/kb/SCHEMA.md\` e \`research/kb/PROTOCOLO-EXTRACAO.md\`.
As transcrições estão em \`research/corpus/transcripts/\` (uma linha por janela de ~15s,
prefixada por [mm:ss]). O manifesto \`research/corpus/manifest.json\` tem título, duração e
data de cada vídeo.

O CONSUMIDOR. Homem, 28 anos, brasileiro, 87 kg, powerlifter NATURAL, classe IPF 93 kg.
Marcas de treino 250/170/268 kg, nunca competiu, primeira competição em ~12 meses.
Objetivo declarado: recorde mundial. A fonte principal (Matt Vena) agacha 400 kg, pesa
~120 kg e NÃO compete testado. A base existe para conversar sobre treino, planejar blocos
e evoluir — e só é segura se distinguir o que ele manda fazer do que ele mesmo faz.

O QUE JÁ ESTÁ MECANIZADO em \`research/tools/check-claims.mjs\` (0 erros hoje):
citação resolve para vídeo existente e citável; timestamp dentro da duração; verbatim
existe na transcrição dentro de 45s do 'at'; todo número em param tem unit e frame de um
enumerado fechado; tier exige a procedência dele (R: src+at+verbatim+scope; I: basis;
L: PMID/DOI; O: parágrafo que existe no regulamento; E: source.url; U: source.date);
topic pertence ao vocabulário fechado; ids únicos; basis e conflicts resolvem.
Há teste do próprio checker (\`check-claims.test.mjs\`, 19 casos) que exige que ele recuse
claims deliberadamente quebradas.

DEFEITOS JÁ ENCONTRADOS POR AUDITORIA HUMANA (amostra de 163 claims, taxa 91,4% fiel,
0% invertida) — use como calibração do que procurar, NÃO como lista a repetir:
- V011-20: claim diz "devem sempre" com verbatim "for sumo pullers, I find" (não é proposição)
- V033-09: garble do ASR "7 12%" virou DOIS params inventados, 7% e 12%
- V052-07: claim blanket "não usar cues" quando ele manda usar cue externo
- V143-02: "sobrecarga progressiva é mito" — o "it" do original era a versão absoluta da regra
- 376 verbatims (7,6%) cortados no meio da frase pela janela de 15s da legenda
- 72 params com frame de outra grandeza (já reparados, mas a classe pode reincidir)
- prescrição separada da condição que a torna segura: "supino 6x/semana" existe sem
  "nunca acima de RPE 5", que ele diz junto. Este é o defeito mais perigoso da base.
- só 17% do que está marcado scope:GERAL é prescrição de verdade; o resto é opinião,
  mecanismo, fato ou narração de estudo — por isso o SCHEMA prevê um campo 'modo'.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Caçar')

const CLASSE_SCHEMA = {
  type: 'object',
  required: ['classes'],
  properties: {
    classes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['nome', 'descricao', 'exemplos', 'checagem', 'mecanizavel', 'prevalencia'],
        properties: {
          nome: { type: 'string', description: 'kebab-case, curto' },
          descricao: { type: 'string', description: 'o defeito em 1-2 frases, e por que ele importa para o consumidor' },
          exemplos: { type: 'array', items: { type: 'string' }, description: 'ids reais de claims que exibem o defeito (mínimo 2 se existirem)' },
          checagem: { type: 'string', description: 'a REGRA DETERMINÍSTICA proposta, precisa o bastante para virar código: quais campos comparar, qual limiar, o que é sinal e o que é ruído' },
          mecanizavel: { type: 'string', enum: ['total', 'parcial', 'nao'], description: 'total = pega tudo sem falso negativo; parcial = triagem que reduz o que precisa de leitura; nao = exige julgamento sempre' },
          prevalencia: { type: 'string', description: 'estimativa com o método de contagem usado (grep, script, amostra de N)' },
          falsoPositivo: { type: 'string', description: 'onde a regra vai errar, e como reduzir' },
        },
      },
    },
    notas: { type: 'string', description: 'o que você tentou e NÃO deu em nada — evita outro agente repetir' },
  },
}

const LENTES = [
  {
    key: 'deontica',
    prompt: `LENTE: LINGUAGEM DEÔNTICA. Procure claims cuja força normativa não existe no verbatim.

O caso paradigmático já achado: claim afirma "devem sempre" sustentada por "for sumo pullers, I find".
A claim vira ordem; o original era observação pessoal.

Investigue mecanicamente: marcadores deônticos no português da claim (deve, devem, precisa,
tem que, sempre, nunca, jamais, é obrigatório, o correto é, o ideal é) contra marcadores no
inglês do verbatim (should, must, need to, have to, always, never, ought, gotta, make sure).
Meça a taxa de claims deônticas cujo verbatim não tem NENHUM marcador. Investigue também o
inverso: verbatim com "should/must" cuja claim virou descrição frouxa, perdendo a prescrição.

Cuidado com o inglês falado: "you want to keep your back tight" é prescritivo sem modal, e
"I like to" às vezes é conselho. A regra tem que reconhecer isso ou vai ter falso positivo demais.`,
  },
  {
    key: 'numeros',
    prompt: `LENTE: NÚMEROS FABRICADOS OU DESLOCADOS. Procure params cujo valor não está no verbatim.

O caso paradigmático: um garble do ASR ("7 12%") virou dois params inventados, 7% e 12%.
Isso é fabricação, e é a coisa mais grave que pode acontecer numa base de treino.

Regra óbvia a testar: todo params[].value tem que aparecer no verbatim, em dígito ou por
extenso, em inglês. Meça quantos violam. Depois refine: número derivado por conversão legítima
(lb→kg, horas→min), faixa ("2 a 3" gerando dois params), número escrito por extenso em inglês
(five, a dozen, half), e percentual dito como fração.

Investigue também: params com grandeza incompatível com o unit; params cujo unit contradiz a
palavra que acompanha o número no verbatim (o verbatim diz "pounds" e o param diz kg);
e claims com número na prosa que não tem param correspondente.`,
  },
  {
    key: 'polaridade',
    prompt: `LENTE: POLARIDADE E NEGAÇÃO. Procure onde a afirmação está invertida.

O corpus vem de legenda automática do YouTube, e um "n't" perdido inverte a frase sem parecer
errado — sai uma sentença gramatical, plausível, e ao contrário do que foi dito. Casos reais
já achados na transcrição: "energy availability doesn't play a role" logo depois de ele
argumentar o contrário; "any amount you add won't give you big benefits" invertendo a conclusão
do próprio parágrafo.

Duas direções: (a) o verbatim está certo e a claim inverteu; (b) a CLAIM está certa e o
VERBATIM é que veio corrompido da legenda — este segundo caso é o mais difícil e o mais
importante, porque a evidência é que está errada.

Mecanize: negação no verbatim (not, n't, no, never, without, neither) contra negação na claim
(não, nunca, nem, sem, jamais). Divergência de contagem é sinal. E procure o padrão mais
diagnóstico: verbatim cuja negação contradiz as linhas VIZINHAS da transcrição — abra
\`research/corpus/transcripts/\` e compare com o entorno.`,
  },
  {
    key: 'recorte',
    prompt: `LENTE: RECORTE E MOLDURA. Procure claims verdadeiras cujo registro não as prova.

Já medido: 376 verbatims (7,6%) foram cortados no meio da frase pela janela de ~15s da legenda.
A claim continua verdadeira mas o verbatim não a sustenta sozinho — que é exatamente o estado
que o SCHEMA existe para impedir.

Mecanize a detecção de truncamento: verbatim que começa ou termina no meio de sintagma,
que não fecha oração, ou cujo primeiro/último caractere na transcrição não é fronteira de frase.
Verifique se o verbatim poderia ter sido estendido — o texto da transcrição é contínuo entre
janelas, então estender é possível e a correção é mecânica.

Procure também descontextualização: verbatim real cujo ENTORNO muda o sentido. Ele citando a
opinião de outra pessoa para discordar; hipótese que ele depois rejeita; condicional cuja
condição ficou fora; ironia. Abra a transcrição e leia 60s em volta dos casos suspeitos.
Proponha um sinal mecânico de triagem (marcadores como "some people say", "you might think",
"a lot of guys", "if you", "let's say") que reduza o que precisa de leitura.`,
  },
  {
    key: 'escopo',
    prompt: `LENTE: ESCOPO, MODO E CONDIÇÃO. Procure prescrição que circula sem o que a limita.

Este é o defeito mais perigoso da base para o consumidor. Já medido: "supino 6x/semana" existe
como registro sem a condição declarada junto, "nunca acima de RPE 5". Separada da condição, a
prescrição não fica incompleta — fica perigosa, porque parece completa.

Também já medido: só 17% do que está marcado scope:GERAL é prescrição; o resto é opinião,
mecanismo, fato do mundo ou narração de estudo. E existe pelo menos um caso (V170-33) de ordem
geral embutida DENTRO de um registro marcado PESSOAL, onde nenhum filtro por scope a enxerga.

Mecanize: (a) detectar condicionais no verbatim (if, as long as, provided, unless, when you're,
for beginners, once you) e exigir que a claim preserve a condição ou aponte para ela;
(b) detectar prescrição com número de volume/intensidade/frequência sem condição associada;
(c) detectar registro PESSOAL cujo texto contém linguagem de segunda pessoa prescritiva;
(d) propor a heurística que separa 'modo' (prescricao/opiniao/mecanismo/fato/estudo/anedota/
narrativa) com maior acerto possível a partir de verbatim e claim.

Diga honestamente qual parte disso NÃO é mecanizável e precisa de julgamento sempre.`,
  },
  {
    key: 'cobertura',
    prompt: `LENTE: COBERTURA E OMISSÃO. Procure o que a base DEIXOU DE registrar.

Todas as outras lentes procuram erro no que está lá. Esta procura o buraco: informação
importante do corpus que nenhuma claim capturou. É o defeito invisível — não gera erro,
não gera aviso, e a base parece completa.

Método: escolha 12 a 15 vídeos de alta densidade metodológica (use o manifesto e os títulos;
priorize os que tratam de programação, técnica dos três movimentos, e seleção de exercício),
leia a transcrição INTEIRA de cada um e compare com as claims extraídas daquele ref.
O que foi dito e não virou claim? Há padrão no que se perde — final de vídeo, argumento longo,
ressalva lateral, número dito de passagem?

Meça também: distribuição de claims por minuto de vídeo (há vídeos subextraídos?), vídeos com
zero ou pouquíssimas claims, e trechos longos da transcrição sem nenhuma claim apontando para
eles. Proponha uma métrica determinística de subextração que sirva de triagem para o futuro.`,
  },
  {
    key: 'procedencia',
    prompt: `LENTE: PROCEDÊNCIA E LAVAGEM. Procure afirmação com autoridade maior do que merece.

Na rodada anterior deste projeto, uma interpretação circulou com autoridade de citação — um
fator de ajuste de carga que não tinha fonte nenhuma no corpus — e chegou ao programa de
treino. O esquema atual proíbe isso com o tier 'I' exigindo basis, mas a lavagem pode
reaparecer de outras formas.

Procure: (a) claims tier R que na verdade são inferência do extrator, não o que foi dito;
(b) claims onde ele NARRA um estudo e a claim registra como se fosse fato estabelecido —
mecanize detectando marcadores de estudo no verbatim (study, research, meta-analysis, they
found, participants, subjects) e verificando se a claim preserva a atribuição;
(c) claims onde ele relata anedota de terceiro registrada como regra geral;
(d) claims onde ele explicitamente declara incerteza ("I think", "I'm not sure", "maybe",
"I could be wrong", "don't quote me") e a claim apagou a hedge;
(e) números que ele mesmo declara inventados ou ilustrativos ("let's say", "hypothetically",
"made up numbers") registrados como dado — sabemos que R159 tem um caso assim.

Meça a prevalência de cada e proponha a regra para cada uma.`,
  },
  {
    key: 'temporal',
    prompt: `LENTE: CONSISTÊNCIA TEMPORAL. Procure posições contraditórias que não estão ligadas.

A base cobre dez anos de canal (2015-2026) e o autor mudou de opinião várias vezes de forma
declarada. O manifesto tem a data de cada vídeo, então "o mais recente vence" é computável —
mas só se as contradições estiverem REGISTRADAS. Hoje há apenas 3 arestas 'conflicts' em 5.090
claims, contra 25 contradições catalogadas na rodada anterior. Isso é subregistro grosseiro.

Contradições já relatadas pelos extratores e NÃO registradas como aresta (verifique cada uma
e ache mais): volume alto submáximo vs. queda de 15 para 5 séries semanais de agacho com ganho
de 27 kg; "natural precisa de MAIS volume" (vídeos antigos) vs. o corte drástico recente;
deload de rotina rejeitado vs. taper de pico prescrito; "parei de me importar com forma" vs.
vídeos inteiros de correção técnica; deltoide anterior subestimado vs. superestimado;
frequência de supino 6x/semana vs. prescrições conservadoras.

Mecanize: como detectar candidatos a contradição sem ler tudo? Pense em claims que compartilham
topic e cujos params têm a MESMA grandeza com valores distantes (ex.: duas claims de 'volume'
com frame 'series' e valores 5 e 50). Isso é uma consulta determinística e provavelmente
altamente produtiva. Proponha e MEÇA quantos pares ela devolve e quantos são contradição real
numa amostra que você verifique.`,
  },
]

const classesPorLente = await parallel(
  LENTES.map((l) => () =>
    agent(
      `${CONTEXTO}\n\n${l.prompt}\n\n` +
        `SEU PRODUTO NÃO É UMA LISTA DE CLAIMS RUINS — é uma lista de CLASSES de defeito, cada uma ` +
        `com a regra determinística que a pegaria. Um agente que devolve 30 claims erradas dá 30 ` +
        `correções; um que devolve 4 classes com 4 regras dá todas elas, para sempre, inclusive nas ` +
        `fontes novas que ainda vão entrar na base.\n\n` +
        `Trabalhe com FERRAMENTA, não com leitura exaustiva: escreva scripts de varredura em node ` +
        `sobre os .jsonl e as transcrições, meça, e use leitura apenas para calibrar e validar. ` +
        `Você tem 5.090 claims e não deve ler todas.\n\n` +
        `Para cada classe, a 'checagem' proposta precisa ser precisa o bastante para outra pessoa ` +
        `implementar sem te perguntar nada: quais campos, qual comparação, qual limiar, o que conta ` +
        `como sinal e o que é ruído. E seja honesto no campo 'mecanizavel': dizer "parcial" com uma ` +
        `boa triagem vale mais do que dizer "total" e entregar uma regra que erra.\n\n` +
        `NÃO edite nenhum .jsonl. NÃO use git. Scripts de varredura descartáveis podem ir para ` +
        `\`research/tools/scan/\`. Português do Brasil.`,
      { label: `caçar:${l.key}`, phase: 'Caçar', schema: CLASSE_SCHEMA },
    ),
  ),
)

const classes = classesPorLente.filter(Boolean).flatMap((r) => r.classes ?? [])
log(`${classes.length} classes de defeito propostas por ${classesPorLente.filter(Boolean).length} lentes`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Mecanizar')

const dossie = classes
  .map(
    (c, i) =>
      `### ${i + 1}. ${c.nome} [${c.mecanizavel}]\n` +
      `${c.descricao}\n` +
      `PREVALÊNCIA: ${c.prevalencia}\n` +
      `EXEMPLOS: ${(c.exemplos ?? []).join(', ')}\n` +
      `REGRA PROPOSTA: ${c.checagem}\n` +
      `FALSO POSITIVO: ${c.falsoPositivo}\n`,
  )
  .join('\n')

const FAMILIAS = [
  { key: 'linguagem', desc: 'deôntica, polaridade/negação, hedge apagada, atribuição de estudo, linguagem de segunda pessoa' },
  { key: 'numeros', desc: 'valor ausente do verbatim, grandeza incompatível, unit contra a palavra do verbatim, número na prosa sem param' },
  { key: 'estrutura', desc: 'verbatim truncado, descontextualização, condicional perdida, prescrição sem condição, subextração' },
]

const modulos = await parallel(
  FAMILIAS.map((f) => () =>
    agent(
      `${CONTEXTO}\n\n` +
        `Oito lentes adversariais varreram a base e propuseram estas classes de defeito, cada uma ` +
        `com uma regra determinística sugerida:\n\n${dossie}\n\n` +
        `SEU TRABALHO: implementar as regras da família **${f.key}** (${f.desc}) num módulo novo ` +
        `\`research/tools/lint/${f.key}.mjs\`.\n\n` +
        `CONTRATO DO MÓDULO. Exporte \`export const regras = [...]\`, onde cada regra é ` +
        `\`{ nome, severidade: 'erro'|'aviso', descricao, aplica(claim, ctx) }\`. \`aplica\` devolve ` +
        `\`null\` quando está tudo bem, ou \`{ mensagem, sugestao? }\` quando viola. \`ctx\` traz ` +
        `\`{ transcript(ref), manifest, byId, norm(s) }\` — assuma essa interface e documente o que ` +
        `você precisar além dela; um integrador vai ligar tudo depois.\n\n` +
        `SEVERIDADE É DECISÃO SUA E IMPORTA. 'erro' quebra o build e trava o trabalho de todo mundo; ` +
        `use só onde o defeito é inequívoco e a regra não tem falso positivo relevante (número ` +
        `fabricado é candidato natural). 'aviso' é para triagem — reduz o que precisa de leitura ` +
        `humana sem parar ninguém. **Aviso que ninguém consegue resolver ensina a ignorar avisos**, ` +
        `então uma regra com muito ruído deve ser afinada ou não entrar.\n\n` +
        `Descarte classes fora da sua família, e descarte também as que você julgar mal concebidas — ` +
        `mas DIGA quais descartou e por quê. Implementar uma regra ruim é pior que não implementar.\n\n` +
        `Cada regra leva comentário em português explicando o PORQUÊ dela, com o defeito real que a ` +
        `motivou. Estilo do repositório: comentário explica a razão, não a mecânica.\n\n` +
        `NÃO edite \`check-claims.mjs\` nem nenhum .jsonl. NÃO use git.`,
      { label: `mecanizar:${f.key}`, phase: 'Mecanizar' },
    ),
  ),
)

const integracao = await agent(
  `${CONTEXTO}\n\n` +
    `Três agentes acabaram de escrever módulos de lint em \`research/tools/lint/\` ` +
    `(linguagem.mjs, numeros.mjs, estrutura.mjs). Relatórios deles:\n\n` +
    `${modulos.filter(Boolean).join('\n\n---\n\n')}\n\n` +
    `SEU TRABALHO:\n\n` +
    `1. Escrever \`research/tools/lint-claims.mjs\`, que carrega os três módulos, monta o \`ctx\` ` +
    `(transcript por ref, manifesto, índice de ids, normalizador — veja como \`check-claims.mjs\` ` +
    `faz, e REAPROVEITE em vez de duplicar), roda todas as regras sobre as 5.090 claims e imprime ` +
    `um relatório agrupado por regra, com contagem e amostra. Aceite \`--only <ref>\`, ` +
    `\`--regra <nome>\` e \`--json <arquivo>\` (para o passe de reparo consumir).\n\n` +
    `2. Conciliar as interfaces se os três módulos divergirem — eles foram escritos em paralelo ` +
    `sem se ver.\n\n` +
    `3. Escrever \`research/tools/lint-claims.test.mjs\` no MESMO espírito de ` +
    `\`check-claims.test.mjs\` (leia-o primeiro): para CADA regra, uma claim sintética que a viola ` +
    `e tem que ser pega, e uma que não viola e tem que passar. **Regra sem teste não entra** — ` +
    `uma trava que não se sabe se morde é pior que trava nenhuma, porque dá confiança falsa.\n\n` +
    `4. Rodar o lint na base inteira e reportar o inventário: quantas violações por regra, e as ` +
    `regras que dispararam em mais de 15% das claims (quase sempre sinal de regra mal calibrada, ` +
    `não de base podre — investigue antes de aceitar).\n\n` +
    `5. Acrescentar \`"lint:kb": "node research/tools/lint-claims.test.mjs && node research/tools/lint-claims.mjs"\` ` +
    `ao package.json. NÃO o encadeie no \`build\` ainda — o build só deve travar depois do reparo.\n\n` +
    `\`npm run check:kb\` tem que continuar passando (5.090 claims, 0 erros, 19/19 no teste do ` +
    `checker). NÃO use git.`,
  { label: 'integrar-lint', phase: 'Mecanizar' },
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Varrer')

const inventario = await agent(
  `${CONTEXTO}\n\n` +
    `O lint determinístico acabou de ser construído. Relatório da integração:\n\n${integracao}\n\n` +
    `SEU TRABALHO: produzir \`research/kb/INVENTARIO-DEFEITOS.md\`, que é o documento que o passe ` +
    `de reparo vai executar.\n\n` +
    `1. Rode \`node research/tools/lint-claims.mjs --json research/kb/lint.json\` sobre a base inteira.\n\n` +
    `2. Triagem por regra: para cada uma, leia uma amostra das violações e classifique a regra como ` +
    `**confiável** (violação é defeito de verdade, reparo pode ser mecânico), **ruidosa** (mistura ` +
    `defeito com falso positivo, reparo exige leitura caso a caso) ou **quebrada** (quase tudo é ` +
    `falso positivo — proponha afinar ou remover). Justifique com exemplo.\n\n` +
    `3. Particione as violações reais em 5 faixas de arquivo aproximadamente equilibradas em ` +
    `ESFORÇO, não em contagem: R001-R040, R041-R080, R081-R120, R121-R160, R161-R196+F001. Para ` +
    `cada faixa, quantas violações de cada regra.\n\n` +
    `4. Ordene as regras por consequência para o consumidor. Um número fabricado numa prescrição de ` +
    `volume machuca um atleta natural de 87 kg; um verbatim truncado numa claim de mentalidade não. ` +
    `O reparo tem que saber o que atacar primeiro.\n\n` +
    `5. Seção final: **o que o lint NÃO alcança**. Das classes que as lentes acharam, quais ficaram ` +
    `de fora por não serem mecanizáveis, e qual amostragem humana periódica seria necessária para ` +
    `cobri-las. Esta seção é tão importante quanto o inventário — é a lista honesta do que continua ` +
    `sem rede.\n\n` +
    `NÃO edite nenhum .jsonl. NÃO use git.`,
  { label: 'inventario', phase: 'Varrer' },
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Reparar')

const FAIXAS = [
  { key: 'R001-R040', de: 1, ate: 40 },
  { key: 'R041-R080', de: 41, ate: 80 },
  { key: 'R081-R120', de: 81, ate: 120 },
  { key: 'R121-R160', de: 121, ate: 160 },
  { key: 'R161-R196', de: 161, ate: 196 },
]

const reparos = await parallel(
  FAIXAS.map((f) => () =>
    agent(
      `${CONTEXTO}\n\n` +
        `Inventário de defeitos produzido pela varredura:\n\n${inventario}\n\n` +
        `SUA FAIXA: arquivos \`research/extract/R${String(f.de).padStart(3, '0')}.jsonl\` até ` +
        `\`R${String(f.ate).padStart(3, '0')}.jsonl\`. **Não toque em nenhum arquivo fora dela** — ` +
        `quatro outros agentes estão trabalhando nas outras faixas ao mesmo tempo.\n` +
        `${f.de > 160 ? 'Sua faixa inclui também F001.jsonl (regulamento da IPF), que já foi revisado — só mexa se o lint apontar violação real nele.\n' : ''}` +
        `\nDUAS TAREFAS, nesta ordem:\n\n` +
        `**1. Corrigir as violações do lint na sua faixa.** Rode ` +
        `\`node research/tools/lint-claims.mjs --only R0XX\` por arquivo. Priorize pela ordem de ` +
        `consequência do inventário. Regras marcadas como ruidosas exigem leitura caso a caso — ` +
        `não aplique correção em massa sobre elas.\n\n` +
        `**2. Preencher \`modo\` e \`conditions\` em toda claim da sua faixa.** Isto é construção, ` +
        `não conserto, e é o item mais importante da base hoje.\n` +
        `\`modo\` (ver SCHEMA.md): prescricao | opiniao | mecanismo | fato | estudo | anedota | narrativa. ` +
        `Só 17% do que está marcado GERAL é prescrição de verdade, e hoje filtrar por scope devolve ` +
        `"ele acha o deltoide anterior subestimado" junto com "agache duas vezes por semana", como se ` +
        `fossem a mesma categoria de instrução. É a segunda que vira treino.\n` +
        `\`conditions\`: os ids das claims que LIMITAM esta. O defeito que motiva o campo: ` +
        `"supino 6x/semana" existe sem "nunca acima de RPE 5", que ele diz junto. Separada da ` +
        `condição, a prescrição não fica incompleta — fica perigosa, porque parece completa. ` +
        `Procure a condição no mesmo vídeo primeiro (leia a transcrição em volta), e em outros ` +
        `vídeos depois. \`conditions\` pode apontar para claim de qualquer arquivo: o checker resolve ` +
        `referência contra a base inteira mesmo com \`--only\`.\n\n` +
        `REGRAS DURAS:\n` +
        `- Não altere \`value\` de param nenhum sem que o verbatim prove o valor novo. O defeito ` +
        `costuma ser o rótulo, não o número, e converter valor introduz erro pior que o original.\n` +
        `- Não altere \`verbatim\`, \`at\`, \`src\`, \`id\` nem \`tier\`.\n` +
        `- Onde o verbatim truncado puder ser ESTENDIDO a partir da transcrição para provar a claim, ` +
        `estenda — o texto é contínuo entre as janelas de 15s. Isso é exceção explícita à regra acima ` +
        `e só vale para estender, nunca para reescrever.\n` +
        `- Na dúvida sobre \`modo\`, prefira a categoria menos prescritiva. Errar para 'prescricao' ` +
        `é o erro caro; errar para 'opiniao' é conservador.\n` +
        `- Onde você suspeitar de defeito mas não tiver certeza, NÃO adivinhe: relate.\n\n` +
        `Ao terminar: \`node research/tools/check-claims.mjs\` e \`node research/tools/lint-claims.mjs\` ` +
        `com zero erros na sua faixa. NÃO use git.`,
      { label: `reparar:${f.key}`, phase: 'Reparar' },
    ),
  ),
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Medir')

const COBERTURA_SCHEMA = {
  type: 'object',
  required: ['classesTotal', 'classesMecanizadas', 'cobertura', 'semRede', 'veredito'],
  properties: {
    classesTotal: { type: 'number' },
    classesMecanizadas: { type: 'number' },
    cobertura: { type: 'string', description: 'percentual e como foi medido' },
    residual: { type: 'string', description: 'taxa de defeito remanescente numa reamostragem independente' },
    semRede: { type: 'array', items: { type: 'string' }, description: 'classes que continuam sem trava mecânica' },
    veredito: { type: 'string', description: 'a base está pronta para dirigir treino de um atleta natural? Onde não está?' },
  },
}

const [cobertura, redTeam] = await parallel([
  () =>
    agent(
      `${CONTEXTO}\n\n` +
        `Uma rodada de blindagem acabou de acontecer: 8 lentes adversariais acharam classes de ` +
        `defeito, 3 módulos de lint as mecanizaram, e 5 agentes repararam a base por faixa.\n\n` +
        `Classes encontradas:\n${dossie}\n\n` +
        `Inventário da varredura:\n${inventario}\n\n` +
        `SEU TRABALHO É MEDIR SE ISSO VALEU, e a medida precisa ser defensável.\n\n` +
        `1. **Cobertura**: das classes de defeito encontradas por leitura adversarial, quantas ` +
        `passaram a ser pegas por regra determinística? Confira lendo ` +
        `\`research/tools/lint/*.mjs\` e o teste, não confiando no relatório de ninguém.\n\n` +
        `2. **Residual**: reamostre 60 claims de forma INDEPENDENTE (estratifique por faixa e por ` +
        `modo) e meça quantas ainda exibem defeito depois do reparo. Compare com a taxa da auditoria ` +
        `anterior (91,4% fiel, 0% invertida, numa amostra enviesada para risco). A comparação só é ` +
        `honesta se você declarar as diferenças de método entre as duas amostras.\n\n` +
        `3. **Falso conforto**: procure ativamente sinais de que o lint está dando confiança indevida ` +
        `— regra que passa por não ser aplicada, teste que passaria mesmo com a regra desligada, ` +
        `contagem que caiu porque claims foram apagadas em vez de corrigidas. **Compare a contagem ` +
        `total de claims antes (5.090) e depois; queda inexplicada é sinal de alarme.**\n\n` +
        `4. **Veredito**: a base está pronta para dirigir o treino de um atleta natural de 87 kg ` +
        `mirando IPF? Onde ela ainda não está, e o que faltaria. Seja específico e não seja gentil.\n\n` +
        `NÃO edite nada. NÃO use git.`,
      { label: 'medir-cobertura', phase: 'Medir', schema: COBERTURA_SCHEMA },
    ),
  () =>
    agent(
      `${CONTEXTO}\n\n` +
        `VOCÊ É O RED TEAM. Acabaram de blindar esta base com um lint determinístico novo ` +
        `(\`research/tools/lint/*.mjs\` + \`research/tools/lint-claims.mjs\`) somado ao compilador ` +
        `que já existia (\`check-claims.mjs\`, 19 casos de teste).\n\n` +
        `SEU TRABALHO: **quebrar isso.** Escreva claims falsas, enganosas ou perigosas que passem ` +
        `por TODAS as travas. Cada uma que passar é um buraco real.\n\n` +
        `Alvos de ataque sugeridos, e invente outros:\n` +
        `- uma claim que cita verbatim real mas afirma o oposto de forma sutil, sem negação explícita\n` +
        `- uma prescrição perigosa para atleta natural (volume ou intensidade de outlier) apresentada ` +
        `com procedência impecável\n` +
        `- um número correto no param mas com significado deslocado (o valor existe no verbatim, ` +
        `mas se referia a outra coisa)\n` +
        `- uma interpretação sua vestida de tier R, com verbatim que tecnicamente contém as palavras\n` +
        `- uma claim que remove a condição de segurança e mesmo assim satisfaz a regra de conditions\n` +
        `- uma claim montada com dois trechos distantes do mesmo vídeo, cada um verificável, mas cuja ` +
        `combinação diz algo que ele nunca disse\n\n` +
        `Trabalhe num diretório temporário fora de \`research/extract/\` e rode os validadores com ` +
        `\`--extract\` apontando para lá. **NÃO插入 nada na base real.**\n\n` +
        `ENTREGA: \`research/kb/RED-TEAM.md\` com cada ataque, o veredito (passou / foi pego), e — ` +
        `para os que passaram — a regra que os pegaria e por que ela não existe ainda ` +
        `(esqueceram? é cara? é impossível?).\n\n` +
        `Um red team que não consegue quebrar nada provavelmente não tentou o suficiente. Se ao fim ` +
        `você não passou nenhum ataque, diga isso explicitamente e mostre os que chegaram mais perto.\n\n` +
        `NÃO use git.`,
      { label: 'red-team', phase: 'Medir' },
    ),
])

return {
  classesEncontradas: classes.length,
  lentes: classesPorLente.filter(Boolean).length,
  reparosOk: reparos.filter(Boolean).length,
  cobertura,
  redTeam,
  inventario,
}
