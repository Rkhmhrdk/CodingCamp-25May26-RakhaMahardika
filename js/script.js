// StorageManager - Handles Local Storage operations
class StorageManager {
    constructor() {
        this.storageKey = 'expense_transactions';
        this.categoriesKey = 'expense_categories';
        this.themeKey = 'expense_theme';
    }

    loadTransactions() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }

    saveTransactions(transactions) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Error saving transactions:', error);
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please delete some transactions.');
            }
            return false;
        }
    }

    loadCategories() {
        try {
            const data = localStorage.getItem(this.categoriesKey);
            if (!data) return ['Food', 'Transport', 'Fun'];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            return ['Food', 'Transport', 'Fun'];
        }
    }

    saveCategories(categories) {
        try {
            localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
            return true;
        } catch (error) {
            console.error('Error saving categories:', error);
            return false;
        }
    }

    loadTheme() {
        try {
            return localStorage.getItem(this.themeKey) || 'light';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'light';
        }
    }

    saveTheme(theme) {
        try {
            localStorage.setItem(this.themeKey, theme);
            return true;
        } catch (error) {
            console.error('Error saving theme:', error);
            return false;
        }
    }

    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// ValidationManager - Handles input validation
class ValidationManager {
    constructor(categories = ['Food', 'Transport', 'Fun']) {
        this.categories = categories;
    }

    updateCategories(categories) {
        this.categories = categories;
    }

    validateTransaction(name, amount, category) {
        const errors = [];

        if (!this.validateName(name)) {
            errors.push('Name cannot be empty');
        }

        if (!this.validateAmount(amount)) {
            errors.push('Amount must be a positive number');
        }

        if (!this.validateCategory(category)) {
            errors.push('Please select a valid category');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    validateName(name) {
        return name && name.trim().length > 0;
    }

    validateAmount(amount) {
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
    }

    validateCategory(category) {
        return this.categories.includes(category);
    }

    validateCategoryName(name) {
        return name && name.trim().length > 0 && name.trim().length <= 20;
    }
}

// CalculationEngine - Handles calculations
class CalculationEngine {
    constructor(categories = ['Food', 'Transport', 'Fun']) {
        this.categories = categories;
    }

    updateCategories(categories) {
        this.categories = categories;
    }

    calculateTotalBalance(transactions) {
        if (!transactions || transactions.length === 0) return 0;
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
    }

    calculateCategoryTotals(transactions) {
        const totals = {};
        
        // Initialize all categories with 0
        this.categories.forEach(category => {
            totals[category] = 0;
        });

        if (!transactions || transactions.length === 0) return totals;

        transactions.forEach(transaction => {
            if (totals.hasOwnProperty(transaction.category)) {
                totals[transaction.category] += transaction.amount;
            } else {
                // Handle legacy categories that might not exist anymore
                totals[transaction.category] = transaction.amount;
            }
        });

        return totals;
    }

    formatCurrency(amount) {
        return `$${amount.toFixed(2)}`;
    }
}

// TransactionManager - Manages transaction operations
class TransactionManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.transactions = [];
    }

    initialize() {
        this.transactions = this.storageManager.loadTransactions();
        return this.transactions;
    }

    addTransaction(name, amount, category) {
        const transaction = {
            id: this.generateUniqueId(),
            name: name.trim(),
            amount: parseFloat(amount),
            category: category,
            createdAt: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.storageManager.saveTransactions(this.transactions);
        return transaction;
    }

    deleteTransaction(id) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions.splice(index, 1);
            this.storageManager.saveTransactions(this.transactions);
            return true;
        }
        return false;
    }

    getAllTransactions() {
        return [...this.transactions];
    }

    getTransactionsByCategory(category) {
        return this.transactions.filter(t => t.category === category);
    }

    generateUniqueId() {
        const random = Math.random().toString(36).substring(2, 9);
        return `txn_${Date.now()}_${random}`;
    }
}

// UIManager - Handles DOM manipulation
class UIManager {
    constructor() {
        this.elements = {
            transactionList: document.getElementById('transactionList'),
            balanceAmount: document.getElementById('balanceAmount'),
            emptyState: document.getElementById('emptyState'),
            errorMessage: document.getElementById('errorMessage'),
            form: document.getElementById('expenseForm'),
            nameInput: document.getElementById('expenseName'),
            amountInput: document.getElementById('expenseAmount'),
            categoryInput: document.getElementById('expenseCategory'),
            sortSelect: document.getElementById('sortSelect'),
            themeToggle: document.getElementById('themeToggle'),
            addCategoryBtn: document.getElementById('addCategoryBtn'),
            categoryModal: document.getElementById('categoryModal'),
            categoryForm: document.getElementById('categoryForm'),
            newCategoryInput: document.getElementById('newCategoryName'),
            categoryColorInput: document.getElementById('categoryColor'),
            closeCategoryModal: document.getElementById('closeCategoryModal'),
            categoryList: document.getElementById('categoryList')
        };
        this.currentSort = 'date-desc';
    }

