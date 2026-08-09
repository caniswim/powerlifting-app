export const meta = {
  name: 'vena-block1-rebuild',
  description: 'Reconstrói o programa de treino contra a REVISÃO 2, com resolução de conflitos antes da escrita e verificação adversarial depois',
  whenToUse: 'Quando o design.md mudar substancialmente e o programa precisar ser reconstruído com garantia de fidelidade',
  phases: [
    { title: 'Viabilidade', detail: 'resolve conflitos entre requisitos ANTES de escrever' },
    { title: 'Spec', detail: 'funde em uma especificação única e executável' },
    { title: 'Build', detail: '5 autores de dia em paralelo, coerência cruzada, e um integrador escrevendo' },
    { title: 'Verificar', detail: 'auditoria de citações + 4 lentes, cada uma com seu relatório anterior' },
    { title: 'Triagem', detail: 'consolida em must-fix / aceitar / decisão do usuário' },
    { title: 'Corrigir', detail: 'escritor único aplica só os must-fix' },
  ],
}

const SCRATCH = '/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad'
const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CONTEXTO = `
REPO: ${REPO} (React 19 + TS + Vite, PWA)
PESQUISA: ${SCRATCH}/prog/

LEITURA OBRIGATÓRIA, nesta ordem:
1. ${SCRATCH}/prog/design.md — o contrato. Seções §4-B, §11-A2, §11-A e §13-B (REVISÃO 2)
   têm PRECEDÊNCIA sobre as anteriores onde houver conflito.
2. ${SCRATCH}/prog/baseline.md — marcas legais canônicas: agacho 215, supino 160, terra 240.
   NUNCA usar as declaradas (250/170/268).

NÃO leia ${SCRATCH}/corpus/ (transcrições completas, grande demais).
Detalhe cru só por grep dirigido em ${SCRATCH}/extract/*.md.

ATLETA: 28a, 178cm, 87kg, natural, nunca competiu. 11 anos de treino, ~10 em bodybuilding.
Lesão de peitoral perto da inserção no úmero há 4 meses, hoje assintomático; úmero de 31cm.
5 dias/semana, 75-100 min. Recomp em manutenção (2600 kcal, peso estável).
ACADEMIA — inventário confirmado pelo atleta (design §0-B). EXISTE: rack, barra olímpica de
marcação dupla, halteres até 40kg, leg press 45 e vertical, mesa flexora, máquinas de puxada,
PECK DECK e crucifixo invertido, CADEIRA EXTENSORA, MÁQUINA DE PANTURRILHA, BANCO INCLINADO
AJUSTÁVEL, cinto, magnésio, faixa de joelho, munhequeira, strap. NÃO EXISTE: GHD.
Anilha de plástico grossa (mecanismo de inflação do terra). Incremento de desenho: 2,5 kg.
`

const FEASIBILITY_SCHEMA = {
  type: 'object',
  required: ['conflicts', 'recommendation'],
  properties: {
    conflicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['requisitos', 'natureza', 'opcoes', 'recomendacao'],
        properties: {
          requisitos: { type: 'array', items: { type: 'string' }, description: 'ids das seções do design que colidem, ex R3 e R14' },
          natureza: { type: 'string', description: 'por que são mutuamente inviáveis, com aritmética' },
          opcoes: { type: 'array', items: { type: 'string' }, description: 'saídas concretas, com o custo de cada uma' },
          recomendacao: { type: 'string' },
          precisaDecisaoHumana: { type: 'boolean' },
        },
      },
    },
    recommendation: { type: 'string', description: 'resumo executável' },
  },
}

const TRIAGE_SCHEMA = {
  type: 'object',
  required: ['mustFix', 'aceitar', 'decisaoUsuario'],
  properties: {
    mustFix: {
      type: 'array',
      items: {
        type: 'object',
        required: ['local', 'defeito', 'correcao', 'fonte'],
        properties: {
          local: { type: 'string' },
          defeito: { type: 'string' },
          correcao: { type: 'string' },
          fonte: { type: 'string', description: 'qual lente reportou' },
          gravidade: { type: 'string' },
        },
      },
    },
    aceitar: { type: 'array', items: { type: 'string' }, description: 'achados que NÃO devem ser corrigidos, com o motivo' },
    decisaoUsuario: { type: 'array', items: { type: 'string' }, description: 'o que exige decisão humana, formulado como pergunta' },
  },
}

// ---------------------------------------------------------------------------
// FASE 1 — Viabilidade. Read-only, barato, e evita o desperdício mais caro:
// construir 18 semanas contra requisitos que não podem coexistir.
// ---------------------------------------------------------------------------
phase('Viabilidade')

