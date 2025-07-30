# Coin-Coin

A modern, mobile-first personal finance management app built with Expo, React Native, and TypeScript. Track your income, expenses, and balances with a beautiful, responsive UI and smooth navigation.

## Features

- **Home Screen**: View your total balance, income, and expenses at a glance.
- **Transaction List**: Browse all transactions with date, description, and amount. Filter by type and date range.
- **Add Transaction**: Quickly add new income or expense entries with validation.
- **Charts**: Visualize your financial summary (chart integration ready).
- **Persistent Storage**: All data is stored locally using AsyncStorage.
- **Modern UI**: Dark theme, custom icons, and smooth transitions.
- **Responsive**: Works on phones and tablets.

## Tech Stack

- [Expo](https://expo.dev/) (React Native framework)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [expo-router](https://expo.github.io/router/) (file-based navigation)
- [@react-navigation](https://reactnavigation.org/) (navigation)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local storage)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) (charts)
- [Lucide Icons](https://lucide.dev/icons/) (icons)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Bun](https://bun.sh/) or [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```sh
  npm install -g expo-cli
  ```

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Ni-zav/coin-coin.git
   cd coin-coin
   ```
2. Install dependencies:
   ```sh
   bun install
   # or
   npm install
   # or
   yarn install
   ```

### Running Locally
- Start the Expo development server:
  ```sh
  bun run dev
  # or
  npm run dev
  # or
  yarn dev
  ```
- Scan the QR code with the Expo Go app or run on an emulator/simulator.

### Building for Web
- Export a static web build:
  ```sh
  bun run build:web
  # or
  npm run build:web
  # or
  yarn build:web
  ```
- The output will be in the `web-build/` directory.

## Project Structure

```
app/                # App entry, screens, and navigation
  _layout.tsx       # Root layout
  (tabs)/           # Tab navigation screens
    _layout.tsx
    index.tsx       # Home screen
    transactions.tsx
    add.tsx
components/         # Reusable UI components
hooks/              # Custom React hooks
services/           # Business logic and data services
assets/             # Images and static assets
types/              # TypeScript type definitions
```

## License

MIT
