# 🔧 Technical Documentation - Portfolio Dashboard

## Architecture Overview

### System Design
The Portfolio Dashboard follows a **Next.js App Router** architecture with API routes serving as the backend layer. This provides a unified full-stack solution without requiring separate server infrastructure.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   External      │
│   (React)       │◄──►│   Routes        │◄──►│   APIs          │
│                 │    │                 │    │                 │
│ • Portfolio     │    │ • /api/cmp      │    │ • Yahoo Finance │
│ • Sector        │    │ • /api/google   │    │ • Google Finance│
│ • Auto-refresh  │    │ • /api/portfolio│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Architecture

1. **Client Request** → Portfolio page loads
2. **API Call** → `/api/portfolio` endpoint
3. **Data Aggregation** → Combines mock data + live APIs
4. **Response** → Structured portfolio data
5. **Auto-refresh** → 15-second intervals via `setInterval`

## API Implementation Details

### 1. CMP API (`/api/cmp/route.ts`)

**Purpose**: Fetch real-time stock prices from Yahoo Finance

**Implementation**:
```typescript
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  try {
    const quote = await yahooFinance.quote(symbol);
    return NextResponse.json({ 
      symbol, 
      cmp: quote.regularMarketPrice 
    });
  } catch (error) {
    // Error handling with fallback
  }
}
```

**Error Handling**:
- Invalid symbols return 400 status
- API failures return 500 status with error message
- Fallback to 0 CMP value on errors

**Rate Limiting**: Yahoo Finance has inherent rate limits; consider implementing exponential backoff for production.

### 2. Google Finance API (`/api/google/route.ts`)

**Purpose**: Scrape P/E ratios and earnings data

**Implementation**:
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

const response = await axios.get(googleFinanceUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0...' }
});

const $ = cheerio.load(response.data);
// Extract data using CSS selectors
```

**Challenges**:
- **Selector Fragility**: Google Finance HTML structure changes frequently
- **Anti-bot Measures**: Requires proper User-Agent headers
- **Rate Limiting**: Implement delays between requests

**Production Considerations**:
- Use proxy rotation for high-volume scraping
- Implement retry logic with exponential backoff
- Consider alternative data sources (Alpha Vantage, IEX Cloud)

### 3. Portfolio API (`/api/portfolio/route.ts`)

**Purpose**: Main data aggregation endpoint

**Data Processing Pipeline**:
```typescript
// 1. Load mock data
const stocks: Stock[] = [...mockPortfolioData.stocks];

// 2. Fetch live CMP data
const cmpHashes = await Promise.all(
  stocks.map(async (stock) => {
    const cmp = await fetchCMP(stock.symbol);
    return { /* processed data */ };
  })
);

// 3. Calculate derived values
stocks.forEach(stock => {
  const liveData = cmpHashes.find(hash => hash.id === stock.id);
  // Update stock with live data
});

// 4. Generate sector summaries
const sectorSummaries = calculateSectorSummaries(stocks);
```

**Performance Optimizations**:
- **Parallel API Calls**: `Promise.all()` for concurrent CMP fetching
- **Memoized Calculations**: Sector summaries computed once per update
- **Efficient Data Structures**: Map-based lookups for O(1) performance

## Frontend Architecture

### Component Hierarchy

```
PortfolioPage
├── SectorSummary
│   ├── Overview Cards
│   ├── Bar Chart (Recharts)
│   └── Sector Table
└── PortfolioTable
    ├── Sortable Headers
    ├── Data Rows
    └── Loading States
```

### State Management

**Local State**:
```typescript
const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
const [isRefreshing, setIsRefreshing] = useState(false);
```

**State Updates**:
- **Initial Load**: `useEffect` on component mount
- **Auto-refresh**: `setInterval` every 15 seconds
- **Manual Refresh**: User-triggered updates
- **Error Handling**: Graceful degradation with user feedback

### Performance Optimizations

1. **React.memo**: Prevent unnecessary re-renders
2. **useCallback**: Stable function references
3. **useMemo**: Expensive calculation caching
4. **Debounced Updates**: Prevent excessive API calls

## Data Models

### TypeScript Interfaces

```typescript
interface Stock {
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

interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  stockCount: number;
}
```

### Data Validation

**Input Validation**:
- Symbol parameter required for API endpoints
- Numeric values validated before calculations
- Error boundaries catch runtime exceptions

**Data Integrity**:
- Portfolio percentages sum to 100%
- Investment = Purchase Price × Quantity
- Present Value = CMP × Quantity
- Gain/Loss = Present Value - Investment

## Styling & UI

### Tailwind CSS Configuration

**Custom Colors**:
```javascript
theme: {
  extend: {
    colors: {
      'gain': '#10b981',    // Green for positive returns
      'loss': '#ef4444',    // Red for negative returns
      'neutral': '#6b7280', // Gray for neutral values
    },
  },
}
```

**Responsive Design**:
- **Mobile-first**: Base styles for small screens
- **Breakpoints**: `sm:`, `md:`, `lg:` for larger devices
- **Grid System**: CSS Grid for layout flexibility
- **Table Scrolling**: Horizontal scroll on small screens

### Component Styling

**CSS Classes**:
```css
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.gain-text {
  @apply text-gain font-medium;
}