    renderTransactionList(transactions, onDelete, categoryColors = {}) {
        if (!this.elements.transactionList) return;

        this.elements.transactionList.innerHTML = '';

        // Sort transactions based on current sort option
        const sortedTransactions = this.sortTransactions([...transactions], this.currentSort);

        sortedTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.dataset.id = transaction.id;

            const info = document.createElement('div');
            info.className = 'transaction-info';

            const name = document.createElement('div');
            name.className = 'transaction-name';
            name.textContent = transaction.name;

            const details = document.createElement('div');
            details.className = 'transaction-details';
            
            const badge = document.createElement('span');
            badge.className = `category-badge`;
            badge.textContent = transaction.category;
            
            // Apply custom color if available
            if (categoryColors[transaction.category]) {
                badge.style.backgroundColor = categoryColors[transaction.category];
                badge.style.color = this.getContrastColor(categoryColors[transaction.category]);
            } else {
                badge.className += ` category-${transaction.category}`;
            }
            
            const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            details.textContent = date + ' ';
            details.appendChild(badge);

            info.appendChild(name);
            info.appendChild(details);

            const actions = document.createElement('div');
            actions.className = 'transaction-actions';

            const amount = document.createElement('span');
            amount.className = 'transaction-amount';
            amount.textContent = new CalculationEngine().formatCurrency(transaction.amount);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.setAttribute('aria-label', `Delete ${transaction.name}`);
            deleteBtn.dataset.id = transaction.id;

            actions.appendChild(amount);
            actions.appendChild(deleteBtn);

            item.appendChild(info);
            item.appendChild(actions);

            this.elements.transactionList.appendChild(item);
        });

        this.toggleEmptyState(transactions.length === 0);
    }

    sortTransactions(transactions, sortBy) {
        switch(sortBy) {
            case 'amount-asc':
                return transactions.sort((a, b) => a.amount - b.amount);
            case 'amount-desc':
                return transactions.sort((a, b) => b.amount - a.amount);
            case 'category':
                return transactions.sort((a, b) => a.category.localeCompare(b.category));
            case 'date-asc':
                return transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'date-desc':
            default:
                return transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    renderBalance(balance) {
        if (this.elements.balanceAmount) {
            this.elements.balanceAmount.textContent = new CalculationEngine().formatCurrency(balance);
        }
    }

    toggleEmptyState(isEmpty) {
        if (this.elements.emptyState) {
            if (isEmpty) {
                this.elements.emptyState.classList.remove('hidden');
            } else {
                this.elements.emptyState.classList.add('hidden');
            }
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
    }

    clearError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = '';
        }
    }

    clearForm() {
        if (this.elements.form) {
            this.elements.form.reset();
        }
    }

    attachEventListeners(onSubmit, onDelete, onSort, onThemeToggle, onAddCategory, onDeleteCategory) {
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit();
            });
        }

        if (this.elements.transactionList) {
            this.elements.transactionList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete')) {
                    const id = e.target.dataset.id;
                    if (id) onDelete(id);
                }
            });
        }

        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                onSort(e.target.value);
            });
        }

        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => {
                onThemeToggle();
            });
        }

        if (this.elements.addCategoryBtn) {
            this.elements.addCategoryBtn.addEventListener('click', () => {
                this.showCategoryModal();
            });
        }

        if (this.elements.closeCategoryModal) {
            this.elements.closeCategoryModal.addEventListener('click', () => {
                this.hideCategoryModal();
            });
        }

        if (this.elements.categoryModal) {
            this.elements.categoryModal.addEventListener('click', (e) => {
                if (e.target === this.elements.categoryModal) {
                    this.hideCategoryModal();
                }
            });
        }

        if (this.elements.categoryForm) {
            this.elements.categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = this.elements.newCategoryInput?.value;
                const color = this.elements.categoryColorInput?.value;
                if (name && color) {
                    onAddCategory(name, color);
                }
            });
        }

        if (this.elements.categoryList) {
            this.elements.categoryList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-category')) {
                    const category = e.target.dataset.category;
                    if (category) onDeleteCategory(category);
                }
            });
        }
    }

    getFormValues() {
        return {
            name: this.elements.nameInput?.value || '',
            amount: this.elements.amountInput?.value || '',
            category: this.elements.categoryInput?.value || ''
        };
    }

    updateCategorySelect(categories) {
        if (!this.elements.categoryInput) return;
        
        const currentValue = this.elements.categoryInput.value;
        this.elements.categoryInput.innerHTML = '<option value="">Select a category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.elements.categoryInput.appendChild(option);
        });

        // Restore previous selection if still valid
        if (categories.includes(currentValue)) {
            this.elements.categoryInput.value = currentValue;
        }
    }

    renderCategoryList(categories, categoryColors, onDelete) {
        if (!this.elements.categoryList) return;

        this.elements.categoryList.innerHTML = '';

        categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'category-color-box';
            colorBox.style.backgroundColor = categoryColors[category] || '#ccc';

            const name = document.createElement('span');
            name.className = 'category-item-name';
            name.textContent = category;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-category';
            deleteBtn.textContent = '×';
            deleteBtn.dataset.category = category;
            deleteBtn.setAttribute('aria-label', `Delete ${category} category`);

            // Don't allow deleting default categories if they have transactions
            const isDefault = ['Food', 'Transport', 'Fun'].includes(category);
            if (isDefault) {
                deleteBtn.disabled = true;
                deleteBtn.style.opacity = '0.3';
                deleteBtn.style.cursor = 'not-allowed';
            }

            item.appendChild(colorBox);
            item.appendChild(name);
            item.appendChild(deleteBtn);

            this.elements.categoryList.appendChild(item);
        });
    }

    showCategoryModal() {
        if (this.elements.categoryModal) {
            this.elements.categoryModal.classList.add('show');
        }
    }

    hideCategoryModal() {
        if (this.elements.categoryModal) {
            this.elements.categoryModal.classList.remove('show');
        }
        if (this.elements.categoryForm) {
            this.elements.categoryForm.reset();
        }
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (this.elements.themeToggle) {
            const icon = this.elements.themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }
    }
}

