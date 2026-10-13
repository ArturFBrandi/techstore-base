import { formatarPreco } from '../utils/formatarPreco'
import { calcularDadosPainel } from '../utils/painel'

export default function PainelLojista({ produtos, interessados }) {
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const dadosPainel = calcularDadosPainel(produtos, interessados)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>
      <p className="aviso">
        Visão geral do estoque, faturamento potencial e demanda por reposição.
      </p>

      <div className="painel-indicadores">
        <article className="painel-indicador">
          <span className="painel-indicador-rotulo">Produtos sem preço</span>
          <strong>{dadosPainel.semPreco.length}</strong>
          <span>
            {dadosPainel.unidadesSemPreco} unidades aguardando definição de preço
          </span>
        </article>
        <article className="painel-indicador">
          <span className="painel-indicador-rotulo">Clientes aguardando reposição</span>
          <strong>{dadosPainel.clientesAguardandoReposicao}</strong>
          <span>Contagem de e-mails únicos para produtos esgotados</span>
        </article>
      </div>

      <h2>Estoque e faturamento potencial por categoria</h2>
      <p className="aviso">
        Projeção bruta ao vender todas as unidades disponíveis pelo preço atual; produtos
        sem preço não entram no cálculo.
      </p>
      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Produtos com preço</th>
              <th>Unidades disponíveis</th>
              <th>Valor do estoque / faturamento potencial</th>
            </tr>
          </thead>
          <tbody>
            {dadosPainel.categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nome}</td>
                <td>{categoria.produtos}</td>
                <td>{categoria.unidades}</td>
                <td>{formatarPreco(categoria.faturamentoPotencialCentavos / 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Produtos aguardando definição de preço</h2>
      {dadosPainel.semPreco.length === 0 ? (
        <p className="estado-vazio">Não há produtos aguardando definição de preço.</p>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Unidades separadas</th>
              </tr>
            </thead>
            <tbody>
              {dadosPainel.semPreco.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Estoque</h2>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>
      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Pedidos para aviso de reposição</h2>
      <p className="aviso">
        Clientes cadastrados para receber aviso quando um produto voltar ao estoque.
      </p>
      {dadosPainel.interessadosPorProduto.length === 0 ? (
        <p className="estado-vazio">Ainda não há clientes aguardando produtos.</p>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque</th>
                <th>Aguardando</th>
                <th>Clientes</th>
              </tr>
            </thead>
            <tbody>
              {dadosPainel.interessadosPorProduto.map((grupo) => {
                const produto = produtos.find((item) => item.id === grupo.produtoId)
                return (
                  <tr key={grupo.produtoId}>
                    <td>{produto ? produto.title : `Produto ${grupo.produtoId}`}</td>
                    <td>{produto ? produto.estoque : 'Indisponível'}</td>
                    <td>{grupo.pessoas.length}</td>
                    <td>
                      <ul className="lista-interessados">
                        {grupo.pessoas.map((pessoa) => (
                          <li key={`${grupo.produtoId}-${pessoa.email.toLocaleLowerCase()}`}>
                            <strong>{pessoa.nome}</strong>
                            <br />
                            <a href={`mailto:${pessoa.email}`}>{pessoa.email}</a>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