const viab = await parallel([
  () => agent(`${CONTEXTO}

Você é analista de VIABILIDADE DE VOLUME E ORÇAMENTO. Não escreva programa nenhum. Sua entrega é aritmética.

A REVISÃO 2 (§13-B) impõe simultaneamente:
- R3: supino >= 22 séries/semana (R116: "supino ~ agacho+terra, provavelmente mais")
- R4: costas >= 12 séries/semana E acima de bíceps e deltoide lateral
- R5: deltoide lateral+posterior <= 12 séries/semana
- R7: high bar ~50% do volume de agacho POR SÉRIES
- R9: oscilação de back-offs 5/4/5/4 entre semanas
- R14: D5 hoje dá 102,8 min lendo o teto das faixas de descanso, e D1 fica abaixo do piso de 75 min
- R15: tonelagem axial de D4 é 1,7x o terra de D5, mascarando o alvo
- §10-B: braço e ombro com ênfase real (bíceps e delt lateral têm crédito ZERO do SBD)
- Restrição dura: 5 dias, 75-100 min por sessão

Rode \`cd ${REPO} && npm run validate:program\` para ver as contagens atuais por levantamento e por grupo muscular.

TAREFA: construa um modelo de alocação semanal — séries por levantamento, séries por grupo muscular, e minutos por sessão usando o TETO das faixas de descanso (é a prescrição literal) mais 5-10 min de aquecimento geral. Determine se os requisitos acima cabem. Onde NÃO couberem, nomeie o conflito com a aritmética e dê opções concretas de corte, com o custo de cada uma.

RESTRIÇÃO INEGOCIÁVEL: o que sair de D5 não pode ser braço/ombro nem o trabalho protetivo de peitoral alongado — é a prioridade declarada do atleta e o tecido lesionado.

Devolva o schema. Seja específico: "cortar X de D5 libera N min" e não "reduzir volume".`,
    { label: 'viab:volume-tempo', phase: 'Viabilidade', schema: FEASIBILITY_SCHEMA }),

  () => agent(`${CONTEXTO}

Você é analista de VIABILIDADE DE SEGURANÇA vs DOSE. Não escreva programa nenhum.

Há uma tensão frontal na REVISÃO 2:
- R2 exige teto de RPE subindo até 9 nas semanas 14-16, porque a lente de dose achou ZERO exposições >= RPE 8,5 em 16 semanas, num bloco cujo diagnóstico é "zero prática de expressar força máxima". Pela letra de Pak (RPE 7,5-9,5) a dose efetiva de força seria 0, não 5.
- §4-B exige rampa de duração de pausa e gate de dor, porque o mecanismo da lesão de peitoral é TEMPO EM COMPRIMENTO MÁXIMO e o teto de RPE não toca nisso.
- R1 exige re-ancoragem contínua porque +6,9 kg de ganho no agacho já derruba a back-off abaixo de 80%.
- §11-C: o bloco não passa de ~87% do máximo projetado de competição em 12 meses.

Leia também ${SCRATCH}/prog/params_tecnica.md secção 5 (lesão) e ${SCRATCH}/prog/review_seguranca.md e ${SCRATCH}/prog/review_dose.md — os dois relatórios que geraram esta tensão.

TAREFA: determine se as quatro exigências coexistem. Produza:
1. A rampa de RPE definitiva por semana e POR LEVANTAMENTO (o supino pode precisar de rampa diferente do agacho, dado o peitoral).
2. A rampa de duração de pausa definitiva, cruzada com a rampa de RPE — mostre que o pico de duração de pausa NÃO coincide com o pico de RPE no supino.
3. A regra de ação bidirecional do gauge set, escrita de forma implementável.
4. Onde as exigências forem incompatíveis, nomeie e dê opções.

Toda decisão citando a base. Onde a base for omissa, escreva LACUNA e marque como interpretação. Devolva o schema.`,
    { label: 'viab:seguranca-dose', phase: 'Viabilidade', schema: FEASIBILITY_SCHEMA }),

  () => agent(`${CONTEXTO}

Você é arquiteto do FORMATO DE ORIGEM. Não escreva o programa; desenhe o mecanismo.

PROBLEMA CONCRETO: o markdown de origem em ${REPO}/src/data/program/vena-block1/source/PROGRAMA.md hoje é "5 templates de dia + tabela de progressão", e a tabela só carrega CARGA. A REVISÃO 2 faz variar por semana também:
- duração da pausa de supino (§4-B)
- teto de RPE (R2)
- volume de peitoral alongado (§4-B)
- contagem de back-offs, oscilando 5/4/5/4 (R9)
- recálculo de todas as cargas na semana 4 a partir do trainingMax descoberto (§11-A2)

Leia ${REPO}/scripts/build-vena-block1.mjs, ${REPO}/scripts/validate-program.mjs, ${REPO}/src/types/index.ts (PrescribedWeek/PrescribedExercise/PrescribedSet) e ${REPO}/src/domain/referenceMax.ts.

TAREFA: desenhe o formato de origem e a mudança no gerador para suportar variáveis por semana, mantendo:
(a) markdown como fonte de verdade única, sem duplicar 18 semanas de tabela;
(b) gerador determinístico com sha256 e --check;
(c) o bloco de metadados \`invariantes\` VERIFICÁVEL — hoje ele declara taper_reducao_volume_pct: 47 quando o real é 27,6%, e metadado falso é pior que metadado ausente;
(d) as cargas derivando de trainingMax (215/160/240) e recomputáveis quando ele mudar.

NOTA DE PRECEDENTE: variar RPE dentro do bloco NÃO viola "dentro do bloco só a carga varia" — Agata Sitko roda "dynamic RPE" subindo 1 ponto por semana ao longo do bloco. Confirme isso em ${SCRATCH}/prog/params_elites.md antes de assumir.

Entregue o formato concreto (com exemplo de sintaxe) e as mudanças exatas no gerador e no validador. Devolva o schema, usando \`conflicts\` para o que não for resolvível sem quebrar (a)-(d).`,
    { label: 'viab:formato', phase: 'Viabilidade', schema: FEASIBILITY_SCHEMA }),
])

