/**
 * Resolvedor de import extensionless para rodar módulos `.ts` do app dentro de
 * um script Node.
 *
 * O Node já executa TypeScript (apaga os tipos), mas não reescreve
 * `from '../../types'` para `../../types.ts` — quem faz isso é o bundler. Sem
 * este gancho, uma checagem de build só conseguiria olhar para módulos sem
 * nenhum import, e a checagem valiosa é justamente a que exercita o código real
 * de produção (`buildWeekDoc`) em vez de uma reimplementação da regra.
 *
 * Uso: `import './ts-resolve.mjs'` ANTES de qualquer `await import()` de `.ts`.
 */
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && !/\.[a-zA-Z0-9]+$/.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        /* não é módulo do app: cai no resolvedor padrão */
      }
    }
    return nextResolve(specifier, context);
  },
});
