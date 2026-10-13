const CHAVE_ARMAZENAMENTO = 'techstore-interessados-esgotados'

export function carregarInteressados() {
  let dados

  try {
    dados = localStorage.getItem(CHAVE_ARMAZENAMENTO)
  } catch (erro) {
    throw new Error('Não foi possível acessar os pedidos de aviso salvos neste navegador.', {
      cause: erro,
    })
  }

  if (dados === null) return []

  let interessados
  try {
    interessados = JSON.parse(dados)
  } catch (erro) {
    throw new Error('Os pedidos de aviso salvos neste navegador estão inválidos.', {
      cause: erro,
    })
  }

  if (
    !Array.isArray(interessados) ||
    interessados.some(
      (item) =>
        !item ||
        typeof item.produtoId !== 'string' ||
        typeof item.nome !== 'string' ||
        typeof item.email !== 'string'
    )
  ) {
    throw new Error('Os pedidos de aviso salvos neste navegador estão em formato inválido.')
  }

  return interessados
}

export function salvarInteressados(interessados) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(interessados))
  } catch (erro) {
    throw new Error('Não foi possível salvar o pedido de aviso neste navegador.', {
      cause: erro,
    })
  }
}
