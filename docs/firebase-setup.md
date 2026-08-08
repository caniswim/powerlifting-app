# Firebase — estado real do projeto `powerlifting-d93b8`

> Atualizado automaticamente após a configuração assistida.
> Credencial usada: service account do Admin SDK (`firebase-adminsdk-fbsvc@...`),
> mantida em `~/Downloads/` e **nunca copiada para o repositório**.

## ✅ Feito, sem intervenção manual

| Item | Estado |
|---|---|
| Banco Firestore `(default)` | já existia no projeto |
| App web `powerlifting-app` | **criado** — App ID `1:326594352367:web:13e8e86a5869c30606371a` |
| `.env` com a config web | **escrito** (6 variáveis `VITE_FIREBASE_*`), ignorado pelo git |
| `firebase.json` + `.firebaserc` | **criados** (não existiam; sem eles não há deploy) |
| **Regras do Firestore** | **PUBLICADAS** em `projects/powerlifting-d93b8/releases/cloud.firestore` |

As regras no ar são as de `firestore.rules`: tudo vive sob `athletes/{uid}`, só o dono
daquele uid lê e escreve, exige `sign_in_provider == 'password'`, e qualquer outro
caminho é negado — inclusive para usuário autenticado.

## ⛔ Bloqueado por permissão ou por plano — precisa do console

### 1. Habilitar Authentication → E-mail/Senha
A API de inicialização retorna `BILLING_NOT_ENABLED: Identity Platform feature requires
billing to be enabled`. Esse endpoint é o do **Identity Platform** (plano Blaze); o
**Firebase Authentication comum é grátis no Spark**, mas o primeiro "ligar" dele só
existe pelo console.

**Não habilitei billing por conta própria** — é compromisso financeiro e não estava
autorizado.

Console → Authentication → Get started → Sign-in method → **Email/Password** → Enable.
Depois: Users → Add user → `brunnovert98@gmail.com` + uma senha forte.
Por fim, Settings → User actions → desmarcar **Enable create (sign-up)**, para o app
ficar de um atleta só.

### 2. Índices compostos do Firestore
`403 PERMISSION_DENIED` — o service account do Admin SDK não tem `datastore.indexAdmin`,
e também não consegue ler nem alterar a política IAM do projeto para conceder a si mesmo.

Dois caminhos, ambos triviais:
- **Preguiçoso e seguro:** não fazer nada. Na primeira consulta que precisar do índice, o
  Firestore devolve um erro com um **link direto que cria o índice em um clique**.
- Ou colar os dois de `firestore.indexes.json` em Console → Firestore → Índices:
  `weeks(programId ASC, weekNumber DESC)` e `sessions(programId ASC, date DESC)`.

### 3. Preencher `FIREBASE_PASSWORD` no `.env`
Só depois de criar a conta no passo 1. É o que o `npm run briefing` usa para entrar.

## Vercel

Importar do `.env` **apenas as seis `VITE_FIREBASE_*`**.
`FIREBASE_EMAIL` e `FIREBASE_PASSWORD` **não vão para o Vercel** — o briefing roda na sua
máquina, não no deploy, e a senha não tem por que existir no ambiente de build.

A config web vai embutida no bundle do navegador; isso é o desenho do Firebase e não é
vazamento. Quem protege o dado são as regras já publicadas mais o Auth.

---


Nada aqui pode ser feito por código: exige o console do Firebase e a sua conta.
Leva ~10 minutos, uma vez só. Enquanto não for feito, **o app funciona
exatamente como antes** (100% local, offline, sem uma linha de Firebase no
bundle).

O modelo de dados está em [`firestore-schema.md`](./firestore-schema.md).

---

## 1. Criar o projeto

1. <https://console.firebase.google.com> → **Adicionar projeto**.
2. Nome: o que quiser (ex.: `prime-lift`). Google Analytics: **desativado** — não
   é usado e só adiciona coleta.
3. Plano **Spark (gratuito)** basta: a revisão semanal custa ~6 leituras e o app
   escreve algumas dezenas de documentos por semana, contra uma cota de 50 mil
   leituras e 20 mil escritas por dia.

## 2. Criar o banco Firestore

1. Menu lateral → **Build → Firestore Database → Criar banco de dados**.
2. Modo: **produção** (as regras deste repositório substituem o padrão no passo 5).
3. Região: **`southamerica-east1` (São Paulo)** — menor latência daqui.
   ⚠️ A região **não pode ser alterada depois**.

