// /lib/DataContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import type { Product, Sale } from '@/lib/types';

type DataContextType = {
  products: Product[];
  sales: Sale[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({
  products,
  sales,
  children,
}: DataContextType & { children: React.ReactNode }) => {
  return (
    <DataContext.Provider value={{ products, sales }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
