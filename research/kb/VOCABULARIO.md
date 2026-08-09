# VOCABULÁRIO — a palavra que o canal usa, por tópico

Este arquivo existe por causa de dois números da `MEDICAO-02.md`:

> `six times` = **4** resultados, todos PESSOAL.
> `six days a week` = **6** resultados, dois deles `GERAL` + `prescricao`.

Entre os dois está a distância entre `responde-bem` e `responde-mal` na Q05 — a
pergunta que é literalmente sobre supinar seis vezes por semana, feita por um
atleta com o peitoral rompido há quatro meses. Nada de novo precisava entrar na
base. Faltava saber **qual palavra o canal usa**.

**Sem banco vetorial, e não vai ter um.** O consumidor é um modelo de janela
grande lendo arquivos, a busca é grep, e isso é restrição dura e provavelmente
vantagem — o que se recupera é auditável. Nesse mundo este índice faz o trabalho
que o *embedding* faria: ele é a ponte entre a palavra que se digita e a palavra
que está gravada.

## Como este arquivo é usado, e por que ele não é decoração

1. **Por máquina.** `research/tools/busca.mjs` lê estas seções e usa `usa:` para
   **expandir a consulta**: quem digita `ciclo` recebe também as claims que só
   dizem `training cycle`. Os termos emprestados entram com peso baixo (0,45) e
   a saída declara de qual seção vieram — palpite do índice não pode se passar
   por palavra do usuário.
2. **Por máquina, de novo.** `check-vocabulario.mjs` (dentro do `npm run
   check:kb`) recusa **termo morto**: todo termo em `usa:` tem de casar ao menos
   uma claim *daquele tópico*, e todo termo em `não usa:` tem de casar **zero na
   base inteira**. Um índice que envelhece em silêncio é pior que índice
   nenhum — ele confirma ao próximo agente que a base não tem o assunto.
3. **Por humano.** As notas em prosa são ignoradas pelo parser e são a metade que
   importa: elas dizem *por que* aquela busca falhou.

## Formato — pobre de propósito

    ## <topico>            (tem de estar no vocabulário fechado do PROTOCOLO-EXTRACAO.md)
    **usa:** `termo` · `termo`      ← cada um é regex, e tem de estar VIVO no tópico
    **não usa:** `termo` · `termo`  ← cada um tem de casar ZERO na base inteira
    Prosa livre. O parser ignora.

Formato rico é formato que ninguém escreve à mão. Os termos são escritos por
quem leu a saída do corpus (`vocabularioDoTopico` em `busca.mjs` lista os termos
e bigramas distintivos de cada tópico) — **derivados do corpus, não inventados**.

**Cobertura, declarada:** 10 dos 74 tópicos. Começou pelos que falharam na
medição (`frequencia`, `acessorios`, `periodizacao`, `rpe`, `profundidade`,
`equipamento`) e pelos que governam o peitoral deste atleta (`supino`, `lesao`,
`dor`, `volume`). Os outros 64 não têm seção, e a busca neles continua sendo só
raiz + número. Isso está escrito para não ser confundido com cobertura completa.

---

## frequencia

**usa:** `six days a week` · `days a week` · `times per week` · `per week` · `high frequency` · `frequency` · `vezes por semana` · `dias por semana` · `x/semana` · `freq_supino` · `frequencia_sbd`

**não usa:** `6x por semana`

O caso Q05, inteiro. O canal fala **`six days a week`** (6 claims, e é onde
V170-34 e V175-53 moram — `GERAL` + `prescricao`, as duas). Quem digita
`six times` cai em 4 claims que são todas `PESSOAL`: V015-03, V053-07, V152-19,
V170-04. As quatro descrevem o que ele *faz*; nenhuma é o que ele *prescreve*.
Concluir dali que "a base só tem log pessoal" é a recusa convincente que a
`MEDICAO-02` §2.2 mede.

`six times a week` existe, e casa **exatamente uma** claim (V015-03) — por isso
não está em `não usa:`. Um termo que devolve 1 é pior que um que devolve 0:
parece resposta. `six days per week` também não está: a primeira redação desta
seção o listou como morto e o `check-vocabulario.mjs` recusou o arquivo na
primeira execução, porque V114-19 diz exatamente isso. A trava pegou o erro do
autor do índice antes de o índice existir por um minuto.

O nome do `param` é `freq_supino`, e ele nunca fez parte de busca nenhuma até a
`busca.mjs` passar a indexar `params.name`.

## supino

**usa:** `bench press` · `bench` · `supino` · `leg drive` · `close grip` · `barbell bench`

**não usa:** `paused bench` · `chest injury`

`paused bench` casa **zero**: o supino pausado — que é a coluna `PAUSA-P` do
bloco inteiro deste atleta, pausa de 1,0 s em toda rep de barra desde a S1 — não
tem esse nome em lugar nenhum da base. Procurar por ele e não achar nada não diz
que o assunto está ausente; diz que o assunto está sob `bench` e sob os comandos
da IPF (`F001-35`: a barra imóvel no peito).

## periodizacao

**usa:** `training cycle` · `ciclo de treino` · `block periodization` · `linear periodization` · `macrociclo` · `duracao_ciclo` · `bloco de treino` · `cycle`

**não usa:** `mesocycle` · `mesociclo` · `duração do ciclo` · `quantas semanas`

