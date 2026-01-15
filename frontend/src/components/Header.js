import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoreSettings } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [settings, setSettings] = useState(null);
  const { items } = useCart();

  useEffect(() => {
    getStoreSettings().then(res => {
      // Strapi REST returns data: []
      if (res && res.data && res.data.length) {
        setSettings(res.data[0].attributes);
      }
    }).catch(() => {});
  }, []);

  const cartCount = items.reduce((s, it) => s + Number(it.qty || 0), 0);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/"><a className="logo">
          {settings && settings.storeLogo ? (
            <img src={settings.storeLogo.data.attributes.url} alt={settings.storeName || 'Loja'} />
          ) : (
            <div className="logo-placeholder">Loja Infantil</div>
          )}
        </a></Link>
        <nav>
          <Link href="/"><a>Início</a></Link>
          <Link href="/categories"><a>Categorias</a></Link>
          <Link href="/cart"><a>Carrinho ({cartCount})</a></Link>
        </nav>
      </div>
    </header>
  );
}
