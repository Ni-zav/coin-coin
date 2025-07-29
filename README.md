# Personal Finance Management App

A comprehensive mobile application for personal finance management built with React Native and Expo. Track your income and expenses with beautiful visualizations, filtering capabilities, and data persistence.

## Features

### 🏠 Home Dashboard
- **Balance Overview**: Prominent display of current total balance with visual indicators
- **Income/Expense Summary**: Quick stats with color-coded cards
- **7-Day Trend Chart**: Interactive line chart showing daily balance changes
- **Quick Actions**: Direct access to add transactions and view all transactions

### 📱 Transaction Management
- **Complete CRUD Operations**: Create, read, update, and delete transactions
- **Pull-to-Refresh**: Swipe down to refresh transaction list
- **Empty State Handling**: Elegant display when no transactions exist
- **Transaction Details**: Date, description, amount with visual distinction (green for income, red for expenses)

### ➕ Add Transaction
- **Smart Form Validation**: Real-time validation with error feedback
- **Transaction Type Selector**: Visual toggle between Income/Expense
- **Amount Input**: Numeric keypad with decimal support
- **Description Field**: Optional text input for transaction notes
- **Date Picker**: Auto-populated with current date, manual selection available
- **Live Preview**: See transaction preview before submission
- **Success Feedback**: Confirmation with options to add another or view all

### 🔍 Advanced Filtering
- **Date Range Filter**: From/To date selection with native date picker
- **Transaction Type Filter**: Filter by income, expense, or all transactions
- **Active Filter Display**: Visual indication of applied filters
- **Clear/Reset Options**: Easy filter removal
- **Real-time Results**: Instant filtering without page refresh

### 📊 Statistics & Analytics
- **Monthly Trends**: 6-month bar chart showing income vs expenses
- **Expense Categories**: Pie chart with intelligent categorization
- **Summary Cards**: Total income, expenses, and net balance
- **Quick Stats Grid**: Transaction counts and averages
- **Visual Insights**: Charts powered by react-native-chart-kit

## Technical Implementation

### 🏗️ Architecture
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router with tab-based architecture
- **State Management**: React Context API with custom hooks
- **Data Persistence**: AsyncStorage for local data storage
- **Form Handling**: Controlled components with validation
- **Type Safety**: Full TypeScript implementation

### 📱 Platform Support
- **Primary Target**: Android (fully tested)
- **Secondary Target**: iOS (cross-platform compatible)
- **Web Support**: Expo web compatibility
- **Responsive Design**: Adapts to phone and tablet screen sizes

### 🎨 Design System
- **Color Palette**: 
  - Primary Blue: #2563EB
  - Success Green: #059669  
  - Error Red: #DC2626
  - Warning Orange: #F59E0B
  - Neutral Grays: #111827, #6B7280, #F9FAFB
- **Typography**: Consistent font weights and sizing
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable styled components with proper theming

### 🔒 Data Management
- **Local Storage**: Secure AsyncStorage implementation
- **Data Validation**: Form validation with error handling
- **State Persistence**: Automatic data saving and loading
- **Error Handling**: Graceful error states and user feedback

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Expo CLI installed globally
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on device/simulator**
   - **Android**: Install Expo Go app and scan QR code
   - **iOS**: Install Expo Go app and scan QR code
   - **Web**: Automatically opens in browser

### Building for Production

#### Android APK
```bash
expo build:android
```

#### iOS App Store
```bash
expo build:ios
```

#### Web Deployment
```bash
npm run build:web
```

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx            # Home screen with dashboard
│   │   ├── transactions.tsx     # Transaction list with filtering
│   │   ├── add.tsx             # Add transaction form
│   │   └── stats.tsx           # Statistics and charts
│   ├── _layout.tsx             # Root layout with providers
│   └── +not-found.tsx         # 404 error screen
├── contexts/
│   └── FinanceContext.tsx      # Global state management
├── hooks/
│   └── useFrameworkReady.ts    # Framework initialization
├── components/                 # Reusable UI components
├── assets/                    # Images and static files
└── package.json               # Dependencies and scripts
```

## Key Dependencies

### Core Framework
- `expo`: ~53.0.0 - Expo SDK for React Native development
- `expo-router`: ~5.0.2 - File-based navigation system
- `react`: 19.0.0 - React library
- `react-native`: 0.79.1 - React Native framework

### Navigation & UI
- `@react-navigation/native`: ^7.0.14 - Navigation library
- `@react-navigation/bottom-tabs`: ^7.2.0 - Tab navigation
- `lucide-react-native`: ^0.475.0 - Icon library
- `react-native-safe-area-context`: 5.3.0 - Safe area handling

### Data & Storage
- `@react-native-async-storage/async-storage`: Latest - Local data persistence
- `react-native-chart-kit`: Latest - Chart components
- `@react-native-community/datetimepicker`: Latest - Date picker

### Additional Features
- `react-native-modal`: Latest - Modal components
- `react-native-svg`: 15.11.2 - SVG support for charts
- `expo-haptics`: ~14.1.3 - Haptic feedback

## Usage Examples

### Adding a Transaction
1. Navigate to the "Add" tab
2. Select transaction type (Income/Expense)
3. Enter amount (required, validated)
4. Add optional description
5. Select date (defaults to today)
6. Review in preview section
7. Submit transaction

### Filtering Transactions
1. Go to "Transactions" tab
2. Tap filter icon in header
3. Select transaction type filter
4. Choose date range if needed
5. Apply filters to see results
6. Clear filters when done

### Viewing Statistics
1. Navigate to "Stats" tab
2. Review summary cards for totals
3. Analyze 6-month trend chart
4. Check expense category breakdown
5. View detailed transaction metrics

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Comprehensive error handling

### Testing Strategy
- Component unit tests
- Integration tests for data flow
- E2E testing with Detox
- Manual testing on multiple devices
- Performance monitoring

### Performance Optimization
- Lazy loading for large lists
- Memoization for expensive calculations
- Optimized chart rendering
- Efficient state updates
- Memory leak prevention

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the excellent development platform
- React Native community for comprehensive libraries
- Lucide for beautiful icons
- Chart.js community for visualization components

---

**Built with ❤️ using React Native and Expo**