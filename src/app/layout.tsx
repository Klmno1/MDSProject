import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link"; // import Link
import "./globals.css";
import Button from '@mui/material/Button';
import { DataProvider } from '@/lib/dataContext';
import { loadProducts, loadSales, loadProductRules, loadHolidaysRules, loadSeasonsRules } from '@/lib/loadExcel';
import { BarChart3, Home } from 'lucide-react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Product Intelligence Dashboard',
  description: 'Analyze product returns, seasonality, and customer behavior.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await loadProducts();
  const sales = await loadSales();
  const productsRules = await loadProductRules();
  const holidaysRules = await loadHolidaysRules();
  const seasonsRules = await loadSeasonsRules();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans bg-gray-950 text-gray-100">
        <div className="flex min-h-screen">
          <aside className="w-[15%] bg-gray-900 text-gray-100 shadow-2xl p-6 space-y-6 border-r border-gray-800 rounded-r-3xl z-10">
            <div className="text-2xl font-bold text-center">Menu</div>
            <nav className="flex flex-col gap-4">
              {/* Home Button */}
              <Link href="/">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableElevation
                  className="!shadow-xl !transition-transform !duration-300 !rounded-xl !py-2.5 !text-base 
                  hover:brightness-110 hover:scale-[1.1] active:scale-[0.98] flex items-center justify-between"
                >
                  <Home className="w-6 h-6" />
                  <div>Home</div>
                </Button>
              </Link>

              {/* Product Analysis Button */}
              <Link href="/product-group">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableElevation
                  className="!shadow-xl !transition-transform !duration-300 !rounded-xl !py-2.5 !text-base 
                  hover:brightness-110 hover:scale-[1.1] active:scale-[0.98] flex items-center justify-between"
                >
                  <BarChart3 className="w-6 h-6" />
                  <div>Product Analysis</div>
                </Button>
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-10 bg-gray-900 text-gray-100 rounded-l-3xl shadow-inner">
            <DataProvider products={products} sales={sales} productsRules={productsRules} holidaysRules={holidaysRules} seasonsRules={seasonsRules}>
              {children}
            </DataProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
