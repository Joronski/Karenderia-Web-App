// ===================================
// Karenderia Web App - JavaScript
// Integrates all team member features
// ===================================

// Global State
const state = {
    menu: [],
    currentOrder: [],
    orders: [],
    salesData: {
        totalSales: 0,
        orderCount: 0,
        salesByHour: new Array(24).fill(0)
    },
    currentView: 'menu'
};

let salesChart = null;

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateDate();
    loadMenu();
    loadFromLocalStorage();
    initializeChart();
    renderMenu();
    renderCurrentOrder();
    updateSalesDisplay();
    updateOrderBadge();
}

// ===================================
// View Switching
// ===================================

function switchView(viewName) {
    // Update state
    state.currentView = viewName;
    
    // Hide all views
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const viewMap = {
        'menu': 'menuView',
        'orders': 'ordersView',
        'sales': 'salesView'
    };
    
    const selectedView = document.getElementById(viewMap[viewName]);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update navigation buttons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[data-view="${viewName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Update chart if switching to sales view
    if (viewName === 'sales' && salesChart) {
        setTimeout(() => {
            salesChart.resize();
            salesChart.update();
        }, 100);
    }
}

// Export switchView to global scope
window.switchView = switchView;

// ===================================
// Order Badge Update
// ===================================

function updateOrderBadge() {
    const badge = document.getElementById('orderBadge');
    const itemCount = state.currentOrder.reduce((sum, item) => sum + item.quantity, 0);
    
    if (badge) {
        badge.textContent = itemCount;
        if (itemCount > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ===================================
// Date Display
// ===================================

function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    const isoDate = now.toISOString().split('T')[0];
    
    dateElement.textContent = formattedDate;
    dateElement.setAttribute('datetime', isoDate);
}

// ===================================
// Menu Management (Student 2)
// ===================================

function loadMenu() {
    // Sample menu items - Student 2's contribution
    state.menu = [
        {
            id: 1,
            name: 'Adobong Manok',
            price: 85.00,
            description: 'Classic Filipino chicken adobo with soy sauce and vinegar',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 2,
            name: 'Sinigang na Baboy',
            price: 95.00,
            description: 'Sour pork soup with tamarind and vegetables',
            category: 'Main Dish',
            image: 'https://speedyrecipe.com/wp-content/uploads/2022/09/how-to-cook-sinigang-na-baboy.jpg'
        },
        {
            id: 3,
            name: 'Lechon Kawali',
            price: 120.00,
            description: 'Crispy deep-fried pork belly',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 4,
            name: 'Pinakbet',
            price: 70.00,
            description: 'Mixed vegetables with shrimp paste',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 5,
            name: 'Kare-Kare',
            price: 110.00,
            description: 'Oxtail stew in peanut sauce',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 6,
            name: 'Bulalo',
            price: 130.00,
            description: 'Beef marrow soup with vegetables',
            category: 'Soup',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 7,
            name: 'Pancit Canton',
            price: 60.00,
            description: 'Stir-fried noodles with vegetables',
            category: 'Noodles',
            image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 8,
            name: 'Lumpia Shanghai',
            price: 50.00,
            description: 'Filipino-style spring rolls (10 pieces)',
            category: 'Appetizer',
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 9,
            name: 'Halo-Halo',
            price: 75.00,
            description: 'Mixed shaved ice dessert with beans and fruits',
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 10,
            name: 'Turon',
            price: 40.00,
            description: 'Banana spring rolls with jackfruit (3 pieces)',
            category: 'Dessert',
            image: 'https://i0.wp.com/aeslinbakes.com/wp-content/uploads/2020/08/Turon-3-scaled.jpg?w=2048&ssl=1'
        },
        {
            id: 11,
            name: 'Rice',
            price: 15.00,
            description: 'Steamed white rice',
            category: 'Side',
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop&auto=format'
        },
        {
            id: 12,
            name: 'Softdrinks (Coca-Cola, Sprite, Royal)',
            price: 25.00,
            description: 'Assorted soft drinks',
            category: 'Beverage',
            image: 'https://thumbs.dreamstime.com/b/bottles-assorted-global-soft-drinks-poznan-poland-jan-drink-market-dominated-brands-few-multinational-companies-founded-84848646.jpg'
        }
    ];
}

function renderMenu() {
    const menuList = document.getElementById('menuList');
    if (!menuList) return;
    
    menuList.innerHTML = '';
    
    state.menu.forEach(item => {
        const menuItem = document.createElement('button');
        menuItem.className = 'menu-item';
        menuItem.type = 'button';
        menuItem.setAttribute('aria-label', `Add ${item.name} to order - ${item.price} pesos`);
        menuItem.onclick = () => addToOrder(item.id);
        
        menuItem.innerHTML = `
            <div class="menu-item-image-container">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     class="menu-item-image"
                     crossorigin="anonymous"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/0d7a4f/ffffff?text=${encodeURIComponent(item.name)}';">
                <span class="menu-item-category">${item.category}</span>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">₱${item.price.toFixed(2)}</div>
                </div>
                <div class="menu-item-description">${item.description}</div>
            </div>
        `;
        
        menuList.appendChild(menuItem);
    });
    
    // Log confirmation that menu was rendered
    console.log(`Menu rendered with ${state.menu.length} items`);
}

// ===================================
// Order Management (Student 3)
// ===================================

function addToOrder(itemId) {
    const menuItem = state.menu.find(item => item.id === itemId);
    const existingItem = state.currentOrder.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.currentOrder.push({
            ...menuItem,
            quantity: 1
        });
    }
    
    renderCurrentOrder();
    highlightMenuItem(itemId);
    updateOrderBadge();
}

function removeFromOrder(itemId) {
    state.currentOrder = state.currentOrder.filter(item => item.id !== itemId);
    renderCurrentOrder();
    unhighlightMenuItem(itemId);
    updateOrderBadge();
}

function updateQuantity(itemId, change) {
    const item = state.currentOrder.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromOrder(itemId);
        } else {
            renderCurrentOrder();
            updateOrderBadge();
        }
    }
}

