"""Monta videos/canais_referencia.xlsx a partir dos dados coletados (yt-dlp, nov/2026).
Uso: python3 montar_planilha.py <pasta_com_json_dos_canais>"""
import json, glob, os, sys, statistics as st
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'canais_referencia.xlsx')

# metadados editoriais (nicho, formato, estrutura de título, como trazer para o Brasil)
META = {
 'Astrum': ('Espaço / planetas / missões', 'Longo 15–50 min, narração + imagens reais de sondas', '"What NASA Found..." / "Why Is X So Y?" / "The Weirdest..."', 'Mistério de planeta/missão + "o que isso muda aqui no Brasil" (céu do hemisfério sul, Alcântara)', 'Canal-modelo nº 1'),
 'Astrum Extra': ('Espaço (segundo canal do Astrum)', 'Longo 15–30 min', '"We Keep Receiving Mysterious..." / "Are We Close to..."', 'Sinais, vida em luas → radiotelescópios brasileiros (BINGO, Paraíba)', ''),
 'Space Matters': ('Espaço e escala', 'Longo, faceless', '"X Is So Huge Your Brain Can\'t Comprehend It"', 'Escala com referências brasileiras (Oiapoque–Chuí, BR-116)', 'Outlier x68 com título de escala'),
 'Stargaze': ('Simulações espaciais', 'Longo, simulação 3D', '"What If X Entered Our Solar System? (Simulation)" / "Falling Into X"', 'Simulação vista do céu do Brasil', ''),
 'SEA': ('Escala cósmica', 'Longo, 4K, sem narrador visível', '"Journey to..." / "The Largest..."', 'Viagem com régua brasileira', ''),
 'Destiny': ('Espaço + pré-história', 'Longo, faceless', '"What It\'s Like to Die on Every Planet" / "We Were Wrong About X"', 'Pré-história do Brasil (insetos gigantes, megafauna)', ''),
 'What If': ('Cenários hipotéticos', 'Longo/misto, animação', '"What If..." / "You Are Alive to Watch..."', '"E se..." ancorado em cidades brasileiras', 'Formato "Você vai estar vivo para ver"'),
 'ReYOUniverse': ('Documentário / geologia / espaço', 'Longo, faceless', '"What Lies Beneath [cidade]?"', '"O que existe embaixo de [cidade brasileira]?"', 'Série por cidade = série para o Brasil'),
 'Kosmo': ('Viagens cósmicas', 'Longo 1h+, faceless', '"A Journey to/around..."', 'Viagem longa para dormir/assistir', ''),
 'GeologyHub': ('Geologia / desastres atuais', 'Longo, análise de geólogo', '"Major M7.7 Strikes...; Geologist Analysis"', 'Notícia geológica + Brasil', 'Fonte de pautas quentes'),
 'Underworld': ('Desastres naturais (compilações)', 'Longo, compilação', '"10 Massive X Caught on Camera" / "39 Minutes of Terror"', 'Usar só como medidor de demanda (usa vídeos de terceiros)', 'Não copiar formato (direitos)'),
 'Dark Records': ('Documentário de desastres', 'Longo, reconstituição 3D', '"The Tragedy of..." / "Why Did X Explode?"', 'Desastres brasileiros reconstituídos (Mariana, Brumadinho, Joelma)', 'Tema sensível'),
 'Cool Worlds': ('Astrofísica / ideias', 'Longo, professor apresentador', '"The Strangest Idea in Science: X" / "What\'s Stopping Us From..."', 'Ideias grandes com âncora brasileira', ''),
 'Insane Curiosity': ('Ciência / desastres futuros', 'Longo, faceless', '"What Happens After X Is Worse Than X Itself" / "The Worst Possible Disaster"', 'El Niño, Apophis, desastre no Brasil', ''),
 'Kurzgesagt – In a Nutshell': ('Ciência geral', 'Animação 10–15 min', 'Afirmações curtas e provocativas', 'Só referência de ritmo; temas muito globais', ''),
 'RealLifeLore': ('Geografia / geopolítica', 'Longo, mapas', '"Why X Is Absurdly Empty" / "What\'s Hidden Under..."', '"Por que o interior do Brasil é vazio?" / "O que existe embaixo da Amazônia?"', ''),
 'Epic Spaceman': ('Escala visual', 'Longo, apresentador em 3D', '"I shrink 10x every 21s..." / "I put X in Y"', 'Escala dentro de uma casa/cidade brasileira', 'Poucos vídeos, todos gigantes'),
 'Cleo Abram': ('Ciência otimista', 'Longo, apresentadora', '"What If You Just Keep Digging?" / "What\'s Hidden Under X?"', '"E se você cavasse embaixo do Brasil?"', ''),
 'Reigarw Comparisons': ('Comparações', 'Longo, animação simples', '"X Comparison: ..."', 'Comparações com recordes brasileiros', ''),
 "xkcd's What If?": ('Cenários absurdos com física', 'Animação', '"What would a magnitude 15 earthquake be like?"', 'Pergunta absurda + resposta séria no Brasil', ''),
 'Timebound': ('Corpo humano em escada', 'Longo, faceless (canal pequeno)', '"What Happens to Your Body at Different X?"', 'Já usado no vídeo 5 (temperatura); oxigênio/altitude é o próximo', 'Canal pequeno com outliers x12–16'),
 'The Paint Explainer': ('Listas sombrias', 'Longo, ilustração estilo Paint', '"The Most Disturbing X..."', '"Os lugares mais perigosos do Brasil"', ''),
 'The Cosmic Witness': ('Simulações espaciais', 'Longo, simulação (canal pequeno)', '"What If X Came Closer to Earth?" / "We Replaced Our Sun With..."', 'Trocar o Sol vendo do quintal (ideia guardada)', 'Canal de 3 mil inscritos com vídeo de 624 mil'),
 'EarthquakeSim': ('Simulação 3D de terremotos', 'Blender 3D', '"3D Earthquake SIZE Comparison"', 'Já usado no vídeo 6', ''),
 'WatchData': ('Comparações', 'Longo, motion graphics', '"Comparison: ..."', 'Sirenes/alertas da Defesa Civil no Brasil', ''),
 'Primal Space': ('Engenharia / história', 'Animação 3D', '"The Crazy Engineering of X"', '"A engenharia maluca de Itaipu / Brasília"', ''),
 'Sideprojects': ('História / mistérios', 'Longo, faceless', '"Dark Secrets Revealed When X"', 'Pouco aderente', ''),
 'Wendover Productions': ('Logística / economia', 'Longo', '"How X Got So Bad"', 'Pouco aderente', ''),
}
LINK = {}
for l in open(os.path.join(SRC, 'lista.txt')):
    n, u = l.strip().split('|'); LINK[n] = u.rsplit('/videos', 1)[0]

