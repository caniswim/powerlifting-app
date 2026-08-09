import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith('.') && !/\.[a-z]+$/.test(spec)) {
      try { return next(spec + '.ts', ctx); } catch { /* cai no padrão */ }
    }
    return next(spec, ctx);
  },
});
const m = await import('/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/sync/weeklyRollup.ts');
console.log('OK', Object.keys(m));