O caso Q16. `training cycle` tem **86 claims** e nunca foi tentado. E o buraco
que a `busca.mjs` sozinha **não** fecha está aqui em cima, escrito: `ciclo` e
`cycle` não compartilham raiz nem número, então nenhuma radicalização junta os
dois. V125-07 (*"16 semanas é a duração ótima de um ciclo"*, `GERAL`) é
inalcançável a partir de qualquer consulta em inglês — **exceto** pela expansão
que este arquivo faz. É o exemplo canônico de por que o índice é peça de
engenharia e não anexo.

Quem escreve a pergunta como um humano escreveria (`duração do ciclo`, `quantas
semanas`) casa **zero**. As duas estão em `não usa:` justamente para que a trava
avise quando isso deixar de ser verdade.

## acessorios

**usa:** `accessory work` · `isolation work` · `isolation` · `trabalho de isolamento` · `per muscle` · `series_isolamento`

**não usa:** `sets per muscle group`

O caso Q19. `sets per muscle` devolve **2** (V010-01 e V145-28); `per muscle`
devolve **4**, e a quarta é **V010-13** — o polo 1–3 séries por músculo,
`GERAL` + `prescricao`, **doze ids depois de V010-01, no mesmo vídeo que a
resposta já estava citando**. Duas lições, e a segunda é a mais barata da
medição inteira: tire uma palavra da frase antes de desistir, e **leia os
vizinhos do id que você já achou** — o extrator emitiu as claims na ordem em
que o assunto foi dito.

## rpe

**usa:** `RPE` · `RIR` · `reps in reserve` · `repetições em reserva` · `in the tank` · `no tanque` · `relative intensity` · `proximidade da falha` · `to failure`

**não usa:** `escala de Borg` · `@8`

O caso Q11 **não é de vocabulário** — está aqui para não ser confundido com um.
A resposta filtrou `--modo prescricao --scope GERAL`, e o número de que
precisava (1 RPE ≈ 2–3 % de peso, V033-03/04/05) mora em **`PESSOAL` + `fato`**.
Nenhuma palavra teria salvo aquela busca: o filtro de segurança é o mesmo filtro
de recuperação. O conserto é o aviso de alargamento de filtro na `busca.mjs`, e
a regra do `RECUPERACAO.md` §4: **declaração de ausência não vale se a busca que
a sustenta carregava `--modo` ou `--scope`.**

## profundidade

**usa:** `depth` · `hit depth` · `above parallel` · `acima do paralelo` · `profundidade` · `agachamento`

**não usa:** `camera angle` · `ângulo da câmera` · `below parallel` · `breaking parallel`

O caso Q14. A resposta buscou vocabulário de **câmera** e a base fala de
**profundidade** — `camera angle` casa zero, `--topic profundidade` tem 87
claims. E note o par `above parallel` (20) contra `below parallel` (**zero**):
o canal descreve o erro (*parar acima*), não o alvo. Procurar pelo alvo devolve
nada e sugere ausência onde há 87.

## equipamento

**usa:** `commercial gym` · `academia comercial` · `knee sleeve` · `joelheira` · `home gym` · `academia em casa` · `whip` · `anilha`

**não usa:** `garage gym`

O caso Q29: a resposta leu as claims de academia só contra *"nomeia um lugar?"*
e declarou V169-42 única. `commercial gym` (8) e `academia comercial` (5) são
gavetas diferentes da mesma coisa, e é onde V055-21 e V174-18 estão; `home gym`
e `academia em casa` são onde G048-56 está.

## lesao

**usa:** `injury` · `lesão` · `pain` · `load management` · `reabilitação` · `rehab` · `overuse` · `peitoral` · `\bpec\b`

**não usa:** `pec tear` · `torn pec` · `fisioterapeuta` · `physical therapist` · `see a doctor` · `ver um médico`

**A linha mais importante deste arquivo, e ela é um zero.** Os quatro últimos
termos de `não usa:` casam **zero claims na base inteira** — e a trava do
`check-vocabulario.mjs` vai continuar reconferindo isso a cada execução. A base
não tem uma única claim sobre quando uma lesão exige avaliação presencial. É o
agravante já registrado em `MEDICAO-02` §6.2: *uma resposta fiel à base é uma
resposta que nunca manda ele procurar ninguém.*

`\bpec\b` precisa da âncora de palavra: `pec` cru casa 295 claims por dentro de
*expect*, *special*, *specific*. Com âncora, casa **5**. Um termo de índice que
casa 295 por acidente é um termo que ensina o próximo agente a confiar em ruído.

## dor

**usa:** `dor` · `pain` · `painful` · `escala de dor` · `escala_dor`

**não usa:** `2 de 10` · `RPE de dor`

O gate deste bloco (`PROGRAMA.md` §1.2) fala em **≥2/10 congela** e **≥4/10
encerra**, e a base **não escreve dor assim**. `escala de dor` casa **1**. O
cluster perigoso — V001-06, V079-34, V138-20, V079-32, e as quatro sem
`conditions` — é encontrável por `dor` e por `pain`, e por mais nada específico.
Quem procurar pelo vocabulário do gate não acha o que contradiz o gate.

## volume

**usa:** `volume` · `sets per week` · `séries por semana` · `junk volume` · `stimulus`

**não usa:** `MRV` · `MEV` · `volume landmarks`

O vocabulário de *landmarks* de volume (MEV/MAV/MRV), que é o mais difundido na
internet, casa **zero** aqui. Os dois homens da base não usam esse sistema. Uma
pergunta escrita nesse dialeto não devolve nada e parece lacuna de conteúdo — é
lacuna de dialeto, e as 750 claims de `volume` continuam lá.
