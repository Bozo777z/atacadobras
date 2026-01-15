import Link from 'next/link';

export default function ProductCard({ product }) {
  const img = product?.images?.data?.[0]?.attributes?.url || '/placeholder.png';
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <img src={img} alt={product.name} />
          <h3>{product.name}</h3>
        </a>
      </Link>
      {/* Prices are managed in Strapi but not displayed in scaffold per requirements */}
    </article>
  );
}
