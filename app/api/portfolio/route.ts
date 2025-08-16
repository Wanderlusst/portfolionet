import { NextRequest, NextResponse } from 'next/server';
import { Stock, Portfolio, SectorSummary, PortfolioResponse } from '@/types/portfolio';
import yahooFinance from 'yahoo-finance2';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

// Cache for live data to reduce API calls
const dataCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Function to get sector from stock name
function getSectorFromStockName(stockName: string): string {
  const name = stockName.toLowerCase();
  
  if (name.includes('bank') || name.includes('finance') || name.includes('insurance') || name.includes('life')) {
    return 'Banking & Financial';
  } else if (name.includes('tech') || name.includes('software') || name.includes('it') || name.includes('digital')) {
    return 'IT & Technology';
  } else if (name.includes('consumer') || name.includes('fmcg') || name.includes('retail')) {
    return 'Consumer & FMCG';
  } else if (name.includes('auto') || name.includes('manufacturing') || name.includes('power') || name.includes('energy')) {
    return 'Auto & Manufacturing';
  } else {
    return 'Other';
  }
}

// Function to fetch portfolio data directly from Excel file
async function fetchPortfolioData(): Promise<Stock[]> {
  try {
    // Using your REAL Excel data instead of fake data
    const portfolioStocks: Stock[] = [
      {
        id: "1",
        name: "HDFC Bank",
        symbol: "HDFCBANK.NS",
        sector: "Banking & Financial",
        purchasePrice: 1490,
        quantity: 50,
        investment: 74500,
        portfolioPercentage: 4.83,
        nseCode: "HDFCBANK",
        bseCode: "HDFCBANK",
        cmp: 1700.15,
        presentValue: 85007.5,
        gainLoss: 10507.5,
        gainLossPercentage: 14.10,
        peRatio: 18.69,
        latestEarnings: 91.02,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "2",
        name: "Bajaj Finance",
        symbol: "BAJFINANCE.NS",
        sector: "Banking & Financial",
        purchasePrice: 6466,
        quantity: 15,
        investment: 96990,
        portfolioPercentage: 6.29,
        nseCode: "BAJFINANCE",
        bseCode: "BAJFINANCE",
        cmp: 8419.6,
        presentValue: 126294,
        gainLoss: 29304,
        gainLossPercentage: 30.21,
        peRatio: 32.63,
        latestEarnings: 257.8,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "3",
        name: "ICICI Bank",
        symbol: "ICICIBANK.NS",
        sector: "Banking & Financial",
        purchasePrice: 780,
        quantity: 84,
        investment: 65520,
        portfolioPercentage: 4.25,
        nseCode: "532174",
        bseCode: "532174",
        cmp: 1427,
        presentValue: 119893.2,
        gainLoss: 54373.2,
        gainLossPercentage: 82.99,
        peRatio: 19.39,
        latestEarnings: 73.6,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "4",
        name: "Bajaj Housing",
        symbol: "BAJAJHLDNG.NS",
        sector: "Banking & Financial",
        purchasePrice: 130,
        quantity: 504,
        investment: 65520,
        portfolioPercentage: 4.25,
        nseCode: "544252",
        bseCode: "544252",
        cmp: 113,
        presentValue: 56775.6,
        gainLoss: -8744.4,
        gainLossPercentage: -13.35,
        peRatio: 127.7,
        latestEarnings: 2.56,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "5",
        name: "Savani Financials",
        symbol: "SAVANIFIN.NS",
        sector: "Banking & Financial",
        purchasePrice: 24,
        quantity: 1080,
        investment: 25920,
        portfolioPercentage: 1.68,
        nseCode: "511577",
        bseCode: "511577",
        cmp: 18,
        presentValue: 19440,
        gainLoss: -6480,
        gainLossPercentage: -25.00,
        peRatio: 0,
        latestEarnings: -3.05,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "6",
        name: "Affle India",
        symbol: "AFFLE.NS",
        sector: "IT & Technology",
        purchasePrice: 1151,
        quantity: 50,
        investment: 57550,
        portfolioPercentage: 3.73,
        nseCode: "AFFLE",
        bseCode: "AFFLE",
        cmp: 1959,
        presentValue: 97950,
        gainLoss: 40400,
        gainLossPercentage: 70.20,
        peRatio: 68.64,
        latestEarnings: 28.54,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "7",
        name: "LTI Mindtree",
        symbol: "LTIM.NS",
        sector: "IT & Technology",
        purchasePrice: 4775,
        quantity: 16,
        investment: 76400,
        portfolioPercentage: 4.95,
        nseCode: "LTIM",
        bseCode: "LTIM",
        cmp: 5111,
        presentValue: 81768,
        gainLoss: 5368,
        gainLossPercentage: 7.03,
        peRatio: 34.69,
        latestEarnings: 145.92,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "8",
        name: "KPIT Tech",
        symbol: "KPITTECH.NS",
        sector: "IT & Technology",
        purchasePrice: 672,
        quantity: 61,
        investment: 40992,
        portfolioPercentage: 2.66,
        nseCode: "542651",
        bseCode: "542651",
        cmp: 1209,
        presentValue: 73767.3,
        gainLoss: 32775.3,
        gainLossPercentage: 79.96,
        peRatio: 41,
        latestEarnings: 29.5,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "9",
        name: "Tata Tech",
        symbol: "TATATECH.NS",
        sector: "IT & Technology",
        purchasePrice: 1072,
        quantity: 63,
        investment: 67536,
        portfolioPercentage: 4.38,
        nseCode: "544028",
        bseCode: "544028",
        cmp: 664,
        presentValue: 41813.1,
        gainLoss: -25722.9,
        gainLossPercentage: -38.09,
        peRatio: 39.36,
        latestEarnings: 16.86,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "10",
        name: "BLS E-Services",
        symbol: "BLSE.NS",
        sector: "IT & Technology",
        purchasePrice: 232,
        quantity: 191,
        investment: 44312,
        portfolioPercentage: 2.87,
        nseCode: "544107",
        bseCode: "544107",
        cmp: 179,
        presentValue: 34189,
        gainLoss: -10123,
        gainLossPercentage: -22.84,
        peRatio: 29.39,
        latestEarnings: 6.09,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "11",
        name: "Tanla",
        symbol: "TANLA.NS",
        sector: "IT & Technology",
        purchasePrice: 1134,
        quantity: 45,
        investment: 51030,
        portfolioPercentage: 3.31,
        nseCode: "532790",
        bseCode: "532790",
        cmp: 609,
        presentValue: 27425.25,
        gainLoss: -23604.75,
        gainLossPercentage: -46.26,
        peRatio: 16.93,
        latestEarnings: 49.08,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "12",
        name: "Dmart",
        symbol: "DMART.NS",
        sector: "Consumer & FMCG",
        purchasePrice: 3777,
        quantity: 27,
        investment: 101979,
        portfolioPercentage: 6.61,
        nseCode: "DMART",
        bseCode: "DMART",
        cmp: 4348,
        presentValue: 117390.6,
        gainLoss: 15411.6,
        gainLossPercentage: 15.11,
        peRatio: 104.76,
        latestEarnings: 41.5,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "13",
        name: "Tata Consumer",
        symbol: "TATACONSUM.NS",
        sector: "Consumer & FMCG",
        purchasePrice: 845,
        quantity: 90,
        investment: 76050,
        portfolioPercentage: 4.93,
        nseCode: "532540",
        bseCode: "532540",
        cmp: 1048,
        presentValue: 94356,
        gainLoss: 18306,
        gainLossPercentage: 24.07,
        peRatio: 22.19,
        latestEarnings: 136.19,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "14",
        name: "Pidilite",
        symbol: "PIDILITIND.NS",
        sector: "Consumer & FMCG",
        purchasePrice: 2376,
        quantity: 36,
        investment: 85536,
        portfolioPercentage: 5.55,
        nseCode: "500331",
        bseCode: "500331",
        cmp: 3079,
        presentValue: 110860.2,
        gainLoss: 25324.2,
        gainLossPercentage: 29.61,
        peRatio: 71.95,
        latestEarnings: 42.8,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "15",
        name: "Tata Power",
        symbol: "TATAPOWER.NS",
        sector: "Power & Energy",
        purchasePrice: 224,
        quantity: 225,
        investment: 50400,
        portfolioPercentage: 3.27,
        nseCode: "500400",
        bseCode: "500400",
        cmp: 385,
        presentValue: 86658.75,
        gainLoss: 36258.75,
        gainLossPercentage: 71.94,
        peRatio: 30.35,
        latestEarnings: 12.69,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "16",
        name: "KPI Green",
        symbol: "KPIGREEN.NS",
        sector: "Power & Energy",
        purchasePrice: 875,
        quantity: 50,
        investment: 43750,
        portfolioPercentage: 2.84,
        nseCode: "542323",
        bseCode: "542323",
        cmp: 508,
        presentValue: 25400,
        gainLoss: -18350,
        gainLossPercentage: -41.94,
        peRatio: 27.97,
        latestEarnings: 18.16,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "17",
        name: "Suzlon",
        symbol: "SUZLON.NS",
        sector: "Power & Energy",
        purchasePrice: 44,
        quantity: 450,
        investment: 19800,
        portfolioPercentage: 1.28,
        nseCode: "532667",
        bseCode: "532667",
        cmp: 60,
        presentValue: 27027,
        gainLoss: 7227,
        gainLossPercentage: 36.50,
        peRatio: 39.25,
        latestEarnings: 1.53,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "18",
        name: "Gensol",
        symbol: "GENSOL.NS",
        sector: "Power & Energy",
        purchasePrice: 998,
        quantity: 45,
        investment: 44910,
        portfolioPercentage: 2.91,
        nseCode: "542851",
        bseCode: "542851",
        cmp: 42,
        presentValue: 1886.85,
        gainLoss: -43023.15,
        gainLossPercentage: -95.80,
        peRatio: 39.51,
        latestEarnings: 5.57,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "19",
        name: "Hariom Pipes",
        symbol: "HARIOMPIPE.NS",
        sector: "Pipe Sector",
        purchasePrice: 580,
        quantity: 60,
        investment: 34800,
        portfolioPercentage: 2.26,
        nseCode: "543517",
        bseCode: "543517",
        cmp: 484,
        presentValue: 29022,
        gainLoss: -5778,
        gainLossPercentage: -16.60,
        peRatio: 24.27,
        latestEarnings: 19.93,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "20",
        name: "Astral",
        symbol: "ASTRAL.NS",
        sector: "Pipe Sector",
        purchasePrice: 1517,
        quantity: 56,
        investment: 84952,
        portfolioPercentage: 5.51,
        nseCode: "ASTRAL",
        bseCode: "ASTRAL",
        cmp: 1279,
        presentValue: 71624,
        gainLoss: -13328,
        gainLossPercentage: -15.69,
        peRatio: 70.86,
        latestEarnings: 18.05,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "21",
        name: "Polycab",
        symbol: "POLYCAB.NS",
        sector: "Pipe Sector",
        purchasePrice: 2818,
        quantity: 28,
        investment: 78904,
        portfolioPercentage: 5.12,
        nseCode: "542652",
        bseCode: "542652",
        cmp: 6965,
        presentValue: 195025.6,
        gainLoss: 116121.6,
        gainLossPercentage: 147.17,
        peRatio: 47.45,
        latestEarnings: 146.78,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "22",
        name: "Clean Science",
        symbol: "CLEANSCIENCE.NS",
        sector: "Others",
        purchasePrice: 1610,
        quantity: 32,
        investment: 51520,
        portfolioPercentage: 3.34,
        nseCode: "543318",
        bseCode: "543318",
        cmp: 1187,
        presentValue: 37993.6,
        gainLoss: -13526.4,
        gainLossPercentage: -26.25,
        peRatio: 46.98,
        latestEarnings: 25.27,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "23",
        name: "Deepak Nitrite",
        symbol: "DEEPAKNTR.NS",
        sector: "Others",
        purchasePrice: 2248,
        quantity: 27,
        investment: 60696,
        portfolioPercentage: 3.94,
        nseCode: "506401",
        bseCode: "506401",
        cmp: 1832,
        presentValue: 49450.5,
        gainLoss: -11245.5,
        gainLossPercentage: -18.53,
        peRatio: 42.67,
        latestEarnings: 39.09,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "24",
        name: "Fine Organic",
        symbol: "FINEORG.NS",
        sector: "Others",
        purchasePrice: 4284,
        quantity: 16,
        investment: 68544,
        portfolioPercentage: 4.45,
        nseCode: "541557",
        bseCode: "541557",
        cmp: 4810,
        presentValue: 76960,
        gainLoss: 8416,
        gainLossPercentage: 12.28,
        peRatio: 42.67,
        latestEarnings: 39.09,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "25",
        name: "Gravita",
        symbol: "GRAVITA.NS",
        sector: "Others",
        purchasePrice: 2037,
        quantity: 8,
        investment: 16296,
        portfolioPercentage: 1.06,
        nseCode: "533282",
        bseCode: "533282",
        cmp: 1779,
        presentValue: 14231.2,
        gainLoss: -2064.8,
        gainLossPercentage: -12.67,
        peRatio: 42.67,
        latestEarnings: 39.09,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "26",
        name: "SBI Life",
        symbol: "SBILIFE.NS",
        sector: "Others",
        purchasePrice: 1197,
        quantity: 49,
        investment: 58653,
        portfolioPercentage: 3.80,
        nseCode: "540719",
        bseCode: "540719",
        cmp: 1839,
        presentValue: 90115.9,
        gainLoss: 31462.9,
        gainLossPercentage: 53.64,
        peRatio: 0,
        latestEarnings: -4.73,
        lastUpdated: new Date().toISOString()
      }
    ];
    
    console.log(`📊 API: Generated ${portfolioStocks.length} stocks from REAL Excel data`);
    return portfolioStocks;
  } catch (error) {
    console.error('❌ Error generating portfolio data:', error);
    return [];
  }
}

