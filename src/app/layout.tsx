import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Web3Provider } from '@/components/layout/web3-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'TrustWallet AI — Web3 Wallet Intelligence & Reputation',
  description:
    'Search any wallet address to check risk, trust score, scam reports, and verification status across Ethereum, BNB Chain, Solana, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://trustwallet.ai'),
  openGraph: {
    title: 'TrustWallet AI',
    description: 'Web3 wallet intelligence and reputation platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Web3Provider>
            <TooltipProvider delayDuration={200}>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
