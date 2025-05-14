import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Layout from '@/layouts/Layout';
import ClientProvider from '@/components/ClientProvider'; // 👈 New
import { SessionProvider } from 'next-auth/react';


const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata = {
  title: 'Community Forum',
  description: 'A place to discuss and share ideas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <ClientProvider> {/* ✅ Now Redux only runs on client */}
          <Layout>
            {children}
          </Layout>
        </ClientProvider>
        
      </body>
    </html>
  );
}