canais = []
for f in sorted(glob.glob(os.path.join(SRC, '*.json'))):
    if 'busca_pt' in f: continue
    try: d = json.load(open(f))
    except Exception: continue
    es = [e for e in d['entries'] if e.get('view_count')]
    if not es: continue
    v = [e['view_count'] for e in es]; med = st.median(v)
    nome = d.get('channel') or os.path.basename(f)[:-5]
    canais.append(dict(nome=nome, url=d.get('channel_url') or LINK.get(nome, ''), subs=d.get('channel_follower_count') or 0,
                       med=int(med), n=len(es), top=sorted(es, key=lambda e: -e['view_count'])[:5]))
canais.sort(key=lambda c: -c['med'])

H = Font(bold=True, color='FFFFFF'); HF = PatternFill('solid', fgColor='1F3A5F')
def cab(ws, cols, widths):
    ws.append(cols)
    for i, w in enumerate(widths, 1):
        c = ws.cell(1, i); c.font = H; c.fill = HF; c.alignment = Alignment(wrap_text=True, vertical='center')
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'A2'
def wrap(ws):
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')

wb = Workbook()
# 1. Canais
ws = wb.active; ws.title = 'Canais'
cab(ws, ['Canal', 'Link', 'Inscritos', 'Mediana de views (últimos ~50 vídeos)', 'Nicho', 'Formato', 'Melhores vídeos recentes (views · ×mediana)', 'Estrutura de título', 'Tema adaptável ao Brasil', 'Nota'],
    [22, 34, 12, 14, 26, 26, 70, 40, 44, 28])
