import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'Abdul Rehman | Full Stack Web Developer',
  description: 'I build modern, scalable, high-performance web applications with React.js, Node.js, Express.js, and MongoDB.',
  openGraph: {
    title: 'Abdul Rehman | Full Stack Web Developer',
    description: 'I build modern, scalable, high-performance web applications.',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
