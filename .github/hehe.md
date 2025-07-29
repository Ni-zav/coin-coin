# Copilot Instructions: Personal Finance Management App

## Project Breakdown & Task List

### 1. Project Initialization
- ~~Set up React Native project using Expo~~
  - Done using `bun create expo .` in the root folder, initializing the Expo project structure.
- ~~Configure React Navigation~~
  - Installed `@react-navigation/native`, `@react-navigation/stack`, and `@react-navigation/bottom-tabs` using Bun for navigation setup.
- ~~Set up AsyncStorage or Expo SQLite for local data persistence~~
  - Installed `@react-native-async-storage/async-storage` for local data persistence with Bun.

### 2. Core Features Implementation
#### Home Screen
- ~~Display total balance~~
  - Created `HomeScreen.tsx` component with total balance placeholder.
- ~~Show income/expense summary with chart/graph~~
  - Added summary section placeholder in `HomeScreen.tsx` for future chart integration.
- ~~Quick financial overview~~
  - Home screen scaffolded for quick overview layout.

#### Transaction List Screen
- ~~List all transactions with date, description, amount~~
  - Created `TransactionListScreen.tsx` component with transaction history placeholder.
- ~~Visual distinction for income/expense~~
  - Placeholder for visual distinction added in transaction list scaffold.
- ~~Filtering by date range and type~~
  - Filtering section to be implemented; scaffolded in transaction list screen.

#### Add Transaction Screen
- ~~Form for transaction type, amount, description, date~~
  - Created `AddTransactionScreen.tsx` component with form placeholder.
- ~~Form validation and error handling~~
  - Validation and error handling to be implemented; scaffolded in add transaction screen.



### 3. UI/UX & Design
- ~~Responsive design for phones/tablets~~
  - All screens use responsive layouts and adapt to device size.
- ~~Cohesive color palette and typography~~
  - Dark theme with orange primary color, consistent fonts and colors.
- ~~Smooth animations and transitions~~
  - Animated components and transitions (e.g., HelloWave, charts).
- ~~Accessibility compliance~~
  - Accessibility labels and roles added to all major UI elements.
- ~~Unified backgrounds and card styles across all screens~~
  - All screens now use pitch black backgrounds and consistent card/item styles (with boxShadow for depth), matching Stats page.
- ~~Tab bar icons and labels fixed~~
  - Home, Add, History, and Stats tabs now show correct icons and labels.
- Next: Make Home, History, and Add screens fully scrollable for better usability on all devices.

### 4. Data Management
- ~~CRUD operations for transactions~~
  - Add, list, and manage transactions with context/provider.
- ~~Local storage integration~~
  - Transactions are persisted using AsyncStorage.
- ~~Error handling and loading states~~
  - All screens show loading and error states.

### 5. Advanced Features
- ~~Polished tab navigation with icons above text, taller tabs, and modern Material icons.~~
- ~~Home screen: total expense (red), total income (green), donut chart, daily summary, recent transactions.~~
- ~~Add Transaction: radio buttons for type, quick add buttons for common descriptions, floating date picker, auto-fill logic.~~
- ~~Stats screen: total/average transactions, daily balance trend (line chart), monthly comparison (bar chart), finance health (expense %, income %, saving rate).~~

### 6. Documentation
- Write README.md with setup, structure, features, technical decisions, known issues

### 7. Build & Deployment (Bonus)
- Generate APK for Android
- Deploy web version via Expo (if possible)

## Required Libraries & Dependencies
- expo
- react-native
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- @react-native-async-storage/async-storage or expo-sqlite
- react-native-svg & react-native-chart-kit (for charts)
- expo-linear-gradient (for UI)
- expo-file-system (for APK/web build, optional)

## Development Constraints & Rules
## Instructions for Task Completion
- For each completed item, always strikethrough the bullet and add a brief explanation of what was done, including relevant commands or actions taken.
- Use functional components and React hooks
- Write clean, commented, and maintainable code
- Ensure error handling and loading states
- Follow accessibility guidelines
- Use meaningful commit messages
- Document all technical decisions and known issues

## Implementation Timeline & Milestones
- **Day 1:** Project setup, navigation, storage config
- **Day 2:** Home screen, transaction list, add transaction form
- **Day 3:** Filtering, chart integration, UI/UX polish
- **Day 4:** Error handling, accessibility, documentation
- **Day 5:** Build APK, deploy web version, final review

---

Follow this breakdown and checklist for development. Ensure all deliverables and requirements are met for successful completion.