const viabOk = viab.filter(Boolean)
log(`Viabilidade: ${viabOk.length}/3 análises · ${viabOk.reduce((n, v) => n + (v.conflicts?.length ?? 0), 0)} conflitos identificados`)

// ---------------------------------------------------------------------------
// FASE 2 — Spec única. Barreira legítima: o builder precisa das TRÊS análises
// juntas, porque elas se restringem mutuamente.
// ---------------------------------------------------------------------------
phase('Spec')

const spec = await agent(`${CONTEXTO}

Você funde três análises de viabilidade numa ESPECIFICAÇÃO ÚNICA E EXECUTÁVEL. Não escreva o programa.

As três análises (volume/tempo, segurança/dose, formato de origem) estão abaixo em JSON. Elas se restringem mutuamente — resolva as colisões entre elas, não só dentro de cada uma.

VOLUME/TEMPO:
${JSON.stringify(viabOk[0] ?? {}, null, 1)}

SEGURANÇA/DOSE:
${JSON.stringify(viabOk[1] ?? {}, null, 1)}

FORMATO:
${JSON.stringify(viabOk[2] ?? {}, null, 1)}

TAREFA: escreva ${SCRATCH}/prog/SPEC_REV2.md — a especificação que o construtor vai seguir, contendo:
1. Alocação semanal final: séries por levantamento, por grupo muscular, minutos por sessão.
2. Rampas por semana: RPE por levantamento, duração de pausa, volume de peitoral alongado, contagem de back-offs.
3. Formato de origem e mudanças no gerador e no validador.
4. Gate de recálculo da semana 4 e regra do gauge set.
5. Tabela de rastreio: cada item de §4-B, §11-A2, §11-A e §13-B (R1 a R15) mapeado para onde a spec o implementa. Item não implementado fica marcado NÃO IMPLEMENTADO com o motivo.
6. Seção DECISÕES PENDENTES: o que exigiu escolha humana e você resolveu provisoriamente, com o que assumiu.

REGRA: onde as análises discordarem entre si, escolha e DIGA que escolheu, com o motivo. Onde a escolha for cara e reversível, escolha a conservadora. Onde for cara e irreversível, mande para DECISÕES PENDENTES.

Retorne apenas o caminho do arquivo e no máximo 8 linhas com as decisões de maior impacto e as pendências.`,
  { label: 'spec:fusao', phase: 'Spec' })

log('Spec consolidada. Iniciando construção (escritor único).')

// ---------------------------------------------------------------------------
// FASE 3 — Build. ESCRITOR ÚNICO. Nenhum outro agente toca o repo aqui.
// O validador é determinístico e roda dentro desta fase, de graça.
// ---------------------------------------------------------------------------
phase('Build')

// AUTORIA PARALELA, ESCRITA SERIAL. O motivo de um escritor único era concorrência
// de arquivo, não qualidade de autoria — confundir as duas produziu, na versão
// anterior, 15 divergências silenciosas e 21 citações ruins num único contexto longo.
// Aqui cada dia tem um autor dedicado que lê a técnica do PRÓPRIO levantamento em
// extract/, dentro de um orçamento já fixado pela spec. Ninguém escreve arquivo.
const DIAS = [
  { id: 'D1', papel: 'agacho com pausa acima do paralelo (terciário, livre, 1 s) + supino volume', lifts: 'agachamento e supino' },
  { id: 'D2', papel: 'supino força + terra sumo prática', lifts: 'supino e terra' },
  { id: 'D3', papel: 'agacho high bar (secundário/volume) + supino prática', lifts: 'agachamento e supino' },
  { id: 'D4', papel: 'agacho low bar PRIMÁRIO/força + supino volume', lifts: 'agachamento e supino' },
  { id: 'D5', papel: 'terra sumo força + stiff-legged + estética (braço, ombro, peito alongado)', lifts: 'terra e acessórios' },
]

