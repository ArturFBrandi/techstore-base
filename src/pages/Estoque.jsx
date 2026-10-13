// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, interessados }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const gruposInteressados = interessados
    .reduce((grupos, interessado) => {
      let grupo = grupos.find((item) => item.produtoId === interessado.produtoId)
      if (!grupo) {
        grupo = { produtoId: interessado.produtoId, pessoas: [] }
        grupos.push(grupo)
      }
      grupo.pessoas.push(interessado)
      return grupos
    }, [])
    .sort((a, b) => b.pessoas.length - a.pessoas.length)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
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
      {gruposInteressados.length === 0 ? (
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
              {gruposInteressados.map((grupo) => {
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
