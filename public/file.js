const XLSX = require("xlsx");
const fs = require("fs");

try {
  // Read the Excel file
  const workbook = XLSX.readFile("public/Sample_Portfolio_BE_A41C6DA6FF.xlsx");
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON with headers
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Find the actual data rows (skip header rows)
  let dataStartRow = 0;
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i][0] === 'No' && rawData[i][1] === 'Particulars') {
      dataStartRow = i + 1;
      break;
    }
  }
  
  // Extract headers and data
  const headers = rawData[dataStartRow - 1];
  const dataRows = rawData.slice(dataStartRow);
  
  console.log("📊 Found headers:", headers);
  console.log("📊 Data rows found:", dataRows.length);
  
  // Function to get sector from stock name
  function getSectorFromStockName(stockName) {
    if (!stockName) return 'Other';
    
    const name = stockName.toLowerCase();
    
    if (name.includes('bank') || name.includes('finance') || name.includes('insurance') || name.includes('hdfc') || name.includes('icici') || name.includes('sbi')) {
      return 'Banking & Financial';
    } else if (name.includes('tech') || name.includes('software') || name.includes('it') || name.includes('infosys') || name.includes('tcs') || name.includes('wipro')) {
      return 'IT & Technology';
    } else if (name.includes('auto') || name.includes('motor') || name.includes('tata') || name.includes('mahindra') || name.includes('maruti')) {
      return 'Auto & Manufacturing';
    } else if (name.includes('pharma') || name.includes('health') || name.includes('medical')) {
      return 'Healthcare & Pharma';
    } else if (name.includes('energy') || name.includes('oil') || name.includes('gas') || name.includes('reliance')) {
      return 'Energy & Oil';
    } else if (name.includes('real') || name.includes('estate') || name.includes('construction')) {
      return 'Real Estate & Construction';
    } else if (name.includes('consumer') || name.includes('fmcg') || name.includes('food')) {
      return 'Consumer & FMCG';
    } else {
      return 'Other';
    }
  }
  
  // Process data rows
  const portfolioStocks = [];
  const sectorBreakdown = {};
  
  dataRows.forEach((row, index) => {
    // Skip empty rows or rows without stock name
    if (!row[1] || row[1] === 'Particulars' || row[1] === 'Total' || row[1] === 'Grand Total') {
      return;
    }
    
    // Skip sector summary rows (rows without purchase price or quantity)
    if (!row[2] || !row[3] || row[2] === 0 || row[3] === 0) {
      console.log(`⚠️ Skipping sector summary row: ${row[1]}`);
      return;
    }
    
    try {
      const stockName = row[1]?.toString().trim();
      const purchasePrice = parseFloat(row[2]) || 0;
      const quantity = parseInt(row[3]) || 0;
      const investment = parseFloat(row[4]) || 0;
      const portfolioPercentage = parseFloat(row[5]) || 0;
      const nseCode = row[6]?.toString().trim() || '';
      const cmp = parseFloat(row[7]) || 0;
      const presentValue = parseFloat(row[8]) || 0;
      const gainLoss = parseFloat(row[9]) || 0;
      const gainLossPercentage = parseFloat(row[10]) || 0;
      const peRatio = parseFloat(row[12]) || 0;
      const latestEarnings = parseFloat(row[13]) || 0;
      
      // Only add stocks with valid data
      if (stockName && investment > 0 && purchasePrice > 0 && quantity > 0) {
        const sector = getSectorFromStockName(stockName);
        
        // Count sectors
        sectorBreakdown[sector] = (sectorBreakdown[sector] || 0) + 1;
        
        const stock = {
          id: (index + 1).toString(),
          name: stockName,
          symbol: nseCode || `${stockName.replace(/\s+/g, '')}.NS`,
          sector: sector,
          purchasePrice: purchasePrice,
          quantity: quantity,
          investment: investment,
          portfolioPercentage: portfolioPercentage,
          nseCode: nseCode,
          bseCode: nseCode,
          cmp: cmp,
          presentValue: presentValue,
          gainLoss: gainLoss,
          gainLossPercentage: gainLossPercentage,
          peRatio: peRatio,
          latestEarnings: latestEarnings,
          lastUpdated: new Date().toISOString()
        };
        
        portfolioStocks.push(stock);
        console.log(`✅ Added real stock: ${stockName} - ₹${purchasePrice} x ${quantity} = ₹${investment}`);
      }
    } catch (error) {
      console.log(`⚠️ Skipping row ${index + 1}:`, error.message);
    }
  });
  
  // Create portfolio object
  const portfolio = {
    stocks: portfolioStocks,
    sectorSummaries: [],
    totalInvestment: portfolioStocks.reduce((sum, stock) => sum + stock.investment, 0),
    totalPresentValue: portfolioStocks.reduce((sum, stock) => sum + (stock.presentValue || 0), 0),
    totalGainLoss: portfolioStocks.reduce((sum, stock) => sum + (stock.gainLoss || 0), 0),
    totalGainLossPercentage: 0,
    lastUpdated: new Date().toISOString()
  };
  
  // Calculate total gain/loss percentage
  if (portfolio.totalInvestment > 0) {
    portfolio.totalGainLossPercentage = (portfolio.totalGainLoss / portfolio.totalInvestment) * 100;
  }
  
  // Calculate sector summaries
  const sectorMap = new Map();
  portfolioStocks.forEach(stock => {
    const sector = stock.sector;
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, {
        sector,
        stockCount: 0,
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercentage: 0
      });
    }
    
    const summary = sectorMap.get(sector);
    summary.stockCount += 1;
    summary.totalInvestment += stock.investment;
    summary.totalPresentValue += stock.presentValue || 0;
    summary.totalGainLoss += stock.gainLoss || 0;
  });
  
  // Calculate sector percentages
  sectorMap.forEach(summary => {
    if (summary.totalInvestment > 0) {
      summary.totalGainLossPercentage = (summary.totalGainLoss / summary.totalInvestment) * 100;
    }
  });
  
  portfolio.sectorSummaries = Array.from(sectorMap.values());
  
  // Write to JSON file
  fs.writeFileSync("data/portfolio.json", JSON.stringify(portfolio, null, 2));
  
  console.log("✅ Portfolio data generated successfully");
  console.log(`📊 Total stocks: ${portfolioStocks.length}`);
  console.log("🏢 Sectors:", sectorBreakdown);
  console.log(`💰 Total Investment: ₹${portfolio.totalInvestment.toLocaleString('en-IN')}`);
  console.log(`📈 Total Present Value: ₹${portfolio.totalPresentValue.toLocaleString('en-IN')}`);
  console.log(`📊 Total Gain/Loss: ₹${portfolio.totalGainLoss.toLocaleString('en-IN')} (${portfolio.totalGainLossPercentage.toFixed(2)}%)`);
  
} catch (error) {
  console.error("❌ Error processing Excel file:", error.message);
  process.exit(1);
}