function renderCurrentOrder() {
    const orderItems = document.getElementById('orderItems');
    const orderSummary = document.getElementById('orderSummary');
    const orderActions = document.getElementById('orderActions');
    const emptyState = document.querySelector('.order-empty-state');
    
    if (state.currentOrder.length === 0) {
        orderItems.innerHTML = '';
        emptyState.style.display = 'block';
        orderSummary.style.display = 'none';
        orderActions.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    orderSummary.style.display = 'block';
    orderActions.style.display = 'flex';
    
    orderItems.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;
    
    state.currentOrder.forEach(item => {
        const orderItem = document.createElement('li');
        orderItem.className = 'order-item';
        
        const itemTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;
        
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">₱${item.price.toFixed(2)} × ${item.quantity} = ₱${itemTotal.toFixed(2)}</div>
            </div>
            <div class="order-item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">-</button>
                    <span class="qty-display" aria-label="Quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                </div>
                <button class="btn-remove" onclick="removeFromOrder(${item.id})" aria-label="Remove ${item.name} from order">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        orderItems.appendChild(orderItem);
    });
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = `₱${totalPrice.toFixed(2)}`;
}

function highlightMenuItem(itemId) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        if (state.menu[index].id === itemId) {
            item.classList.add('selected');
        }
    });
}

function unhighlightMenuItem(itemId) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        if (state.menu[index].id === itemId) {
            item.classList.remove('selected');
        }
    });
}

function clearOrder() {
    state.currentOrder = [];
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('selected');
    });
    renderCurrentOrder();
    updateOrderBadge();
}

function completeOrder() {
    if (state.currentOrder.length === 0) return;
    
    const totalPrice = state.currentOrder.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
    );
    
    const order = {
        id: state.orders.length + 1,
        items: [...state.currentOrder],
        total: totalPrice,
        timestamp: new Date(),
        time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    
    state.orders.push(order);
    
    // Update sales data (Student 4)
    state.salesData.totalSales += totalPrice;
    state.salesData.orderCount += 1;
    
    const hour = new Date().getHours();
    state.salesData.salesByHour[hour] += totalPrice;
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Show completion animation
    showCompletionAnimation(order);
    
    // Clear current order
    clearOrder();
    
    // Update displays
    updateSalesDisplay();
    updateChart();
    renderOrderHistory();
    updateOrderBadge();
    
    // Switch to sales view after a delay
    setTimeout(() => {
        switchView('sales');
    }, 2500);
}

