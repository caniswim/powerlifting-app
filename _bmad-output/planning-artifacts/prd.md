---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - prompt-update-bodyweight-nutrition.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
  specifications: 1
workflowType: 'prd'
classification:
  projectType: web_app
  domain: fitness_sports_performance
  complexity: low
  projectContext: brownfield
---

# Product Requirements Document - treino

**Author:** Brunno
**Date:** 2026-03-16

## Sumário Executivo

O app de periodização de powerlifting "treino" é uma PWA pessoal que gerencia um programa de 52 semanas (4 macrociclos × 13 semanas) com 6 sessões semanais. Atualmente cobre prescrição de treino, tracking de séries, cálculo de e1RM, PRs, surveys pré/pós-treino, feedback de IA e análise de progresso.

Esta atualização adiciona **monitoramento de peso corporal e fases nutricionais** — a peça que falta para fechar o loop entre treino e nutrição. O atleta (natural, nível elite, ~84kg) poderá registrar peso diário em 2 toques, visualizar média móvel de 7 dias, e receber alertas contextuais quando a taxa de variação sair dos ranges definidos pelo coach para cada fase do programa.

O objetivo é eliminar o atrito entre tracking de treino e decisões nutricionais, integrando ambos no mesmo sistema com fases alinhadas aos macrociclos (bulk durante acumulação/transmutação, mini-cut nas transições, manutenção durante realização).

### O Que Torna Isso Especial

As fases nutricionais não são genéricas — estão **hardcoded aos macrociclos de treino**. O sistema sabe que durante um bloco de acumulação o atleta deve estar em superávit modesto (+250 kcal), e durante realização deve estar em manutenção. Os alertas são calibrados por fase: ganhar +0.8 kg/semana em bulk é acumular gordura; perder -1.0 kg/semana em mini-cut é risco de perda muscular. Esse nível de integração não existe em apps genéricos de peso.

O DOTS (indicador de força relativa ao peso corporal) passa a usar a média móvel em vez do peso estático, tornando-o mais preciso e responsivo a mudanças reais de composição corporal.

### Classificação do Projeto

- **Tipo:** Web App (PWA/SPA) — React 19 + TypeScript + Vite + Tailwind + Recharts
- **Domínio:** Fitness / Performance Esportiva
- **Complexidade:** Baixa — app pessoal, sem compliance regulatório, sem multi-tenancy
- **Contexto:** Brownfield — adição de funcionalidades a um sistema existente com ~8.800 linhas, arquitetura repository pattern, localStorage + OPFS

## Critérios de Sucesso

### Sucesso do Usuário

- **Fluxo matinal**: ao abrir o app, o campo de peso corporal é **o primeiro elemento visível e interativo** — sem scroll, sem navegação
- Registrar peso em **menos de 5 segundos** (abrir app → digitar → salvo)
- Visualizar média móvel de 7 dias e taxa de variação semanal **sem nenhum cálculo manual**
- Receber alertas acionáveis quando o peso sair do range da fase atual — sem precisar lembrar os números do coach
- Saber em que fase nutricional está e quanto falta pra próxima transição com **um olhar no dashboard**
- DOTS sempre atualizado com base no peso real (média móvel), não num valor estático desatualizado

### Sucesso Técnico

- Zero regressão nas funcionalidades existentes (treino, analytics, surveys, AI feedback)
- Dados de peso integrados ao export/import JSON existente (`dataTransfer.ts`)
- Performance: cálculos de média móvel e variação pré-computados ao carregar dados, sem recálculo a cada render
- Gráfico de peso com mesma qualidade visual dos gráficos existentes (Recharts, dark theme, tooltips)
- Código seguindo os padrões existentes: repository pattern, TypeScript strict, componentes feature-based

### Resultados Mensuráveis

- **Adoção**: registro de peso em 90%+ dos dias de treino após primeira semana de uso
- **Utilidade dos alertas**: pelo menos 1 ajuste nutricional informado por alerta nos primeiros 2 meses
- **Completude**: todas as 8 funcionalidades operacionais e integradas ao fluxo existente do app

## Escopo do Produto

### Release Único — Todas as Funcionalidades

