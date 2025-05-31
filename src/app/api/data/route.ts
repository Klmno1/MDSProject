// /app/api/data/route.ts
import { NextResponse } from 'next/server';
import { loadProducts, loadSales } from '@/lib/loadExcel';

export async function GET() {
  const products = loadProducts();
  const sales = loadSales();

  return NextResponse.json({ products, sales });
}
// This will return the products and sales data as JSON