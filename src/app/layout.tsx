import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/json-ld';
import { BASE_URL } from '@/lib/constants';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CycleMap - Bicycle Sharing Networks Worldwide',
    template: '%s | CycleMap',
  },
  description:
    'Explore and discover bicycle sharing networks around the world. Find bike stations, availability, and locations in real-time.',
  keywords: [
    'bicycle sharing',
    'bike rental',
    'cycling',
    'urban mobility',
    'bike stations',
    'city bikes',
    'bike sharing map',
    'public bicycles',
  ],
  authors: [{ name: 'CycleMap Team' }],
  creator: 'CycleMap',
  publisher: 'CycleMap',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'CycleMap',
    title: 'CycleMap - Bicycle Sharing Networks Worldwide',
    description:
      'Explore and discover bicycle sharing networks around the world. Find bike stations and plan your ride.',
    images: [
      {
        url: `${BASE_URL}/stations_header.jpg`,
        width: 1102,
        height: 734,
        alt: 'CycleMap - Bicycle Sharing Networks Worldwide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CycleMap - Bicycle Sharing Networks Worldwide',
    description:
      'Explore and discover bicycle sharing networks around the world. Find bike stations and plan your ride.',
    images: [`${BASE_URL}/stations_header.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} scrollbar-hidden overflow-hidden antialiased`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
