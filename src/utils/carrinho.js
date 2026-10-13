// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

import { obterPrecoNumerico } from './preco.js'

export function calcularTotal(carrinho) {
  let totalEmCentavos = 0

  for (const produto of carrinho) {
    const preco = obterPrecoNumerico(produto.price)
    if (preco === null) return null
    totalEmCentavos += Math.round(preco * 100)
  }

  return totalEmCentavos / 100
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
