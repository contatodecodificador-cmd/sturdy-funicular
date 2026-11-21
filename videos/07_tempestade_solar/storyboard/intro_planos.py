"""Planos da introdução v2 com tempos reais da narração (audio/intro_v2.mp3 + audio/alinh_intro.json).
Regra: plano <= 5 s. Movimento: se o plano já tem movimento (câmera andando, globo girando, nuvem crescendo) -> SEM zoom;
se a imagem for parada -> UM zoom leve contínuo do começo ao fim do plano (nunca vai-e-volta)."""
import json, os, unicodedata
V = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = [w for w in json.load(open(os.path.join(V, 'audio', 'alinh_intro.json')))['words'] if w['text'].strip()]
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn').strip('.,?!…:;')

def idx(frase, depois=0):
    f = [norm(x) for x in frase.split()]
    for i in range(depois, len(W)):
        if [norm(W[i + k]['text']) for k in range(len(f)) if i + k < len(W)] == f: return i
    raise ValueError(frase)

# (prévia, movimento, descrição, palavra onde o plano começa, relógio)
PL = [
 ('S01', 'câmera recua devagar', 'Sol em close: uma erupção nasce na borda', 'Se a maior', None),
 ('S02', 'globo girando (sem zoom)', 'Brasil à noite visto do espaço; relógio aparece', 'o Brasil teria', '17:36:00'),
 ('A03', 'Sol girando (sem zoom)', 'O Sol inteiro, distante', 'Porque o Sol', '17:36:00'),
 ('A04', 'câmera acompanha a luz', 'Um feixe de luz cruza o espaço até a Terra', 'A luz dele', '17:36:00'),
 ('S11', 'globo girando (sem zoom)', 'Brasil à noite, tranquilo', 'Então, quando ele', '17:36:00'),
 ('S03', 'dolly lento até o celular', 'Sala à noite: celular com a rota do GPS', 'O GPS continua', '17:36:00'),
 ('A07', 'dolly lento', 'Close: notificação de Pix na tela', 'O Pix continua', '17:36:00'),
 ('S04', 'clarão + câmera parada → leve avanço', 'Terra e Sol: CLARÃO; o relógio começa a correr', 'Aí vem o', '17:35:59'),
 ('S05', 'nuvem crescendo (sem zoom)', 'A nuvem de plasma sai do Sol', 'Uma nuvem com', '17:35:56'),
 ('S14', 'câmera acompanha a nuvem', 'A nuvem viaja rumo à Terra', 'vindo na nossa', '17:35:53'),
 ('A11', 'câmera sobe pelo poste', '1859: poste de telégrafo sob a aurora', 'A última vez', '17:35:50'),
 ('A11', 'câmera parada → leve avanço (outro ângulo)', 'Close do poste e dos fios sob a aurora', 'foi em mil', '17:35:47'),
 ('S06', 'faísca piscando + zoom leve', 'Faísca no fio; papel pegando fogo', 'Os fios do', '17:35:45'),
 ('S07', 'satélites passando (sem zoom)', 'Satélites e cabos em órbita', 'Aquilo foi com', '17:35:40'),
 ('A20', 'globo girando (sem zoom)', 'O escudo magnético envolve a Terra', 'E tem um', '17:35:36'),
 ('S08', 'globo girando até a América do Sul', 'O escudo... e uma falha aparece', 'O escudo que', '17:35:33'),
 ('S09', 'câmera desce sobre o Atlântico Sul', 'A falha pulsa em cima do Brasil', 'E esse ponto', '17:35:30'),
 ('S10', 'câmera recua devagar', 'Terra e Sol; relógio em destaque', 'Um estudo calculou', '17:35:27'),
 ('S04', 'câmera recua devagar', 'A Terra pequena diante do Sol', 'de uma tempestade', '17:35:25'),
 ('A18', 'câmera gira em volta do Sol', 'O Sol ativo, cheio de manchas', 'E o Sol acabou', '17:35:22'),
 ('S11', 'globo girando (sem zoom)', 'Brasil à noite: "mais exposto..."', 'Então, se ela', '17:35:18'),
 ('S09', 'câmera desce sobre a falha', '"...o lugar mais exposto da Terra..."', 'o Brasil seria', '17:35:16'),
 ('A20', 'globo girando (sem zoom)', '"...ou um dos mais protegidos?"', 'ou um dos', '17:35:15'),
 ('S11', 'câmera para; luzes piscam', 'As luzes de uma capital piscam uma vez', 'A resposta tem', '17:35:11'),
 ('CARTELA', 'partículas formam o selo', 'Cartela do canal; tique do relógio', 'E uma delas', '17:35:08'),
]

def planos():
    out = []; ult = 0
    for k, (pv, mov, desc, frase, rel) in enumerate(PL):
        i = idx(frase, ult); ult = i
        out.append(dict(prev=pv, mov=mov, desc=desc, w0=i, rel=rel))
    fim = W[-1]['end'] + 0.8
    for k, p in enumerate(out):
        p['t0'] = 0.0 if k == 0 else W[p['w0']]['start'] - 0.12
        w1 = out[k + 1]['w0'] if k + 1 < len(out) else len(W)
        p['t1'] = (W[w1]['start'] - 0.12) if k + 1 < len(out) else fim
        p['fala'] = ' '.join(w['text'] for w in W[p['w0']:w1])
    return out

if __name__ == '__main__':
    for p in planos(): print(f"{p['t0']:6.2f}–{p['t1']:6.2f} ({p['t1']-p['t0']:.1f}s) {p['prev']:8} {p['fala'][:60]}")
