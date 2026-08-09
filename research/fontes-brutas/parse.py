import re,html,sys
def clean(s):
    s=re.sub(r'<(script|style)[^>]*>.*?</\1>','',s,flags=re.S)
    s=re.sub(r'<span style="font-size:0[^"]*">.*?</span>','',s,flags=re.S)
    s=s.replace('​','').replace('‌','').replace('‍','').replace('⁠','').replace('⁢','').replace('⁣','')
    return s
def rows(s):
    s=clean(s)
    out=[]
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',s,flags=re.S):
        cells=[html.unescape(re.sub(r'<[^>]+>','',c)).replace('\xa0',' ').strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',tr,flags=re.S)]
        if any(cells): out.append(cells)
    return out
if __name__=='__main__':
    s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
    # print headings too
    c=clean(s)
    for h in re.findall(r'<h\d[^>]*>(.*?)</h\d>',c,flags=re.S):
        print('H:',re.sub(r'<[^>]+>','',h).strip())
    for r in rows(s): print(' | '.join(r))
