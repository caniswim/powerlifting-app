export const meta = {
  name: 'onda-2b-roteamento',
  description: 'Refaz a recuperação sobre roteamento por tópico fechado, com canários escritos antes e escondidos do construtor, e fecha as duas dívidas de segurança',
  phases: [
    { title: 'Canários', detail: 'perguntas cuja resposta está provadamente na base, escritas antes do conserto' },
    { title: 'Construir', detail: 'roteamento por tópico + dívidas de segurança do gate de dor' },
    { title: 'Atacar', detail: 'refaz as sete falhas e roda os canários que o construtor nunca viu' },
    { title: 'Fechar', detail: 'build verde, veredito honesto' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. NÃO use git. Português do Brasil. Sem emoji em código.

ATLETA: natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu, **histórico de lesão de
peitoral** — o bloco atual é reexposição gradual do supino. Agacho 250 / supino 170 / terra
sumo 268 (treino).

BASE: 6.909 claims em \`research/extract/*.jsonl\`, um arquivo por vídeo. 4.947 Vena (R###,
não testado, ~120 kg), 1.819 Blevins (G###, compete testado IPF), 143 regulamento IPF (F001,
tier O). Campos por claim: tier, scope (GERAL/PESSOAL), certainty, modo (prescricao /
opiniao / mecanismo / fato / estudo / anedota / narrativa / relato-de-programa /
avaliacao-de-terceiro), conditions, conflicts, **topic[] de vocabulário FECHADO com 74
termos**, claim pt-BR, verbatim literal inglês, params[] com unit e frame. O vídeo tem
\`genero\` no manifesto.

CONSULTA:
  node research/tools/check-evidence.mjs <ids>            # resolve id; acusa fabricado
  node research/tools/check-evidence.mjs --grep "termo" --topic X --modo Y --scope Z --genero W --limit 0
  node research/tools/check-evidence.mjs --busca "pergunta em linguagem natural"
VERIFICAÇÃO: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`,
\`node research/tools/check-canarios.mjs\`.

O PRINCÍPIO: **onde um compilador pode verificar, agente não deve.** Limite: determinismo
prova fidelidade à fonte, não correção da fonte.

MODOS DE FALHA DESTA CASA, todos reincidentes:
1. Copiar convenção errada do vizinho e chamar de padrão.
2. Trava estreita empurra o dado para fora da trava.
3. Documento e código divergem em silêncio.
4. **Trava que se testa a si mesma** — compara valor derivado contra o mesmo valor derivado.
   Ontem apareceu três vezes, uma delas DENTRO do arquivo que cita este modo de falha.
5. Relatório de agente que diz sucesso sem sucesso.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Canários')

const CANARIO_SCHEMA = {
  type: 'object',
  required: ['canarios'],
  properties: {
    canarios: {
      type: 'array',
      description: '12 a 18 perguntas presente-escondido',
      items: {
        type: 'object',
        required: ['id', 'pergunta', 'idsEsperados', 'comoVoceProvou', 'porqueEhEscondido'],
        properties: {
          id: { type: 'string', description: 'P01, P02, …' },
          pergunta: { type: 'string', description: 'na voz do atleta, do jeito que ele digitaria numa conversa de domingo' },
          idsEsperados: { type: 'array', items: { type: 'string' }, description: 'os ids que uma resposta boa TEM de encontrar' },
          comoVoceProvou: { type: 'string', description: 'o comando exato que provou que esses ids existem e respondem' },
          porqueEhEscondido: { type: 'string', description: 'por que a pergunta do atleta não contém o vocabulário da claim' },
          topico: { type: 'string', description: 'o tópico do vocabulário fechado onde a resposta mora' },
        },
      },
    },
  },
}

const canarios = await agent(
  `${CTX}\n\n` +
    `## SUA TAREFA: ESCREVER OS CANÁRIOS \`presente-escondido\` — ANTES DO CONSERTO E SEM ELE\n\n` +
    `Você escreve o teste. Outro agente vai consertar a camada de busca **sem ver o que você ` +
    `escreveu**. É a única forma de o teste valer: ontem o construtor escreveu o próprio canário e ` +
    `calibrou os termos de busca **sobre a resposta** (\`buscaCega.termos = ["2 a 3%"]\`), o que ` +
    `mede zero, porque nenhum atleta digita a resposta que está procurando.\n\n` +
    `### O que é um canário \`presente-escondido\`\n\n` +
    `Uma pergunta cuja resposta **está comprovadamente na base**, formulada com as palavras que o ` +
    `ATLETA usaria — que não são as palavras da claim. Se a busca não achar, a camada de ` +
    `recuperação está quebrada, e é a única coisa que vai avisar quando ela regredir.\n\n` +
    `O caso canônico, achado ontem: *"quanto tempo descansar entre séries"*. O tópico fechado ` +
    `\`descanso-entre-series\` tem 12 claims, V038-07 e V074-10 têm param tipado em minutos — e a ` +
    `busca livre devolveu, do conjunto todo, só G015-11, que é \`relato-de-programa\` do GZCLP, ` +
    `exatamente a gaveta que a base manda nunca tratar como prescrição.\n\n` +
    `### Método\n\n` +
    `1. **Ache primeiro, pergunte depois.** Vá aos tópicos com \`--topic\` e \`--limit 0\`, ache ` +
    `claims que respondem bem alguma coisa, anote os ids, e **só então** escreva a pergunta que um ` +
    `atleta faria — sem usar as palavras da claim. Ordem inversa produz canário fácil.\n` +
    `2. **Prove que os ids existem e respondem.** Registre o comando exato. Um canário cujo ` +
    `\`idsEsperados\` não resolve é pior que canário nenhum.\n` +
    `3. **Cubra a diversidade que importa:** o assunto que o canal chama por outro nome (\`training ` +
    `cycle\` para o que o atleta chama de bloco); o número que mora em \`params.name\` e não na ` +
    `prosa; o que só aparece filtrando fora do filtro de segurança; o assunto que existe nos DOIS ` +
    `corpora com termos diferentes; e ao menos dois em que a resposta certa exige distinguir ` +
    `\`prescricao\` de \`relato-de-programa\`.\n` +
    `4. **Inclua pelo menos três de peitoral, supino e dor**, que é onde o erro machuca.\n` +
    `5. **NÃO conserte nada. NÃO escreva ferramenta. NÃO toque em \`research/tools/busca.mjs\` nem ` +
    `em \`CANARIOS.json\`.** Sua entrega é o objeto estruturado; quem grava sou eu, depois do ` +
    `conserto. Se você gravar em arquivo, o construtor lê e o teste morre.\n\n` +
    `Seja duro. Um canário que passa hoje sem conserto nenhum não mede nada — antes de entregar, ` +
    `**rode \`--busca\` na sua própria pergunta** e descarte as que já funcionam.`,
  { label: 'canarios', phase: 'Canários', schema: CANARIO_SCHEMA, effort: 'high' },
)

const lista = canarios?.canarios ?? []
log(`${lista.length} canários presente-escondido escritos, e escondidos do construtor`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Construir')

const obras = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: REFAZER A RECUPERAÇÃO SOBRE ROTEAMENTO POR TÓPICO\n\n` +
        `A camada de busca de ontem (\`research/tools/busca.mjs\`, \`--busca\`) reprovou no ataque ` +
        `cego. Leia \`research/kb/RECUPERACAO.md\` e a lista de furos no fim do ` +
        `\`research/kb/ONDA-2B.md\`. Os três que definem o problema:\n\n` +
        `- **Precisão destruída pela expansão de vocabulário**: uma seção inteira disparava quando ` +
        `UMA palavra de 4+ letras casava, e "semana" está em toda pergunta. Consertado, mas mostra ` +
        `a fragilidade do casamento por texto.\n` +
        `- **\`TETO_VIZINHANCA\` é os dois lados da comparação** — o canário importa a constante da ` +
        `ferramenta que ele mede. Trocar 40 por 400 passa verde.\n` +
        `- **\`busca.test.mjs\` roda sobre 12 claims sintéticas** e não cobre a fiação: quebrar o ` +
        `caminho real passa verde.\n\n` +
        `### A correção de rumo, e é o coração desta tarefa\n\n` +
        `**A busca livre está resolvendo um problema que a base já resolveu.** Existe um vocabulário ` +
        `**fechado** de 74 tópicos, e no caso que a busca livre errou feio — \`descanso-entre-series\` ` +
        `— \`--topic\` devolve as 12 claims na hora, com param tipado em minutos.\n\n` +
        `O roteamento certo é **pergunta → tópico → claims**, não pergunta → texto. E ele é melhor ` +
        `por três razões: o alvo é fechado e pequeno (74), mapear pergunta a tópico é o que um ` +
        `modelo faz bem, e **um compilador pode conferir o resultado**, porque a lista é fechada — ` +
        `tópico inventado é erro, não silêncio.\n\n` +
        `Desenhe e implemente. Você julga a forma, mas ela precisa: partir da pergunta em linguagem ` +
        `natural; resolver para um ou mais tópicos do vocabulário fechado; e só então buscar dentro, ` +
        `com o texto livre servindo de **ordenação**, não de porta de entrada. Cuide de dois casos ` +
        `que vão morder: pergunta que não mapeia para tópico nenhum (dizer isso é melhor que ` +
        `devolver lixo), e pergunta que mapeia para tópico grande demais (\`agacho\` tem 990).\n\n` +
        `O sinal para o mapeamento já existe e não precisa ser inventado: os tópicos estão em ` +
        `\`research/kb/PROTOCOLO-EXTRACAO.md\`, o \`research/kb/VOCABULARIO.md\` de ontem tem ` +
        `sinônimos por tópico, e as próprias claims mostram como o canal fala de cada assunto.\n\n` +
        `### Duas regras de higiene, e as duas foram violadas ontem\n\n` +
        `1. **Nenhuma trava pode ler a constante que ela verifica.** Se um limite de posição existe, ` +
        `ele é dado do teste, não da ferramenta.\n` +
        `2. **Teste sobre corpus sintético não prova recuperação.** O que prova é a base real. Se ` +
        `você escrever teste, que ele quebre quando a fiação quebra.\n\n` +
        `### Como você sabe que funcionou\n\n` +
        `Contra os casos MEDIDOS, que você já conhece: Q05 (V170-34, V175-53 — a pergunta usou ` +
        `\`six times\`, a claim diz \`six days a week\`), Q16 (V070-20, V125-07, V108-08 — nunca ` +
        `tentou \`training cycle\`), Q19 (V010-13), Q11 (V033-03/04/05 — o filtro de segurança ` +
        `escondeu). Mostre o comando e a saída para cada um.\n\n` +
        `**Existe um conjunto de canários que você NÃO vai ver**, escrito antes de você por outro ` +
        `agente, com perguntas na voz do atleta cujas respostas estão provadas na base. É contra ele ` +
        `que esta tarefa vai ser julgada. Otimizar para os quatro casos acima e ir mal nele é o ` +
        `resultado esperado se você tratar isto como conserto pontual em vez de camada.\n\n` +
        `\`npm run check:kb\` e \`npm run build\` verdes. Atualize \`research/kb/RECUPERACAO.md\`.`,
      { label: 'roteamento', phase: 'Construir', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: DUAS DÍVIDAS DE SEGURANÇA DO GATE DE DOR\n\n` +
        `**1. A trava mente sobre o que cobre.** \`research/kb/DOR-E-TREINO.md\` §5 afirma que ` +
        `qualquer claim futura que prescreva um número de dor sem condição quebra o build. É falso, ` +
        `e foi provado ontem: \`check-claims.mjs\` (~linha 346) exige ` +
        `\`modo === 'prescricao'\`, e **V138-19** — limiar de 2 a 4/10, quatro params \`escala_dor\` ` +
        `— é \`modo: opiniao\`. Apagar as \`conditions\` dela não muda o resultado do checker. ` +
        `Ampliou-se o eixo do frame e deixou-se aberto o eixo do modo, e foi justamente por ser ` +
        `\`opiniao\` que ela escapou da medição original.\n\n` +
        `Conserte a trava e conserte a afirmação do documento. **Cuidado com o excesso:** ` +
        `\`mecanismo\` e \`fato\` também podem carregar número de dor sem serem instrução ` +
        `("nociceptores respondem a partir de X") — decida qual é o eixo certo e justifique, em vez ` +
        `de varrer todos os modos e produzir aviso que ninguém lê. Prove por mutação: apague as ` +
        `\`conditions\` de V138-19 e exija que o checker acuse; restaure depois.\n\n` +
        `**2. Quatro claims declaradas cruas continuam cruas.** O §2 do \`DOR-E-TREINO.md\` lista ` +
        `nove; o §4.1 tratou cinco. **V138-08, V138-13, V138-24 e V138-18** ficaram sem \`conditions\` ` +
        `e sem uma linha explicando por quê. Abra as quatro, leia o verbatim com contexto na ` +
        `transcrição, e ou ligue a condição que existe no corpus, ou explique por escrito por que ` +
        `elas não precisam. **Não invente ressalva que ele não disse** — condição fabricada é pior ` +
        `que condição ausente, porque dá falsa sensação de completude.\n\n` +
        `### O teste é comportamental\n\n` +
        `Simule a consulta real — *"senti uma fisgada de 3/10 no peitoral na terceira série de ` +
        `supino pausado, continuo?"* — e mostre a saída. O \`PROGRAMA.md\` §1.2 manda **congelar em ` +
        `≥2/10**. Se a base ainda serve "2 a 3/10 é boa faixa para empurrar" sem a ressalva do lado, ` +
        `o conserto não pegou, por melhor que esteja o documento.\n\n` +
        `Você é dono de \`check-claims.mjs\`, do \`DOR-E-TREINO.md\` e dos arquivos de claim de dor. ` +
        `Outro agente trabalha na camada de busca e não vai encostar neles. ` +
        `\`npm run check:kb\` e \`npm run check:gate\` verdes.`,
      { label: 'divida-dor', phase: 'Construir', effort: 'high' },
    ),
])

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['canariosPassaram', 'canariosTotal', 'seteDestravadas', 'furos', 'veredito'],
  properties: {
    canariosPassaram: { type: 'number' },
    canariosTotal: { type: 'number' },
    seteDestravadas: { type: 'number', description: 'quantas das sete falhas medidas o conserto de fato destrava, verificado às cegas' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito com o comando que reproduz' },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n\n` +
    `## VOCÊ JULGA O CONSERTO DA RECUPERAÇÃO — E VOCÊ TEM O QUE ELE NÃO TEVE\n\n` +
    `Relato de quem construiu:\n\n${obras[0] ?? '(sem relato)'}\n\n` +
    `**Não acredite no relato.** Ontem três frentes foram entregues como prontas e as três ` +
    `reprovaram.\n\n` +
    `### Os canários que o construtor nunca viu\n\n` +
    `Escritos por outro agente ANTES do conserto, cada um com os ids provados na base:\n\n` +
    lista
      .map((c) => `**${c.id}** [${c.topico ?? '—'}] ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   é escondido porque: ${c.porqueEhEscondido}`)
      .join('\n\n') +
    `\n\n### O que fazer, nesta ordem\n\n` +
    `**1. Rode cada canário pela camada nova**, do jeito que um agente de conversa rodaria — a ` +
    `pergunta como está escrita, sem ajustar termo. Conte quantos devolvem os \`idsEsperados\` numa ` +
    `posição em que alguém de fato os leria. **Este número é o produto desta onda.**\n\n` +
    `**2. Refaça as sete falhas medidas às cegas**: Q02, Q05, Q11, Q14, Q16, Q19, Q29 ` +
    `(\`research/kb/AVALIACAO.md\`, diagnóstico em \`research/kb/MEDICAO-02.md\`). Responda do zero ` +
    `e só então compare com os ids que o \`MEDICAO-02.md\` diz estarem escondidos. Ontem o ` +
    `construtor reportou destravadas que o ataque cego não conseguiu reproduzir.\n\n` +
    `**3. Ataque por mutação, procurando o modo de falha nº 4.** Alguma trava lê a constante que ` +
    `verifica? Algum teste roda sobre corpus sintético e passa quando a fiação real quebra? ` +
    `Reproduza com o comando.\n\n` +
    `**4. Ataque a precisão, que é o custo esquecido.** Roteamento por tópico pode devolver 990 ` +
    `claims de \`agacho\` e chamar isso de achar. Rode perguntas ESTREITAS e veja se a resposta é ` +
    `estreita. E rode uma pergunta que não mapeia para tópico nenhum: a camada diz que não sabe, ou ` +
    `inventa?\n\n` +
    `**5. Julgue a dívida de dor** — relato: ${obras[1] ?? '(sem relato)'} — pelo teste ` +
    `comportamental: *"fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"*. ` +
    `A base ainda serve "2 a 3/10 é boa faixa para empurrar" sem a ressalva? E a trava nova acusa ` +
    `mesmo quando as \`conditions\` de V138-19 somem?\n\n` +
    `Seja específico e sem diplomacia. Se o número de canários que passa for baixo, **diga o número ` +
    `baixo** — a onda existiu para medir isso, e um número honesto vale mais que um conserto ` +
    `celebrado.`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(`canários: ${ataque?.canariosPassaram ?? '?'}/${ataque?.canariosTotal ?? lista.length} · sete falhas destravadas: ${ataque?.seteDestravadas ?? '?'}/7`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 2B\n\n` +
    `**Roteamento:** ${obras[0] ?? '(sem relato)'}\n\n` +
    `**Dívida de dor:** ${obras[1] ?? '(sem relato)'}\n\n` +
    `**Ataque:** canários ${ataque?.canariosPassaram ?? '?'}/${ataque?.canariosTotal ?? '?'}, ` +
    `sete falhas ${ataque?.seteDestravadas ?? '?'}/7.\n${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.** Nada sai daqui ` +
    `vermelho.\n\n` +
    `2. **Grave os canários \`presente-escondido\` em \`research/kb/CANARIOS.json\`** e ligue-os ao ` +
    `\`check-canarios.mjs\`. Eles são a quarta família e a única que mede recuperação. **O limite de ` +
    `posição é dado do canário, não constante importada da ferramenta de busca** — foi assim que a ` +
    `trava se testou a si mesma ontem. Os que o ataque mostrou que FALHAM entram assim mesmo, ` +
    `marcados como falhando: canário que só entra depois de passar é canário decorativo.\n\n` +
    `Aqui estão eles:\n\n\`\`\`json\n${JSON.stringify(lista, null, 1).slice(0, 6000)}\n\`\`\`\n\n` +
    `3. **Consertos pequenos e claros que o ataque apontou**, se houver. Difuso, registre.\n\n` +
    `4. **Atualize \`research/kb/ESTADO.md\`** (o que saiu de "julgamento de agente" para "provado ` +
    `por compilador") e o **\`RUNBOOK.md\` §8** — divergências resolvidas saem, novas entram, **não ` +
    `resolvidas continuam na lista**.\n\n` +
    `5. **Escreva o veredito no topo do \`RECUPERACAO.md\`, em duas linhas:** a camada de ` +
    `recuperação acha o que a base tem, sim ou não, com o número de canários. Sem adjetivo.\n\n` +
    `6. **\`research/kb/ONDA-2C.md\`**, lista de trabalho: triagem de banalidade (#34, com a ` +
    `calibração de dois agentes na mesma amostra de 150 e o corte em 85 % de concordância), fatos do ` +
    `atleta como tier U (#28 — a calibração de RPE fica FORA, ele não vai treinar esta semana), ` +
    `Whisper nos 53 \`suspect\` (#31), e por último ledger de contradições e sínteses (#25, #26), ` +
    `porque reparo vem antes de síntese.\n\n` +
    `**Não proponha ingerir mais corpus** — o \`MEDICAO-02.md\` mediu que o gargalo não é conteúdo.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  canarios: `${ataque?.canariosPassaram ?? '?'}/${ataque?.canariosTotal ?? lista.length}`,
  seteDestravadas: ataque?.seteDestravadas,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
