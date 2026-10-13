export function obterPrecoNumerico(preco) {
  if (typeof preco !== 'number' && typeof preco !== 'string') {
    return null
  }

  if (typeof preco === 'string' && preco.trim() === '') {
    return null
  }

  const valor = Number(preco)
  return Number.isFinite(valor) && valor >= 0 ? valor : null
}
