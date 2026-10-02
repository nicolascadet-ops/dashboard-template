import type { Metadata } from 'next';
import Shell from '@/components/Shell';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Pulse · Sales analytics', template: '%s · Pulse' },
  description: 'Pulse is a sales analytics dashboard template: revenue, orders, customers and settings, with light and dark themes.',
  robots: { index: false },
};

// Runs before paint so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem('pulse-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
