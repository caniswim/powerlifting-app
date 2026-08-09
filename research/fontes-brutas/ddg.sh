#!/bin/zsh
q="$1"
curl -sL --max-time 30 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" --data-urlencode "q=$q" "https://html.duckduckgo.com/html/" | python3 -c "
import sys,re,html,urllib.parse
t=sys.stdin.read()
for m in re.findall(r'result__a\" href=\"([^\"]+)\"[^>]*>(.*?)</a>',t,flags=re.S)[:12]:
    u=html.unescape(m[0])
    p=urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('uddg',[u])[0]
    print('-',re.sub(r'<[^>]+>','',html.unescape(m[1]))[:80],'|',p[:130])
"
