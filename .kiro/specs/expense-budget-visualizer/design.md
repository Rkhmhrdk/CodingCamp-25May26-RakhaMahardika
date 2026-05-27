# Design Document: Expense & Budget Visualizer

## Overview

A simple client-side web app for tracking expenses, built with vanilla HTML, CSS, and JavaScript. All data lives in Local Storage. Chart.js handles the pie chart. No backend, no build step.

### Design Principles

1. **Vanilla only** — no frameworks, no bundlers
2. **Client-side state** — Local Storage is the source of truth
3. **Responsive grid** — stacked on mobile, side-by-side on desktop
4. **Instant feedback** — every action immediately updates the UI
5. **Customizable** — users can add categories, sort, and switch themes

### Tech Stack

- HTML5 + semantic markup
- CSS3 (custom properties for theming, CSS Grid for layout)
- Vanilla JavaScript (ES6+ classes)
- Chart.js 4.x (via CDN)
- Local Storage API
- Google Fonts (Inter)

---

## Architecture

### Layered Structure

```
┌─────────────────────────────────────┐
│  Presentation                       │
│  HTML + CSS + UIManager / ChartMgr  │
├─────────────────────────────────────┤
│  Application                        │
│  App, TransactionManager,           │
│  ValidationManager, CalcEngine      │
├─────────────────────────────────────┤
│  Data                               │
│  StorageManager → Local Storage     │
└─────────────────────────────────────┘
```

### Data Flow

```
User action → Validation → Update in-memory state
                              ↓
                          Save to Local Storage
                              ↓
                          Refresh UI (list + balance + chart)
```

---

## Components and Interfaces

All components are JavaScript classes in `js/script.js`.

### 1. StorageManager

Handles all Local Storage reads/writes.

**Keys:**
- `expense_transactions` — transaction array
- `expense_categories` — category name array
- `expense_category_colors` — `{ categoryName: hexColor }`
- `expense_theme` — `"light"` or `"dark"`

**Methods:**
- `loadTransactions()` / `saveTransactions(list)`
- `loadCategories()` / `saveCategories(list)`
- `loadTheme()` / `saveTheme(theme)`
- `isStorageAvailable()`

All methods wrap operations in try/catch and return safe defaults on failure.

---

### 2. ValidationManager

Validates form input.

**Rules:**
- Name: non-empty after trim
- Amount: numeric and > 0
- Category: must exist in current category list
- Custom category name: 1–20 chars

Returns `{ isValid: boolean, errors: string[] }`.

---

### 3. CalculationEngine

Pure calculation functions.

- `calculateTotalBalance(transactions)` — sum of amounts
- `calculateCategoryTotals(transactions)` — `{ category: total }`
- `formatCurrency(amount)` — returns `$X.XX`

Empty arrays return 0 / zeroed totals.

---

### 4. TransactionManager

Manages the in-memory transaction list and persistence.

- `initialize()` — loads from storage
- `addTransaction(name, amount, category)` — creates with unique ID and timestamp
- `deleteTransaction(id)`
- `getAllTransactions()`

ID format: `txn_${Date.now()}_${random}`

---

### 5. UIManager

Handles DOM rendering and event wiring.

- `renderTransactionList(transactions, ...)` — sorts, then renders
- `renderBalance(amount)`
- `toggleEmptyState(isEmpty)`
- `showError(msg)` / `clearError()`
- `updateCategorySelect(categories)`
- `renderCategoryList(...)` — for the manage-categories modal
- `applyTheme("light" | "dark")`
- `attachEventListeners(...)` — submit, delete, sort, theme, category add/delete

Uses `textContent` (not `innerHTML`) for any user-supplied data.

**Sort options** (handled in `sortTransactions`):
- `date-desc` (default), `date-asc`, `amount-desc`, `amount-asc`, `category`

---

### 6. ChartManager

Wraps the Chart.js instance.

- `initialize()` — creates a pie chart with current categories
- `updateChart(totals, categories, colors)` — refreshes labels, colors, and data

Default colors: Food `#10b981`, Transport `#3b82f6`, Fun `#f59e0b`. Custom categories use user-picked colors.

---

### 7. App (Controller)

Wires everything together.

**Init flow:**
1. Load categories, colors, theme from storage
2. Apply theme
3. Load transactions
4. Populate category dropdown
5. Initialize chart
6. Render initial UI
7. Attach event listeners