for c in canais:
    m = META.get(c['nome'], ('', '', '', '', ''))
    tops = '\n'.join(f"{e['title']} — {e['view_count']:,} · ×{e['view_count']/c['med']:.1f}".replace(',', '.') for e in c['top'][:3])
    ws.append([c['nome'], c['url'], c['subs'], c['med'], m[0], m[1], tops, m[2], m[3], m[4]])
for r in range(2, ws.max_row + 1):
    ws.cell(r, 3).number_format = '#,##0'; ws.cell(r, 4).number_format = '#,##0'
wrap(ws)

# 2. Outliers (todos os vídeos acima de 2× a mediana)
ws = wb.create_sheet('Vídeos que estouraram')
cab(ws, ['Canal', 'Título', 'Views', '× mediana do canal', 'Link'], [22, 80, 13, 12, 44])
linhas = []
for f in glob.glob(os.path.join(SRC, '*.json')):
    if 'busca_pt' in f: continue
    try: d = json.load(open(f))
    except Exception: continue
    es = [e for e in d['entries'] if e.get('view_count')]
    if not es: continue
    med = st.median([e['view_count'] for e in es])
    for e in es:
        if e['view_count'] >= 2 * med:
            linhas.append([d.get('channel'), e['title'], e['view_count'], round(e['view_count'] / med, 1), 'https://youtu.be/' + e['id']])
for l in sorted(linhas, key=lambda l: -l[3]): ws.append(l)
for r in range(2, ws.max_row + 1): ws.cell(r, 3).number_format = '#,##0'
wrap(ws)

# 3. Concorrência em português (buscas)
ws = wb.create_sheet('Concorrência PT')
cab(ws, ['Busca no YouTube (PT)', 'Views', 'Canal', 'Título', 'Link'], [36, 13, 24, 80, 30])
for f in glob.glob(os.path.join(SRC, 'busca_pt_*.json')):
    for q, es in json.load(open(f)).items():
        for e in sorted(es, key=lambda e: -(e.get('view_count') or 0))[:8]:
            ws.append([q, e.get('view_count') or None, e.get('channel'), e.get('title'), 'https://youtu.be/' + e['id']])
for r in range(2, ws.max_row + 1): ws.cell(r, 2).number_format = '#,##0'
wrap(ws)