Todas as 8 funcionalidades são interdependentes e entregam valor como conjunto. Release único, sem faseamento.

**Recurso:** Um desenvolvedor (Brunno) + assistência de IA.

| # | Funcionalidade | Jornada Suportada |
|---|---|---|
| 1 | Registro diário de peso (topo do Dashboard) | J1 - Ritual Matinal |
| 2 | Fases nutricionais hardcoded alinhadas aos macrociclos | J4 - Transição de Fase |
| 3 | Métricas calculadas (média móvel 7 dias, variação semanal) | J1, J2 |
| 4 | Widget de peso no Dashboard com fase atual e barra de progresso | J1 |
| 5 | Gráfico de peso na tela de Analytics (linha dupla + faixas de fase) | J3 - Revisão Semanal |
| 6 | Banner de alertas nutricionais contextuais | J2, J4, J6 |
| 7 | Seção de configurações nutricionais (editar fases, data de início) | J5 - Setup Inicial |
| 8 | DOTS atualizado usando média móvel | J1 |

### Visão Futura (Pós-Release)

- Migração localStorage → Firestore
- Tracking de macros/calorias
- Correlação automática entre surveys de energia/sono e variação de peso
- Sugestões de ajuste calórico via AI feedback baseadas na tendência de peso

### Estratégia de Mitigação de Riscos

**Riscos técnicos:**
- **CSS variables no SVG/Recharts**: testar `getComputedStyle` cedo no desenvolvimento. Fallback: cores hardcoded no componente.
- **Performance com histórico longo (365+ pontos)**: implementar downsampling para visualização anual, manter dados brutos no storage.
- **DOTS snapshot vs. dinâmico**: usar snapshot no momento do registro para consistência histórica. Dashboard exibe DOTS dinâmico (tempo real), histórico exibe snapshot.
- **OPFS Worker + React StrictMode**: serializar writes com fila interna para evitar writes concorrentes.

**Riscos de dados:**
- **Sobreposição de fases**: validação no formulário com feedback imediato — impedir save se datas sobrepõem.
- **Migration path para Firestore**: interfaces async + IDs UUID desde o início. Custo zero agora, economia significativa depois.

**Riscos de UX:**
- **Input de peso muito exposto no topo**: se incomodar em dias sem pesagem, considerar estado colapsado mostrando apenas última média. Implementar aberto por default, avaliar após 2 semanas de uso.

## Jornadas do Usuário

### Jornada 1: Ritual Matinal — Registro de Peso (Happy Path)

**Cena de abertura:** São 6h30 da manhã. Brunno acorda, vai ao banheiro, sobe na balança. 84.3 kg. Pega o celular que está na mesinha de cabeceira.

**Ação:** Abre o app "treino". O campo de peso é a primeira coisa na tela. Digita 84.3, toca salvar. Menos de 5 segundos.

**Clímax:** Logo abaixo do input, vê: média móvel **84.5 kg**, variação **+0.3 kg/sem** com indicador verde. Fase atual: **BULK (+250 kcal)**, semana 3 de 11, barra de progresso preenchida ~27%. Tudo nos trilhos.

**Resolução:** Sem alertas. Fecha o app e vai preparar o café da manhã sabendo que está no range do coach. Zero fricção, zero cálculo manual.

### Jornada 2: Alerta Nutricional — Peso Subindo Rápido Demais

**Cena de abertura:** Semana 6 do bulk. Brunno registra 86.1 kg. Nos últimos 14 dias, a variação semanal subiu pra +0.9 kg/sem.

**Ação:** Após salvar o peso, o dashboard exibe um banner amarelo: "Peso subindo rápido demais. Reduza superávit em ~100-150kcal."

**Clímax:** O alerta é acionável — diz exatamente o que fazer. Brunno não precisa abrir planilha, calcular tendência, ou adivinhar se é retenção hídrica. A média móvel de 7 dias já filtrou as flutuações diárias.

**Resolução:** Brunno ajusta a dieta reduzindo ~150 kcal. Nas próximas 2 semanas, a variação volta pra +0.4 kg/sem. O alerta desaparece. O coach valida o ajuste no próximo check-in.

### Jornada 3: Revisão Semanal — Gráfico de Progresso

