import {readFileSync, readdirSync} from 'node:fs';
const E='research/extract';
export const claims=[];
for(const f of readdirSync(E).filter(x=>x.endsWith('.jsonl'))){
  readFileSync(`${E}/${f}`,'utf8').split('\n').filter(Boolean).forEach((l,i)=>{const c=JSON.parse(l);c._f=`${f}:${i+1}`;claims.push(c);});
}
