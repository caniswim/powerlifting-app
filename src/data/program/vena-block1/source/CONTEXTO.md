# Bloco 1 — contexto que não cabe em tabela de exercício

Companheiro de `PROGRAMA.md`. Aqui moram as decisões de `design.md` que governam o
bloco mas não são prescrição de série: nutrição, aritmética de peso corporal e cardio.
Elas não viram linha de tabela de propósito — forçá-las ali produziria nota que ninguém
lê no meio de uma sessão.

---

## 1. Nutrição (`design.md` §9)

- **2600 kcal = manutenção verificada** (peso estável em 87 kg) — ⚠️ **verificada SOB A
  CARGA DE TREINO ANTERIOR AO BLOCO 1** (rotina de bodybuilding, sem os 5 dias de SBD desta
  spec), e é isso que a declaração anterior omitia. **O Bloco 1 sobe o volume-carga ~15% em
  13 semanas** (`VENA_BLOCK1_MEASURES[].volumeCarga`, S4 → S16): manutenção medida em
  outra carga de treino não é manutenção nesta. **Reverificar na S4 e na S8**, com a série
  de peso corporal do app — se o peso cair sem que o DOTS suba, o número era de outra
  rotina e sobe.
- **220 g de proteína = 2,53 g/kg**, já acima da prescrição de 2,2 g/kg do Vena.
  **Não mexer na proteína.**
- **Recomp em manutenção é a escolha dele, e combina bem com ESTE bloco
  especificamente:** a prioridade aqui é aprendizado técnico, e técnica não precisa de
  superávit do jeito que força máxima precisa.
- **Árbitro: o DOTS decide.** Se o peso cair e o DOTS subir, a direção está certa. Se o
  DOTS cair, corrigir. O app já guarda a série de peso corporal com DOTS por ponto —
  é essa curva que responde a pergunta, não a balança sozinha.
- **Creatina: 5 g/dia, monoidratada.**
  ⚠️ **Verificar selo `Informed Sport` ou `NSF Certified for Sport`.** A IPF opera em
  responsabilidade objetiva: contaminação de lote é problema do atleta, não do
  fabricante. Este é o único item de suplementação com risco regulatório real.

---

## 2. Aritmética de peso corporal (`design.md` §12)

O número que decide a estratégia de classe. Aos 87 kg numa classe de 93:

| Movimento | Efeito no GL |
|---|---|
| **+1 kg de massa magra** | ≈ +10,8 kg de total ≈ **+1,6% de GL** |
| **−1 kg de peso corporal** | **+0,5% de GL** |

→ **1 kg de massa magra vale ~3× mais que 1 kg economizado.**

A escolha dele (manter 87 melhorando composição) **é compatível** com isso, porque
ganhar magro e perder gordura no mesmo peso É ganhar magro. Mas **se em algum momento
houver escolha entre ganhar magro mais rápido aceitando alguma gordura, ou segurar o
peso, a aritmética favorece ganhar magro 3:1.** Registrar e revisitar com o DOTS.

Subir para 105 kg custaria **+41,7 kg de total só para empatar**. Fora de questão.

---

## 3. Cardio (`design.md` §13)

Aqui a evidência **contradiz o costume do esporte**:

- **1 de 12 elites faz aeróbico estruturado** (Rouska, e por obrigação militar).
- Mas **Schumann: SMD −0,06, p = 0,45** — cardio fácil é essencialmente **grátis**,
  não interfere na força.

→ **Prescrever piso mínimo de saúde sem medo, e sem esperar retorno de performance.**
Base adjacente: 5–10 min/dia já mantêm uma linha de base decente `[R136 @ 01:36]`
`[R37 @ 02:33]`.

**No taper**, reduzir primeiro a **intensidade** (zona 4 → zona 2), depois o **volume**
— 3 dias/semana de zona 2, caminhada nos outros `[R54 @ 02:03]`. Erro comum registrado:
ficar **sedentário demais** na semana da competição `[R54 @ 02:03]`; nunca descanso
completo `[R110]`.

---

## 4. Vestuário e vídeo (`design.md` §8)

Regra que vale para toda filmagem: **short curto e justo**, ou marcadores nos pontos
ósseos. Short folgado custou **±3 cm de incerteza** na análise de vídeo anterior — sem
isso, nenhuma medição de profundidade é confiável.

---

## 5. Pré-condições do bloco (`SPEC_REV2` §6)

Não são acessório de protocolo: sem elas, invariantes do programa viram declaração.

| Item | Sem ele, o que quebra |
|---|---|
| **Câmera lateral de supino** | a escala de RPE 10 do programa vira declarativa — não há como julgar a pausa, a queda de costela nem o *upper body thrust*, que são os dois riscos nº 1 de luz vermelha |
| **Câmera perpendicular de agacho** | idem para profundidade legal e ângulo de tronco |
| **Micro-anilhas de 1,25 kg** (par → 2,5 kg na barra) | a grade inteira de percentuais; com 5 kg o arredondamento estoura o teto de 92% **e** o piso de 80% |
| **Log de dor de peitoral por sessão, em 3 momentos** | o gate de §1.2 do `PROGRAMA.md`, e a discriminação de mecanismo (exposição × carga) que o bloco existe para fazer |
| **Ajudante (ou vídeo) para os comandos** | os comandos de competição desde a semana 1, e o simulado como teste de legalidade |

## 6. O que muda na nutrição durante o taper

Nada na dose — **2600 kcal e 220 g de proteína seguem iguais nos 10 dias**. O que muda é o
risco de afrouxar: *"as pessoas relaxam na dieta e param de ser rigorosas com o sono… então
recuperam pior justamente quando esperavam recuperar melhor"* `[R22 @01:06]` `[GERAL]`.
Horário de sono constante `[R15 @01:33]` `[GERAL]`.

No **cardio**, reduzir primeiro a intensidade (zona 4 → zona 2) e só depois o volume;
caminhada nos dias de descanso do taper (D−8, D−6, D−4, D−2, D−1). **Não trocar acessório
por sedentarismo:** *"erro comum no taper é ficar sedentário demais; manter esse movimento
leve o deixou muito mais solto"* `[R54 @02:03]` `[GERAL]`.

## 7. O que o DOTS decide, e o que ele não decide

O DOTS é o árbitro da direção de peso corporal (§1), **não** do sucesso do bloco. O sucesso
do Bloco 1 é medido em **legalidade**: profundidade batida sem hesitação, pausa imóvel até o
comando, lockout fechado atrás da linha da barra. O supino, em particular, progride em
**séries** (16 → 22) e não em quilos — a terceira tentativa do simulado é +2,5 kg sobre o
melhor single da semana 16, e isso é o esperado, não uma falha do programa.
