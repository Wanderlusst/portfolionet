export interface Stock {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  nseCode: string;
  bseCode: string;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
  gainLossPercentage?: number;
  peRatio?: number;
  latestEarnings?: number;
  lastUpdated?: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  stockCount: number;
}

export interface Portfolio {
  stocks: Stock[];
  sectorSummaries: SectorSummary[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  lastUpdated: string;
}

export interface CMPResponse {
  symbol: string;
  cmp: number;
  error?: string;
}

export interface GoogleFinanceResponse {
  symbol: string;
  peRatio?: number;
  latestEarnings?: number;
  error?: string;
}

export interface PortfolioResponse {
  portfolio: Portfolio;
  error?: string;
}