**Cena de abertura:** Domingo à noite, fim de semana de descanso. Brunno quer ver como o peso evoluiu durante o macrociclo.

**Ação:** Abre a tela de Analytics. Rola até o gráfico de peso. Vê a linha pontilhada cinza (peso diário) oscilando em torno da linha dourada sólida (média móvel), que sobe gradualmente. As faixas de fundo mostram claramente: faixa verde do bulk (semanas 1-11), faixa vermelha do mini-cut (semanas 12-15).

**Clímax:** Toca num ponto da semana 8. Tooltip mostra: 85.2 kg diário, 84.9 kg média móvel, +0.35 kg/sem. A tendência é exatamente o que o coach planejou.

**Resolução:** Visão clara de que o programa está funcionando. A integração treino+nutrição no mesmo app permite correlacionar mentalmente o volume de treino com a tendência de peso.

### Jornada 4: Transição de Fase — Bulk para Mini-Cut

**Cena de abertura:** Semana 11. Brunno abre o app e vê um banner azul: "Mini-cut começa na próxima semana. Prepare-se: proteína 2.2-2.4g/kg, déficit de ~400kcal."

**Ação:** A barra de progresso da fase bulk mostra 100%. Na semana seguinte, o widget automaticamente muda: fase atual passa de "BULK (+250 kcal)" para "MINI-CUT (-400 kcal)", com novos ranges de variação ideal (-0.4 a -0.7 kg/sem).

**Clímax:** A transição é automática. Nada pra configurar. Os alertas se recalibram — agora peso subindo é problema, peso descendo no range é o esperado.

**Resolução:** Brunno ajusta dieta pro déficit. Nas próximas 4 semanas, os alertas monitoram se o corte está agressivo demais (-1.0 kg/sem) ou se não está funcionando.

### Jornada 5: Setup Inicial — Configurando Data de Início

**Cena de abertura:** Brunno acabou de receber a atualização do app com as novas features. Precisa configurar a data de início do programa pra que as fases nutricionais mapeiem corretamente pras semanas reais.

**Ação:** Vai em Configurações → Seção Nutricional. Define a data de início do programa (ex: 2026-01-05). As 7 fases nutricionais aparecem listadas com datas reais calculadas automaticamente. Revisa, confirma que batem com o planejamento do coach.

**Resolução:** A partir de agora, o app sabe que "semana 1" = 05/jan/2026 e calcula todas as fases. O dashboard já mostra a fase correta baseada na data de hoje.

### Jornada 6: Edge Case — Sem Dados de Peso

**Cena de abertura:** Brunno viajou e ficou 5 dias sem registrar peso.

**Ação:** Ao abrir o app, vê banner cinza: "Sem registro de peso há 3 dias. Registre para manter o tracking preciso." A média móvel e variação continuam exibidas com base nos últimos 7 registros (não nos últimos 7 dias).

**Resolução:** Registra o peso. Métricas se atualizam. Se os 7 registros forem muito espaçados, a variação semanal pode ser menos precisa, mas o sistema não quebra — funciona com dados disponíveis.

### Resumo de Requisitos das Jornadas

| Jornada | Capacidades Reveladas |
|---|---|
| 1 - Ritual Matinal | Input no topo do dashboard, save instantâneo, exibição de média/variação/fase |
| 2 - Alerta Nutricional | Motor de alertas contextuais, dismiss por dia, priorização por severidade |
| 3 - Revisão Semanal | Gráfico Recharts dual-line, faixas de fase, tooltips interativos |
| 4 - Transição de Fase | Cálculo automático de fase por data, recalibração de alertas |
| 5 - Setup Inicial | Input de data de início, cálculo de datas reais, CRUD de fases |
| 6 - Edge Case | Degradação graciosa sem dados, alertas de inatividade |

## Requisitos Funcionais

### Registro de Peso Corporal

- **FR1:** O atleta pode registrar seu peso corporal diário com precisão de 1 casa decimal
- **FR2:** O atleta pode editar um registro de peso já feito no mesmo dia (substitui o anterior)
- **FR3:** O sistema exibe o último peso registrado como placeholder no campo de input
- **FR4:** O registro de peso é o primeiro elemento interativo visível ao abrir o app

