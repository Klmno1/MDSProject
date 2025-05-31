import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Button from '@mui/material/Button';
import { DataProvider } from '@/lib/dataContext';
import { loadProducts, loadSales } from '@/lib/loadExcel';

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

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans bg-gray-950 text-gray-100">
        <div className="flex min-h-screen">
          <aside className="w-[15%] bg-gray-900 text-gray-100 shadow-2xl p-6 space-y-6 border-r border-gray-800 rounded-r-3xl z-10">
            <h1 className="text-2xl font-bold">功能選單</h1>
            <nav className="flex flex-col gap-3">
              <a href="/product-group" className="transition-transform transform hover:scale-110 hover:brightness-110">
                <Button variant="contained" color="primary" fullWidth className="!shadow-lg !transition-all !duration-300">商品群分析</Button>
              </a>
              {/* <a href="/product-group" className="transition-transform transform hover:scale-110 hover:brightness-110">
                <Button variant="contained" color="primary" fullWidth className="!shadow-lg !transition-all !duration-300">商品群分析</Button>
              </a> */}
            </nav>
          </aside>
          <main className="flex-1 p-10 bg-gray-900 text-gray-100 rounded-l-3xl shadow-inner">
            <DataProvider products={products} sales={sales}>
              {children}
            </DataProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