// ChartManager - Handles Chart.js visualization
class ChartManager {
    constructor(canvasElement, categories = ['Food', 'Transport', 'Fun'], categoryColors = {}) {
        this.canvas = canvasElement;
        this.chart = null;
        this.categories = categories;
        this.categoryColors = categoryColors;
        this.defaultColors = {
            'Food': '#10b981',
            'Transport': '#3b82f6',
            'Fun': '#f59e0b'
        };
    }

    initialize() {
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        try {
            const ctx = this.canvas.getContext('2d');
            const colors = this.categories.map(cat => 
                this.categoryColors[cat] || this.defaultColors[cat] || this.generateRandomColor()
            );

            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: this.categories,
                    datasets: [{
                        data: new Array(this.categories.length).fill(0),
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 16,
                                font: {
                                    size: 12,
                                    family: "'Inter', sans-serif",
                                    weight: '500'
                                },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8,
                                boxHeight: 8
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            padding: 12,
                            cornerRadius: 8,
                            titleFont: { family: "'Inter', sans-serif", size: 13, weight: '600' },
                            bodyFont: { family: "'Inter', sans-serif", size: 12 },
                            displayColors: true,
                            boxPadding: 4,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return `${label}: $${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }

    updateChart(categoryTotals, categories, categoryColors) {
        if (!this.chart) return;

        try {
            // Update categories if changed
            if (categories) {
                this.categories = categories;
                this.categoryColors = categoryColors || this.categoryColors;
                
                const colors = this.categories.map(cat => 
                    this.categoryColors[cat] || this.defaultColors[cat] || this.generateRandomColor()
                );

                this.chart.data.labels = this.categories;
                this.chart.data.datasets[0].backgroundColor = colors;
            }

            // Update data
            this.chart.data.datasets[0].data = this.categories.map(cat => categoryTotals[cat] || 0);
            this.chart.update();
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 65%, 55%)`;
    }
}

// App - Main application controller
class App {
    constructor() {
        this.storageManager = new StorageManager();
        this.categories = this.storageManager.loadCategories();
        this.categoryColors = this.loadCategoryColors();
        this.theme = this.storageManager.loadTheme();
        
        this.transactionManager = new TransactionManager(this.storageManager);
        this.validationManager = new ValidationManager(this.categories);
        this.calculationEngine = new CalculationEngine(this.categories);
        this.uiManager = new UIManager();
        this.chartManager = new ChartManager(
            document.getElementById('expenseChart'),
            this.categories,
            this.categoryColors
        );
    }

    loadCategoryColors() {
        try {
            const data = localStorage.getItem('expense_category_colors');
            if (!data) {
                return {
                    'Food': '#2ecc71',
                    'Transport': '#3498db',
                    'Fun': '#f39c12'
                };
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading category colors:', error);
            return {
                'Food': '#2ecc71',
                'Transport': '#3498db',
                'Fun': '#f39c12'
            };
        }
    }

    saveCategoryColors() {
        try {
            localStorage.setItem('expense_category_colors', JSON.stringify(this.categoryColors));
        } catch (error) {
            console.error('Error saving category colors:', error);
        }
    }

    init() {
        // Check storage availability
        if (!this.storageManager.isStorageAvailable()) {
            alert('Local Storage is not available. The app may not work correctly.');
        }

        // Apply saved theme
        this.uiManager.applyTheme(this.theme);

        // Load transactions
        this.transactionManager.initialize();

        // Update category select
        this.uiManager.updateCategorySelect(this.categories);

        // Initialize chart
        this.chartManager.initialize();

        // Render initial UI
        this.refreshUI();

        // Attach event listeners
        this.uiManager.attachEventListeners(
            () => this.handleAddTransaction(),
            (id) => this.handleDeleteTransaction(id),
            (sortBy) => this.handleSort(sortBy),
            () => this.handleThemeToggle(),
            (name, color) => this.handleAddCategory(name, color),
            (category) => this.handleDeleteCategory(category)
        );

        // Render category list
        this.uiManager.renderCategoryList(this.categories, this.categoryColors, (cat) => this.handleDeleteCategory(cat));
    }

    handleAddTransaction() {
        const { name, amount, category } = this.uiManager.getFormValues();

        // Validate input
        const validation = this.validationManager.validateTransaction(name, amount, category);
        
        if (!validation.isValid) {
            this.uiManager.showError(validation.errors.join('. '));
            return;
        }

        // Clear any previous errors
        this.uiManager.clearError();

        // Add transaction
        this.transactionManager.addTransaction(name, amount, category);

        // Clear form
        this.uiManager.clearForm();

        // Refresh UI
        this.refreshUI();
    }

    handleDeleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactionManager.deleteTransaction(id);
            this.refreshUI();
        }
    }

    handleSort(sortBy) {
        this.refreshUI();
    }

    handleThemeToggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.storageManager.saveTheme(this.theme);
        this.uiManager.applyTheme(this.theme);
    }

    handleAddCategory(name, color) {
        const trimmedName = name.trim();
        
        if (!this.validationManager.validateCategoryName(trimmedName)) {
            alert('Category name must be between 1 and 20 characters');
            return;
        }

        if (this.categories.includes(trimmedName)) {
            alert('Category already exists');
            return;
        }

        // Add category
        this.categories.push(trimmedName);
        this.categoryColors[trimmedName] = color;

        // Save to storage
        this.storageManager.saveCategories(this.categories);
        this.saveCategoryColors();

        // Update all components
        this.validationManager.updateCategories(this.categories);
        this.calculationEngine.updateCategories(this.categories);
        this.uiManager.updateCategorySelect(this.categories);
        this.uiManager.renderCategoryList(this.categories, this.categoryColors, (cat) => this.handleDeleteCategory(cat));

        // Hide modal
        this.uiManager.hideCategoryModal();

        // Refresh UI
        this.refreshUI();
    }

    handleDeleteCategory(category) {
        // Check if category is in use
        const transactions = this.transactionManager.getAllTransactions();
        const inUse = transactions.some(t => t.category === category);

        if (inUse) {
            alert(`Cannot delete "${category}" because it has transactions. Delete those transactions first.`);
            return;
        }

        if (!confirm(`Are you sure you want to delete the "${category}" category?`)) {
            return;
        }

        // Remove category
        this.categories = this.categories.filter(c => c !== category);
        delete this.categoryColors[category];

        // Save to storage
        this.storageManager.saveCategories(this.categories);
        this.saveCategoryColors();

        // Update all components
        this.validationManager.updateCategories(this.categories);
        this.calculationEngine.updateCategories(this.categories);
        this.uiManager.updateCategorySelect(this.categories);
        this.uiManager.renderCategoryList(this.categories, this.categoryColors, (cat) => this.handleDeleteCategory(cat));

        // Refresh UI
        this.refreshUI();
    }

    refreshUI() {
        const transactions = this.transactionManager.getAllTransactions();
        const balance = this.calculationEngine.calculateTotalBalance(transactions);
        const categoryTotals = this.calculationEngine.calculateCategoryTotals(transactions);

        // Update UI
        this.uiManager.renderTransactionList(transactions, (id) => this.handleDeleteTransaction(id), this.categoryColors);
        this.uiManager.renderBalance(balance);
        this.chartManager.updateChart(categoryTotals, this.categories, this.categoryColors);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