### Métricas de Peso Calculadas

- **FR5:** O sistema calcula a média móvel dos últimos 7 registros de peso
- **FR6:** O sistema calcula a taxa de variação semanal comparando a média móvel atual com a de 7 dias atrás
- **FR7:** O sistema exibe a variação semanal com indicador visual de cor conforme o range da fase nutricional atual (verde/amarelo/vermelho)
- **FR8:** O sistema exibe mensagem informativa quando há menos de 7 registros, indicando que são necessários mais dados para calcular tendências

### Fases Nutricionais

- **FR9:** O sistema determina automaticamente a fase nutricional ativa com base na data atual e nas datas das fases configuradas
- **FR10:** O sistema fornece fases nutricionais pré-configuradas alinhadas aos 4 macrociclos do programa (7 fases: 3 bulk, 2 mini-cut, 2 manutenção)
- **FR11:** O sistema assume "manutenção" como fase default quando a data atual não cai em nenhuma fase definida
- **FR12:** O sistema calcula e exibe o progresso da fase atual como percentual de dias transcorridos

### Alertas Nutricionais

- **FR13:** O sistema gera alertas contextuais quando a taxa de variação semanal sai do range ideal da fase ativa
- **FR14:** O sistema gera alerta preventivo 7 dias antes do início de uma transição de fase (ex: bulk → mini-cut)
- **FR15:** O sistema gera alerta de inatividade quando não há registro de peso nos últimos 3 dias
- **FR16:** O atleta pode dispensar um alerta, e este não reaparece no mesmo dia
- **FR17:** O sistema prioriza alertas por severidade, exibindo no máximo 1 por vez (vermelho > amarelo > azul > cinza)

### Visualização de Dados de Peso

- **FR18:** O atleta pode visualizar um gráfico com linha de peso diário e linha de média móvel ao longo do tempo
- **FR19:** O gráfico exibe faixas de fundo coloridas indicando as fases nutricionais (bulk, mini-cut, manutenção)
- **FR20:** O atleta pode tocar em qualquer ponto do gráfico para ver tooltip com data, peso, média móvel e variação
- **FR21:** O atleta pode alternar entre visualização do ano completo e das últimas 4 semanas

### Dashboard — Widget de Peso

- **FR22:** O dashboard exibe a média móvel de 7 dias como métrica principal destacada
- **FR23:** O dashboard exibe a fase nutricional ativa com tipo, superávit/déficit alvo e barra de progresso
- **FR24:** O dashboard exibe o range de variação ideal para a fase atual como referência

### DOTS Atualizado

- **FR25:** O sistema calcula o DOTS usando a média móvel de 7 dias como peso corporal (em vez do peso estático do perfil)
- **FR26:** O DOTS é recalculado automaticamente quando a média móvel muda
- **FR27:** O DOTS do dashboard exibe o valor dinâmico (tempo real); registros históricos mantêm o valor snapshot do momento

### Configurações Nutricionais

- **FR28:** O atleta pode definir a data de início do programa, que serve como referência para mapear semanas a datas reais
- **FR29:** O atleta pode visualizar, editar, adicionar e remover fases nutricionais
- **FR30:** O sistema valida que fases não se sobrepõem em datas e fornece feedback imediato em caso de conflito
- **FR31:** O atleta pode alterar o tipo (bulk/mini-cut/manutenção) e o superávit/déficit alvo de cada fase

### Persistência e Integração de Dados

- **FR32:** Os dados de peso e fases nutricionais são incluídos no export JSON existente do app
- **FR33:** O import JSON restaura dados de peso e fases nutricionais junto com os demais dados
- **FR34:** O atleta pode limpar o histórico de peso independentemente dos outros dados
- **FR35:** O registro de peso não é obrigatório — todas as funcionalidades existentes continuam operando sem dados de peso

## Requisitos Não-Funcionais

### Performance

- **NFR1:** O registro de peso (input → save → feedback visual) completa em menos de 200ms
- **NFR2:** O cálculo de média móvel e variação semanal executa em menos de 50ms para até 365 entradas
- **NFR3:** O gráfico de peso renderiza em menos de 500ms com até 365 pontos de dados
- **NFR4:** Time to Interactive (TTI) do Dashboard permanece abaixo de 3s em 4G após adição das novas features
- **NFR5:** First Contentful Paint (FCP) permanece abaixo de 1.5s — o chunk do Recharts não impacta páginas sem gráfico

