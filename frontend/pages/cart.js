import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../src/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, canCheckout, clothingSetTotalQty } = useCart();
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    setMessageVisible(!canCheckout());
  }, [items]);

  return (
    <div className="container">
      <h1>Carrinho</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div>
          <ul>
            {items.map(it => (
              <li key={`${it.productId}-${it.size}`}>
                <div>{it.name} - {it.size}</div>
                <div>
                  <input type="number" min="1" value={it.qty} onChange={(e) => updateQty(it.productId, it.size, Number(e.target.value))} />
                  <button onClick={() => removeItem(it.productId, it.size)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>

          {messageVisible && (
            <div className="cart-warning">
              <strong>Atenção:</strong>
              <p>Roupas, conjuntos, calçados e chinelos exigem compra mínima de 6 unidades. Outros itens não possuem quantidade mínima.</p>
              <p>Unidades de roupas/conjuntos no carrinho: {clothingSetTotalQty()}</p>
            </div>
          )}

          <div className="cart-actions">
            <Link href="/checkout">
              <a className={`btn ${canCheckout() ? '' : 'btn-disabled'}`}>Finalizar compra</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
