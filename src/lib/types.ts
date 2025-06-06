export type Product = {
  productId: string;
  description: string;
  category: string;
};

export type Sale = {
  productId: string;
  country: string;
  month: number;
  year: number;
  quantity: number;
  price: number;
  isReturned: number;
};

export type ProductsRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  coverage: number;
};

export type HolidatysRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  holiday: string;
};

export type SeasonsRules = {
  lhs: string;
  rhs: string;
  support: number;
  confidence: number;
  lift: number;
  season: string;
};

export type Customers = {
  customerId: string;
  country: string;
};