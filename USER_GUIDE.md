# User Guide

A quick walkthrough of how to use the Expense & Budget Visualizer.

## Add a transaction

1. Type the item name (e.g., "Coffee")
2. Enter the amount (e.g., `4.50`)
3. Pick a category
4. Click **Add Transaction**

The transaction appears in the list, the total balance updates, and the chart refreshes.

## Delete a transaction

Click the **Delete** button on any transaction and confirm. Balance and chart update immediately.

## Sort transactions

Use the dropdown in the **Transactions** section header:

- Newest First (default)
- Oldest First
- Highest Amount
- Lowest Amount
- By Category

## Custom categories

Click **+ Manage Categories** below the chart.

**Add:** type a name (max 20 chars), pick a color, click **Add Category**.

**Delete:** click the **×** next to a custom category. You can't delete:
- The defaults (Food, Transport, Fun)
- Any category that still has transactions

## Theme toggle

Click the moon/sun icon in the top-right corner to switch between light and dark mode. Your choice is saved.

## What gets saved

Everything is stored in your browser's Local Storage:

- Transactions
- Custom categories and their colors
- Theme preference

Nothing is sent to a server.

## Reset everything

Open DevTools → Application → Local Storage → delete the keys starting with `expense_`, then refresh.

## Troubleshooting

| Problem | Fix |
|---|---|
| Chart isn't showing | Check your internet (Chart.js loads from a CDN) |
| Theme not saving | Make sure Local Storage isn't blocked |
| Can't delete a category | Delete its transactions first, or it's a default |
