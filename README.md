# AFX Mobile Banking - Transaction Viewer

A React Native mobile banking application that displays a list of financial transactions with detail views, offline caching, and error resilience. Built with TypeScript, Zustand, and Expo (bare workflow).

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn or npm
- For Android: Android Studio with an emulator or physical device
- For iOS: Xcode with a simulator or physical device (macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/anuarredza/AFX_Mobile_Banking.git
cd AFX_Mobile_Banking

# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start the Metro bundler
npm start

# Run on Android (emulator or device)
npm run android

# Run on iOS (simulator or device, macOS only)
npm run ios
```

### Running Tests

```bash
npm test
```

## Architecture

### Project Structure

```
src/
  types/index.ts                  # TypeScript interfaces matching BE contract
  services/api.ts                 # Simulated banking API (10% failure rate)
  store/useTransactionStore.ts    # Zustand store with Action Pattern
  utils/formatters.ts             # Date & currency formatting utilities
  components/
    TransactionItem.tsx           # Memoised list row
    SkeletonLoader.tsx            # Animated placeholder UI
    ErrorBanner.tsx               # Dismissible error banner with retry
  screens/
    ListScreen.tsx                # FlatList with pull-to-refresh & empty state
    DetailScreen.tsx              # Transfer details with native Share API
app/
  _layout.tsx                     # Root stack navigator (expo-router)
  index.tsx                       # Route -> ListScreen
  detail.tsx                      # Route -> DetailScreen
__tests__/
  formatters.test.ts              # 14 unit tests for formatting utilities
  api.test.ts                     # 6 unit tests for API response contract
```

### Data Model

The `Transaction` interface mirrors the backend response contract exactly:

```ts
interface Transaction {
  refId: string;          // Unique reference ID (e.g. "123ABC")
  transferDate: string;   // ISO 8601 UTC date (e.g. "2024-10-15T12:34:56Z")
  recipientName: string;  // Name of the recipient (e.g. "John Doe")
  transferName: string;   // Description of the transfer (e.g. "Salary Payment")
  amount: number;         // Positive = incoming, negative = outgoing/refund
}
```

### Key Architectural Decisions

#### 1. Zustand Action Pattern

State management uses [Zustand](https://github.com/pmndrs/zustand) with the **Action Pattern**: the type layer cleanly separates `TransactionState` (data) from `TransactionActions` (behaviour), while the runtime store merges them for ergonomic single-hook access.

This avoids the boilerplate of Redux (action creators, reducers, middleware) while maintaining type safety and testability.

#### 2. Offline Caching via AsyncStorage Persistence

The Zustand store is wrapped with `persist` middleware backed by `AsyncStorage`. Only the `transactions` array is persisted (not transient UI flags like `isLoading` or `error`), so the app:

- Shows cached data immediately on cold start
- Remains useful when the network is unavailable
- Avoids stale UI state after a restart

#### 3. Simulated 10% API Failure Rate

The mock API deliberately fails ~10% of the time to exercise the full error-handling UX:

- **ErrorBanner** appears at the top of the list with Retry / Dismiss actions
- Cached transactions remain visible behind the error
- Pull-to-refresh uses a separate `isRefreshing` flag so the list doesn't flash a skeleton

#### 4. Share Functionality

The detail screen includes a "Share Transaction" button that uses React Native's native `Share` API. Users can share a formatted text summary of the transaction (Reference ID, transfer name, recipient, date, amount) to any installed app (WhatsApp, email, etc.).

#### 5. Performance Optimisations

- **`React.memo`** on `TransactionItem` to prevent unnecessary re-renders
- **`keyExtractor`** and **`getItemLayout`** on FlatList for O(1) scroll performance
- **`useCallback`** on event handlers to maintain referential equality

## Tech Stack

| Layer            | Choice                           |
| ---------------- | -------------------------------- |
| Framework        | React Native 0.81 + Expo SDK 54 |
| Routing          | expo-router (file-based)         |
| State Management | Zustand 5 + persist middleware   |
| Persistence      | AsyncStorage                     |
| Language         | TypeScript (strict mode)         |
| Testing          | Jest (20 tests)                  |

## Screenshots

### Transaction List
The main screen displays all transactions sorted by date (newest first) with:
- Directional indicators (green ↓ for incoming, red ↑ for outgoing)
- Transfer name and recipient on each row
- Colour-coded amounts

### Transaction Detail
Tapping a transaction navigates to a detail screen showing:
- Reference ID
- Transfer date and time
- Recipient name
- Amount with incoming/outgoing badge
- Share button for external sharing
