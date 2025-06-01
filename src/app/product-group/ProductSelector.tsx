'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  products: Product[];
  onSelect: (productId: string) => void;
};

export default function ProductSelector({ products, onSelect }: Props) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const categories = [...new Set(products.map(p => p.category))].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (selectedGroup) {
      const filtered = products
        .filter(p => p.category === selectedGroup)
        .sort((a, b) => a.description.localeCompare(b.description));
      setFilteredProducts(filtered);
      setSelectedProductId('');
    } else {
      setFilteredProducts([]);
    }
  }, [selectedGroup, products]);

  useEffect(() => {
    if (selectedProductId) {
      onSelect(selectedProductId);
    }
  }, [selectedProductId, onSelect]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">商品群分析</h2>
      <p className="text-gray-300">請先選擇商品群，再選擇商品。</p>

      <div className="flex gap-4 flex-wrap">
        {/* Category Combobox */}
        <div className="w-64">
          <Label>選擇商品群</Label>
          <Popover open={groupOpen} onOpenChange={setGroupOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={groupOpen}
                className="w-full justify-between w-full justify-between bg-gray-800 text-white border-gray-600 hover:bg-gray-600"
              >
                {selectedGroup || '選擇商品群'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="搜尋商品群..." className="h-9" />
                <CommandList>
                  <CommandEmpty>找不到商品群</CommandEmpty>
                  <CommandGroup>
                    {categories.map(category => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={current => {
                          setSelectedGroup(current);
                          setGroupOpen(false);
                        }}
                      >
                        {category}
                        <Check className={cn('ml-auto', selectedGroup === category ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Product Combobox */}
        <div className="w-64">
          <Label>選擇商品</Label>
          <Popover open={productOpen} onOpenChange={setProductOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={productOpen}
                disabled={!selectedGroup}
                className="w-full justify-between w-full justify-between bg-gray-800 text-white border-gray-600 hover:bg-gray-600"
              >
                {selectedProductId
                  ? filteredProducts.find(p => p.productId === selectedProductId)?.description
                  : '選擇商品'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="搜尋商品..." className="h-9" />
                <CommandList>
                  <CommandEmpty>找不到商品</CommandEmpty>
                  <CommandGroup>
                    {filteredProducts.map(product => (
                      <CommandItem
                        key={product.productId}
                        value={product.description}
                        onSelect={() => {
                          setSelectedProductId(product.productId);
                          setProductOpen(false);
                        }}
                      >
                        {product.description}
                        <Check
                          className={cn(
                            'ml-auto',
                            selectedProductId === product.productId ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
