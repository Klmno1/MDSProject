// src/lib/loadExcel.ts
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';
import type { Product, Sale } from '@/lib/types';

function renameProductKeys(raw: any): Product {
  return {
    productId: raw['ProductUUID'],
    description: raw['ProductName'],
    category: raw['Category'],
  };
}

function renameSalesKeys(raw: any): Sale {
  return {
    productId: raw['ProductUUID'],
    country: raw['Country'],
    month: raw['Month'],
    year: raw['Year'],
    quantity: raw['Quantity'],
    price: raw['Price'],
    isReturned: raw['IsReturned'],
  };
}

async function readSheet(fileName: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found: ${filePath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0]; // first sheet

  const headers: string[] = [];
  const rows: any[] = [];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values as any[];
    if (rowNumber === 1) {
      // Read header row
      values.forEach((cell, index) => {
        if (index > 0) headers.push(cell);
      });
    } else {
      // Read data row
      const obj: Record<string, any> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i + 1]; // values[0] is null
      });
      rows.push(obj);
    }
  });

  return rows;
}

export async function loadProducts(): Promise<Product[]> {
  const raw = await readSheet('products.xlsx');
  return raw.map(renameProductKeys);
}

export async function loadSales(): Promise<Sale[]> {
  const raw = await readSheet('sales.xlsx');
  return raw.map(renameSalesKeys);
}
