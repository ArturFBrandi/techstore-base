import { formatarPreco } from '../utils/formatarPreco'
import { obterPrecoNumerico } from '../utils/preco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const preco = obterPrecoNumerico(produto.price)

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">
          {preco === null ? 'Preço indisponível' : formatarPreco(preco)}
        </p>
      </div>
      <button
        className="botao botao-pequeno"
        onClick={() => onAdicionar(produto)}
        disabled={preco === null}
      >
        Comprar
      </button>
    </div>
  )
}