**Handlers:**
- `handleAddTransaction()`
- `handleDeleteTransaction(id)` — with confirm
- `handleSort(option)`
- `handleThemeToggle()`
- `handleAddCategory(name, color)`
- `handleDeleteCategory(name)` — blocked if category is in use

---

## Data Models

### Transaction

```js
{
  id: "txn_1748345678901_k3j2h1g9f",
  name: "Coffee",
  amount: 4.50,
  category: "Food",
  createdAt: "2026-05-27T03:14:38.901Z"
}
```

### Category Colors

```js
{
  "Food": "#10b981",
  "Transport": "#3b82f6",
  "Fun": "#f59e0b",
  "Shopping": "#8b5cf6"   // example custom
}
```

---

## UI Layout

```
┌──────────────────────────────────────────┐
│  Header: Title              🌙 toggle    │
├──────────────────────────────────────────┤
│  Balance Card (gradient)                 │
├──────────────────────────────────────────┤
│  Add Transaction Form                    │
├──────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  │
│  │ Transactions │  │ Spending by      │  │
│  │ [sort ▾]     │  │ Category (chart) │  │
│  │ ...          │  │                  │  │
│  │              │  │ + Manage Cats    │  │
│  └──────────────┘  └──────────────────┘  │
└──────────────────────────────────────────┘
```

- Mobile (<768px): single column, stacked
- Desktop (≥768px): 2-column grid for transactions + chart
- Modal: full-screen overlay with the manage-categories form

---

## Theming

Themes are implemented with CSS custom properties on the `body[data-theme]` attribute.

```css
:root { --bg: #f8fafc; --surface: #fff; --text: #0f172a; ... }
[data-theme="dark"] { --bg: #0b1120; --surface: #111827; --text: #f1f5f9; ... }
```

Toggling sets `data-theme` and saves to Local Storage. All components reference variables, so the switch is instant.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Validation failure | Show error message above submit button |
| Storage quota exceeded | Alert user, keep in-memory data |
| Corrupted JSON in storage | Return empty array, log error |
| Chart.js init failure | Log error, app continues without chart |
| Missing DOM element | Skip operation (optional chaining) |

---

## Security

- **XSS:** all user data rendered via `textContent`
- **No external network:** only Chart.js + Google Fonts CDNs
- **No PII transmitted:** everything stays in the browser

---

## Accessibility

- Semantic HTML (`<form>`, `<label>`, `<button>`)
- `aria-label` on icon-only buttons (theme toggle, delete, close modal)
- Visible focus indicators on all interactive elements
- Sufficient color contrast in both themes
- Keyboard navigable forms and modals

---

## File Structure

```
project/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

---

## Correctness Properties

The pure logic functions have a few invariants worth noting (useful if anyone wants to add property-based tests later).

### Property 1: Balance Equals Sum of Amounts

For any list of transactions, `calculateTotalBalance` returns the sum of all `amount` values.

**Validates: Requirements 4.2**

### Property 2: Category Totals Sum to Balance

The sum of `calculateCategoryTotals(transactions)` across all categories equals `calculateTotalBalance(transactions)`.

**Validates: Requirements 5.1, 5.2**

### Property 3: Validation Rejects Invalid Amounts

Non-numeric amounts and amounts ≤ 0 always fail validation.

**Validates: Requirements 1.4**

### Property 4: Adding Increases Balance

Adding a transaction with amount X increases the balance by exactly X.

**Validates: Requirements 4.3**

### Property 5: Deleting Decreases Balance

Deleting a transaction with amount X decreases the balance by exactly X.

**Validates: Requirements 3.3, 4.3**

### Property 6: Unique Transaction IDs

Every generated transaction ID is unique within a session.

**Validates: Requirements 7.2**

These are documented as invariants — formal property-based tests are optional for this project.

---

## Testing Strategy

This is a UI-driven app, so verification is primarily manual:

**Manual checks:**
- Add and delete transactions across all categories
- Refresh the page to confirm persistence
- Toggle the theme and reload
- Add a custom category, use it, then try to delete it (should be blocked)
- Delete the transactions, then delete the category (should succeed)
- Try each sort option
- Resize the window to verify the responsive grid

**Optional automated tests:**
- Unit tests for `CalculationEngine` and `ValidationManager` (pure functions)
- Integration tests for the add/delete flows using JSDOM
- Property-based tests for the invariants in the previous section

Test framework choice (Jest, Vitest, Mocha) is left to the implementer.
