import './globals.css';

export const metadata = {
  title: { default: 'Collège Saint Alfred', template: '%s – Collège Saint Alfred' },
  description:
    'Collège Saint Alfred : école privée (maternelle, primaire et secondaire) à la Muya, Mbujimayi, Kasaï Oriental, RDC.',
  icons: { icon: '/logo.svg' },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
