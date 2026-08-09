import fs from 'node:fs'; import readline from 'node:readline';
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]) });
let head=null, idx={}; const first=new Map();
for await (const line of rl){ if(!head){head=line.split(','); head.forEach((h,i)=>idx[h]=i); continue;}
 const f=line.split(',');
 if(f[idx.Sex]!=='M'||f[idx.Equipment]!=='Raw'||f[idx.Event]!=='SBD'||f[idx.ParentFederation]!=='IPF') continue;
 const n=f[idx.Name], d=f[idx.Date]; const p=first.get(n); if(!p||d<p.d) first.set(n,{d,f}); }
let bomb=0, semAttempt=0, comAttempt=0, sq=0;
for(const {f} of first.values()){
  const t=f[idx.TotalKg]; if(!(t===''||parseFloat(t)===0)) continue; bomb++;
  const any=['Squat1Kg','Squat2Kg','Squat3Kg','Bench1Kg','Bench2Kg','Bench3Kg','Deadlift1Kg','Deadlift2Kg','Deadlift3Kg'].some(k=>f[idx[k]]!=='');
  if(!any){semAttempt++;continue;} comAttempt++;
  const sqA=['Squat1Kg','Squat2Kg','Squat3Kg'].map(k=>f[idx[k]]);
  if(f[idx.Best3SquatKg]==='' && sqA.some(v=>v!=='')) sq++;
}
console.log('bombs:',bomb,'sem nenhuma tentativa registrada:',semAttempt,'com tentativa:',comAttempt);
console.log('bombs cujo agacho não produziu marca válida (entre os com tentativa):',sq,'=',(100*sq/comAttempt).toFixed(1)+'%');