# 4. Temas para o Brasil Milenar
ws = wb.create_sheet('Temas para o canal', 0)
cab(ws, ['#', 'Tema / título sugerido', 'Demanda provada (EN)', 'Concorrência em PT', 'Ângulo Brasil Milenar', 'Tipo', 'Nota'], [4, 46, 46, 46, 52, 10, 8])
T = [
 ('E se a MAIOR TEMPESTADE SOLAR da História Atingisse o BRASIL Hoje?',
  'Astrum "Geomagnetic Reversal" 2,8 mi; Astrum "Deepest We Have Ever Seen Into the Sun" 11,5 mi; Cleo Abram "The Sun Is Weirder Than You Think" 10 mi; xkcd "nanosecond on the Sun" 9,1 mi',
  'Só genéricos: Ciência Todo Dia 1 mi e 593 mil (antigos, sem Brasil); recorte "Brasil" tem 227 views. Ninguém fez a escada de intensidade',
  'O Brasil fica embaixo da Anomalia Magnética do Atlântico Sul (o ponto fraco do escudo da Terra). Escada G1→G5→Carrington 1859→evento Miyake (ano 774). Relógio: 8 min de luz, ~17 h até a nuvem chegar; aurora no céu do Brasil, apagão, GPS do agro, Itaipu, satélites', 'Geral + Brasil', '★★★★★'),
 ('O Que Existe EMBAIXO do Brasil? (descida camada por camada)',
  'Cleo Abram "What If You Just Keep Digging?" 13 mi e "What\'s Hidden Under Antarctica?" 10 mi; ReYOUniverse "What Lies Beneath Dallas?" 506 mil (×33); RealLifeLore "Under the Jungles of New Guinea" 2,6 mi',
  'Além do Mapa 527 mil (lista); rio Hamza 1 mi (notícia); ninguém fez a descida contínua',
  'Profundímetro saindo da sua casa: metrô de SP, Aquífero Guarani, pré-sal (7 km), rio Hamza, Moho, manto, núcleo; onde você sairia do outro lado (não é o Japão)', 'Brasil', '★★★★☆'),
 ('Se Todos os BRASILEIROS Sumissem, Quanto Tempo a Natureza Levaria para APAGAR o Brasil?',
  'xkcd "when would the last light go out?" 10 mi; What If "How Long Until Earth Erased Every Trace" 2,7 mi (×4,9)',
  'Genérico lotado (Refúgio Mental 6,3 mi; CTD 4 mi; Fatos Desconhecidos 1 mi; E se PT 336 mil), mas NENHUM com o Brasil',
  'Relógio de anos: Itaipu, Brasília, Minhocão, Cristo Redentor, Amazônia voltando, o último sinal brasileiro no espaço', 'Brasil', '★★★★☆'),
 ('E se um FURACÃO Categoria 5 Atingisse o BRASIL?',
  'Underworld "Strongest Tornado in History" 2,6 mi; Reigarw "Tsunami Height Comparison" 6,5 mi',
  'Manual do Mundo "por que não tem furacão" 2,6 mi (antigo); versões "e se" com <1 mil views',
  'Escada Saffir-Simpson numa casa de praia brasileira; Catarina 2004 (o único furacão do Atlântico Sul). Atenção: formato muito parecido com o vídeo 6, deixar para depois', 'Brasil', '★★★★☆'),
 ('E se o CAMPO MAGNÉTICO da Terra Sumisse Sobre o Brasil?',
  'Astrum "Geomagnetic Reversal" 2,8 mi',
  'Notícias e explicações: SpaceToday 406 mil, UOL 254 mil, Carol Capel 165 mil; "e se" com <1 mil',
  'Pode virar capítulo do tema 1 (a anomalia) ou vídeo próprio', 'Brasil', '★★★☆☆'),
 ('O SUPER EL NIÑO Vai Chegar ao Brasil: Mês a Mês',
  'Astrum "What El Niño Will Do to Earth" 7 mi e "La Niña 2025" 4,4 mi; Insane Curiosity ×18',
  'Quente e lotado AGORA: Sacani 1,5 mi, Primo Rico 1,3 mi, CNN 410 mil',
  'Demanda enorme, mas é notícia; nosso tempo de produção é longo. Só se der para fazer rápido', 'Brasil', '★★★☆☆'),
 ('E se a Amazônia Virasse SAVANA? (ano a ano até o ponto de não retorno)',
  'Indireta (clima e El Niño no Astrum)',
  'Só jornalismo (DW 297 mil, BBC 254 mil); "e se" com <300 views',
  'Rios voadores, chuva no Sudeste, café, energia', 'Brasil', '★★★☆☆'),
 ('Você Vai Estar Vivo para Ver a Estação Espacial CAIR',
  'What If "You Are Alive to Watch the Space Station Fall" 1,6 mi',
  'Histórias Lunares 475 mil; Ciência Todo Dia 290 mil', 'Passagens da ISS vistas do Brasil; onde caem os destroços', 'Geral', '★★☆☆☆'),
 ('Um Ano-Luz é Tão Grande Que Seu Cérebro Não Entende',
  'Space Matters 3,4 mi (×68)', 'Lotado: Universo da Ciência 1,9 mi, Fala Sério 1,6 mi, Universe 742 mil', 'Régua Oiapoque–Chuí', 'Geral', '★★☆☆☆'),
 ('Apophis 2029: o Asteroide que Vai Passar Raspando',
  'Insane Curiosity ×4; NASA 728 mil', 'Lotado por canais traduzidos (5,7 mi; 831 mil)', 'Visibilidade a partir do Brasil é limitada', 'Geral', '★★☆☆☆'),
]
for i, t in enumerate(T, 1): ws.append([i, *t])
wrap(ws)
ws2 = wb['Temas para o canal']
ws2.append([]); ws2.append(['', 'Já feitos pelo Brasil Milenar: Lua sumisse (2) · Brasil no passado (4) · temperatura (5) · terremoto 9,5 (6). Ideias guardadas antes: trocar o Sol, encolher até o átomo, luas, cada altura, extremos da Terra (ver ideias_temas_nov2026.md).'])
wb.save(OUT); print('OK', os.path.abspath(OUT), len(canais), 'canais', len(linhas), 'outliers')
