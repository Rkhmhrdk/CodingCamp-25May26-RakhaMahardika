# Implementation Plan: Expense & Budget Visualizer

## Overview

Vanilla JavaScript expense tracker with Local Storage persistence, pie chart visualization, custom categories, transaction sorting, and dark/light theme. All tasks below reflect the actual scope of the project.

## Tasks

- [x] 1. Set up project structure
  - Create `index.html`, `css/style.css`, `js/script.js`
  - Add Chart.js via CDN and Inter font from Google Fonts
  - Add semantic sections: header, balance, form, transactions, chart, modal
  - Include `<canvas id="expenseChart">` for the pie chart
  - _Requirements: 11, 12_

- [x] 2. Build the data layer (StorageManager)
  - Load and save transactions under `expense_transactions`
  - Load and save categories under `expense_categories`
  - Load and save category colors under `expense_category_colors`
  - Load and save theme preference under `expense_theme`
  - Wrap all operations in try/catch with safe defaults
  - Add `isStorageAvailable()` check
  - _Requirements: 6, 14_

- [x] 3. Build validation (ValidationManager)
  - `validateName` — non-empty after trim
  - `validateAmount` — numeric and > 0
  - `validateCategory` — must exist in current category list
  - `validateCategoryName` — 1–20 characters
  - Return `{ isValid, errors }`
  - _Requirements: 1, 8_

- [x] 4. Build calculations (CalculationEngine)
  - `calculateTotalBalance` — sum of amounts via `reduce`
  - `calculateCategoryTotals` — totals keyed by category
  - `formatCurrency` — `$X.XX` format
  - Handle empty arrays and unknown categories
  - _Requirements: 4, 5_

- [x] 5. Build transaction management (TransactionManager)
  - Constructor takes a StorageManager
  - `initialize()` loads from storage
  - `addTransaction()` creates with unique ID (`txn_${Date.now()}_${random}`) and ISO timestamp
  - `deleteTransaction(id)` removes by ID
  - `getAllTransactions()`
  - Persist after every mutation
  - _Requirements: 1, 3, 7_

- [x] 6. Build UI rendering (UIManager)
  - `renderTransactionList` — name, amount, category badge, delete button
  - `renderBalance` — formatted total
  - `toggleEmptyState` — show/hide empty message
  - `showError` / `clearError`
  - `clearForm`
  - `updateCategorySelect` — refresh dropdown options
  - `renderCategoryList` — modal list with color box and delete
  - `applyTheme` — set `data-theme` on body
  - `sortTransactions` — supports `date-desc`, `date-asc`, `amount-desc`, `amount-asc`, `category`
  - Use `textContent` for user input (XSS prevention)
  - _Requirements: 2, 3, 8, 9, 10, 14_

- [x] 7. Build chart visualization (ChartManager)
  - Pie chart via Chart.js
  - Default colors: Food `#10b981`, Transport `#3b82f6`, Fun `#f59e0b`
  - Custom categories use user-picked colors
  - Legend at bottom, styled tooltip
  - `updateChart` refreshes labels, colors, and data
  - _Requirements: 5, 8_

- [x] 8. Build app controller (App)
  - Instantiate all managers
  - `init()` — load data, apply theme, render UI, init chart, attach listeners
  - `handleAddTransaction()` — validate, add, refresh
  - `handleDeleteTransaction(id)` — confirm, delete, refresh
  - `handleSort()` — re-render list
  - `handleThemeToggle()` — flip theme, save, apply
  - `handleAddCategory(name, color)` — validate, add, save, refresh
  - `handleDeleteCategory(name)` — block if in use or default, otherwise remove
  - `refreshUI()` — update list, balance, chart in one pass
  - _Requirements: 1, 3, 4, 5, 8, 9, 10_

- [x] 9. Style the app (style.css)
  - Use CSS custom properties for theming
  - Light and dark theme variables on `[data-theme]`
  - Responsive grid: stacked on mobile, 2-column on ≥768px
  - Gradient balance card, polished form, pill category badges
  - Modal with backdrop blur for category management
  - Custom-styled sort dropdown and theme toggle
  - Focus rings and hover states for accessibility
  - _Requirements: 10, 13, 14_

- [x] 10. Wire it up and verify
  - Confirm add → list, balance, chart, storage all update
  - Confirm delete → list, balance, chart, storage all update
  - Refresh page → transactions, categories, theme persist
  - Try each sort option
  - Add a custom category with a color, use it, then delete it
  - Toggle theme and reload
  - _Requirements: all_

## Notes

- Vanilla HTML / CSS / JS — no frameworks, no build step
- Chart.js loaded via CDN
- All user input rendered with `textContent` to prevent XSS
- Local Storage operations are wrapped in try/catch
- Tested in Chrome, Firefox, Safari, Edge
- Automated tests are optional for this project; manual verification covers the UI flows

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3", "4"] },
    { "id": 2, "tasks": ["5"] },
    { "id": 3, "tasks": ["6", "7"] },
    { "id": 4, "tasks": ["8"] },
    { "id": 5, "tasks": ["9"] },
    { "id": 6, "tasks": ["10"] }
  ]
}
```
