# Powerlifting App

PWA de acompanhamento de treino. Dois programas estão disponíveis: **Powerbuilding
Phase 2.0** (Jeff Nippard, 12 semanas — o padrão) e o programa legado de 52 semanas,
mantido para preservar o histórico já registrado.

## Programa a partir do markdown

O Powerbuilding 2.0 é gerado a partir do material de origem, não escrito à mão:

```
src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md   fonte de verdade (54 dias, 373 linhas)
src/data/program/powerbuilding2/source/WARMUP_ROUTINE.md      protocolo de aquecimento
scripts/exercise-map.mjs                                      rótulo do markdown -> exerciseId
scripts/build-program.mjs                                     gerador
src/data/program/powerbuilding2/generated.ts                  ARQUIVO GERADO — não editar
```

- `npm run build:program` regenera o TS a partir do markdown.
- `npm run check:program` falha se o gerado estiver defasado (roda dentro de `npm run build`).
- O gerador aborta se algum rótulo de exercício não estiver mapeado ou se as
  contagens de dias/linhas divergirem — nenhum exercício entra no app sem grupo
  muscular associado.

Cada linha da tabela vira um **bloco de prescrição** (`PrescribedExercise`) com as
oito colunas do documento. A expansão de um bloco nas séries individuais
(aquecimento em pirâmide, dropset, 21s, rest-pause, AMRAP, isometria, unilateral)
acontece em runtime, em `src/domain/setPlan.ts`.

## Stack

React 19 + TypeScript + Vite + Tailwind + Recharts, localStorage com backup em OPFS.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
