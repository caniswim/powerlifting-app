# Schema Firestore — armazém da revisão semanal

## Para que este banco existe

O Firestore **não** é backend de IA. Ele é o armazém que uma sessão de análise
semanal no Claude Code lê. O único requisito de desempenho que importa é:

> puxar o estado inteiro do atleta em **poucas leituras e poucos tokens**, sem
> varrer o histórico cru.

Daí a regra que organiza todo o resto:

> **Nada que o leitor semanal precise pode exigir que ele reconstrua agregados a
> partir de logs crus.** Todo rollup é calculado no app, no momento da escrita.

O log cru continua existindo — mas num documento separado, que a conversa semanal
não abre a menos que precise cavar uma sessão específica.

---

## 1. Mapa das coleções

```
athletes/{uid}                                 1 doc          identidade, perfil, ponteiros
athletes/{uid}/state/current                   1 doc          estado ao vivo (posição, PRs, peso)
athletes/{uid}/weeks/{weekId}                  1 doc/semana   ROLLUP SEMANAL  ← o documento da conversa
athletes/{uid}/sessions/{workoutId}            1 doc/sessão   resumo de sessão (por exercício)
athletes/{uid}/sessions/{workoutId}/raw/log    1 doc/sessão   WorkoutLog verbatim (deep dive / restore)
athletes/{uid}/bodyweight/{YYYY-MM-DD}         1 doc/pesagem  série temporal de peso e DOTS
athletes/{uid}/records/{exerciseId}            1 doc/exerc.   PR corrente
```

`weekId` = `` `${programId}__w${NN}` `` — ex.: `powerbuilding-2.0__w07`. Determinístico
de propósito: o mesmo `setDoc` reescreve a semana quantas vezes for preciso, e a
sincronização é idempotente sem precisar de transação.

`uid` vem do Firebase Auth. Um único atleta, um único uid.

---

## 2. Custo de leitura de uma revisão semanal

| Passo | Leituras | Tamanho aprox. |
|---|---|---|
| `athletes/{uid}` | 1 | ~1 KB |
| `state/current` | 1 | ~4 KB |
| `weeks` — últimas 4 (`--weeks N`) | 4 | ~6 KB cada |
| **Total padrão** | **6** | **~29 KB** |

Cavar uma sessão custa +1 (`sessions/{id}`) e +1 se o log cru for aberto
(`sessions/{id}/raw/log`). Uma revisão típica termina em **6 a 10 leituras**, bem
dentro da cota gratuita do Spark (50k leituras/dia), e o briefing renderizado fica
em torno de **2–4 mil tokens** — não os ~80 mil que o histórico cru de 4 semanas
custaria.

O rollup semanal embute peso corporal, DOTS, dor e surveys justamente para que
`bodyweight/*` e as sessões **não precisem ser lidos** na revisão de rotina.

---

## 3. Documentos

Convenções: `updatedAt` e `createdAt` são ISO 8601 em string (não `Timestamp`) —
o briefing é markdown e strings ISO atravessam SDK, JSON e olho humano sem
conversão. Datas de dia (`bodyweight`) são `YYYY-MM-DD` **locais**, porque
pesagem é um evento local, não um instante UTC.

### 3.1 `athletes/{uid}`

```jsonc
{
  "uid": "…",
  "email": "…",
  "schemaVersion": 1,
  "appVersion": "1.3.0",
  "createdAt": "2026-08-08T…", "updatedAt": "2026-08-08T…",
  "profile": {
    "bodyweight": 87, "squat1RM": 215, "bench1RM": 160,
    "deadlift1RM": 240, "ohp1RM": 0, "total": 615, "dots": 405
  },
  "activeProgramId": "powerbuilding-2.0",
  "programName": "Powerbuilding Phase 2.0",
  "totalWeeks": 12, "totalSessions": 54
}
```

> `profile.*1RM` são as marcas **contra as quais o programa prescreve**. No Bloco 1
> essas são as marcas legais (`baseline.md`), não as declaradas. O app não guarda
> as duas — quem define qual está no perfil é o dono.

### 3.2 `athletes/{uid}/state/current`

Estado ao vivo. O que a conversa precisa saber antes de olhar qualquer semana.