## 3. Registrar o app web e pegar a config

1. Visão geral do projeto → ícone **`</>`** (Web) → apelido `prime-lift-pwa`.
2. **Não** marque Firebase Hosting (o app é hospedado onde já está hoje).
3. Copie o objeto `firebaseConfig` que aparece.
4. Na raiz do repositório: `cp .env.example .env` e preencha:

   | Campo do console | Variável |
   |---|---|
   | `apiKey` | `VITE_FIREBASE_API_KEY` |
   | `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `VITE_FIREBASE_PROJECT_ID` |
   | `appId` | `VITE_FIREBASE_APP_ID` |

   `.env` está no `.gitignore` — não comite.

## 4. Criar a conta do atleta

1. **Build → Authentication → Começar**.
2. Aba **Sign-in method** → habilite **E-mail/senha**. Deixe "Link de e-mail"
   desligado.
3. Aba **Users → Adicionar usuário**: o seu e-mail e uma senha forte.
4. Ainda em Authentication → **Settings → User actions**: desmarque
   **"Enable create (sign-up)"** se disponível, para que ninguém mais crie conta
   no projeto.

> **Por que e-mail/senha e não anônima:** auth anônima dá um `uid` novo a cada
> dispositivo ou limpeza de storage — o celular e o script Node acabariam
> gravando e lendo caixas diferentes. E-mail/senha dá um `uid` estável, e é a
> opção mais simples que ainda faz o dado ser de uma pessoa, não de um navegador.

5. Ponha o mesmo e-mail e senha no `.env`, em `FIREBASE_EMAIL` e
   `FIREBASE_PASSWORD` — é como o script de briefing entra. **Esses dois são
   segredos de verdade.**

## 5. Publicar regras e índices

Os arquivos já estão na raiz: `firestore.rules` e `firestore.indexes.json`.

**Opção A — CLI (recomendada):**

```bash
npm i -g firebase-tools
firebase login
firebase use --add            # selecione o projeto criado
firebase deploy --only firestore:rules,firestore:indexes
```

Se o `firebase init` pedir, aponte para os arquivos existentes; não deixe
sobrescrevê-los.

**Opção B — console:** Firestore → **Rules**, cole o conteúdo de
`firestore.rules` e publique. Depois **Indexes → Composto → Adicionar** e crie
os dois índices descritos em `firestore-schema.md` §4.

> Sem os índices, a primeira execução do briefing falha com um erro que **inclui
> um link direto** para criar o índice que faltou. Clicar nele também resolve.

## 6. Primeira sincronização

1. `npm run build && npm run preview` (ou rode o app onde ele já está publicado —
   lembre de configurar as mesmas variáveis `VITE_*` no build do deploy).
2. No app: **Config → Nuvem (Firestore)** → entre com o e-mail e a senha.
3. Clique em **Reenviar tudo**. Isso enfileira todo o histórico local. Acompanhe
   o contador "Na fila" chegar a 0.
4. Confira no console: deve existir `athletes/{uid}` com `state`, `weeks`,
   `sessions`, `bodyweight` e `records`.

## 7. Gerar o briefing

```bash
npm run briefing                 # últimas 4 semanas
npm run briefing -- --weeks 8
npm run briefing -- --sessions   # + detalhe por exercício da semana atual
npm run briefing -- --out brief.md
```

O markdown resultante é o que se lê na sessão semanal de análise.

---

## Operação

- **Deploy:** as variáveis `VITE_FIREBASE_*` precisam existir no ambiente de
  build do host (Vercel/Netlify/etc.), não só no `.env` local — elas são
  embutidas no bundle em tempo de build.
- **Trocar de celular:** entre na mesma conta. O histórico local do aparelho novo
  vem do export/import JSON (Config → Gerenciamento de Dados); o Firestore é
  armazém de leitura, não faz pull automático (ver `firestore-schema.md` §6).
- **Algo não chegou:** Config → Nuvem mostra a fila pendente e o último erro.
  "Reenviar tudo" reconstrói todos os documentos a partir do estado local.
- **Custo:** com 5 sessões/semana o projeto fica na ordem de centenas de
  escritas e algumas dezenas de leituras por semana — folgadamente dentro do
  plano gratuito.
