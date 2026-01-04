import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Nagpur Orange Marketplace',
  description: 'A decentralized marketplace for Nagpur oranges.',
};

import { WalletProvider } from '@/context/WalletContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#FFFBF5]`}>
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
