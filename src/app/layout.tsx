import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './retro-effects.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vidyut - Interactive Coding Education',
  description: 'Learn coding concepts through retro-themed interactive visualizations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
