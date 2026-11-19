"""Ajustes manuais de tempo de palavras-chave (rodar depois de alinhar_e_eventos.py)."""
import json
AJ={'NÃO TEM TSUNAMI':(129.8,3.0),'O TRÓPICO ANDA':(562.2,3.6),'O TRÓPICO É O EIXO':(543.2,3.6)}
p='render/src/data.json'; d=json.load(open(p))
for e in d['eventos']['palavra']:
    if e['texto'] in AJ: e['t'],e['dur']=AJ[e['texto']]
json.dump(d,open(p,'w'),ensure_ascii=False,indent=1); print('ok')
