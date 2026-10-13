import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import PainelLojista from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { obterPrecoNumerico } from './utils/preco'
import { carregarInteressados, salvarInteressados } from './utils/interessados'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [interessados, setInteressados] = useState([])
  const [carregandoInteressados, setCarregandoInteressados] = useState(true)
  const [erroInteressados, setErroInteressados] = useState('')
  const [animacaoCarrinho, setAnimacaoCarrinho] = useState(0)

  useEffect(() => {
    try {
      setInteressados(carregarInteressados())
    } catch (erro) {
      setErroInteressados(erro.message)
    } finally {
      setCarregandoInteressados(false)
    }

    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (obterPrecoNumerico(produto.price) === null) return
    setCarrinho((itens) => itens.concat(produto))
    setAnimacaoCarrinho((versao) => versao + 1)
  }

  function registrarInteresse(produtoId, dados) {
    const nome = dados.nome.trim()
    const email = dados.email.trim()

    if (!nome || !email) {
      return { sucesso: false, mensagem: 'Informe seu nome e um e-mail válido.' }
    }

    const emailNormalizado = email.toLocaleLowerCase()
    const duplicado = interessados.some(
      (item) =>
        item.produtoId === produtoId && item.email.toLocaleLowerCase() === emailNormalizado
    )

    if (duplicado) {
      return {
        sucesso: false,
        mensagem: 'Este e-mail já está cadastrado para receber aviso deste produto.',
      }
    }

    const atualizados = interessados.concat({ produtoId, nome, email })

    try {
      salvarInteressados(atualizados)
      setInteressados(atualizados)
      setErroInteressados('')
      return { sucesso: true, mensagem: 'Pronto! Avisaremos quando o produto voltar.' }
    } catch (erro) {
      setErroInteressados(erro.message)
      return { sucesso: false, mensagem: erro.message }
    }
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header
        quantidadeCarrinho={carrinho.length}
        animacaoCarrinho={animacaoCarrinho}
        clienteAtual={clienteAtual}
      />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}
        {erroInteressados && (
          <p className="aviso aviso-erro" role="alert">
            {erroInteressados}
          </p>
        )}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  interessados={interessados}
                  onRegistrarInteresse={registrarInteresse}
                  carregandoInteressados={carregandoInteressados}
                  erroInteressados={erroInteressados}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/painel"
              element={<PainelLojista produtos={produtos} interessados={interessados} />}
            />
            <Route
              path="/estoque"
              element={<PainelLojista produtos={produtos} interessados={interessados} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
