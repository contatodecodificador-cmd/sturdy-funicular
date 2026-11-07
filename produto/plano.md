# Oficina do Vigia: plano do produto

Versão 2 (07/11/2026), com os ajustes do dono.

## Em uma frase

Um **modelo completo** (guia + skill para o Claude Code + personagem-base editável) para a pessoa criar
o próprio canal de **séries animadas com IA em partes**, em **qualquer nicho**, com **a voz que ela
escolher** e o público votando no caminho da história.

## Princípios

- **A ideia é da pessoa.** Ela traz a ideia e o nicho, e o Claude adapta o processo. O terror leve é só o
  nicho do Contos do Vigia, não uma regra do produto.
- **Tudo é editável.** Roteiro, visual, personagens, voz e ritmo.
- **Sem regras escondidas.** O que a pessoa cria é dela.
- **A página não entrega o método.** Ela diz o que a pessoa recebe e o que dá para fazer, mas não como a
  gente faz (nada de "10 frases", tags de emoção, sincronia, legenda em duas cores, regra dos 15 dB).
- **A voz fica em aberto.** Pode ser a voz clonada da pessoa, uma voz pronta de um banco de vozes ou uma
  voz criada com IA. Única regra: não usar a voz de uma pessoa real sem autorização.
- **Não precisa de computador potente.** Tudo pode ser feito com o Claude Code na nuvem, pelo navegador.

## As ofertas (Cakto)

| Produto | Preço sugerido | O que leva |
|---|---|---|
| **Só o guia** | R$ 27 | guia, modelos para preencher, diário de O Bunker |
| **Só a skill** | R$ 47 | skill para o Claude Code, personagem-base editável |
| **Oficina completa** | R$ 67 | tudo acima |

Os preços são sugestões, e cada um troca em um lugar só na página. Os links de checkout entram em
`LINKS_CAKTO` (guia, skill, completo) no fim de `pagina/index.html`. Enquanto estiverem vazios, os
botões mostram "Em breve".

### Ofertas no checkout (order bump)

Na Cakto, cada checkout pode oferecer um item extra com um clique, sem aparecer na página.

**Extra 1: Caça-Ideias** (`entrega/extra-ideias/`), oferecido nos 3 checkouts.
- O que é: o comando `/ideias`. O Claude pesquisa na internet o que o público do nicho da pessoa está
  procurando, entrega 10 ideias de série prontas (nome, ideia, primeira frase, escolha da parte 1,
  personagem, por que pode prender, tamanho, facilidade), ajuda a escolher e lapidar a melhor e guarda
  tudo em `canal/ideias/`. Pode ser usado quantas vezes quiser, sem repetir ideias.
- Preço sugerido: **R$ 17**.
- Testado em 07/11/2026: a busca na internet funciona dentro do Claude Code na nuvem.
- Texto para o checkout (curto, como a Cakto pede):
  - **Título:** Sem ideia? Leve o Caça-Ideias
  - **Descrição:** O Claude pesquisa o que o seu público procura e te entrega 10 ideias de série prontas para
    usar, e ainda te ajuda a escolher a melhor. Ideal para quem trava na página em branco.

**Outros extras possíveis** (a decidir): no checkout do guia, "Adicione a skill" por um valor menor que
comprar separado; no da skill, "Adicione o guia".

## Garantia e reembolso

O dono não quer destacar os 7 dias na página, para evitar quem compra, usa e pede o dinheiro de volta.
A página **não fala em prazo de reembolso**. Atenção: o direito de arrependimento de 7 dias nas compras
pela internet é lei (art. 49 do Código de Defesa do Consumidor) e a Cakto aplica esse prazo de qualquer
jeito. Não dá para escrever "sem reembolso" nem negar o pedido dentro dos 7 dias. Só não fazemos
propaganda disso.

## Licença (fica DENTRO do produto, não na página)

Texto curto para os termos de uso, a escrever:
- pode usar, editar e adaptar para qualquer nicho e quantos canais quiser;
- o que a pessoa criar com o modelo é dela;
- não pode revender, repassar ou publicar o guia, a skill ou o personagem-base, inteiros ou em partes;
- quem quiser divulgar pode pedir para virar **afiliado**.

## O que a pessoa recebe

1. **O guia passo a passo**, em 6 cadernos.
2. **A skill para o Claude Code**, que pergunta logo no começo o nicho e o público e adapta o resto.
3. **O personagem-base editável**: só rosto, olhos e boca, em código próprio (escrito do zero). Cabelo,
   roupa, acessórios, cores e expressões são escolhidos pela pessoa junto com o Claude.
