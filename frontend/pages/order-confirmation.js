import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getOrder } from '../src/services/api';

export default function OrderConfirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    // Minimal fetch example — implement endpoint if needed
    // getOrder is not implemented in scaffold; order details can be retrieved from Strapi admin
    // For now show a friendly message.
  }, [id]);

  return (
    <div className="container">
      <h1>Pedido Recebido</h1>
      <p>Obrigado! Seu pedido foi criado com sucesso. Em breve entraremos em contato para finalizar o pagamento via PIX (fluxo Sunize). Verifique o painel administrativo para mais detalhes.</p>
    </div>
  );
}
