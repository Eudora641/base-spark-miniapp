import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a212d621bf1ab98bb37b99d" />
      </head>
      <body>{children}</body>
    </html>
  );
}