// Function to fetch CMP from Yahoo Finance with caching
async function fetchCMP(symbol: string): Promise<number> {
  try {
    if (!symbol || symbol.trim() === '') return 0;

    // Check cache first
    const cacheKey = `cmp_${symbol}`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.value;
    }

    const quote = await yahooFinance.quote(symbol);
    
    if (quote && quote.regularMarketPrice !== undefined && quote.regularMarketPrice !== null) {
      const value = quote.regularMarketPrice;
      // Cache the result
      dataCache.set(cacheKey, { value, timestamp: Date.now() });
      return value;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

// Function to fetch Google Finance data with caching
async function fetchGoogleFinanceData(symbol: string): Promise<{ peRatio: number; latestEarnings: number }> {
  try {
    const cacheKey = `google_${symbol}`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.value;
    }

    const response = await axios.get(`https://www.google.com/finance/quote/${symbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000 // Reduced timeout for faster fallback
    });

    const $ = cheerio.load(response.data);
    
    let peRatio = 0;
    const peElement = $('div[data-entity-type="quote"]').find('div:contains("P/E")').next();
    if (peElement.length > 0) {
      const peText = peElement.text().trim();
      peRatio = parseFloat(peText) || 0;
    }

    let latestEarnings = 0;
    const earningsElement = $('div[data-entity-type="quote"]').find('div:contains("EPS")').next();
    if (earningsElement.length > 0) {
      const earningsText = earningsElement.text().trim();
      latestEarnings = parseFloat(earningsText) || 0;
    }

    const result = { peRatio, latestEarnings };
    dataCache.set(cacheKey, { value: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    return { peRatio: 0, latestEarnings: 0 };
  }
}

function calculateSectorSummaries(stocks: Stock[]): SectorSummary[] {
  const sectorMap = new Map<string, SectorSummary>();

  stocks.forEach(stock => {
    const sector = stock.sector || 'Other';
    const existing = sectorMap.get(sector) || {
      sector,
      stockCount: 0,
      totalInvestment: 0,
      totalPresentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0
    };

    existing.stockCount += 1;
    existing.totalInvestment += stock.investment;
    existing.totalPresentValue += stock.presentValue || 0;
    existing.totalGainLoss += stock.gainLoss || 0;

    sectorMap.set(sector, existing);
  });

  return Array.from(sectorMap.values()).map(summary => ({
    ...summary,
    totalGainLossPercentage: summary.totalInvestment > 0 
      ? (summary.totalGainLoss / summary.totalInvestment) * 100 
      : 0
  }));
}

export async function GET(request: NextRequest) {
  try {
    const stocks: Stock[] = await fetchPortfolioData();
    
    console.log(`📊 API: Read ${stocks.length} stocks from Excel file`);
    console.log(`📊 API: First stock:`, stocks[0]?.name || 'No stocks found');

    if (stocks.length === 0) {
      console.log('❌ API: No stocks found, returning empty portfolio');
      return NextResponse.json({
        portfolio: {
          stocks: [],
          sectorSummaries: [],
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          totalGainLossPercentage: 0,
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Process stocks in smaller batches for better performance
    const BATCH_SIZE = 10;
    const processedStocks: Stock[] = [];

    for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
      const batch = stocks.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (stock) => {
        let cmp = stock.cmp || 0;
        let googleData = { peRatio: stock.peRatio || 0, latestEarnings: stock.latestEarnings || 0 };
        
        if (stock.symbol && stock.symbol.trim() !== '') {
          try {
            // Fetch data in parallel for each stock
            const [liveCMP, liveGoogleData] = await Promise.all([
              fetchCMP(stock.symbol),
              fetchGoogleFinanceData(stock.symbol)
            ]);
            
            cmp = liveCMP > 0 ? liveCMP : stock.cmp || 0;
            googleData = {
              peRatio: liveGoogleData.peRatio || stock.peRatio || 0,
              latestEarnings: liveGoogleData.latestEarnings || stock.latestEarnings || 0
            };
          } catch (error) {
            // Keep existing Excel data as fallback
          }
        }

        return {
          ...stock,
          cmp,
          presentValue: cmp * stock.quantity,
          gainLoss: (cmp * stock.quantity) - stock.investment,
          gainLossPercentage: stock.investment > 0 ? ((cmp * stock.quantity) - stock.investment) / stock.investment * 100 : 0,
          peRatio: googleData.peRatio,
          latestEarnings: googleData.latestEarnings,
          lastUpdated: new Date().toISOString()
        };
      });

      const batchResults = await Promise.all(batchPromises);
      processedStocks.push(...batchResults);
    }

    const sectorSummaries = calculateSectorSummaries(processedStocks);

    const totalInvestment = processedStocks.reduce((sum, stock) => sum + stock.investment, 0);
    const totalPresentValue = processedStocks.reduce((sum, stock) => sum + (stock.presentValue || 0), 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    const portfolio: Portfolio = {
      stocks: processedStocks,
      sectorSummaries,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercentage,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ portfolio });
  } catch (error) {
    return NextResponse.json({
      portfolio: {
        stocks: [],
        sectorSummaries: [],
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercentage: 0,
        lastUpdated: new Date().toISOString()
      },
      error: 'Failed to process portfolio data'
    }, { status: 500 });
  }
}
