'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/dataContext';

import FeatureImportanceChart from './FeatureImportance';

export default function PredictReturn() {
  const { products, customers } = useData();

  const [price, setPrice] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [featureImportance, setFeatureImportance] = useState<Record<string, number>>({});


  const categories = [...new Set(products.map(p => p.category))].sort();
  const filteredProducts = products.filter(p => p.category === category).sort();

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !category || !productId || !date || !price) {
      const missingFields = [];
      if (!customerId) missingFields.push('Customer ID');
      if (!category) missingFields.push('Category');
      if (!productId) missingFields.push('Product');
      if (!date) missingFields.push('Date');
      if (!price) missingFields.push('Price');

      toast({
        title: (
          <span className="text-lg font-semibold">
            Missing required fields
          </span>
        ),
        description: (
          <span className="text-base">
            Please fill in: {missingFields.join(', ')}
          </span>
        ),
        variant: 'destructive',
      });

      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const selectedProduct = products.find(p => p.productId === productId);

      // const res = await fetch('https://mds-project-model.onrender.com/predict', {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 確保 Key 要跟 跟後端的一樣
        body: JSON.stringify({
          price: parseFloat(price),
          customerID: customerId,
          category,
          product: selectedProduct?.description || '',
          date,
        }),
      });

      const data = await res.json();
      // console.log(data.feature_importance);
      setResult(`Predicted Return Probability: ${(data.probability * 100).toFixed(2)}%`);
      setFeatureImportance(data.feature_importance || {});
      
      // setResult(`Predicted Return Probability: ${(100).toFixed(2)}%`);
    } catch (err) {
      console.error('Prediction failed', err);
      setResult('Error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-12">
      <Card className="max-w-md mx-auto bg-gray-900 text-white border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Return Probability Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Customer ID Combobox */}
            <div className="space-y-1">
              <Label>Customer ID</Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-gray-800 text-white border-gray-600"
                  >
                    {customerId
                      ? `${customerId} (${customers.find(c => c.customerId === customerId)?.country || ''})`
                      : 'Select customer'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 max-h-60 overflow-auto">
                  <Command>
                    <CommandInput placeholder="Search customer ID..." />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {customers.map(customer => (
                          <CommandItem
                            key={customer.customerId}
                            value={customer.customerId}
                            onSelect={() => {
                              setCustomerId(customer.customerId);
                              setCustomerOpen(false);
                            }}
                          >
                            {customer.customerId} ({customer.country})
                            <Check
                              className={cn(
                                'ml-auto',
                                customer.customerId === customerId ? 'opacity-100' : 'opacity-0'
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
                            value={product.productId}
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

            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="bg-gray-800 text-white border-gray-700"
              />
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
              className="w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 
                        text-gray-900 font-semibold rounded-lg shadow-lg 
                        hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300 
                        transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Predict'}
            </Button>
          </form>

          {/* Debug Preview */}
          {/* <div className="mt-6 p-3 rounded-md bg-gray-800 border border-gray-700">
            <p className="text-sm text-gray-400 font-semibold mb-1">Input Preview</p>
            <p><span className="text-gray-300">Customer ID:</span> {customerId}</p>
            <p><span className="text-gray-300">Category:</span> {category}</p>
            <p><span className="text-gray-300">Product ID:</span> {productId}</p>
            <p><span className="text-gray-300">Date:</span> {date}</p>
          </div> */}

          {/* Result */}
          {result && (
            <div className="mt-4 text-center text-green-400 font-medium text-lg">
              {result}
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(featureImportance).length > 0 && (
        <div className="mt-8">
          <FeatureImportanceChart importances={featureImportance} />
        </div>
      )}
    </div>
  );
}