const dias = await parallel(DIAS.map((D) => () => agent(`${CONTEXTO}

Você é o AUTOR DO ${D.id}. Você NÃO escreve arquivo nenhum — devolve o conteúdo do dia como markdown, e um integrador monta os arquivos depois.

SPEC (leia inteira, ela já fixou o seu orçamento): ${SCRATCH}/prog/SPEC_REV2.md
Resumo: ${spec}

SEU DIA: ${D.id} — ${D.papel}

## ESCOPO: SEMANAS 1 A 16 APENAS
As semanas 17 e 18 (taper e simulado) têm um autor dedicado — não escreva nada delas.
Elas são um desenho único e coordenado (cessação por levantamento, redução de volume da
semana inteira, seleção de tentativa) e fatiá-las entre autores produziria incoerência.

## O QUE ENTREGAR
A tabela de 8 colunas do dia, no formato do repo:
\`| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |\`
mais as linhas da tabela de progressão que dizem respeito aos exercícios do seu dia (carga, teto de RPE por semana, duração de pausa por semana quando houver, contagem de back-offs oscilando).

## RESTRIÇÕES QUE VÊM DA SPEC E NÃO SÃO SUAS PARA MUDAR
- Séries por levantamento, séries por grupo muscular e minutos da sessão: use o orçamento da spec. Se o seu dia não couber, **diga**, não corte por conta própria.
- Cargas derivam de trainingMax (agacho 215 · supino 160 · terra 240), nunca das declaradas.
- Incremento múltiplo de 2,5 kg na barra.
- Papéis: força 88–92%, volume 70–80% × 5–7, prática 40–70%.

## A PARTE QUE É SÓ SUA — as notas técnicas
Esta é a superfície de maior erro da versão anterior (21 citações ruins em 84). Para os exercícios de **${D.lifts}**:
- Leia ${SCRATCH}/prog/params_tecnica.md nas seções do seu levantamento.
- **Verifique cada citação por grep em ${SCRATCH}/extract/*.md ANTES de escrevê-la.** Nunca cite de memória nem de segunda mão.
- Formato: \`[R<n>]\` para o que vem da base, \`[interpretação]\` para leitura sua. Sem afirmação anônima.
- **Distinga [PESSOAL] (o que Vena faz) de [GERAL] (o que ele recomenda).** Trocar um pelo outro foi o erro mais comum e mais sutil da versão anterior — ele frequentemente faz o que não recomenda.
- Proibições explícitas: nada de "peito para cima" ou "quadril para baixo" (a base diz que não funcionam); nada de bíceps protegendo cotovelo (zero claims); nada afirmando posição alongada superior para deltoide (é extrapolação com conflito na base); toda nota de volume de braço citando Vena declara a contradição R010 × R145.

## SE O SEU DIA TIVER AGACHAMENTO
A correção mestra (§2) tem DUAS metades e na versão anterior só uma sobreviveu. Precisa constar: o cue dos joelhos para frente e para fora **e** o ângulo de tronco (ele agacha ~15° mais inclinado do que as alavancas exigem; princípio de espelhar o ângulo entre excêntrica e concêntrica).

## SE O SEU DIA TIVER SUPINO
A rampa de duração de pausa da §4-B é a variável de segurança principal — a pausa completa estreia no dia de MENOR carga e migra para o de maior. Respeite o degrau que a spec deu ao SEU dia. Gate de dor obrigatório na nota.

## SE O SEU DIA TIVER TERRA
Lockout geométrico IPF 2026 vai no dia de PRÁTICA a RPE 6, nunca sob RPE 8. Sem strap e reset a cada rep entram juntos na semana 1.

Retorne o markdown do seu dia e das suas linhas de progressão, mais no máximo 6 linhas dizendo o que não coube no orçamento e quais citações você tentou usar e descartou por não confirmarem.`,
  { label: `autor:${D.id}`, phase: 'Build' })))

const diasOk = dias.filter(Boolean)
log(`Autoria: ${diasOk.length}/5 dias (S1-16) escritos por autores dedicados.`)

