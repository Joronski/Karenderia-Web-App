// ===================================
// Karenderia Web App - JavaScript
// Integrates all team member features
// Assigned Devs: Student 10 - Dela Torre, Student 11 - Layog, Student 12 - Rosario
// ===================================

// Global State - Student 10 (Dela Torre)
const state = {
    menu: [],
    currentOrder: [],
    orders: [],
    salesData: {
        totalSales: 0,
        orderCount: 0,
        salesByHour: new Array(24).fill(0)
    }
};

let salesChart = null;

// ===================================
// Initialization - Student 10 (Dela Torre)
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
}

// ===================================
// Date Display - Student 10 (Dela Torre)
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
// Menu Management - Student 10 (Dela Torre)
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
            image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            name: 'Sinigang na Baboy',
            price: 95.00,
            description: 'Sour pork soup with tamarind and vegetables',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1604908815346-f41641338f17?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            name: 'Lechon Kawali',
            price: 120.00,
            description: 'Crispy deep-fried pork belly',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop'
        },
        {
            id: 4,
            name: 'Pinakbet',
            price: 70.00,
            description: 'Mixed vegetables with shrimp paste',
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            name: 'Kare-Kare',
            price: 110.00,
            description: 'Oxtail stew in peanut sauce',
            category: 'Main Dish',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            name: 'Bulalo',
            price: 130.00,
            description: 'Beef marrow soup with vegetables',
            category: 'Soup',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
        },
        {
            id: 7,
            name: 'Pancit Canton',
            price: 60.00,
            description: 'Stir-fried noodles with vegetables',
            category: 'Noodles',
            image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop'
        },
        {
            id: 8,
            name: 'Lumpia Shanghai',
            price: 50.00,
            description: 'Filipino-style spring rolls (10 pieces)',
            category: 'Appetizer',
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop'
        },
        {
            id: 9,
            name: 'Halo-Halo',
            price: 75.00,
            description: 'Mixed shaved ice dessert with beans and fruits',
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop'
        },
        {
            id: 10,
            name: 'Turon',
            price: 40.00,
            description: 'Banana spring rolls with jackfruit (3 pieces)',
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1587132117816-5a0b94f9fcaa?w=400&h=300&fit=crop'
        },
        {
            id: 11,
            name: 'Rice',
            price: 15.00,
            description: 'Steamed white rice',
            category: 'Side',
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop'
        },
        {
            id: 12,
            name: 'Softdrinks',
            price: 25.00,
            description: 'Assorted soft drinks',
            category: 'Beverage',
            image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop'
        }
    ];
}

function renderMenu() {
    const menuList = document.getElementById('menuList');
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
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
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
}