.loss-text {
  @apply text-loss font-medium;
}
```

## Error Handling Strategy

### API Error Handling

1. **Network Errors**: Fetch API failures
2. **Rate Limiting**: 429 status code handling
3. **Invalid Data**: Malformed API responses
4. **Timeout Errors**: Request timeout handling

### User Experience

1. **Loading States**: Skeleton screens during data fetch
2. **Error Messages**: User-friendly error descriptions
3. **Fallback Data**: Cached data when APIs fail
4. **Retry Mechanisms**: Manual refresh buttons

## Security Considerations

### API Security

1. **Input Validation**: Symbol parameter sanitization
2. **Rate Limiting**: Prevent API abuse
3. **Error Messages**: No sensitive data exposure
4. **CORS Configuration**: Cross-origin request handling

### Data Privacy

1. **Mock Data**: No real financial information
2. **API Keys**: No sensitive credentials in code
3. **User Data**: No personal information collection

## Testing Strategy

### Manual Testing Checklist

- [ ] Portfolio data loading
- [ ] Auto-refresh functionality (15s intervals)
- [ ] Manual refresh button
- [ ] Error handling scenarios
- [ ] Responsive design across devices
- [ ] Table sorting functionality
- [ ] Chart rendering and interactions

### API Testing

**Endpoint Testing**:
```bash
# Test CMP API
curl "http://localhost:3000/api/cmp?symbol=HDFCBANK.NS"

# Test Portfolio API
curl "http://localhost:3000/api/portfolio"

# Test Google Finance API
curl "http://localhost:3000/api/google?symbol=HDFCBANK.NS"
```

**Error Scenarios**:
- Invalid symbols
- Network failures
- API rate limits
- Malformed responses

## Deployment & Production

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Environment Variables

**Required**:
- `NODE_ENV`: Production/development mode
- `NEXT_PUBLIC_API_BASE_URL`: API base URL (if different)

**Optional**:
- `YAHOO_FINANCE_API_KEY`: For premium API access
- `GOOGLE_FINANCE_SCRAPING_DELAY`: Scraping delay in milliseconds

### Performance Monitoring

1. **Bundle Analysis**: `@next/bundle-analyzer`
2. **Performance Metrics**: Core Web Vitals
3. **API Response Times**: Monitor external API performance
4. **Error Tracking**: Sentry or similar service

## Future Enhancements

### Planned Features

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Charts**: More chart types and interactions
3. **Portfolio Management**: Add/edit/delete holdings
4. **Historical Data**: Price history and performance tracking
5. **Export Functionality**: PDF/Excel export options

### Technical Improvements

1. **Caching Layer**: Redis for API response caching
2. **Background Jobs**: Queue-based data updates
3. **Database Integration**: PostgreSQL for persistent storage
4. **Authentication**: User accounts and portfolio privacy
5. **Mobile App**: React Native companion app

## Troubleshooting Guide

### Common Issues

1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm install
   npm run dev
   ```

2. **API Rate Limits**
   - Implement exponential backoff
   - Use multiple API keys
   - Cache responses locally

3. **Google Finance Scraping**
   - Update CSS selectors
   - Check for anti-bot measures
   - Implement proxy rotation

### Debug Mode

Enable detailed logging:
```typescript
// In development
console.log('API Response:', data);
console.log('Portfolio State:', portfolio);
console.log('Sector Calculations:', sectorSummaries);
```

---

**This technical documentation provides comprehensive implementation details for the Portfolio Dashboard project. For additional support, refer to the README.md file or create an issue in the repository.**