4. **Modelos para preencher**: mundo da série, personagens, roteiro, caminhos, postagem.
5. **O diário de produção de O Bunker, parte 1**, com os 4 erros reais e as correções.

## A ordem de início (definida em 07/11/2026)

O comprador recebe `entrega/COMECE-AQUI.md` e a pasta `entrega/oficina/`. A ordem é:

1. **As contas**, nesta ordem:
   1. **Claude Pro**: é o mais importante. Sem ele, nada funciona.
   2. **GitHub**: grátis. É onde o projeto fica guardado e de onde o Claude Code abre na nuvem.
   3. **Voz**: conta grátis no ElevenLabs só para testar. Paga só quando for postar.
2. **Colocar a Oficina no GitHub**: criar um repositório privado e arrastar os arquivos da pasta `oficina`.
3. **Abrir o Claude Code na nuvem** (claude.ai/code, e não o chat normal), conectar o GitHub e escolher o
   repositório.
4. **Digitar `/comecar`**: o Claude confere a oficina, instala o projeto de vídeo, faz um vídeo de teste
   de 3 segundos, pede a chave da voz num cartão seguro, guarda a preparação para as próximas sessões e
   conversa com a pessoa sobre o canal (nicho, público, clima, limites, narrador, voz, redes). No fim,
   preenche `canal/CANAL.md`.

Testado em 07/11/2026: `npm install` e `npm run teste` funcionam na nuvem e geram `saida/teste.mp4`.

## Sumário do guia

> Estrutura própria. Os nomes internos do nosso método (para as etapas, o roteiro e a série) ainda vão
> ser escolhidos com o dono, sem usar "bíblia" nem "roteiro de 10 frases".

1. **O seu canal**: escolher o nicho e o público; o narrador e o jeito do canal; a votação como motor.
2. **A série**: o mundo da história; os personagens a partir do personagem-base; os caminhos.
3. **O roteiro**: como prender do começo ao fim; o gancho; a pergunta do final.
4. **A voz**: escolher ou criar a voz; dar emoção; encaixar a voz nas cenas.
5. **Imagem e som**: personagens e cenários; cenas que funcionam no celular (luz em cena escura);
   legenda; som que não atrapalha a voz.
6. **Postar e continuar**: capa, Stories e legenda; ler a votação; rótulo de IA e cuidados.
- **Diário de produção: O Bunker, parte 1**, com os 4 erros:
  1. Zumbido grave que virou chiado no celular e machucou o ouvido.
  2. Efeitos altos cobrindo a voz (regra: medir com todas as frequências e deixar cada efeito uns
     15 dB abaixo da voz).
  3. Voz estrangeira com sotaque, trocada pela voz clonada do dono.
  4. Cena escura com mancha preta, resolvida com luz no chão.

## O que a skill faz (o fluxo de montagem é o mesmo de O Bunker)

Cada etapa termina com o Claude mostrando o resultado e pedindo aprovação.

1. **Canal**: nicho, público, narrador e regras que a própria pessoa escolher.
2. **Mundo da série**.
3. **Roteiro** da parte, com opções de gancho.
4. **Caminhos** da votação.
5. **Personagens e cenários**, partindo do personagem-base.
6. **Voz**: prepara o texto para a ferramenta de voz que a pessoa usar e encaixa a narração nas cenas.
7. **Vídeo**: escreve as cenas em Remotion do zero, com legenda.
8. **Som**: ambiente e efeitos, conferindo o volume contra a voz.
9. **Postagem**: capa, Stories da votação e legenda.

## O que a pessoa precisa assinar por fora

- **Claude Pro ou superior**, com o Claude Code (pode ser na nuvem, pelo navegador).
- **Uma ferramenta de voz com IA.** A gente usa o ElevenLabs, que exige plano pago para uso comercial.
- **Remotion**: grátis para pessoa física e para empresa de até 3 pessoas.

## Próximos passos

1. ~~Definir o primeiro passo e o comando `/comecar`~~ (feito).
2. Testar o COMECE-AQUI do zero, com uma conta nova, seguindo só o texto.
3. Escolher com o dono os nomes próprios das etapas do método.
4. Escrever os próximos comandos da skill (criar série, roteiro, personagens, voz, montagem, postagem)
   e o personagem-base, do zero, e testar numa série nova, de outro nicho.
5. Escrever o guia, um caderno de cada vez.
6. Decidir o produtinho extra do checkout.
7. Criar os 3 produtos na Cakto e colar os links.
8. Publicar a página quando o dono decidir.
