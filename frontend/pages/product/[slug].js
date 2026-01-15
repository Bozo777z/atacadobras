import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProductBySlug } from '../../src/services/api';
import { useCart } from '../../src/context/CartContext';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug + '&populate=images').then(res => {
      if (res && res.data && res.data.length) {
        const p = { id: res.data[0].id, ...res.data[0].attributes };
        setProduct(p);
        setSize((p.sizes && p.sizes[0]) || '');
      }
    }).catch(() => {});
  }, [slug]);

  if (!product) return <div className="container">Carregando...</div>;

  return (
    <div className="container product-page">
      <div className="product-gallery">
        {product.images?.data?.map(img => (
          <img key={img.id} src={img.attributes.url} alt={product.name} />
        ))}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
        <div>
          <label>Tamanho</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {(product.sizes || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label>Quantidade</label>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </div>
        <button onClick={() => addItem(product, size, qty)}>Adicionar ao carrinho</button>
      </div>
    </div>
  );
}
