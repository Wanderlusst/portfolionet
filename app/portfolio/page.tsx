'use client';

import { useState, useEffect, useCallback } from 'react';
import { Portfolio as PortfolioType } from '@/types/portfolio';
import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portfolio');
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const data = await response.json();
      setPortfolio(data.portfolio);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPortfolio(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        fetchPortfolio();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPortfolio, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">Error Loading Portfolio</h2>
          <p className="text-gray-600 dark:text-dark-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchPortfolio}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
            Portfolio Dashboard
          </h1>
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-dark-text-secondary">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Last updated: {lastUpdated}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={fetchPortfolio}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start space-x-2 text-sm sm:text-base"
        >
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isLoading ? 'Refreshing...' : 'Refresh Now'}</span>
        </button>
      </div>

      {/* Portfolio Content */}
      {portfolio ? (
        <>
          <SectorSummary
            sectorSummaries={portfolio.sectorSummaries}
            totalInvestment={portfolio.totalInvestment}
            totalPresentValue={portfolio.totalPresentValue}
            totalGainLoss={portfolio.totalGainLoss}
            totalGainLossPercentage={portfolio.totalGainLossPercentage}
            isLoading={isLoading}
          />
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-4">
              Portfolio Holdings
            </h2>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
              Showing {portfolio.stocks.length} stocks across {portfolio.sectorSummaries.length} sectors.
            </p>
            <PortfolioTable stocks={portfolio.stocks} />
          </div>
        </>
      ) : (
        <SectorSummary
          sectorSummaries={[]}
          totalInvestment={0}
          totalPresentValue={0}
          totalGainLoss={0}
          totalGainLossPercentage={0}
          isLoading={true}
        />
      )}
    </div>
  );
}
