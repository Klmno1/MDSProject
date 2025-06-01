'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SeasonsRules } from '@/lib/types';

interface Props {
  selectedProductName: string;
  seasonsRules: SeasonsRules[];
}

const PAGE_SIZE = 5;

export default function SeasonalAssociationRules({
  selectedProductName,
  seasonsRules,
}: Props) {
  const [pages, setPages] = useState({ lhs: 0, rhs: 0 });

  const changePage = (
    position: 'lhs' | 'rhs',
    delta: number,
    maxPage: number
  ) => {
    setPages((prev) => {
      let nextPage = prev[position] + delta;
      if (nextPage < 0) nextPage = 0;
      if (nextPage > maxPage) nextPage = maxPage;
      return { ...prev, [position]: nextPage };
    });
  };

  const filterRules = (rules: SeasonsRules[]) => {
    const seasonOrder = ['Spring', 'Summer', 'Autumn', 'Winter'];

    const sortFn = (a: SeasonsRules, b: SeasonsRules) => {
      const indexA = seasonOrder.indexOf(a.season);
      const indexB = seasonOrder.indexOf(b.season);
      if (indexA !== indexB) return indexA - indexB;
      return b.lift - a.lift || b.confidence - a.confidence || b.support - a.support;
    };

    return {
      lhs: rules.filter((r) => r.lhs === selectedProductName).sort(sortFn),
      rhs: rules.filter((r) => r.rhs === selectedProductName).sort(sortFn),
    };
  };

  const season = filterRules(seasonsRules);

  const renderTable = (title: string, rules: { lhs: SeasonsRules[]; rhs: SeasonsRules[] }) => {
    const hasData = rules.lhs.length > 0 || rules.rhs.length > 0;

    if (!hasData) {
      return (
        <div className="space-y-2">
          <h4 className="text-md font-semibold text-white">{title}</h4>
          <p className="text-sm text-gray-400">
            No association rules available for this product.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-xl font-semibold text-white">{title}</p>

        {(['lhs', 'rhs'] as const).map((position) => {
          const currentPage = pages[position];
          const allRules = rules[position];
          const maxPage = Math.max(0, Math.ceil(allRules.length / PAGE_SIZE) - 1);
          const pagedRules = allRules.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

          const headerText = position === 'lhs' 
            ? 'When this product is a condition (If)'
            : 'When this product is a result (Then)';

          return (
            <div key={position}>
              <h4 className="font-medium text-gray-300 mb-2">
                {headerText}
              </h4>

              <ScrollArea className="rounded-md border border-gray-700">
                <Table className="min-w-[700px]">
                  <TableHeader className="bg-gray-800 text-gray-300">
                    <TableRow>
                      <TableHead className="border border-gray-600 px-3 py-2">If (Condition)</TableHead>
                      <TableHead className="border border-gray-600 px-3 py-2">Then (Result)</TableHead>
                      <TableHead className="border border-gray-600 px-3 py-2">Season</TableHead>
                      <TableHead className="border border-gray-600 px-3 py-2">Support (%)</TableHead>
                      <TableHead className="border border-gray-600 px-3 py-2">Confidence (%)</TableHead>
                      <TableHead className="border border-gray-600 px-3 py-2">Lift</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-gray-900 text-white">
                    {pagedRules.map((r, i) => (
                      <TableRow key={i} className="hover:bg-gray-700 transition-colors">
                        <TableCell className="border border-gray-700 px-3 py-2">{r.lhs}</TableCell>
                        <TableCell className="border border-gray-700 px-3 py-2">{r.rhs}</TableCell>
                        <TableCell className="border border-gray-700 px-3 py-2">{r.season}</TableCell>
                        <TableCell className="border border-gray-700 px-3 py-2">{(r.support * 100).toFixed(2)}</TableCell>
                        <TableCell className="border border-gray-700 px-3 py-2">{(r.confidence * 100).toFixed(2)}</TableCell>
                        <TableCell className="border border-gray-700 px-3 py-2">{r.lift.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <div className="flex justify-between items-center mt-2 text-gray-300">
                <button
                  onClick={() => changePage(position, -1, maxPage)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span>Page {currentPage + 1} of {maxPage + 1}</span>
                <button
                  onClick={() => changePage(position, 1, maxPage)}
                  disabled={currentPage === maxPage}
                  className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return <div className="space-y-6">{renderTable('Seasonal Association Insights', season)}</div>;
}
