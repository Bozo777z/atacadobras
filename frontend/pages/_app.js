import '../styles/globals.css';
import { CartProvider } from '../src/context/CartContext';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Header />
      <main className="site-main">
        <Component {...pageProps} />
      </main>
      <Footer />
    </CartProvider>
  );
}

export default MyApp;