### Confiabilidade de Dados

- **NFR6:** Zero perda de dados de peso em cenários normais de uso (close app, refresh, navegação entre páginas)
- **NFR7:** O sync debounced para OPFS completa sem corromper dados existentes em caso de interrupção (write atômico ou rollback)
- **NFR8:** O import JSON não sobrescreve dados de peso mais recentes com dados de backup antigo (merge por data, não replace cego)
- **NFR9:** O app inicia e opera normalmente mesmo com localStorage vazio de dados de peso (degradação graciosa)

### Compatibilidade

- **NFR10:** Todas as novas funcionalidades operam corretamente no Chrome mobile (Android) — único browser-alvo
- **NFR11:** O layout do widget de peso e do gráfico adapta-se corretamente a telas de 360px a 430px de largura (range típico de smartphones)

## Requisitos Técnicos — Web App (PWA)

### Visão Geral

App de uso pessoal, single-user, instalado como PWA no Chrome mobile. Toda a persistência é local via localStorage + OPFS. A nova feature de peso/nutrição segue o mesmo padrão CRUD + visualização analítica do app existente.

### Arquitetura Técnica

- **Novos repositórios** (`bodyweightRepository`, `nutritionPhaseRepository`): mesma interface dos existentes — `getAll()`, `save()`, `delete()`, opcionalmente `getByDateRange()`. Encapsulam chave localStorage + sync OPFS debounced.
- **Feature-based structure**: criar `src/features/bodyweight/` e `src/features/nutrition/` com subpastas `hooks/`, `components/`, `utils/`.
- **Context**: `BodyweightContext` expõe `entries[]`, `addEntry()`, `movingAverage7d[]`, `weeklyDelta`, `activePhase`. Dashboard, Analytics e Settings consomem via context, sem acesso direto ao repository.
- **Hooks de cálculo**: `useMovingAverage`, `useWeeklyVariation`, `useContextualAlerts`, `useDOTS` atualizado — todos memoizados com `useMemo`.
- **Gráfico Analytics**: `BodyweightChart` com `LineChart` dual-line + `ReferenceArea` para faixas de fase (fillOpacity 0.08).
- **Settings**: CRUD de fases + campo global `programStartDate`. Validação de sobreposição de datas no hook, não no repository.

### Design Responsivo e Performance

- TTI < 3s em 4G simulado, FCP < 1.5s
- `BodyweightChart` envolto em `React.memo` com dados estabilizados por `useMemo`
- Cores de fases como CSS variables (`--phase-bulk`, `--phase-cut`, `--phase-maintenance`) resolvidas via `getComputedStyle` para o SVG do Recharts
- Recharts isolado em chunk separado via `manualChunks` para não impactar FCP de páginas sem gráfico

### Estratégia PWA e Offline

- Novas chunks automaticamente incluídas no precache via Vite Plugin PWA
- Storage local (localStorage/OPFS) não precisa de interceptação do service worker
- Export/import (`dataTransfer.ts`): adicionar `bodyweightEntries` e `nutritionPhases` ao schema, versionamento do schema, merge por id+timestamp no import
- Manter `skipWaiting()` + `clientsClaim()` para updates imediatos

### Preparação para Firestore (Futuro)

- IDs via `crypto.randomUUID()`, nunca auto-incremento
- Timestamps como `number` (Unix ms) — conversão para `Timestamp.fromMillis()` isolada no repository
- Schema projetado: `users/{userId}/bodyweightEntries/{entryId}`, `users/{userId}/nutritionPhases/{phaseId}`, `users/{userId}/programConfig/default`
- Interface `IBodyweightRepository` com métodos async agora, mesmo que implementação local seja sync — reduz delta de refatoração na migração

### Ordem de Implementação Sugerida

Tipos → repositories → hooks de cálculo (com testes) → context → DOTS atualizado → input Dashboard → CRUD Settings → gráfico Analytics → dataTransfer
