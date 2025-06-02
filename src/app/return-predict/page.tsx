'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useData } from '@/lib/dataContext';

export default function PredictReturn() {
  const { products } = useData();


  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const categories = [...new Set(products.map(p => p.category))].sort();
  const filteredProducts = products.filter(p => p.category === category);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  try {
    const selectedProduct = products.find(p => p.productId === productId);

    // See in backend python file, the endpoint is set to /predict
    // end point being /predict instead of /
    const res = await fetch('https://mds-project-model.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    //   The keys has to match the type set in the backend python file
      body: JSON.stringify({
        price: parseFloat(price),
        category,
        product: selectedProduct?.description || '',
        date,
      }),
    });

    const data = await res.json();
    setResult(`Predicted Return Probability: ${(data.probability * 100).toFixed(2)}%`);
    // setResult(data.messages);
  } catch (err) {
    console.error('Prediction failed', err);
    setResult('Error occurred during prediction.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-12">
      <Card className="bg-gray-900 text-white border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Return Probability Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            {/* Category Combobox */}
            <div className="space-y-1">
              <Label>Category</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-gray-800 text-white border-gray-600"
                  >
                    {category || 'Select category'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={() => {
                              setCategory(cat);
                              setProductId('');
                              setCategoryOpen(false);
                            }}
                          >
                            {cat}
                            <Check
                              className={cn(
                                'ml-auto',
                                category === cat ? 'opacity-100' : 'opacity-0'
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

            {/* Product Combobox */}
            <div className="space-y-1">
              <Label>Product</Label>
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-gray-800 text-white border-gray-600"
                    disabled={!category}
                  >
                    {productId
                      ? filteredProducts.find(p => p.productId === productId)?.description
                      : 'Select product'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts.map(product => (
                          <CommandItem
                            key={product.productId}
                            value={product.description}
                            onSelect={() => {
                              setProductId(product.productId);
                              setProductOpen(false);
                            }}
                          >
                            {product.description}
                            <Check
                              className={cn(
                                'ml-auto',
                                product.productId === productId ? 'opacity-100' : 'opacity-0'
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

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Predict'}
            </Button>
          </form>

          {/* Debug Preview */}
          <div className="mt-6 p-3 rounded-md bg-gray-800 border border-gray-700">
            <p className="text-sm text-gray-400 font-semibold mb-1">Input Preview</p>
            <p><span className="text-gray-300">Price:</span> {price}</p>
            <p><span className="text-gray-300">Category:</span> {category}</p>
            <p><span className="text-gray-300">Product ID:</span> {productId}</p>
            <p><span className="text-gray-300">Date:</span> {date}</p>
          </div>

          {/* Result */}                  
          {result && (
            <div className="mt-4 text-center text-green-400 font-medium text-lg">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
