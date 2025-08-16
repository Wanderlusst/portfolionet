# 📊 Portfolio Dashboard - 8byte.ai Technical Assignment

A dynamic portfolio management system built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. This application provides real-time stock portfolio tracking with automatic data refresh, sector-wise analysis, and comprehensive financial metrics.

## 🚀 Features

### Core Functionality
- **Real-time Portfolio Tracking**: Live CMP (Current Market Price) updates from Yahoo Finance API
- **Sector-wise Grouping**: Automatic categorization and analysis by business sectors
- **Auto-refresh**: Data updates every 15 seconds automatically
- **Comprehensive Metrics**: Investment, present value, gain/loss, P/E ratios, and earnings data
- **🌙 Dark Theme**: Beautiful dark mode with smooth transitions and theme persistence

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Performance**: Optimized with React hooks and memoization
- **Charts**: Interactive sector performance visualization with Recharts
- **Theme System**: Context-based theme management with localStorage persistence

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark mode support
- **Data Fetching**: Yahoo Finance API, Google Finance scraping
- **Tables**: React Table with sorting and responsive design
- **Charts**: Recharts for sector performance visualization
- **Theme**: Context API for dark/light mode switching
- **Architecture**: Full-stack Next.js (no separate backend needed)

## 📁 Project Structure

```
portfolionet/
├── app/
│   ├── api/
│   │   ├── cmp/route.ts          # Yahoo Finance CMP API
│   │   ├── google/route.ts       # Google Finance scraping API
│   │   └── portfolio/route.ts    # Combine JSON + live API data
│   ├── portfolio/page.tsx        # Dashboard UI
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout with theme provider
│   └── page.tsx                  # Home page
├── components/
│   ├── PortfolioTable.tsx        # Reusable table component
│   ├── SectorSummary.tsx         # Sector grouping summary
│   └── ThemeToggle.tsx           # Dark/light mode toggle
├── contexts/
│   └── ThemeContext.tsx          # Theme management context
├── types/
│   └── portfolio.ts              # TypeScript interfaces
├── public/
│   └── portfolio.json            # Mock portfolio data
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration with dark mode
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolionet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌙 Dark Theme

The application features a beautiful dark theme with:

- **Automatic Detection**: Respects system preference on first visit
- **Persistent Storage**: Remembers your theme choice in localStorage
- **Smooth Transitions**: 200ms transitions for all color changes
- **Comprehensive Coverage**: All components support both themes
- **Accessibility**: High contrast ratios for better readability

**Toggle Theme**: Click the sun/moon icon in the header to switch between light and dark modes.

## 📊 API Endpoints

### 1. CMP Data (`/api/cmp`)
- **Purpose**: Fetch current market prices from Yahoo Finance
- **Method**: GET
- **Parameters**: `symbol` (stock symbol)
- **Response**: CMP value and error handling

### 2. Google Finance (`/api/google`)
- **Purpose**: Scrape P/E ratios and earnings data
- **Method**: GET
- **Parameters**: `symbol` (stock symbol)
- **Response**: P/E ratio, latest earnings, and error handling

### 3. Portfolio Data (`/api/portfolio`)
- **Purpose**: Main portfolio endpoint combining all data
- **Method**: GET
- **Response**: Complete portfolio with live data and sector summaries

## 🔄 Data Flow

1. **Initial Load**: Portfolio loads with mock data
2. **Live Updates**: Yahoo Finance API fetches real-time CMP
3. **Sector Calculation**: Automatic grouping and summary generation
4. **Auto-refresh**: 15-second intervals for continuous updates
5. **Error Handling**: Fallback to cached data if APIs fail

## 🎨 UI Components

### PortfolioTable
- Sortable columns for all metrics
- Color-coded gain/loss indicators
- Responsive design with horizontal scroll
- Loading states and error handling
- Full dark theme support

### SectorSummary
- Overview cards with key metrics
- Interactive bar charts for sector performance
- Detailed sector breakdown table
- Real-time calculations and updates
- Dark theme optimized charts

### ThemeToggle
- Sun/moon icon for intuitive switching
- Smooth hover effects and transitions
- Accessible with proper ARIA labels
- Positioned in header for easy access

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoint-specific layouts** for optimal viewing
- **Touch-friendly interactions** on mobile devices
- **Optimized table scrolling** for small screens
- **Dark theme** works perfectly on all screen sizes

## 🔧 Configuration

### Tailwind CSS
Custom color scheme for financial indicators and dark theme:
- `gain`: Green (#10b981) for positive returns
- `loss`: Red (#ef4444) for negative returns
- `neutral`: Gray (#6b7280) for neutral values
- `dark-bg`: Dark background (#111827)
- `dark-card`: Dark card background (#1f2937)
- `dark-border`: Dark borders (#374151)
- `dark-text`: Dark theme text (#f9fafb)

### TypeScript
- Strict mode enabled
- Path aliases configured (`@/*`)
- Comprehensive type definitions for all data structures
- Theme context types for dark mode

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Static export: `npm run export`

## 🧪 Testing

### Manual Testing
- Portfolio data loading
- Auto-refresh functionality (15s intervals)
- Error handling scenarios
- Responsive design across devices
- **Dark theme switching and persistence**

### API Testing
- Test individual endpoints with Postman/Insomnia
- Verify error handling with invalid symbols
- Check rate limiting and timeout handling

## 🔒 Security Considerations

- **API Rate Limiting**: Implemented in API routes
- **Input Validation**: Symbol parameter validation
- **Error Handling**: No sensitive data exposure
- **CORS**: Configured for cross-origin requests

## 📈 Performance Optimizations

- **Memoization**: React hooks for expensive calculations
- **Lazy Loading**: Components loaded on demand
- **Debounced Updates**: Prevents excessive API calls
- **Caching**: Local state management for data persistence
- **Theme Transitions**: Optimized CSS transitions

## 🐛 Troubleshooting

### Common Issues

1. **API Rate Limits**
   - Yahoo Finance has rate limits
   - Implement exponential backoff if needed

2. **Google Finance Scraping**
   - Selectors may change over time
   - Update CSS selectors in `/api/google/route.ts`

3. **Build Errors**
   - Clear `.next` folder
   - Reinstall dependencies
   - Check Node.js version compatibility

4. **Theme Issues**
   - Clear localStorage if theme gets stuck
   - Check browser console for errors
   - Verify Tailwind dark mode configuration

### Debug Mode
Enable detailed logging in development:
```typescript
// In development
console.log('API Response:', data);
console.log('Portfolio State:', portfolio);
console.log('Theme State:', theme);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for the 8byte.ai technical assignment. All rights reserved.

## 🙏 Acknowledgments

- **Yahoo Finance API** for real-time stock data
- **Next.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for beautiful data visualization

---

**Built with ❤️ for 8byte.ai Technical Assignment**

*Last updated: December 2024*
