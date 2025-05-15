import { Noto_Sans } from 'next/font/google';
import './globals.css';
import Layout from '@/layouts/Layout';
import ClientProvider from '@/components/ClientProvider';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

export const metadata = {
  title: 'Community Forum',
  description: 'A place to discuss and share ideas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${notoSans.variable}`}>
      <body className="antialiased">
        <ClientProvider>
          <Layout>
            {children}
          </Layout>
        </ClientProvider>
      </body>
    </html>
  );
}