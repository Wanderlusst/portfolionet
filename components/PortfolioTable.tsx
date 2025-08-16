'use client';

import { Stock } from '@/types/portfolio';
import { useMemo, useState } from 'react';
import { useTable, useSortBy, Column } from 'react-table';

interface PortfolioTableProps {
  stocks: Stock[];
  isLoading?: boolean;
}

export default function PortfolioTable({ stocks, isLoading = false }: PortfolioTableProps) {
  const [viewMode, setViewMode] = useState<'comfortable' | 'compact'>('comfortable');
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if screen is mobile on mount and resize
  useState(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  const columns = useMemo<Column<Stock>[]>(() => [
    {
      Header: 'Stock Name',
      accessor: 'name',
      Cell: ({ value, row }: { value: string; row: { original: Stock } }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-dark-text">{value}</div>
            <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{row.original.symbol}</div>
          </div>
        </div>
      ),
    },
    {
      Header: 'Sector',
      accessor: 'sector',
      Cell: ({ value }: { value: string }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
          {value}
        </span>
      ),
    },
    {
      Header: 'Purchase Price',
      accessor: 'purchasePrice',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="text-gray-900 dark:text-dark-text">₹{(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="text-gray-900 dark:text-dark-text">{(value || 0).toLocaleString('en-IN')}</span>
      ),
    },
    {
      Header: 'Investment',
      accessor: 'investment',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="font-medium text-gray-900 dark:text-dark-text">₹{(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      Header: 'Portfolio %',
      accessor: 'portfolioPercentage',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="text-gray-900 dark:text-dark-text">{(value || 0).toFixed(2)}%</span>
      ),
    },
    {
      Header: 'CMP',
      accessor: 'cmp',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="font-medium text-gray-900 dark:text-dark-text">₹{(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      Header: 'Present Value',
      accessor: 'presentValue',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="font-medium text-gray-900 dark:text-dark-text">₹{(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      Header: 'Gain/Loss',
      accessor: 'gainLoss',
      Cell: ({ value }: { value: number | undefined }) => {
        const numValue = value || 0;
        const isGain = numValue >= 0;
        return (
          <div className="text-right">
            <div className={`font-medium ${isGain ? 'gain-text' : 'loss-text'}`}>
              {isGain ? '+' : ''}₹{Math.abs(numValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        );
      },
    },
    {
      Header: 'Gain/Loss %',
      accessor: 'gainLossPercentage',
      Cell: ({ value }: { value: number | undefined }) => {
        const numValue = value || 0;
        const isGain = numValue >= 0;
        return (
          <div className="text-right">
            <div className={`font-medium ${isGain ? 'gain-text' : 'loss-text'}`}>
              {isGain ? '+' : ''}{numValue.toFixed(2)}%
            </div>
          </div>
        );
      },
    },
    {
      Header: 'P/E Ratio',
      accessor: 'peRatio',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="text-gray-900 dark:text-dark-text">{(value || 0) > 0 ? (value || 0).toFixed(2) : '-'}</span>
      ),
    },
    {
      Header: 'Latest Earnings',
      accessor: 'latestEarnings',
      Cell: ({ value }: { value: number | undefined }) => (
        <span className="text-gray-900 dark:text-dark-text">{(value || 0) > 0 ? `₹${(value || 0).toFixed(2)}` : '-'}</span>
      ),
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: stocks,
    },
    useSortBy
  );

  // Mobile card view component
  const MobileStockCard = ({ stock }: { stock: Stock }) => {
    const isGain = (stock.gainLoss || 0) >= 0;
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 mb-4 shadow-sm border border-gray-200/50 dark:border-dark-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {stock.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-dark-text text-sm">{stock.name}</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-secondary">{stock.symbol}</div>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            {stock.sector}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">Purchase Price</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">₹{stock.purchasePrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">Quantity</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">{stock.quantity?.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">Investment</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">₹{stock.investment?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">Portfolio %</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">{stock.portfolioPercentage?.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">CMP</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">₹{stock.cmp?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-dark-text-secondary">Present Value</div>
            <div className="font-medium text-gray-900 dark:text-dark-text">₹{stock.presentValue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-dark-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 dark:text-dark-text-secondary text-xs">Gain/Loss</div>
              <div className={`font-bold text-lg ${isGain ? 'gain-text' : 'loss-text'}`}>
                {isGain ? '+' : ''}₹{Math.abs(stock.gainLoss || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 dark:text-dark-text-secondary text-xs">Gain/Loss %</div>
              <div className={`font-bold text-lg ${isGain ? 'gain-text' : 'loss-text'}`}>
                {isGain ? '+' : ''}{Math.abs(stock.gainLossPercentage || 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-dark-accent rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-dark-accent rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Portfolio Holdings</h2>
          <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
            {stocks.length} stocks • Total Investment: ₹{stocks.reduce((sum, stock) => sum + (stock.investment || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        {/* View mode toggle - hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-dark-accent rounded-lg p-1">
          <button
            onClick={() => setViewMode('comfortable')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out flex items-center space-x-2 ${
              viewMode === 'comfortable'
                ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text shadow-sm dark:shadow-dark-card'
                : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>Comfortable</span>
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out flex items-center space-x-2 ${
              viewMode === 'compact'
                ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text shadow-sm dark:shadow-dark-card'
                : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span>Compact</span>
          </button>
        </div>
      </div>

      {/* Mobile view - Card layout */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {stocks.map((stock) => (
            <MobileStockCard key={stock.id} stock={stock} />
          ))}
        </div>
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200/50 dark:divide-dark-border/50 transition-all duration-300 ease-in-out">
            <thead className="bg-gray-50/50 dark:bg-dark-accent/90">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map(column => {
                    const sortableColumn = column as any; 
                    return (
                      <th
                        {...column.getHeaderProps(sortableColumn.getSortByToggleProps())}
                        className={`table-header cursor-pointer hover:bg-gray-100/50 dark:hover:bg-dark-hover/90 transition-all duration-200 ease-in-out group ${
                          viewMode === 'compact' ? 'px-4 py-2' : 'px-6 py-3'
                        }`}
                        key={column.id}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="group-hover:text-gray-900 dark:group-hover:text-dark-text transition-colors duration-200">{column.render('Header')}</span>
                          {sortableColumn.isSorted && (
                            <span className="text-blue-500 dark:text-dark-glow transition-all duration-200 ease-in-out drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                              {sortableColumn.isSortedDesc ? '↓' : '↑'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white/50 dark:bg-dark-card/90 divide-y divide-gray-200/50 dark:divide-dark-border/50">
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr 
                    {...row.getRowProps()} 
                    className="hover:bg-gray-50/50 dark:hover:bg-dark-hover/90 transition-all duration-200 ease-in-out group"
                    key={row.id}
                  >
                    {row.cells.map(cell => (
                      <td 
                        {...cell.getCellProps()} 
                        className={`table-cell transition-all duration-200 ease-in-out ${
                          viewMode === 'compact' ? 'px-4 py-2' : 'px-6 py-4'
                        }`}
                        key={cell.column.id}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {rows.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-200 dark:bg-dark-accent rounded-full flex items-center justify-center mx-auto mb-4 dark:shadow-dark-glow">
            <svg className="w-8 h-8 text-gray-400 dark:text-dark-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-dark-text-secondary font-medium">No portfolio data available</p>
        </div>
      )}
    </div>
  );
}
