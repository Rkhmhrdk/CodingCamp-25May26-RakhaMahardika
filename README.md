# Expense & Budget Visualizer

A simple expense tracker built with vanilla HTML, CSS, and JavaScript. Add transactions, see your total balance, and visualize spending by category — all stored locally in your browser.

## Features

- Add, view, and delete transactions
- Custom categories with color picker
- Sort by date, amount, or category
- Light and dark theme
- Pie chart of spending by category
- Saves to Local Storage (no backend needed)
- Responsive: mobile, tablet, desktop

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- [Chart.js](https://www.chartjs.org/) for the pie chart
- Local Storage API for persistence
- Inter font from Google Fonts

## Project Structure

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── README.md
└── USER_GUIDE.md
```

## Getting Started

Just open `index.html` in any modern browser. There's no build step.

## Architecture

The JavaScript is organized into small classes inside `js/script.js`:

| Class | Responsibility |
|---|---|
| `StorageManager` | Read/write Local Storage |
| `ValidationManager` | Validate form input |
| `CalculationEngine` | Compute balance and category totals |
| `TransactionManager` | Add/delete/list transactions |
| `UIManager` | Render the DOM, handle events |
| `ChartManager` | Manage the Chart.js pie chart |
| `App` | Wires everything together |

## Browser Support

Chrome, Firefox, Safari, and Edge (latest versions).

