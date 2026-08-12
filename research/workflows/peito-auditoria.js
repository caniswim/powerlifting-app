export const meta = {
  name: 'peito-auditoria',
  description: 'Audita a fatia de peitoral do Bloco 1 contra a base e contra o gate, com o atleta relatando dor leve presente no lado lesionado',
  phases: [
    { title: 'Levantar', detail: 'exposicao real do peitoral, o que a base manda, e o que o gate nao cobre' },
    { title: 'Atacar', detail: 'toda citacao resolve? todo numero reproduz? a recomendacao se sustenta?' },
    { title: 'Fechar', detail: 'o parecer que o atleta vai ler, e so os consertos que nao mudam treino' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. NÃO use git. Português do Brasil. Sem emoji em código.

ATLETA: natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu, mira recorde mundial e se
importa com estética (powerbuilding, ~80/20 para força). Treina 5 dias por semana, 75–100 min.
Agacho 250 / supino 170 / terra sumo 268 (treino). **Histórico de lesão de peitoral** — o
Bloco 1 é um protocolo de reexposição gradual do supino.

**O FATO NOVO, e é o motivo desta onda:** o atleta relata **dor leve presente no peitoral, do
lado onde houve a lesão**. Palavras dele: *"levemente dolorido"*, *"bem leve, não é nada
sério"*. Ele não treinou esta semana.

**Não dramatize e não minimize.** Ele descreveu o sintoma dele e a descrição dele é o dado. O
trabalho aqui não é decidir se ele deve treinar — é dizer, com evidência que resolve, o que a
base e o programa mandam fazer nesta situação, e onde eles não têm resposta.

BASE: 6.912 claims em \`research/extract/*.jsonl\`. Vena (R###/V###, **não testado, ~120 kg** —
o que ele diz de si é PESSOAL e não transplanta), Blevins (G###, compete testado IPF),
regulamento IPF (F001). Campos: tier, scope (GERAL/PESSOAL), certainty, **modo**, conditions,
conflicts, topic[] de vocabulário FECHADO com 74 termos, claim pt-BR, verbatim inglês,
params[] com unit e frame.

**DUAS REGRAS DESTA CASA QUE VALEM DOBRADO AQUI:**
- **Só \`modo: prescricao\` pode virar treino.** \`opiniao\`, \`anedota\` e \`narrativa\` são
  contexto, nunca instrução.
- **\`scope: PESSOAL\` é sobre o corpo DELE**, um atleta não testado de 120 kg. Não vira
  regra para um natural de 87 kg sem ressalva escrita.

CONSULTA — a porta que funciona é a gaveta, não o texto livre:
  node research/tools/check-evidence.mjs --topicos            # as 74 gavetas com glosa
  node research/tools/check-evidence.mjs --topic dor --limit 0
  node research/tools/check-evidence.mjs <ids>                # resolve id; ACUSA se for fabricado
VERIFICAÇÃO: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`.

ONDE GRAVAR SCRIPT: \`research/tools/auditoria-peito/\`. **Nunca em /tmp.**

**LIMITE QUE NÃO SE ATRAVESSA:** isto não é avaliação clínica e ninguém aqui é fisioterapeuta.
Se a conclusão honesta for "isto precisa de um profissional", escreva isso.
`

const PROGRAMA = `
## O QUE JÁ ESTÁ ESCRITO, e você tem de ler antes de opinar

\`src/data/program/vena-block1/source/PROGRAMA.md\` **§1.2** é a fonte única do gate de dor, e
o app não tem cópia do limiar: \`scripts/gate-dor.mjs\` converte a tabela em
\`VENA_BLOCK1_PAIN_GATE\`, \`src/domain/painGate.ts\` consome, e \`npm run check:gate\` reprova
o build se o rollup divergir da tabela.

    1 evento >=2/10                    congela TM_supino E o degrau de exposicao. Sem recuo.
    2 eventos >=2/10 em 3 sessoes      recua um degrau do eixo que mudou mais recentemente,
                                       segura 2 semanas
    >=4/10 ou estiramento agudo        encerra a sessao, cai ao degrau das S1-S2 por 1 semana
    RETORNO                            re-sobe so apos 2 semanas com pico <=1/10

Colhido em **toda sessão com supino ou peitoral**, em três momentos: pré-sessão, 1ª série
pausada com carga de trabalho, pós-sessão.

Dois pontos do próprio §1.2 que esta onda existe para examinar:

1. **O floor press são 9 séries semanais sobre o tecido lesionado**, e o documento registra
   que até a última revisão elas eram *"o único bloco de peitoral que o gate não conseguia
   reduzir"*.
2. **"Se o gate disparar entre S8 e S11, o bloco de 2 s é a PRIMEIRA coisa que sai."**

E o alerta \`[PESSOAL]\` que o próprio documento carrega: o Vena passou anos treinando através
de dor pequena com tendinopatia de peitoral e *"ficou patinando sem progresso e sem melhora da
dor"* \`[R27 @05:08]\`. É o modo de falha a evitar, e ele tem exatamente o formato "dói pouco,
dá pra treinar" repetido por meses.

## O BURACO QUE EU JÁ ACHEI E QUE VOCÊ DEVE CONFIRMAR OU DERRUBAR

**O gate só lê dor DURANTE a sessão** — pré, 1ª pausada, pós. O atleta está relatando dor **em
repouso, fora de sessão**, e não existe campo para registrar isso. Se for verdade, o sintoma
que ele tem agora é invisível para o app inteiro.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Levantar')

const levantamentos = await parallel([
  () =>
    agent(
      `${CTX}\n${PROGRAMA}\n\n` +
        `## SUA TAREFA: A EXPOSIÇÃO REAL DO PEITORAL, SEMANA A SEMANA\n\n` +
        `Quanto o peitoral lesionado é carregado neste bloco, de verdade? Não o que o documento ` +
        `diz que carrega — **o que o gerador produz**.\n\n` +
        `1. **Levante toda linha que carrega peitoral**, por semana: supino e variações, floor ` +
        `press, trabalho direto de peito, e o que mais encostar no tecido. Séries, repetições, ` +
        `RPE ou %, e a pausa quando houver.\n` +
        `2. **Some por semana** e mostre a curva do bloco inteiro. Onde está o pico? Quantas ` +
        `séries semanais sobre o peitoral na semana mais pesada?\n` +
        `3. **Os eixos de degrau** — \`SUP-V1\`, \`SUP-V4\`, \`PAUSA-P\`, \`PEC-SETS\`, ` +
        `\`FP-SETS\`, \`FP4-SETS\`, \`FP-RPE\`, \`FP4-RPE\` — qual mexe quando, e qual é o "eixo ` +
        `que mudou mais recentemente" em cada semana? A tabela do §1.2 manda recuar justamente ` +
        `esse, então **se ninguém souber dizer qual é, a regra do segundo degrau não é ` +
        `executável.**\n` +
        `4. **O floor press:** as 9 séries semanais existem mesmo? O gate consegue reduzi-las ` +
        `hoje? Prove pelo código, não pelo documento — \`src/domain/painGate.ts\`, o gerador, e o ` +
        `\`WeekDoc\` que sai dele.\n` +
        `5. **Documento contra código.** Onde o \`PROGRAMA.md\` e o que o gerador produz ` +
        `divergem? É o modo de falha nº 3 desta casa e ele já mordeu aqui antes: o programa ` +
        `mandava congelar a 2/10 e o app só levantava bandeira a 6/10.\n\n` +
        `**Números, não adjetivos.** Toda contagem com o comando que a reproduz. Você NÃO muda ` +
        `nada — levanta.`,
      { label: 'exposicao', phase: 'Levantar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n${PROGRAMA}\n\n` +
        `## SUA TAREFA: O QUE A BASE MANDA FAZER COM DOR LEVE PRESENTE NO PEITORAL\n\n` +
        `Vá gaveta por gaveta — \`dor\`, \`lesao\`, \`peito\`, \`supino\`, \`selecao-exercicio\`, ` +
        `\`autorregulacao\`, \`recuperacao\`, \`proximidade-da-falha\` — com \`--topic X ` +
        `--limit 0\` nas pequenas. **Não use busca por texto livre**: ela é a camada que seis ` +
        `ondas de medição reprovaram, e a gaveta é a porta que funciona.\n\n` +
        `Responda cinco perguntas, cada uma com os ids que a sustentam:\n\n` +
        `1. **Treinar ou parar?** A base tem posição forte e contraintuitiva aqui (V089-24: não ` +
        `descansar completamente na tendinite, porque piora). Ela vale para dor leve presente? ` +
        `Sob que condições? **As condições estão no campo \`conditions\` das claims — leia-as.**\n` +
        `2. **O que sai primeiro?** Carga, séries, amplitude, pausa, frequência? Existe ordem ` +
        `declarada na base, ou o §1.2 inventou a dele?\n` +
        `3. **O contorno.** V089-25 prescreve velocidade lenta, tempo e pausas, porque a tensão ` +
        `no tendão depende do peso E da velocidade. Isso é compatível com um bloco cujo eixo de ` +
        `exposição é justamente a **pausa**? Ou o programa está aumentando exatamente a variável ` +
        `que a base manda usar como contorno?\n` +
        `4. **Qual é o sinal de que está indo mal?** V086-21 condiciona tudo a "os sintomas ` +
        `precisam estar melhorando ao longo do tempo". Como se mede isso com o que o app coleta ` +
        `hoje? Dá para saber se está melhorando, ou só se dói?\n` +
        `5. **Os três limiares conflitam** (V001-06 ~2/10, V079-34 2–3, V138-19 2–4) e a base ` +
        `declara o conflito. O programa escolheu o mais conservador. **Essa escolha se sustenta ` +
        `pelo que está escrito, ou foi preferência disfarçada de derivação?**\n\n` +
        `**Separe \`prescricao\` de \`opiniao\`, e GERAL de PESSOAL, em toda linha.** Uma anedota ` +
        `de um atleta não testado de 120 kg não vira instrução para um natural de 87 kg — e se ` +
        `virar, tem de estar escrito que virou e por quê.\n\n` +
        `**Toda citação com id.** Um id que não resolve é citação fabricada e vale menos que ` +
        `nenhuma — \`check-evidence.mjs\` acusa. Você NÃO muda nada.`,
      { label: 'base', phase: 'Levantar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n${PROGRAMA}\n\n` +
        `## SUA TAREFA: O QUE O GATE NÃO ENXERGA\n\n` +
        `O atleta tem um sintoma **agora**, em repouso, e vai treinar depois. Percorra o caminho ` +
        `inteiro do dado — da pesquisa semanal ao \`WeekDoc\` ao que o app faz — e responda:\n\n` +
        `1. **Dor em repouso, fora de sessão: existe onde registrar?** Se não existe, o sintoma ` +
        `que ele tem hoje é invisível para o app. Confirme ou derrube com o código na mão.\n` +
        `2. **\`estiramento agudo\`** — o §1.2 admite que essa célula não tem comportamento ` +
        `porque não há campo na pesquisa. Isso ainda é verdade?\n` +
        `3. **A janela de 3 sessões**: ela conta sessões de supino e atravessa a virada de ` +
        `semana. Se o atleta ficar duas semanas sem supinar, o que acontece com a janela e com o ` +
        `\`RETORNO\`? Um \`RETORNO\` que exige "2 semanas com pico ≤1/10 em todas as sessões de ` +
        `supino" é satisfeito **vacuamente** por duas semanas sem nenhuma sessão de supino? ` +
        `**Teste isso** — é a diferença entre re-subir degrau por melhora e re-subir por ` +
        `ausência de dado.\n` +
        `4. **O caminho da conversa semanal**: quando ele reportar isso, o que a conversa recebe? ` +
        `A tela traz as claims do limiar de dor, ou o agente que conversa fica sem contexto?\n\n` +
        `### O que você PODE mudar, e o que não\n\n` +
        `**PODE:** consertar instrumentação — campo que falta, teste que falta, aviso que falta, ` +
        `divergência entre documento e código.\n` +
        `**NÃO PODE:** mudar limiar, volume, degrau, ou qualquer número que altere o treino dele. ` +
        `Isso é decisão do atleta e ele vai ler o parecer antes. **Proponha por escrito, com o ` +
        `diff descrito, e não aplique.**\n\n` +
        `Se você mexer em código, \`npm run check:kb\`, \`npm run check:gate\` e ` +
        `\`npm run build\` verdes ao sair — e lembre que \`check:gate\` compara a tabela do §1.2 ` +
        `com o comportamento real, então ele é o teste que importa.`,
      { label: 'gate', phase: 'Levantar', effort: 'high' },
    ),
])

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['idsFabricados', 'idsConferidos', 'numerosQueNaoReproduzem', 'furos', 'veredito'],
  properties: {
    idsConferidos: { type: 'number', description: 'quantos ids citados voce resolveu' },
    idsFabricados: { type: 'array', items: { type: 'string' }, description: 'ids citados que nao existem ou nao dizem o que se afirmou' },
    numerosQueNaoReproduzem: { type: 'array', items: { type: 'string' }, description: 'cada numero de volume/serie/semana que voce nao conseguiu reproduzir' },
    escopoTransplantado: { type: 'array', items: { type: 'string' }, description: 'onde uma claim PESSOAL ou modo nao-prescricao virou instrucao' },
    buracoDoGateConfirmado: { type: 'boolean', description: 'dor em repouso e mesmo invisivel para o app' },
    retornoVacuo: { type: 'boolean', description: 'duas semanas sem supino satisfazem o RETORNO por ausencia de dado' },
    furos: { type: 'array', items: { type: 'string' } },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n${PROGRAMA}\n\n` +
    `## VOCÊ ATACA O PARECER ANTES DE ELE CHEGAR AO ATLETA\n\n` +
    `Três agentes levantaram. **Não acredite em nenhum.** Nesta casa, seis ondas seguidas ` +
    `produziram relatório otimista, e uma delas publicou um achado inteiro construído sobre um ` +
    `comando que não fazia o que o autor pensava. **Confira o que cada comando de fato executa ` +
    `antes de aceitar a conclusão dele.**\n\n` +
    `Desta vez o custo do erro não é uma métrica: é o peitoral de uma pessoa.\n\n` +
    `### Exposição\n\n${levantamentos[0] ?? '(sem relato)'}\n\n` +
    `### O que a base manda\n\n${levantamentos[1] ?? '(sem relato)'}\n\n` +
    `### O que o gate não enxerga\n\n${levantamentos[2] ?? '(sem relato)'}\n\n` +
    `### O que fazer\n\n` +
    `**1. Resolva TODO id citado.** \`check-evidence.mjs <ids>\` acusa fabricado. Para cada um, ` +
    `confira três coisas: que existe, que **diz o que foi afirmado que diz** (leia o verbatim, ` +
    `não só a tradução), e que o \`modo\` e o \`scope\` permitem o uso que se fez dele. Uma ` +
    `claim \`opiniao\` citada como prescrição é o defeito que esta base foi construída para ` +
    `impedir.\n\n` +
    `**2. Reproduza TODO número de volume.** Séries semanais, picos, contagem de floor press. ` +
    `Rode você mesmo contra o gerador. Número que não reproduz é número que não entra no ` +
    `parecer.\n\n` +
    `**3. Teste o \`RETORNO\` vacuo você mesmo**, com cenário no \`buildWeekDoc\` real: duas ` +
    `semanas sem supino satisfazem "2 semanas consecutivas com pico ≤1/10 em todas as sessões de ` +
    `supino"? Se sim, o app re-sobe degrau por ausência de dado, e isso é grave para um atleta ` +
    `que acabou de passar uma semana sem treinar.\n\n` +
    `**4. Ataque a recomendação, não só as contas.** Se o parecer manda tirar alguma coisa, ` +
    `pergunte: é a coisa certa a sair, pela ordem que a base declara, ou é a mais fácil de ` +
    `cortar? Se manda manter, pergunte o mesmo do outro lado.\n\n` +
    `**5. Procure o conforto.** Um parecer que diz "está tudo bem, siga o plano" para um atleta ` +
    `com dor presente no tecido lesionado precisa de evidência mais forte que o contrário, não ` +
    `mais fraca. E o inverso também: alarme sem id que o sustente é ruído caro.\n\n` +
    `Grave seus scripts em \`research/tools/auditoria-peito/\`. Sem diplomacia.`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(
  `ids fabricados: ${(ataque?.idsFabricados ?? []).length} · números que não reproduzem: ` +
    `${(ataque?.numerosQueNaoReproduzem ?? []).length} · buraco do gate: ${ataque?.buracoDoGateConfirmado ?? '?'} · ` +
    `RETORNO vácuo: ${ataque?.retornoVacuo ?? '?'}`,
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n${PROGRAMA}\n\n## FECHAR — O PARECER QUE O ATLETA VAI LER\n\n` +
    `**Exposição:** ${levantamentos[0] ?? '(sem relato)'}\n\n` +
    `**Base:** ${levantamentos[1] ?? '(sem relato)'}\n\n` +
    `**Gate:** ${levantamentos[2] ?? '(sem relato)'}\n\n` +
    `**Ataque:** ids fabricados ${JSON.stringify(ataque?.idsFabricados ?? [])}, números que não ` +
    `reproduzem ${JSON.stringify(ataque?.numerosQueNaoReproduzem ?? [])}, escopo transplantado ` +
    `${JSON.stringify(ataque?.escopoTransplantado ?? [])}, buraco do gate=` +
    `${ataque?.buracoDoGateConfirmado ?? '?'}, RETORNO vácuo=${ataque?.retornoVacuo ?? '?'}\n` +
    `${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **Escreva \`research/kb/PEITO-PARECER.md\`** — e ele é para o ATLETA ler, não para um ` +
    `agente. Português direto, sem jargão de ferramenta. Estrutura:\n\n` +
    `   - **O que fazer nesta semana**, em três linhas no máximo, no topo. Se a resposta ` +
    `depender de em que semana do bloco ele está, **diga as duas ou três versões** em vez de ` +
    `pedir para ele voltar e perguntar.\n` +
    `   - **Por quê**, com os ids ao lado de cada afirmação e o \`modo\`/\`scope\` de cada um ` +
    `explicitados quando importarem.\n` +
    `   - **O que a base NÃO sabe** sobre o caso dele. Esta seção não pode ficar vazia: a base é ` +
    `de um canal do YouTube de um atleta não testado de 120 kg, e o atleta é natural de 87 kg. ` +
    `Onde o conselho é extrapolação, diga que é.\n` +
    `   - **Quando isto vira conversa com fisioterapeuta**, com critério concreto — prazo, ` +
    `tendência, sinal — e não "se piorar".\n\n` +
    `2. **Consertos de instrumentação que NÃO mudam o treino**, se o ataque confirmou: campo que ` +
    `falta, teste que falta, \`RETORNO\` vácuo, divergência documento-código. **Nenhum limiar, ` +
    `nenhum volume, nenhum degrau** — isso é decisão dele e o parecer existe para ele decidir.\n\n` +
    `3. **Se o \`RETORNO\` vácuo foi confirmado, ele é o item de segurança da onda.** Um app que ` +
    `re-sobe degrau porque não houve dado é pior que um app sem gate, porque parece que ` +
    `verificou. Conserte a instrumentação e **escreva no parecer o que mudou**.\n\n` +
    `4. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.**\n\n` +
    `5. **Atualize \`research/kb/DOR-E-TREINO.md\` e o \`RUNBOOK.md\` §8** com o que ficou aberto. ` +
    `Não resolvido continua na lista.\n\n` +
    `6. **Uma linha honesta no fim do parecer:** este documento foi produzido por agentes lendo ` +
    `uma base derivada de vídeos, atacado por um agente adversarial, e **não é avaliação ` +
    `clínica**.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  idsFabricados: ataque?.idsFabricados ?? [],
  numerosQueNaoReproduzem: ataque?.numerosQueNaoReproduzem ?? [],
  escopoTransplantado: ataque?.escopoTransplantado ?? [],
  buracoDoGate: ataque?.buracoDoGateConfirmado,
  retornoVacuo: ataque?.retornoVacuo,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
