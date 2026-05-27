# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application for tracking daily expenses. Users can add transactions, view spending history, see total balance, and visualize spending by category through a pie chart. All data is stored in the browser's Local Storage, so no backend is required.

The app supports custom categories, transaction sorting, and a dark/light theme toggle to give users a flexible and comfortable experience.

## Glossary

- **Transaction**: An expense record with name, amount, category, and timestamp
- **Category**: A label for grouping expenses (default: Food, Transport, Fun)
- **Balance**: Sum of all transaction amounts
- **Theme**: Light or dark visual mode

---

## Requirements

### Requirement 1: Add Transactions

**User Story:** As a user, I want to add expenses through a form so I can track my spending.

#### Acceptance Criteria

1. The form SHALL include fields for item name, amount, and category
2. The category dropdown SHALL include all available categories (default + custom)
3. WHEN the user submits valid data, THE app SHALL create a new transaction and clear the form
4. THE app SHALL reject empty names, non-numeric amounts, and amounts ≤ 0
5. WHEN validation fails, THE app SHALL display an error message

---

### Requirement 2: View Transactions

**User Story:** As a user, I want to see all my transactions so I can review my spending.

#### Acceptance Criteria

1. THE app SHALL display each transaction with name, amount, category, and date
2. THE transaction list SHALL be scrollable when it overflows
3. WHEN no transactions exist, THE app SHALL show "No transactions yet. Add your first expense."
4. WHEN the app loads, THE app SHALL retrieve and display transactions from Local Storage

---

### Requirement 3: Delete Transactions

**User Story:** As a user, I want to delete transactions so I can remove mistakes.

#### Acceptance Criteria

1. EACH transaction SHALL have a delete button
2. WHEN the user confirms deletion, THE app SHALL remove the transaction
3. AFTER deletion, THE app SHALL update Local Storage, balance, and the chart

---

### Requirement 4: Total Balance

**User Story:** As a user, I want to see my total spending so I know how much I've spent.

#### Acceptance Criteria

1. THE app SHALL display the total balance prominently at the top
2. THE balance SHALL equal the sum of all transaction amounts
3. THE balance SHALL update when transactions are added or deleted

---

### Requirement 5: Pie Chart Visualization

**User Story:** As a user, I want to see spending by category so I can understand my habits.

#### Acceptance Criteria

1. THE app SHALL display a pie chart of spending by category
2. THE chart SHALL update when transactions are added or deleted
3. THE chart SHALL use Chart.js
4. EACH category SHALL have a distinct color
5. WHEN no transactions exist, THE chart SHALL show an empty/zero state

---

### Requirement 6: Data Persistence

**User Story:** As a user, I want my data saved so I don't lose it on refresh.

#### Acceptance Criteria

1. THE app SHALL store transactions in Local Storage under `expense_transactions`
2. THE app SHALL store custom categories under `expense_categories`
3. THE app SHALL store category colors under `expense_category_colors`
4. THE app SHALL store the theme preference under `expense_theme`
5. WHEN the page reloads, THE app SHALL restore all stored data

---

### Requirement 7: Transaction Data Structure

**User Story:** As a developer, I want a consistent transaction shape for reliability.

#### Acceptance Criteria

1. EACH transaction SHALL have: `id`, `name`, `amount`, `category`, `createdAt`
2. THE `id` SHALL be unique (format: `txn_${timestamp}_${random}`)
3. THE `amount` SHALL be a positive number
4. THE `createdAt` SHALL be an ISO 8601 timestamp

---

### Requirement 8: Custom Categories

**User Story:** As a user, I want to create my own categories so I can organize expenses my way.

#### Acceptance Criteria

1. THE app SHALL provide a UI to add new categories with a name and color
2. THE app SHALL prevent duplicate category names
3. THE app SHALL allow deleting custom categories that have no transactions
4. THE app SHALL prevent deleting the default categories (Food, Transport, Fun)
5. WHEN a category is added or deleted, THE form dropdown and pie chart SHALL update

---

### Requirement 9: Sort Transactions

**User Story:** As a user, I want to sort my transactions so I can find them easily.

#### Acceptance Criteria

1. THE app SHALL provide a sort dropdown with these options:
   - Newest first (default)
   - Oldest first
   - Highest amount
   - Lowest amount
   - By category (alphabetical)
2. WHEN the user changes the sort option, THE list SHALL re-render immediately

---

### Requirement 10: Dark / Light Theme

**User Story:** As a user, I want a dark mode so I can use the app comfortably at night.

#### Acceptance Criteria

1. THE app SHALL provide a toggle button to switch themes
2. THE app SHALL apply the selected theme to all UI elements
3. THE app SHALL save the theme preference to Local Storage
4. WHEN the page reloads, THE app SHALL restore the previously selected theme

---

### Requirement 11: Tech Stack

**User Story:** As a developer, I want to use vanilla web tech for simplicity.

#### Acceptance Criteria

1. THE app SHALL use HTML, CSS, and vanilla JavaScript only
2. THE app SHALL NOT use frontend frameworks (React, Vue, Angular, etc.)
3. THE app SHALL use Chart.js (via CDN) for the pie chart
4. THE app SHALL NOT require a backend

---

### Requirement 12: File Structure

**User Story:** As a developer, I want a simple folder structure.

#### Acceptance Criteria

1. THE project SHALL have `index.html` in the root
2. THE project SHALL have `css/style.css`
3. THE project SHALL have `js/script.js`

---

### Requirement 13: Responsive Design

**User Story:** As a user, I want the app to work on phone, tablet, and desktop.

#### Acceptance Criteria

1. THE app SHALL use a responsive layout
2. ON mobile, THE layout SHALL stack vertically
3. ON tablet/desktop (≥768px), THE transaction list and chart SHALL display side by side in a grid
4. THE pie chart SHALL resize to fit its container

---

### Requirement 14: Security & Quality

**User Story:** As a user, I want a safe and reliable app.

#### Acceptance Criteria

1. THE app SHALL use `textContent` instead of `innerHTML` for user input to prevent XSS
2. THE app SHALL handle Local Storage errors (quota exceeded, corrupted data) gracefully
3. THE app SHALL provide focus indicators and labels for accessibility
4. THE app SHALL function in modern browsers (Chrome, Firefox, Safari, Edge)