```jsonc
{
  "updatedAt": "…",
  "activeProgramId": "powerbuilding-2.0",
  "sessionIndex": 23, "currentWeek": 6, "totalSessions": 54,
  "programComplete": false,
  "latestWeekId": "powerbuilding-2.0__w06",
  "nextSession": {
    "sessionIndex": 23, "weekNumber": 6, "dayIndex": 3,
    "dayType": "upper_body_continued", "blockName": "…",
    "blockType": "accumulation", "isDeload": false
  },
  "lastCompletedWorkout": { "id": "…", "date": "…", "weekNumber": 6, "dayType": "…" },
  "records": [ { "exerciseId": "agachamento_low_bar", "name": "Back Squat",
                 "e1rm": 231.4, "weight": 200, "reps": 5, "rpe": 8, "date": "…" } ],
  "bodyweight": {
    "latest": { "date": "2026-08-07", "weightKg": 86.4, "dots": 407.1 },
    "d7":     { "date": "…", "weightKg": 86.9, "dots": 405.2 },
    "d28":    { "date": "…", "weightKg": 87.6, "dots": 402.0 },
    "trendKgPerWeek": -0.28, "dotsDelta28": 5.1, "n": 22
  }
}
```

`records` é limitado aos **20 maiores e1RM** — a lista inteira mora em
`records/{exerciseId}` e quase nunca é lida.

### 3.3 `athletes/{uid}/weeks/{weekId}` — o rollup semanal

O documento que carrega a revisão. Tudo aqui é pré-agregado.

```jsonc
{
  "schemaVersion": 1, "updatedAt": "…",
  "weekId": "powerbuilding-2.0__w06",
  "programId": "powerbuilding-2.0", "programName": "Powerbuilding Phase 2.0",
  "weekNumber": 6, "macrocycle": 1,
  "blockName": "…", "blockType": "accumulation", "isDeload": false,
  "firstDate": "2026-08-03", "lastDate": "2026-08-08",

  "adherence": {
    "sessionsPrescribed": 4, "sessionsCompleted": 4,
    "setsPrescribed": 78, "setsCompleted": 74, "setsSkipped": 4,
    "completionPct": 94.9,
    "exercisesSkipped": [ { "exerciseId": "leg_extension", "name": "Leg Extension", "sessions": 1 } ],
    "planAdherence": { "full": 3, "partial": 1, "none": 0 }
  },

  "tonnage": {
    "total": 61240,
    "byLift":     { "squat": 18400, "bench": 15200, "deadlift": 12800, "ohp": 1900, "other": 12940 },
    "byExercise": { "agachamento_low_bar": 14100, "…": 0 }
  },

  // séries ponderadas pela fração de ativação — mesma unidade do app
  "volumeByMuscle": {
    "actual":     { "quads": 14.5, "peito": 12.0, "…": 0 },
    "prescribed": { "quads": 15.0, "peito": 12.0, "…": 0 },
    "delta":      { "quads": -0.5, "peito": 0,    "…": 0 }
  },

  "topE1rm": {
    "agachamento_low_bar": { "name": "Back Squat", "e1rm": 231.4, "weight": 200,
                             "reps": 5, "rpe": 8, "date": "…", "deltaPrevWeek": 3.2 }
  },

  "surveys": {
    "n": 4,
    "averages":      { "sleepQuality": 7.2, "sleepHours": 7.4, "energyLevel": 6.8,
                       "stressLevel": 4.1, "motivation": 8.0,
                       "sessionQuality": 7.5, "sessionRPE": 8.2, "pumpRating": 3.8 },
    "deltaPrevWeek": { "sleepQuality": -0.6, "…": 0 },
    "readinessScore": 7.1,
    "sRPELoad": 607,          // Σ (sessionRPE × séries completadas na sessão)
    "strengthPerception": { "below": 0, "normal": 3, "above": 1 }
  },

  "pain": [
    { "region": "lower_back", "occurrences": 3, "maxIntensity": 4,
      "avgIntensity": 3.0, "source": "pre" }
  ],

  "compliance": {
    "judgedSets": 11, "workingSets": 74,
    "judgedReps": 34, "validReps": 29, "validRepPct": 85.3,
    "videos": 11,
    "byLift": {
      "squat":    { "sets": 12, "judgedSets": 5, "judgedReps": 14, "validReps": 11,
                    "validRepPct": 78.6,
                    "depth": { "below_parallel": 3, "at_parallel": 1,
                               "above_parallel": 1, "unknown": 0 } },
      "bench":    { "sets": 16, "judgedSets": 4, "judgedReps": 12, "validReps": 12,
                    "validRepPct": 100, "pausedSets": 4, "avgPauseSec": 1.1 },
      "deadlift": { "sets": 8,  "judgedSets": 2, "judgedReps": 8,  "validReps": 6,
                    "validRepPct": 75, "deadStopSets": 2, "strapSets": 0 }
    },
    "equipment": { "belt": 9, "straps": 0, "kneeSleeves": 12, "wristWraps": 6 },
    "bars":   { "gym_barbell": 9, "ipf_calibrated": 2 },
    "plates": { "thick_plastic": 8, "calibrated": 3 }
  },

  "bodyweight": {
    "n": 5, "start": 87.1, "end": 86.4, "avg": 86.8, "deltaKg": -0.7,
    "dotsStart": 404.2, "dotsEnd": 407.1, "dotsDelta": 2.9
  },

  // desvio agregado por exercício, em relação ao que o programa prescreveu
  "deviations": [
    { "exerciseId": "supino_wide_grip", "name": "Barbell Bench Press",
      "sets": 8, "avgRepsDelta": -1.2, "avgRpeDelta": 0.6,
      "avgLoadDeltaPct": -2.4, "setsDelta": 0 }
  ],

  "sessions": [
    { "id": "…", "date": "2026-08-03", "dayIndex": 0, "dayType": "lower_body",
      "completed": true, "setsCompleted": 19, "setsPrescribed": 20,
      "tonnage": 17300, "sessionRPE": 8, "sessionQuality": 8,
      "strengthPerception": "normal", "planAdherence": "full",
      "topSet": { "exerciseId": "agachamento_low_bar", "weight": 200,
                  "reps": 5, "rpe": 8, "e1rm": 231.4 } }
  ],

  "notes": [ { "date": "2026-08-03", "dayType": "lower_body",
               "exerciseName": "Back Squat", "text": "joelho abriu na 4ª rep" } ],

  "flags": [ "profundidade: 1 de 5 séries julgadas acima do paralelo",
             "sono caiu 0,6 vs semana anterior" ]
}
```