// Semanas 17-18 têm autor próprio: taper e simulado são um desenho ÚNICO e coordenado
// (cessação por levantamento, redução de volume da semana toda, seleção de tentativa).
// Fatiar isso entre os 5 autores de dia é o arranjo que já produziu, na versão anterior,
// um metadado declarando 7 dias de último pesado no terra quando o real era 5.
const taper = await agent(`${CONTEXTO}

Você é o AUTOR DO TAPER E DO SIMULADO — semanas 17 e 18, explícitas (não são template).
Você NÃO escreve arquivo; devolve markdown, e um integrador monta depois.

SPEC: ${SCRATCH}/prog/SPEC_REV2.md
Resumo: ${spec}

O bloco (semanas 1-16) foi escrito por cinco autores de dia. O conteúdo deles está abaixo — você precisa dele para saber de que estado o atleta chega ao taper (cargas da semana 16, volume semanal, rampa de RPE no fim do bloco).

${DIAS.map((D, i) => `### ${D.id}\n${diasOk[i] ?? 'FALHOU'}`).join('\n\n')}

## NÚMEROS QUE VÊM DA EVIDÊNCIA, NÃO SÃO SEUS PARA ESCOLHER (design §11-B)
- Taper de **10 dias**. Redução de volume **30-50% medida em VOLUME-CARGA** (séries × reps × carga), não em contagem de séries — a versão anterior confundiu as duas e declarou 47% quando o volume-carga caía 26,8%.
- Intensidade mantida **≥85% 1RM**. Teto do taper **92,5%** (Travis 2021: sessões pesadas finais 90-92,5%).
- **Duas métricas distintas de tempo, e elas medem coisas diferentes** (design §13-C):
  · **último pesado** = última exposição ≥85%. Alvo 7-10 dias para agacho e terra, <7 para supino.
  · **cessação total** = última exposição de QUALQUER intensidade. **Nunca acima de 7 dias** — acima disso a força cai (Travis 2020).
  Ou seja: último pesado a 8 dias É correto, desde que haja trabalho leve dentro dos 7.
- Acessórios removidos **~2 semanas antes** (Pritchard 2016). Na versão anterior eles só sumiam a 7 dias e a semana 17 ainda tinha 31 séries de acessório.
- Esquemas de pico: **3×2 agacho, 3×3 supino, 3×1 terra**.
- Ordem de recuperação (R116): supino recupera mais rápido, agacho no meio, **terra tanto quanto o agacho ou mais**.

## SIMULADO (semana 18)
- Três tentativas por levantamento, só os três de competição, com comando.
- Seleção: abertura **~91% da terceira**, segunda **+5%**, terceira **+3%** (Travis/Zourdos 2021; médias reais da IPF: 90,9 / 96,3 / 99,6%).
- Carryover treino → plataforma esperado (Perkins): agacho **+10 a +15 kg**, terra **+7,5 a +10 kg**, supino **±0 a 2,5 kg**. O supino não ganha nada com o taper — diga isso na nota, para não criar expectativa falsa.
- É a primeira vez da vida dele executando sob comando. Se os comandos não foram treinados nos dias de prática do bloco, **diga**.

## ARMADILHA CONHECIDA
Na versão anterior, um single de abertura a **90,9% a 5 dias** do simulado contradizia o metadado que declarava último pesado a 7 dias. Calcule os seus números e **declare o que de fato está no seu markdown**, não o que a spec pediu.

Retorne o markdown das semanas 17 e 18 mais os valores computados de: redução de volume-carga (%), último pesado por levantamento (dias), cessação por levantamento (dias), e a semana em que os acessórios vão a zero. Máximo 8 linhas de comentário além do markdown.`,
  { label: 'autor:taper-simulado', phase: 'Build' })

// Coerência ANTES da escrita: os 5 autores não se veem, e o que os une (orçamento
// semanal, estresse ascendente, não repetir acessório, somar volume por músculo)
// é justamente o que nenhum deles consegue verificar sozinho.
const coerencia = await agent(`${CONTEXTO}

Cinco autores escreveram um dia cada, sem se ver. Você verifica a COERÊNCIA ENTRE ELES antes de qualquer arquivo ser escrito. Você não escreve arquivo.

SPEC: ${SCRATCH}/prog/SPEC_REV2.md

${DIAS.map((D, i) => `## ${D.id}\n${diasOk[i] ?? 'FALHOU'}`).join('\n\n')}

## SEMANAS 17-18 (taper e simulado, autor dedicado)
${taper}

VERIFIQUE:
1. **Soma semanal por levantamento** bate com a spec (séries de agacho, supino, terra)?
2. **Soma semanal por grupo muscular** bate? Em especial: supino ≥22 séries, costas ≥12 e acima de bíceps e delt lateral, delt lateral+posterior ≤12, high bar ~50% do volume de agacho POR SÉRIES.
3. **Minutos por sessão** dentro de 75–100, calculando pelo TETO das faixas de descanso mais aquecimento geral.
4. **Estresse do agachamento ascende** ao longo da semana (D1 terciário → D3 secundário → D4 primário), e o par D4→D5 não empilha carga axial demais na véspera do terra.
5. **Rampas por semana consistentes entre dias** — teto de RPE, duração de pausa, volume de peitoral alongado, oscilação de back-offs. Dois autores não podem ter dado degraus diferentes para a mesma semana.
6. **Acessório repetido** entre dias sem intenção, e exercício fora do inventário confirmado (§0-B do design).
7. **Citações duplicadas com conteúdo divergente** entre dias.

Devolva: as correções concretas necessárias, por dia, para o integrador aplicar. Se estiver coerente, diga em uma linha. Máximo 15 linhas.`,
  { label: 'coerencia', phase: 'Build' })

log('Coerência verificada. Integrando (escritor único).')

const build = await agent(`${CONTEXTO}

Você é o ÚNICO ESCRITOR desta fase. Integre o trabalho de cinco autores nos arquivos do repositório.

## CONTEÚDO DOS AUTORES — semanas 1 a 16
${DIAS.map((D, i) => `### ${D.id}\n${diasOk[i] ?? 'FALHOU'}`).join('\n\n')}

## CONTEÚDO DO AUTOR DO TAPER — semanas 17 e 18
${taper}

## CORREÇÕES DE COERÊNCIA A APLICAR
${coerencia}

Aplique as correções de coerência ao integrar. Não reescreva o conteúdo técnico dos autores por conta própria — se discordar de algo, integre como está e reporte a discordância.

SPEC: ${SCRATCH}/prog/SPEC_REV2.md (leia inteira antes de tocar em qualquer arquivo)
Resumo do que a spec resolveu: ${spec}

ARQUIVOS QUE VOCÊ MANTÉM:
- ${REPO}/src/data/program/vena-block1/source/PROGRAMA.md (fonte de verdade)
- ${REPO}/src/data/program/vena-block1/source/CONTEXTO.md (criar: nutrição/DOTS/creatina certificada, aritmética de peso, piso de cardio — §9, §12, §13 do design)
- ${REPO}/scripts/build-vena-block1.mjs
- ${REPO}/scripts/validate-program.mjs (se a spec pedir invariantes novas)
- ${REPO}/src/data/exercises/vena.ts, ${REPO}/scripts/exercise-map.mjs
- ${REPO}/src/data/exerciseMuscleMap.ts

NÃO TOQUE em ${REPO}/src/data/program/powerbuilding2/** (programa legado, histórico do usuário depende dele).

CORREÇÕES PENDENTES que precisam entrar (além da spec):
- Ângulo de tronco: a metade "~15 graus mais inclinado do que as alavancas exigem" da correção mestra (§2) não existe em nota nenhuma de agachamento. Ponha, com o princípio de espelhar o ângulo entre excêntrica e concêntrica.
- Citações: 4 inventadas (L481/L483 citam R81 e R83 sem suporte; só R110 sustenta), 6 trocas PESSOAL->GERAL, 5 com R errado. Detalhe em ${SCRATCH}/prog/audit_citacoes.md. Corrija todas.
- Ordem de recuperação: R116 diz supino ~0,5 semana, agacho ~1, terra ~1-2. O programa tinha invertido.
- \`blockObjective\` no gerador afirma "0,5 pp por semana" e "teto 90%", ambos falsos, e vão para a tela do app.
- BUG DE DADO: \`terra_sumo_sem_strap\` dá zero crédito a \`costas\` no mapa muscular.
- Contradições internas: §2 declara AG-V 4x6 e o template usa 5x6; a lista de decisões diz mesa flexora cortada e D3 a prescreve.
- Falta pausa NA profundidade legal (só existe acima do paralelo).
- Comandos de competição (cinto, walkout, comando de agacho, handoff, janela de 5s) ausentes em 18 semanas — entram nos dias de prática desde a semana 1.
- Vídeo de supino precisa de lateral além do "dos pés".
- Lockout geométrico IPF 2026 vai para o dia de PRÁTICA a RPE 6, não para D5 a RPE 8.

REGRAS
- Toda nota que afirme algo da base carrega \`[R<n>]\`; o que for leitura sua carrega \`[interpretação]\`. Sem citação anônima.
- Distinga [PESSOAL] (o que Vena faz) de [GERAL] (o que ele recomenda). Trocar um pelo outro foi o erro mais comum da versão anterior.
- Rode \`npm run validate:program\` a cada passo e \`npm run build\` no fim. **Não termine com erro de validador.**
- \`npm run lint\`: há 7 problemas PRÉ-EXISTENTES no HEAD. Confirme com git worktree ou git stash antes de atribuir qualquer um a si mesmo.
- Se dois requisitos da spec colidirem de verdade, implemente o conservador e REGISTRE no markdown. Não invente número que não esteja na spec ou no design.

Retorne: arquivos alterados, saída final de validate e build, e no máximo 10 linhas com decisões que você teve que tomar sozinho e o que ficou incompleto. NÃO cole programa nem código.`,
  { label: 'build:programa', phase: 'Build' })

log('Build concluído. Verificação adversarial (read-only, paralela).')

// ---------------------------------------------------------------------------
// FASE 4 — Verificação. Read-only, sem conflito de escrita.
// ANTI-DESPERDÍCIO: cada lente recebe SEU relatório anterior e verifica
// RESOLUÇÃO, em vez de re-derivar do zero.
// ---------------------------------------------------------------------------
phase('Verificar')

const LENTES = [
  {
    key: 'citacoes',
    prior: `${SCRATCH}/prog/audit_citacoes.md`,
    out: 'audit_citacoes_v2.md',
    brief: `Você é VERIFICADOR ADVERSARIAL DE CITAÇÕES. Sua função é REFUTAR, não concordar.
Verifique cada \`[R<n>]\` do PROGRAMA.md contra ${SCRATCH}/extract/*.md por grep. Vereditos: CONFIRMA, R ERRADO, DISTORCIDA, INVENTADA.
Marque separadamente toda troca [PESSOAL]->[GERAL]: é o erro mais comum e o mais sutil, porque Vena frequentemente faz o que não recomenda.
Cheque também: nenhum cue "peito para cima"/"quadril para baixo"; nenhuma nota de bíceps protegendo cotovelo (zero claims na base); nenhuma nota afirmando superioridade de posição alongada para deltoide; toda nota de volume de braço citando Vena deve declarar a contradição R010 x R145.`,
  },
  {
    key: 'dose',
    prior: `${SCRATCH}/prog/review_dose.md`,
    out: 'review_dose_v2.md',
    brief: `Você é revisor na lente DOSE FISIOLÓGICA. Pergunta única: este programa produz a adaptação que promete?
Ataque com números: dose de força (3-6 séries >=80% em 1-5 reps por levantamento por semana, EM TODA semana), volume de hipertrofia com crédito indireto 0,5, bíceps e delt lateral que recebem ZERO do SBD, proximidade da falha invertida, e se a re-ancoragem contínua realmente impede a back-off de cair abaixo de 80% quando ele ficar mais forte.
Rode \`cd ${REPO} && npm run validate:program\` para as tabelas.`,
  },
  {
    key: 'seguranca',
    prior: `${SCRATCH}/prog/review_seguranca.md`,
    out: 'review_seguranca_v2.md',
    brief: `Você é revisor na lente LEGALIDADE IPF E SEGURANÇA. Pergunta única: isto ensina algo ilegal, ou machuca este atleta?
Foco nº1: o peitoral. O mecanismo da lesão é TEMPO EM COMPRIMENTO MÁXIMO, não carga — verifique se a rampa de pausa realmente controla isso, se o volume de peitoral alongado é progressivo, e se o gate de dor existe em toda sessão de supino.
Verifique também: uma variável técnica por levantamento; mudanças de forma no SETUP e não sob carga; pegada de supino intocada; regras IPF 2026 (profundidade, barra abaixo do deltoide posterior, thrust, lockout geométrico); e se a semana 4 ainda é degrau cego.
Leia ${SCRATCH}/prog/params_tecnica.md e ${SCRATCH}/kb/ipf_reality.md conforme precisar.`,
  },
  {
    key: 'orcamento',
    prior: `${SCRATCH}/prog/review_orcamento.md`,
    out: 'review_orcamento_v2.md',
    brief: `Você é revisor na lente ORÇAMENTO E RECUPERAÇÃO. Pergunta única: isto cabe na vida dele e ele se recupera?
Recalcule a duração de cada sessão usando o TETO das faixas de descanso mais aquecimento geral — a estimativa do validador usa o piso e é otimista. Restrição: 5 dias, 75-100 min.
Verifique: oscilação real entre semanas (a versão anterior tinha variância ZERO em 13 semanas), o par D4->D5, espaçamento do terra, recuperação em manutenção calórica sem superávit, e qual sessão ele mais provavelmente corta e o que se perde.
Rode \`cd ${REPO} && npm run validate:program\`.`,
  },
  {
    key: 'fidelidade',
    prior: `${SCRATCH}/prog/review_fidelidade.md`,
    out: 'review_fidelidade_v2.md',
    brief: `Você é revisor na lente FIDELIDADE. Pergunta única: o programa é o que a spec mandou, ou o construtor redesenhou em silêncio?
Percorra ${SCRATCH}/prog/SPEC_REV2.md e o design.md (§4-B, §11-A2, §11-A, §13-B R1-R15) item por item. Veredito por item: IMPLEMENTADO, DIVERGENTE-marcada, DIVERGENTE-silenciosa, AUSENTE.
O achado mais valioso é DIVERGÊNCIA SILENCIOSA. O relatório anterior encontrou 15, e nomeou o padrão: "rigoroso onde há validador, frouxo onde a promessa é só prosa". Verifique especificamente se esse padrão se repetiu.
Verifique também o bloco de metadados \`invariantes\`: recompute cada valor declarado e confirme que bate com a realidade. Na versão anterior ele declarava taper_reducao_volume_pct: 47 quando o real era 27,6%.
NÃO confie no auto-relato do construtor. Verifique no arquivo.`,
  },
]

const verif = await parallel(LENTES.map((L) => () => agent(`${CONTEXTO}

${L.brief}

## O QUE MUDOU
O programa acabou de ser RECONSTRUÍDO contra ${SCRATCH}/prog/SPEC_REV2.md.
Relato do construtor (não confie, verifique): ${build}

## SEU RELATÓRIO ANTERIOR
${L.prior}

**IMPORTANTE — evite desperdício.** Leia seu relatório anterior PRIMEIRO. Para cada achado que você já tinha feito, verifique se foi RESOLVIDO, PARCIALMENTE RESOLVIDO ou PERSISTE. Só depois procure achados novos. Não re-derive do zero o que você já sabe.

## SAÍDA
${SCRATCH}/prog/${L.out}, com duas partes: (1) estado de cada achado anterior; (2) achados novos.

## RETORNE (curto)
Máximo 10 linhas: quantos achados anteriores foram resolvidos vs persistem, e os achados NOVOS ordenados por gravidade, com localização exata. NÃO cole o conteúdo do arquivo.`,
  { label: `verif:${L.key}`, phase: 'Verificar' })))

const verifOk = verif.filter(Boolean)
log(`Verificação: ${verifOk.length}/${LENTES.length} lentes concluídas.`)

// ---------------------------------------------------------------------------
// FASE 5 — Triagem. Barreira legítima: precisa de TODAS as lentes juntas para
// separar o que é defeito real do que é uma lente pedindo o oposto da outra.
// ---------------------------------------------------------------------------
phase('Triagem')

const triagem = await agent(`${CONTEXTO}

Você consolida cinco revisões adversariais numa lista de ação. Não corrija nada; triagem apenas.

As lentes têm objetivos CONFLITANTES de propósito: dose quer mais intensidade, segurança quer menos, orçamento quer menos volume, fidelidade não quer nada além do especificado, citações não quer afirmação sem fonte. **O desacordo entre elas é a informação — não faça média.**

RELATÓRIOS: ${LENTES.map((L) => `${SCRATCH}/prog/${L.out}`).join(', ')}
Resumos:
${LENTES.map((L, i) => `### ${L.key}\n${verif[i] ?? 'FALHOU'}`).join('\n\n')}

CLASSIFIQUE cada achado:
- **mustFix** — defeito real, correção conhecida, não depende de escolha humana. Inclui: qualquer coisa que machuque o atleta, qualquer citação inventada ou distorcida, qualquer divergência silenciosa da spec, qualquer metadado que não bata com a realidade computada.
- **aceitar** — o achado está errado, ou é o preço deliberado de um trade-off já decidido. Diga o motivo. Uma lente pedindo o oposto de outra normalmente cai aqui, com a decisão registrada.
- **decisaoUsuario** — exige escolha do atleta ou do coach. Formule como pergunta fechada, com as opções e o custo de cada uma.

REGRA DE PRIORIDADE quando duas lentes colidirem: segurança do peitoral > legalidade IPF > dose de força > volume estético > orçamento de tempo. Diga sempre que aplicou essa regra.

Devolva o schema.`,
  { label: 'triagem', phase: 'Triagem', schema: TRIAGE_SCHEMA })

const mustFix = triagem?.mustFix ?? []
log(`Triagem: ${mustFix.length} must-fix · ${(triagem?.aceitar ?? []).length} aceitos · ${(triagem?.decisaoUsuario ?? []).length} para decisão humana`)

// ---------------------------------------------------------------------------
// FASE 6 — Correção. ESCRITOR ÚNICO de novo. Só must-fix; nada de escopo extra.
// ---------------------------------------------------------------------------
let fix = 'Nenhum must-fix — nada a corrigir.'
if (mustFix.length > 0) {
  phase('Corrigir')
  fix = await agent(`${CONTEXTO}

Você é o ÚNICO ESCRITOR desta fase. Aplique APENAS os must-fix abaixo. Nada além disso.

${JSON.stringify(mustFix, null, 1)}

REGRAS
- Não faça melhoria não pedida. Escopo extra aqui é desperdício e risco.
- Se um must-fix estiver errado ou for inaplicável, NÃO o implemente — reporte por que.
- Se dois must-fix se contradisserem, implemente o mais conservador e reporte.
- NÃO toque em ${REPO}/src/data/program/powerbuilding2/**.
- \`npm run validate:program\` e \`npm run build\` têm que passar no fim.
- \`npm run lint\`: 7 problemas são pré-existentes no HEAD; confirme antes de atribuir a si.

Retorne: quais must-fix foram aplicados, quais não e por quê, e a saída final de validate e build. Máximo 10 linhas.`,
    { label: 'corrigir', phase: 'Corrigir' })
}

return {
  spec: `${SCRATCH}/prog/SPEC_REV2.md`,
  build,
  verificacao: LENTES.map((L, i) => ({ lente: L.key, relatorio: `${SCRATCH}/prog/${L.out}`, resumo: verif[i] })),
  triagem,
  correcao: fix,
}
