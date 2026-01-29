import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoldOra - Gestion d\'achat de métaux précieux',
  description: 'Logiciel SaaS de gestion d\'achat d\'or et métaux précieux pour comptoirs d\'achat',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