`flags` são regras determinísticas, não julgamento — servem para a conversa saber
onde olhar primeiro. As regras vivem em `src/services/sync/weeklyRollup.ts`.

### 3.4 `athletes/{uid}/sessions/{workoutId}`

Resumo por sessão, **agregado por exercício** (sem detalhe série a série).

```jsonc
{
  "id": "…", "date": "…", "weekId": "…", "weekNumber": 6, "programId": "…",
  "dayIndex": 0, "dayType": "lower_body", "blockName": "…", "blockType": "…",
  "completed": true, "startedAt": "…", "completedAt": "…", "durationMin": 82,
  "setsPrescribed": 20, "setsCompleted": 19, "tonnage": 17300,
  "tonnageByLift": { … }, "volumeByMuscle": { … },
  "exercises": [
    { "exerciseId": "agachamento_low_bar", "name": "Back Squat", "skipped": false,
      "prescribed": { "sets": 4, "reps": "3-5", "rpe": "8", "percent1RM": "85%" },
      "setsCompleted": 4, "tonnage": 3900,
      "topSet": { "weight": 200, "reps": 5, "rpe": 8, "e1rm": 231.4, "isPR": true },
      "avgRepsDelta": 0, "avgRpeDelta": 0.25, "avgLoadDeltaPct": -1.2,
      "compliance": { "judgedSets": 2, "judgedReps": 8, "validReps": 6,
                      "depth": { "below_parallel": 1, "at_parallel": 1 },
                      "videos": 2 },
      "notes": "joelho abriu na 4ª rep" }
  ],
  "pre":  { "sleepQuality": 7, "sleepHours": 7.5, "energyLevel": 7,
            "stressLevel": 4, "motivation": 8, "pain": [ … ], "supplements": { … } },
  "post": { "sessionQuality": 8, "sessionRPE": 8, "strengthPerception": "normal",
            "planAdherence": "full", "newPain": [ … ], "pumpRating": 4, "notes": "…" }
}
```

### 3.5 `athletes/{uid}/sessions/{workoutId}/raw/log`

`{ "workout": <WorkoutLog verbatim>, "updatedAt": "…" }`

É a única cópia com prescrição série a série, segmentos e `compliance` por série.
Serve para (a) cavar uma sessão específica e (b) reconstruir o app num aparelho novo.
A revisão de rotina **não lê este documento**.

### 3.6 `athletes/{uid}/bodyweight/{YYYY-MM-DD}`

`{ "date": "2026-08-07", "weightKg": 86.4, "total": 615, "dots": 407.1, "note": "", "updatedAt": "…" }`

Uma pesagem por dia; regravar o mesmo dia sobrescreve. O rollup semanal e o
`state/current` já resumem a série — esta coleção só é lida para gráfico de
tendência longa.

