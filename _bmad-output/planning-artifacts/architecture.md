---
stepsCompleted: [1, 2]
inputDocuments:
  - prd.md
workflowType: 'architecture'
project_name: 'treino'
user_name: 'Brunno'
date: '2026-03-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
35 requisitos funcionais organizados em 8 domínios:
- **Registro de Peso (FR1-FR4):** CRUD de peso diário com precisão decimal, substituição same-day, posicionamento prioritário no Dashboard
- **Métricas Calculadas (FR5-FR8):** Média móvel 7 registros, variação semanal, indicadores visuais por fase, degradação graciosa com dados insuficientes
- **Fases Nutricionais (FR9-FR12):** Determinação automática por data, 7 fases pré-configuradas alinhadas a macrociclos, default manutenção, progresso percentual
- **Alertas Nutricionais (FR13-FR17):** Alertas contextuais por variação, preventivos por transição, inatividade 3 dias, dismiss diário, priorização por severidade
- **Visualização (FR18-FR21):** Gráfico dual-line (diário + média móvel), faixas de fase, tooltips interativos, toggle ano/4 semanas
- **Dashboard Widget (FR22-FR24):** Média móvel destacada, fase ativa com barra de progresso, range ideal de referência
- **DOTS Atualizado (FR25-FR27):** Cálculo com média móvel, recálculo automático, dinâmico vs. snapshot
- **Persistência (FR32-FR35):** Integração export/import, limpeza independente, funcionalidades existentes intactas sem dados de peso

**Non-Functional Requirements:**
11 NFRs que direcionam decisões arquiteturais:
- **Performance (NFR1-NFR5):** Save < 200ms, cálculos < 50ms, gráfico < 500ms, TTI < 3s, FCP < 1.5s — exige memoização, code splitting do Recharts, pré-computação de métricas
- **Confiabilidade de Dados (NFR6-NFR9):** Zero perda em uso normal, write atômico/rollback no OPFS, merge inteligente no import (por data, não replace), degradação graciosa sem dados
- **Compatibilidade (NFR10-NFR11):** Chrome mobile Android, layouts 360px-430px

**Scale & Complexity:**
- Primary domain: Web App (PWA/SPA) — React 19 + TypeScript + Vite + Tailwind + Recharts
- Complexity level: Baixa — app pessoal, single-user, sem auth, sem compliance regulatório
- Estimated architectural components: ~12 (2 repositories, 1 context, 4-5 hooks, 3-4 componentes UI, 1 integração dataTransfer)

### Technical Constraints & Dependencies

- **Stack fixa:** React 19, TypeScript strict, Vite, Tailwind, Recharts — sem margem para troca
- **Padrão existente:** Repository pattern com localStorage + OPFS sync debounced — novos repositories devem seguir a mesma interface
- **Feature-based structure:** `src/features/bodyweight/` e `src/features/nutrition/` com subpastas `hooks/`, `components/`, `utils/`
- **Context API:** Exposição de dados e operações via React Context — sem acesso direto ao repository nos componentes
- **CSS Variables:** Cores de fases como CSS variables resolvidas via `getComputedStyle` para SVG do Recharts
- **Preparação Firestore:** IDs `crypto.randomUUID()`, timestamps Unix ms, interfaces async, schema projetado com paths de coleção
- **OPFS Worker + React StrictMode:** Serialização de writes com fila interna

### Cross-Cutting Concerns Identified

- **Persistência dual (localStorage + OPFS):** Toda escrita precisa sincronizar ambos stores com debounce e atomicidade
- **Export/Import (dataTransfer.ts):** Novos dados devem integrar-se ao schema existente com versionamento e merge inteligente
- **Performance de gráficos:** Recharts em chunk separado via `manualChunks`, downsampling para histórico longo (365+ pontos)
- **Theming:** CSS variables para cores de fases, resolução via `getComputedStyle` para SVG
- **Migração Firestore:** Todas as decisões de ID, timestamp e interface async afetam cada componente de dados
- **Degradação graciosa:** O app inteiro deve funcionar sem dados de peso — nenhuma feature existente pode quebrar
