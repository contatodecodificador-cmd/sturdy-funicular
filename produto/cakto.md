# Cakto: o que está criado

Criado pelo Claude em 07/11/2026, pelo CaktoMCP oficial, com a aprovação do dono.
(Nenhuma chave aqui: a credencial fica só no ambiente da nuvem.)

| Produto | Preço | ID do produto | Oferta | Link de checkout |
|---|---|---|---|---|
| Estúdio do Nogueira: completo | R$ 67 | 90f72b1c-d8d1-4501-8206-7e93c1aa1492 | 34jdugf | https://pay.cakto.com.br/34jdugf |
| Estúdio do Nogueira: o guia | R$ 27 | 8362c694-6d6f-46ad-8afd-1cfb5a4a765f | sc7ng7g | https://pay.cakto.com.br/sc7ng7g |
| Estúdio do Nogueira: a skill | R$ 47 | 94158afa-444c-48ab-aae2-3f446d10dfa3 | 5j8pjnu | https://pay.cakto.com.br/5j8pjnu |
| Caça-Ideias do Estúdio do Nogueira | R$ 17 | 3946d0a2-f387-4e9a-b233-44700b03f41a | tjji4nr | https://pay.cakto.com.br/tjji4nr |

- Todos: pagamento único, garantia de 7 dias (padrão da Cakto, a lei), suporte pelo e-mail da conta,
  entrega por e-mail com o link `https://estudiodonogueira.netlify.app/area/`.
- Order bump do Caça-Ideias nos checkouts do completo (36bwDSS), do guia (Av9unbP) e da skill (6uUorH9):
  "Sem ideia? Leve o Caça-Ideias" · botão "Sim, quero o Caça-Ideias".
- A página de venda já tem os links, mas com `VENDAS_ABERTAS = false` até o lançamento.

- Webhook 82321 "Estúdio do Nogueira: acesso à Área" → https://estudiodonogueira.netlify.app/api/cakto
  (compra aprovada, reembolso, chargeback; os 4 produtos). A senha dele está só no Netlify
  (variável CAKTO_WEBHOOK_SECRET).

## Falta
- O site precisa estar público no Netlify (Visitor access › Production visibility: Public) para a
  Cakto conseguir entregar os avisos. Teste de 07/11 voltou 401 por causa disso.
- Imagem de capa de cada produto (opcional).
