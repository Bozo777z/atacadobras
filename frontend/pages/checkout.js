import { useEffect, useState } from 'react';
import { useCart } from '../src/context/CartContext';
import { getShippingRules, getShippingMethods, createOrder } from '../src/services/api';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const { items, canCheckout, clothingSetTotalQty, shippingState, setShippingState, shippingMethod, setShippingMethod, clearCart } = useCart();
  const router = useRouter();
  const [states, setStates] = useState([]);
  const [methods, setMethods] = useState([]);
  const [selectedState, setSelectedState] = useState(shippingState || '');
  const [selectedMethod, setSelectedMethod] = useState(shippingMethod || '');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [shippingPrice, setShippingPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getShippingRules().then(res => {
      if (res && res.data) {
        setStates(res.data.map(s => s.attributes));
      }
    }).catch(() => {});
    getShippingMethods().then(res => {
      if (res && res.data) {
        setMethods(res.data.map(m => ({ id: m.id, ...m.attributes, availableStates: m.attributes.availableStates || [] })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // compute shipping price when state selected
    const rule = states.find(s => s.state === selectedState);
    setShippingPrice(rule ? Number(rule.shippingPrice) : 0);
    setShippingState(selectedState);
  }, [selectedState]);

  useEffect(() => {
    setShippingMethod(selectedMethod);
  }, [selectedMethod]);

  const availableMethodsForState = (stateCode) => {
    return methods.filter(m => m.active && (m.availableStates.length === 0 || m.availableStates.some(s => s.state === stateCode)));
  };

  if (items.length === 0) {
    return <div className="container"><h1>Checkout</h1><p>Seu carrinho está vazio.</p></div>;
  }

  if (!canCheckout()) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <div className="cart-warning">
          <strong>Atenção:</strong>
          <p>Roupas, conjuntos, calçados e chinelos exigem compra mínima de 6 unidades. Outros itens não possuem quantidade mínima.</p>
          <p>Unidades de roupas/conjuntos no carrinho: {clothingSetTotalQty()}</p>
        </div>
      </div>
    );
  }

  async function submitOrder() {
    setSubmitting(true);
    setError('');
    try {
      const subtotal = 0; // Prices are managed by Strapi; no prices in scaffold
      const total = subtotal + Number(shippingPrice || 0);
      const orderPayload = {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items,
        subtotal,
        shipping: {
          state: selectedState,
          method: selectedMethod,
          price: shippingPrice
        },
        total,
        paymentMethod: 'pix_sunize'
      };

      const res = await createOrder(orderPayload);
      // res.data created order
      clearCart();
      // Simulate redirect to confirmation
      router.push(`/order-confirmation?id=${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      <section>
        <h2>Endereço de entrega</h2>
        <div>
          <label>Estado (UF)</label>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
            <option value="">Selecione o estado</option>
            {states.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
          </select>
        </div>
        <div>
          <label>Método de entrega</label>
          <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
            <option value="">Selecione método</option>
            {availableMethodsForState(selectedState).map(m => <option key={m.id} value={m.name}>{m.name} — {m.estimatedDays} dias</option>)}
          </select>
        </div>
        <div>
          <p>Frete: R$ {shippingPrice.toFixed(2)}</p>
        </div>
      </section>

      <section>
        <h2>Dados do cliente</h2>
        <div>
          <label>Nome</label>
          <input value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
        </div>
        <div>
          <label>Email</label>
          <input value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
        </div>
        <div>
          <label>Telefone</label>
          <input value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
        </div>
      </section>

      {error && <div className="error">{error}</div>}
      <button onClick={submitOrder} disabled={submitting || !selectedState || !selectedMethod}>Confirmar pedido</button>
    </div>
  );
}
