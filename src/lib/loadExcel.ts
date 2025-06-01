// src/lib/loadExcel.ts
import path from 'path';
import fs, { rename } from 'fs';
import ExcelJS from 'exceljs';
import type { Product, Sale, ProductsRules, HolidatysRules, SeasonsRules } from '@/lib/types';

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function renameProductKeys(raw: any): Product {
  return {
    productId: raw['ProductUUID'],
    description: toTitleCase(raw['ProductName']),
    category: toTitleCase(raw['Category']),
  };
}

function renameSalesKeys(raw: any): Sale {
  return {
    productId: raw['ProductUUID'],
    country: toTitleCase(raw['Country']),
    month: raw['Month'],  // assuming month is already in proper format
    year: raw['Year'],
    quantity: raw['Quantity'],
    price: raw['Price'],
    isReturned: raw['IsReturned'],
  };
}

function renameProductsRulesKeys(raw: any): ProductsRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    coverage: raw['coverage'],
  };
}

function renameHolidatysRulesKeys(raw: any): HolidatysRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    holiday: toTitleCase(raw['holiday']),
  };
}

function renameSeasonsRulesKeys(raw: any): SeasonsRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    season: toTitleCase(raw['season']),
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

export async function loadProductRules(): Promise<ProductsRules[]> {
  const raw = await readSheet('rules_all_with_coverage.xlsx');
  return raw.map(renameProductsRulesKeys);
}

export async function loadHolidaysRules(): Promise<HolidatysRules[]> {
  const raw = await readSheet('rules_holiday.xlsx');
  return raw.map(renameHolidatysRulesKeys);
}

export async function loadSeasonsRules(): Promise<SeasonsRules[]> {
  const raw = await readSheet('rules_season.xlsx');
  return raw.map(renameSeasonsRulesKeys);
}

