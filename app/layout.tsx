import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="REPLACE_WITH_BASE_DEV_VERIFY_TOKEN" />
      </head>
      <body>{children}</body>
    </html>
  );
}
