import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts } from '../src/services/api';
import ProductCard from '../src/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts('populate=images&pagination[limit]=12').then(res => {
      if (res && res.data) {
        setProducts(res.data.map(item => ({ ...item.attributes, id: item.id })));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="container">
      <section className="home-hero">
        <h1>Loja Atacadista Infantil</h1>
        <p>Catálogo profissional. Faça login para preços de atacado.</p>
      </section>

      <section className="product-grid">
        {products.length === 0 ? <p>Nenhum produto disponível. Crie produtos no painel administrativo.</p> : products.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </section>
    </div>
  );
}
