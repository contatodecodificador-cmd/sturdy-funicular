"""Gera tts_blocos.json + texto_para_IA.txt a partir do roteiro final (.md).
Uso: python3 preparar_texto_ia.py roteiro_final.md
Depois revise à mão: anos/números por extenso, siglas (IPCC -> painel do clima da ONU), nomes estrangeiros.
O script avisa se sobrar algum dígito."""
import sys,json,re
s=open(sys.argv[1]).read().split('## (a)')[0]
blocos=[];cur=None
for l in s.split('\n'):
    if l.startswith('## INTRO') or l.startswith('## BLOCO'):
        cur={'titulo':l[3:].strip(),'texto':[]}; blocos.append(cur); continue
    if l.startswith('### VIRADA') or l.startswith('### FECHO'):
        cur={'titulo':l[4:].strip(),'texto':[]}; blocos.append(cur); continue
    if cur is None or not l.strip() or l.startswith(('[','#','---')): continue
    cur['texto'].append(l.strip())
blocos=[b for b in blocos if b['texto']]
for b in blocos: b['texto']='\n'.join(b['texto'])
json.dump(blocos,open('tts_blocos.json','w'),ensure_ascii=False,indent=1)
t='\n\n'.join(b['texto'] for b in blocos)+'\n'
open('texto_para_IA.txt','w').write(t)
dig=re.findall(r'.{0,25}\d.{0,25}',t)
print(len(t),'caracteres;',len(blocos),'trechos')
if dig: print('ATENÇÃO, números ainda em dígitos:'); [print('  ',d) for d in dig]
