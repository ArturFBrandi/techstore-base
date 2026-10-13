import { obterPrecoNumerico } from './preco.js'

const CATEGORIAS = [
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
]

export function calcularDadosPainel(produtos, interessados) {
  const categorias = CATEGORIAS.map((categoria) => ({
    ...categoria,
    produtos: 0,
    unidades: 0,
    faturamentoPotencialCentavos: 0,
  }))
  const semPreco = []
  const produtosPorId = new Map(produtos.map((produto) => [produto.id, produto]))
  const emailsAguardando = new Set()
  const interessadosPorProduto = []

  produtos.forEach((produto) => {
    const preco = obterPrecoNumerico(produto.price)
    if (preco === null) {
      semPreco.push(produto)
      return
    }

    if (produto.estoque <= 0) return

    const categoria = categorias.find((item) => item.id === produto.category)
    if (!categoria) return

    categoria.produtos += 1
    categoria.unidades += produto.estoque
    categoria.faturamentoPotencialCentavos += Math.round(preco * 100) * produto.estoque
  })

  interessados.forEach((interessado) => {
    const produto = produtosPorId.get(interessado.produtoId)
    if (produto && produto.estoque === 0) {
      emailsAguardando.add(interessado.email.toLocaleLowerCase())
    }

    let grupo = interessadosPorProduto.find(
      (item) => item.produtoId === interessado.produtoId
    )
    if (!grupo) {
      grupo = { produtoId: interessado.produtoId, pessoas: [] }
      interessadosPorProduto.push(grupo)
    }
    grupo.pessoas.push(interessado)
  })

  interessadosPorProduto.sort((a, b) => b.pessoas.length - a.pessoas.length)

  return {
    categorias,
    semPreco,
    unidadesSemPreco: semPreco.reduce((total, produto) => total + produto.estoque, 0),
    clientesAguardandoReposicao: emailsAguardando.size,
    interessadosPorProduto,
  }
}
