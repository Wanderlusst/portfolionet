'use client';

import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SectorSummary as SectorSummaryType } from '@/types/portfolio';

interface Props {
  sectorSummaries: SectorSummaryType[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  isLoading?: boolean;
}

export default function SectorSummary({ 
  sectorSummaries, 
  totalInvestment, 
  totalPresentValue, 
  totalGainLoss, 
  totalGainLossPercentage,
  isLoading = false 
}: Props) {
  const [viewMode, setViewMode] = useState<'comfortable' | 'compact'>('comfortable');
  
  const isGain = totalGainLoss >= 0;

  const chartData = useMemo(() => {
    return sectorSummaries.map(summary => ({
      sector: summary.sector,
      investment: summary.totalInvestment,
      presentValue: summary.totalPresentValue
    }));
  }, [sectorSummaries]);

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-6 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card animate-pulse">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 dark:bg-dark-accent rounded-2xl mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-dark-accent rounded mb-2 w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-dark-accent rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 dark:bg-dark-accent rounded w-48"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-dark-accent rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-accent rounded w-24"></div>
        </div>
      </div>
      <div className="h-80 bg-gray-200 dark:bg-dark-accent rounded"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        
        {/* Skeleton Chart */}
        <SkeletonChart />
        
        {/* Skeleton Table */}
        <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden shadow-xl dark:shadow-dark-card animate-pulse">
          <div className="px-8 py-6 border-b border-gray-200/50 dark:border-dark-border/50">
            <div className="h-8 bg-gray-200 dark:bg-dark-accent rounded w-48"></div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-dark-accent rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500 dark:bg-dark-card/90">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">Total Investment</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-dark-text">₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500 dark:bg-dark-card/90">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">Present Value</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-dark-text">₹{totalPresentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500 dark:bg-dark-card/90">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">Total Gain/Loss</div>
              <div className={`text-lg sm:text-xl font-bold ${isGain ? 'gain-text' : 'loss-text'}`}>
                {isGain ? '+' : ''}₹{Math.abs(totalGainLoss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500 dark:bg-dark-card/90">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary">Gain/Loss %</div>
              <div className={`text-lg sm:text-xl font-bold ${isGain ? 'gain-text' : 'loss-text'}`}>
                {isGain ? '+' : ''}{Math.abs(totalGainLossPercentage).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Sector Chart */}
      <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm p-4 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-dark-border/50 shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-dark-text">Sector Allocation</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 dark:bg-dark-blue rounded-full animate-pulse-glow"></div>
              <span className="text-gray-600 dark:text-dark-text-secondary">Investment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-dark-green rounded-full animate-pulse-glow"></div>
              <span className="text-gray-600 dark:text-dark-text-secondary">Current Value</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="sector"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6b7280',
                  fontSize: 10,
                  fontWeight: 500
                }}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6b7280',
                  fontSize: 10,
                  fontWeight: 500
                }}
                tickMargin={10}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  name === 'investment' ? 'Investment' : 'Current Value'
                ]}
                labelFormatter={(label) => `Sector: ${label}`}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="investment"
                fill="#3b82f6"
                name="Investment"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="presentValue"
                fill="#10b981"
                name="Current Value"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Details Table */}
      <div className="bg-white/50 dark:bg-dark-card/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden shadow-xl dark:shadow-dark-card hover:shadow-2xl dark:hover:shadow-dark-hover transition-all duration-500">
        <div className="px-4 sm:px-8 py-6 border-b border-gray-200/50 dark:border-dark-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-dark-text">Sector Breakdown</h3>
            
            {/* View Mode Toggle - hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Table View:</span>
              <div className="flex bg-gray-200 dark:bg-dark-hover rounded-lg p-1">
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
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-dark-border/50 transition-all duration-300 ease-in-out">
            <thead className="bg-gray-50/50 dark:bg-dark-accent/90">
              <tr>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Sector
                </th>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Stocks
                </th>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Investment
                </th>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Present Value
                </th>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Gain/Loss
                </th>
                <th className={`text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider ${
                  viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-3'
                }`}>
                  Gain/Loss %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 dark:bg-dark-card/90 divide-y divide-gray-200/50 dark:divide-dark-border/50">
              {sectorSummaries.map((summary, index) => {
                const isSectorGain = summary.totalGainLoss >= 0;
                return (
                  <tr key={summary.sector} className="hover:bg-gray-50/50 dark:hover:bg-dark-hover/90 transition-all duration-200 ease-in-out">
                    <td className={`whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    }`}>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-dark-purple/20 dark:to-dark-blue/20 text-blue-800 dark:text-dark-glow border border-blue-200/50 dark:border-dark-glow/30">
                        {summary.sector}
                      </span>
                    </td>
                    <td className={`whitespace-nowrap text-sm text-gray-900 dark:text-dark-text ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    }`}>
                      {summary.stockCount}
                    </td>
                    <td className={`whitespace-nowrap text-sm text-gray-900 dark:text-dark-text ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    }`}>
                      ₹{summary.totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`whitespace-nowrap text-sm text-gray-900 dark:text-dark-text ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    }`}>
                      ₹{summary.totalPresentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`whitespace-nowrap text-sm font-medium ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    } ${isSectorGain ? 'gain-text' : 'loss-text'}`}>
                      {isSectorGain ? '+' : ''}₹{Math.abs(summary.totalGainLoss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`whitespace-nowrap text-sm font-medium ${
                      viewMode === 'compact' ? 'px-4 py-2' : 'px-4 sm:px-8 py-4'
                    } ${isSectorGain ? 'gain-text' : 'loss-text'}`}>
                      {isSectorGain ? '+' : ''}{summary.totalGainLossPercentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