### 3.7 `athletes/{uid}/records/{exerciseId}`

`{ "exerciseId": "…", "name": "…", "e1rm": 231.4, "weight": 200, "reps": 5, "rpe": 8, "date": "…", "updatedAt": "…" }`

---

## 4. Índices

O Firestore indexa cada campo isolado automaticamente. Só duas consultas do
briefing cruzam campos, e ambas precisam de índice composto — o arquivo
`firestore.indexes.json` na raiz do repositório já as declara:

| Coleção | Campos | Usada por |
|---|---|---|
| `weeks` | `programId` ASC, `weekNumber` DESC | briefing: últimas N semanas do programa ativo |
| `sessions` | `programId` ASC, `date` DESC | briefing `--sessions`: últimas sessões |

Nenhuma outra consulta é feita: `athlete`, `state` e os documentos de semana são
buscados por caminho direto (`getDoc`), que não usa índice.

Índices de campo único não precisam ser criados. Nenhum documento é grande o
bastante para exigir exceção de indexação (limite de 40 mil entradas de índice
por documento); o maior é `raw/log`, que ainda assim fica em ~50–150 KB, longe do
teto de 1 MB por documento.

---

## 5. Segurança

`firestore.rules`, na raiz:

- Autenticação por **e-mail + senha**, conta única do atleta.
- `athletes/{uid}` e tudo abaixo: leitura e escrita **só** se
  `request.auth.uid == uid`. Nada mais no banco é acessível.
- Sem regra de leitura pública, sem acesso anônimo, sem cloud functions.

**Por que e-mail/senha e não auth anônima** (uma linha, como pedido): auth anônima
dá um uid novo a cada dispositivo ou limpeza de storage, o que quebraria o sync
entre celular e o script Node — e-mail/senha dá um uid estável, é a opção mais
simples que ainda faz o dado ser de uma pessoa e não de um navegador.

---

## 6. Como a escrita acontece (e por que o offline não regride)

`FirestoreStorageService` implementa `IStorageService` **sem mudar a interface**:
toda leitura e toda escrita continuam indo para o localStorage de forma síncrona,
exatamente como antes. A nuvem é um efeito colateral.

```
UI → IStorageService.saveWorkout()
       ├─ localStorage (síncrono, fonte de verdade da escrita)  ← inalterado
       └─ marca sujo: session:{id}, week:{programId}:{n}, state
                        ↓ (debounce 4 s, ou ao voltar a ficar online)
                     syncEngine.flush()
                        ↓ constrói o rollup a partir do estado local ATUAL
                     Firestore setDoc(merge: false)
```

Pontos que sustentam o offline:

- **A fila guarda marcadores, não payloads.** O outbox (`pl_sync_outbox`) contém
  chaves como `session:abc123`, não documentos serializados. No flush, o documento
  é reconstruído a partir do estado local do momento. Consequência: dez edições
  offline da mesma sessão viram **uma** escrita, sempre com o dado final, e o
  replay é idempotente.
- **Nada bloqueia a UI.** O flush é `fire-and-forget`; falha de rede só mantém o
  marcador na fila.
- **O SDK do Firebase entra por import dinâmico**, então o bundle inicial e o
  service worker do PWA não carregam a biblioteca quando não há configuração.
- **Sem configuração de Firebase, o app usa `LocalStorageService` e nada muda.**

Direção do sync: **local → nuvem**, apenas. Um pull automático exigiria resolução
de conflito entre dois dispositivos escrevendo o mesmo `WorkoutLog` — complexidade
sem benefício para um único atleta com um celular. Restauração continua sendo o
export/import JSON que já existe (e `raw/log` guarda tudo que seria preciso para
escrever um pull no futuro).

---

## 7. Retrocompatibilidade

- `SetCompliance` e `BodyweightEntry` são **aditivos e opcionais**. Nenhum log
  antigo quebra; séries sem `compliance` entram nos rollups como "não julgadas"
  (`judgedSets` menor que `workingSets`), nunca como "inválidas".
- A migração local v2→v3 apaga as chaves órfãs do feedback de IA
  (`pl_ai_feedback`, `pl_api_key` — um segredo que não tinha mais consumidor) e
  semeia o primeiro ponto de peso corporal a partir de `profile.bodyweight`.
- `schemaVersion` está em cada documento de rollup: mudar a forma de um rollup é
  bumpar o número e reescrever as semanas (`Reenviar tudo`, em Config).
