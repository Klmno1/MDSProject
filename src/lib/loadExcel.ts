// src/lib/loadExcel.ts
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';
import type { Product, Sale, ProductsRules, HolidatysRules, SeasonsRules, Customers } from '@/lib/types';

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 要與 Excel 的欄位名稱相同才可以讀的到！！！！
type RawProduct = {
  ProductUUID: string;
  ProductName: string;
  Category: string;
};

function renameProductKeys(raw: RawProduct): Product {
  return {
    productId: raw['ProductUUID'],
    description: toTitleCase(raw['ProductName']),
    category: toTitleCase(raw['Category']),
  };
}

type RawSale = {
  ProductUUID: string;
  Country: string;
  Month: number; 
  Year: number;
  Quantity: number;
  Price: number;
  IsReturned: number;
};

function renameSalesKeys(raw: RawSale): Sale {
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

type RawProductsRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  coverage: number;
};

function renameProductsRulesKeys(raw: RawProductsRules): ProductsRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    coverage: raw['coverage'],
  };
}

type RawHolidatysRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  holiday: string;
};

function renameHolidatysRulesKeys(raw: RawHolidatysRules): HolidatysRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    holiday: toTitleCase(raw['holiday']),
  };
}

type RawSeasonsRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  season: string;
};

function renameSeasonsRulesKeys(raw: RawSeasonsRules): SeasonsRules {
  return {
    lhs: toTitleCase(raw['lhs']),
    rhs: toTitleCase(raw['rhs']),
    support: raw['support'], 
    confidence: raw['confidence'],
    lift: raw['lift'],
    season: toTitleCase(raw['season']),
  };
}

type RawCustomers = {
  customerId: string;
  country: string;
};

function renameCustomersKeys(raw: RawCustomers): Customers {
  return {
    customerId: raw['customerId'],
    country: raw['country'],
  };
}


async function readSheet<T = Record<string, unknown>>(fileName: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found: ${filePath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0]; // first sheet

  const headers: string[] = [];
  const rows: T[] = [];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values as unknown[]; // first index is null
    if (rowNumber === 1) {
      // Read header row
      values.forEach((cell, index) => {
        if (index > 0 && typeof cell === 'string') {
          headers.push(cell);
        }
      });
    } else {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i + 1] ?? null; // skip nulls
      });
      rows.push(obj as T);
    }
  });

  return rows;
}


export async function loadProducts(): Promise<Product[]> {
  const raw = await readSheet<RawProduct>('products.xlsx');
  return raw.map(renameProductKeys);
}

export async function loadSales(): Promise<Sale[]> {
  const raw = await readSheet<RawSale>('sales.xlsx');
  return raw.map(renameSalesKeys);
}

export async function loadProductRules(): Promise<ProductsRules[]> {
  const raw = await readSheet<RawProductsRules>('rules_all_with_coverage.xlsx');
  return raw.map(renameProductsRulesKeys);
}

export async function loadHolidaysRules(): Promise<HolidatysRules[]> {
  const raw = await readSheet<RawHolidatysRules>('rules_holiday.xlsx');
  return raw.map(renameHolidatysRulesKeys);
}

export async function loadSeasonsRules(): Promise<SeasonsRules[]> {
  const raw = await readSheet<RawSeasonsRules>('rules_season.xlsx');
  return raw.map(renameSeasonsRulesKeys);
}

export async function loadCustomers(): Promise<Customers[]> {
  const raw = await readSheet<RawCustomers>('customer_country_mapping.xlsx');
  return raw.map(renameCustomersKeys);
}

