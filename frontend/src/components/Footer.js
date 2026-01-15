import { useEffect, useState } from 'react';
import { getStoreSettings } from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    getStoreSettings().then(res => {
      if (res && res.data && res.data.length) {
        setSettings(res.data[0].attributes);
      }
    }).catch(() => {});
  }, []);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-left">
          {settings && settings.footerText ? settings.footerText : '© Direitos reservados.'}
        </div>
      </div>
    </footer>
  );
}