// ===================================
// Daily Sales Summary (Student 4)
// ===================================

function updateSalesDisplay() {
    document.getElementById('totalSales').textContent = 
        `₱${state.salesData.totalSales.toFixed(2)}`;
    
    document.getElementById('totalOrders').textContent = 
        state.salesData.orderCount;
    
    const averageOrder = state.salesData.orderCount > 0 
        ? state.salesData.totalSales / state.salesData.orderCount 
        : 0;
    
    document.getElementById('averageOrder').textContent = 
        `₱${averageOrder.toFixed(2)}`;
}

function renderOrderHistory() {
    const historyList = document.getElementById('orderHistory');
    
    if (state.orders.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 8v4l3 3"/>
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                <p>No orders yet today</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    // Show last 5 orders
    const recentOrders = state.orders.slice(-5).reverse();
    
    recentOrders.forEach(order => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-order-number">Order #${order.id}</span>
                <span class="history-time">${order.time}</span>
            </div>
            <div style="color: var(--gray-600); font-size: 0.9rem; margin-bottom: 0.5rem;">
                ${itemCount} item${itemCount !== 1 ? 's' : ''}
            </div>
            <div class="history-total">₱${order.total.toFixed(2)}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function initializeChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const period = i < 12 ? 'AM' : 'PM';
        return `${hour}${period}`;
    });
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Sales',
                data: state.salesData.salesByHour,
                backgroundColor: 'rgba(13, 122, 79, 0.1)',
                borderColor: 'rgba(13, 122, 79, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(45, 212, 161, 1)',
                pointBorderColor: 'rgba(13, 122, 79, 1)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 122, 79, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    borderColor: 'rgba(45, 212, 161, 1)',
                    borderWidth: 2,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₱' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₱' + value;
                        },
                        color: '#4b5563'
                    },
                    grid: {
                        color: 'rgba(229, 231, 235, 0.5)'
                    }
                },
                x: {
                    ticks: {
                        color: '#4b5563',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (salesChart) {
        salesChart.data.datasets[0].data = state.salesData.salesByHour;
        salesChart.update();
    }
}

// ===================================
// Completion Animation
// ===================================

function showCompletionAnimation(order) {
    const modal = document.getElementById('completionModal');
    const message = document.getElementById('completionMessage');
    
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    message.textContent = `Order #${order.id} • ${itemCount} items • ₱${order.total.toFixed(2)}`;
    
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 2500);
}

// ===================================
// Local Storage Management
// ===================================

function saveToLocalStorage() {
    localStorage.setItem('karenderia_orders', JSON.stringify(state.orders));
    localStorage.setItem('karenderia_sales', JSON.stringify(state.salesData));
}

function loadFromLocalStorage() {
    const savedOrders = localStorage.getItem('karenderia_orders');
    const savedSales = localStorage.getItem('karenderia_sales');
    
    if (savedOrders) {
        state.orders = JSON.parse(savedOrders);
        // Convert timestamp strings back to Date objects
        state.orders.forEach(order => {
            order.timestamp = new Date(order.timestamp);
        });
    }
    
    if (savedSales) {
        state.salesData = JSON.parse(savedSales);
    }
    
    renderOrderHistory();
}

function resetApp() {
    if (confirm('Are you sure you want to reset all data for today? This action cannot be undone.')) {
        state.orders = [];
        state.currentOrder = [];
        state.salesData = {
            totalSales: 0,
            orderCount: 0,
            salesByHour: new Array(24).fill(0)
        };
        
        localStorage.removeItem('karenderia_orders');
        localStorage.removeItem('karenderia_sales');
        
        clearOrder();
        updateSalesDisplay();
        renderOrderHistory();
        updateChart();
        
        alert('All data has been reset successfully!');
    }
}

// ===================================
// Utility Functions
// ===================================

function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Export functions to global scope
window.addToOrder = addToOrder;
window.removeFromOrder = removeFromOrder;
window.updateQuantity = updateQuantity;
window.clearOrder = clearOrder;
window.completeOrder = completeOrder;
window.resetApp = resetApp;