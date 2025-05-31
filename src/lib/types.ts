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