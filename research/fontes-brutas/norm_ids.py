import json, re, glob, os, sys
D='/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/wt-blevins/research/extract'
RX=re.compile(r'^VG(\d{3}-\d+)$')
def fix(v):
    m=RX.match(v)
    return 'G'+m.group(1) if m else v
tot=0; files=0
for f in sorted(glob.glob(os.path.join(D,'G*.jsonl'))):
    out=[]; changed=False
    for l in open(f, encoding='utf-8'):
        s=l.strip()
        if not s:
            continue
        d=json.loads(s)
        old=d['id']; new=fix(old)
        if new!=old: changed=True; tot+=1
        d['id']=new
        for k in ('conflicts','conditions','basis'):
            if k in d and isinstance(d[k],list):
                nv=[fix(x) for x in d[k]]
                if nv!=d[k]: changed=True
                d[k]=nv
        out.append(json.dumps(d, ensure_ascii=False))
    if changed:
        files+=1
        open(f,'w',encoding='utf-8').write('\n'.join(out)+'\n')
print(f'ids renomeados: {tot} em {files} arquivo(s)')
