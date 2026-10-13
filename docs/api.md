# Contrato da API

Última atualização: março de 2026

A URL base fica na variável `VITE_API_URL`.

## GET /products.json

Retorna a lista de produtos do catálogo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador do produto |
| `title` | string | Nome do produto |
| `price` | number \| null (opcional) | Preço atual. Pode estar ausente ou nulo enquanto não for definido; nesse caso o produto não pode ser vendido |
| `precoOriginal` | number | Preço antes da promoção. Presente só nos produtos em promoção |
| `category` | string | `roupas`, `eletronicos`, `acessorios` ou `casa` |
| `description` | string | Descrição do produto |
| `image` | string | URL da imagem |
| `rating` | object | `{ rate: number, count: number }` |
| `estoque` | number | Unidades disponíveis |

## GET /customers.json

Retorna os clientes cadastrados.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador do cliente |
| `nome` | string | Nome completo |
| `email` | string | E-mail |
| `pedidosAnteriores` | number | Quantidade de pedidos já feitos na loja |

## Pedidos de aviso de reposição

O projeto não possui endpoint de gravação para pedidos de aviso. Esses pedidos são
salvos no `localStorage` do navegador e ficam visíveis na área interna apenas no
mesmo navegador e perfil.
