import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { obterPrecoNumerico } from '../utils/preco'

export default function PaginaProduto({
  produtos,
  onAdicionar,
  interessados,
  onRegistrarInteresse,
  carregandoInteressados,
  erroInteressados,
}) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.estoque > 0 && item.category === produto.category && item.id !== produto.id
    )
    .slice(0, 4)
  const preco = obterPrecoNumerico(produto.price)
  const esgotado = produto.estoque === 0
  const jaCadastrado = interessados.some(
    (item) =>
      item.produtoId === produto.id &&
      item.email.toLocaleLowerCase() === email.trim().toLocaleLowerCase()
  )

  function solicitarAviso(evento) {
    evento.preventDefault()
    const resultado = onRegistrarInteresse(produto.id, { nome, email })
    setMensagemAviso(resultado.mensagem)
    if (resultado.sucesso) {
      setNome('')
      setEmail('')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {preco === null ? 'Preço indisponível' : formatarPreco(preco)}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className={esgotado ? 'detalhe-estoque detalhe-esgotado' : 'detalhe-estoque'}>
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {esgotado ? (
            <form className="form-aviso-estoque" onSubmit={solicitarAviso}>
              <h2>Quer ser avisado quando voltar?</h2>
              <p>Deixe seu nome e e-mail para acompanhar a reposição deste produto.</p>
              <label htmlFor="nome-aviso" className="rotulo">
                Nome
              </label>
              <input
                id="nome-aviso"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                autoComplete="name"
                required
                disabled={carregandoInteressados || Boolean(erroInteressados)}
              />
              <label htmlFor="email-aviso" className="rotulo">
                E-mail
              </label>
              <input
                id="email-aviso"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                autoComplete="email"
                required
                disabled={carregandoInteressados || Boolean(erroInteressados)}
              />
              <button
                className="botao botao-grande"
                disabled={carregandoInteressados || Boolean(erroInteressados) || jaCadastrado}
              >
                {jaCadastrado ? 'E-mail já cadastrado' : 'Avise-me'}
              </button>
              {mensagemAviso && (
                <p className="mensagem-aviso-estoque" role="status">
                  {mensagemAviso}
                </p>
              )}
            </form>
          ) : (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={preco === null}
            >
              Adicionar ao carrinho
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => {
          const precoRelacionado = obterPrecoNumerico(item.price)

          return (
            <article key={item.id} className="card">
              <Link to={`/produto/${item.id}`} className="card-link">
                <div className="card-imagem-moldura">
                  <img src={item.image} alt={item.title} className="card-imagem" />
                </div>
                <h3 className="card-titulo">{item.title}</h3>
              </Link>
              <p className="preco">
                {precoRelacionado === null
                  ? 'Preço indisponível'
                  : formatarPreco(precoRelacionado)}
              </p>
              <button
                className="botao"
                onClick={() => onAdicionar(item)}
                disabled={precoRelacionado === null}
              >
                Adicionar ao carrinho
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
