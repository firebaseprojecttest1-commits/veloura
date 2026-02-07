/**
 * VELOURA E-Commerce Landing Page
 * Object-Oriented Programming Approach
 * Modern JavaScript ES6+ Classes
 */

// ==================== BASE CLASSES ====================

/**
 * BaseComponent - Base class for all UI components
 */
class BaseComponent {
    constructor(name) {
        this.name = name;
        this.state = {};
        this.observers = [];
    }

    /**
     * Subscribe to component state changes
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    /**
     * Notify all observers of state changes
     */
    notify() {
        this.observers.forEach(observer => observer(this.state));
    }

    /**
     * Update component state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Log component info
     */
    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}

/**
 * EventHandler - Base class for handling events
 */
class EventHandler {
    constructor() {
        this.eventListeners = {};
    }

    /**
     * Register event listener
     */
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }

    /**
     * Remove event listener
     */
    off(eventName, callback) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName] = this.eventListeners[eventName].filter(
                cb => cb !== callback
            );
        }
    }

    /**
     * Emit event
     */
    emit(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                callback(data);
            });
        }
    }
}

// ==================== SHOPPING CART ====================

/**
 * Cart - Shopping cart functionality
 */
class Cart extends BaseComponent {
    constructor() {
        super('Cart');
        this.items = [];
        this.totalPrice = 0;
    }

    /**
     * Add item to cart
     */
    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.calculateTotal();
        this.setState({ items: this.items, totalPrice: this.totalPrice });
        this.log(`Added ${product.name} to cart`);
    }

    /**
     * Remove item from cart
     */
    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.calculateTotal();
        this.setState({ items: this.items, totalPrice: this.totalPrice });
        this.log(`Removed ${productName} from cart`);
    }

    /**
     * Calculate total price
     */
    calculateTotal() {
        this.totalPrice = this.items.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    }

    /**
     * Get cart items count
     */
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.items = [];
        this.totalPrice = 0;
        this.setState({ items: [], totalPrice: 0 });
        this.log('Cart cleared');
    }

    /**
     * Get cart data
     */
    getCartData() {
        return {
            items: this.items,
            totalPrice: this.totalPrice,
            itemCount: this.getItemCount()
        };
    }
}

// ==================== NOTIFICATION SYSTEM ====================

/**
 * Notification - Handles user notifications
 */
class Notification extends BaseComponent {
    constructor() {
        super('Notification');
        this.notifications = [];
    }

    /**
     * Show notification
     */
    show(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type, // success, error, warning, info
            timestamp: new Date()
        };

        this.notifications.push(notification);
        this.setState({ notifications: this.notifications });

        // Show toast in DOM
        this.displayToast(notification, duration);

        this.log(`${type.toUpperCase()}: ${message}`);

        // Auto remove after duration
        setTimeout(() => this.remove(notification.id), duration);
    }

    /**
     * Display toast notification in DOM
     */
    displayToast(notification, duration) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.innerHTML = `
            <div class="toast-container">
                <span class="toast-icon">
                    ${this.getIcon(notification.type)}
                </span>
                <span class="toast-message">${notification.message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Get icon based on notification type
     */
    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-warning"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * Remove notification
     */
    remove(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.setState({ notifications: this.notifications });
    }

    /**
     * Success notification shortcut
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    }

    /**
     * Error notification shortcut
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    }

    /**
     * Warning notification shortcut
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    /**
     * Info notification shortcut
     */
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// ==================== ANALYTICS ====================

/**
 * Analytics - Track user interactions
 */
class Analytics extends BaseComponent {
    constructor() {
        super('Analytics');
        this.events = [];
        this.sessionStart = new Date();
    }

    /**
     * Track event
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date(),
            sessionDuration: Date.now() - this.sessionStart.getTime()
        };

        this.events.push(event);
        this.setState({ events: this.events });
        this.log(`Event tracked: ${eventName}`);
    }

    /**
     * Track page view
     */
    trackPageView(section) {
        this.trackEvent('page_view', { section });
    }

    /**
     * Track product interaction
     */
    trackProductInteraction(productName, action) {
        this.trackEvent('product_interaction', { productName, action });
    }

    /**
     * Get analytics report
     */
    getReport() {
        return {
            totalEvents: this.events.length,
            sessionDuration: Date.now() - this.sessionStart.getTime(),
            events: this.events
        };
    }
}

// ==================== FORM VALIDATOR ====================

/**
 * FormValidator - Validate form inputs
 */
class FormValidator extends BaseComponent {
    constructor() {
        super('FormValidator');
        this.rules = {};
    }

    /**
     * Add validation rule
     */
    addRule(fieldName, rule) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push(rule);
    }

    /**
     * Validate email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate required field
     */
    validateRequired(value) {
        return value.trim().length > 0;
    }

    /**
     * Validate minimum length
     */
    validateMinLength(value, minLength) {
        return value.length >= minLength;
    }

    /**
     * Validate form data
     */
    validate(formData) {
        const errors = {};

        for (const [fieldName, value] of Object.entries(formData)) {
            if (fieldName === 'email') {
                if (!this.validateEmail(value)) {
                    errors[fieldName] = 'Invalid email format';
                }
            }
            if (!this.validateRequired(value)) {
                errors[fieldName] = 'This field is required';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// ==================== MAIN APPLICATION ====================

/**
 * VelouraApp - Main application class
 */
class VelouraApp extends EventHandler {
    constructor() {
        super();
        this.name = 'VelouraApp';
        
        // Initialize components
        this.cart = new Cart();
        this.notification = new Notification();
        this.analytics = new Analytics();
        this.formValidator = new FormValidator();

        // Initialize app
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        console.log('%c🚀 VELOURA Application Started', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupNavbarScroll();
        this.analytics.trackEvent('app_initialized');
        // Ensure cart badge shows correct count on startup
        this.updateCartBadge();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                const productName = productCard.querySelector('.product-info h5').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                this.handleAddToCart(productName, productPrice);
            });
        });

        // Explore button
        const exploreBtn = document.querySelector('.btn-explore');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => this.handleExplore());
        }

        // Newsletter form
        const emailInput = document.getElementById('email-input');
        if (emailInput) {
            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubscribe();
                }
            });
        }
        // Cart button in navbar
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.handleViewCart());
        }
    }

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appears-on-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature cards, product cards, and contact cards
        document.querySelectorAll('.feature-card, .product-card, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Setup navbar scroll effect
     */
    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar-custom');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                navbar.style.backgroundColor = 'rgba(26, 26, 46, 0.95)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-lg)';
                navbar.style.backgroundColor = '';
            }

            lastScrollTop = scrollTop;
        });
    }

    /**
     * Handle add to cart
     */
    handleAddToCart(productName, productPrice) {
        // Normalize price by stripping any non-numeric characters (currency symbols, commas)
        const priceClean = String(productPrice).replace(/[^0-9.]/g, '');
        const product = {
            name: productName,
            price: priceClean
        };

        this.cart.addItem(product);
        this.notification.success(`✨ ${productName} added to cart!`);
        this.analytics.trackProductInteraction(productName, 'add_to_cart');
        
        // Log cart data
        console.log('📦 Cart Updated:', this.cart.getCartData());
        // Update navbar badge when item is added
        this.updateCartBadge();
    }

    /**
     * Update cart count badge in navbar
     */
    updateCartBadge() {
        try {
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const count = this.cart.getItemCount();
                cartCount.textContent = count;
                if (count > 0) {
                    cartCount.style.display = 'flex';
                } else {
                    cartCount.style.display = 'none';
                }
            }
        } catch (err) {
            console.error('updateCartBadge error', err);
        }
    }

    /**
     * Handle view cart
     */
    handleViewCart() {
        try {
            const cartData = this.cart.getCartData();
            if (cartData.itemCount === 0) {
                this.notification.info('Your cart is empty. Start shopping!');
                return;
            }
            this.notification.success(`🛍️ You have ${cartData.itemCount} items in cart worth ₱${cartData.totalPrice.toFixed(2)}`);
            console.log('🛒 Cart Items:', cartData);
        } catch (err) {
            console.error('handleViewCart error', err);
        }
    }

    /**
     * Handle explore button
     */
    handleExplore() {
        const productsSection = document.getElementById('products');
        this.analytics.trackEvent('explore_clicked');
        
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
            this.notification.info('Explore our amazing products!');
        }
    }

    /**
     * Handle newsletter subscription
     */
    handleSubscribe() {
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim();

        if (!this.formValidator.validateEmail(email)) {
            this.notification.error('Please enter a valid email address');
            this.analytics.trackEvent('newsletter_failed', { email });
            return;
        }

        // Simulate API call
        this.notification.success(`🎉 Successfully subscribed with ${email}!`);
        this.analytics.trackEvent('newsletter_subscribed', { email });
        emailInput.value = '';
    }

    /**
     * Get app state
     */
    getAppState() {
        return {
            cart: this.cart.getCartData(),
            analytics: this.analytics.getReport(),
            notifications: this.notification.getState()
        };
    }

    /**
     * Log app state to console
     */
    logState() {
        console.log('%c📊 App State:', 'color: #4ecdc4; font-weight: bold;', this.getAppState());
    }
}

// ==================== GLOBAL FUNCTIONS ====================

// Initialize app when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new VelouraApp();
    console.log('%c✅ VELOURA Ready!', 'color: #45b7d1; font-size: 14px;');
});

/**
 * Global function to add product to cart
 */
function handleAddCart(productName) {
    if (app) {
        const card = document.evaluate(
            `//h5[text()='${productName}']/ancestor::div[@class='product-card']`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (card) {
            const price = card.querySelector('.product-price').textContent;
            app.handleAddToCart(productName, price);
        }
    }
}

/**
 * Global function to handle explore
 */
function handleExplore() {
    if (app) {
        app.handleExplore();
    }
}

/**
 * Global function to handle subscribe
 */
function handleSubscribe() {
    if (app) {
        app.handleSubscribe();
    }
}

// ==================== TOAST NOTIFICATION STYLES ====================

// Add toast styles dynamically
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: -100px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: bottom 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
    }

    .toast.show {
        bottom: 20px;
    }

    .toast-success {
        border-left: 4px solid #4ecdc4;
    }

    .toast-error {
        border-left: 4px solid #ff6b6b;
    }

    .toast-warning {
        border-left: 4px solid #ffd700;
    }

    .toast-info {
        border-left: 4px solid #45b7d1;
    }

    .toast-icon {
        font-size: 20px;
        flex-shrink: 0;
    }

    .toast-success .toast-icon {
        color: #4ecdc4;
    }

    .toast-error .toast-icon {
        color: #ff6b6b;
    }

    .toast-warning .toast-icon {
        color: #ffd700;
    }

    .toast-info .toast-icon {
        color: #45b7d1;
    }

    .toast-message {
        flex: 1;
        color: #2d3436;
        font-weight: 500;
    }

    .toast-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #636e72;
        padding: 0;
        margin-left: 10px;
    }

    .toast-close:hover {
        color: #2d3436;
    }

    @media (max-width: 576px) {
        .toast {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

document.head.appendChild(style);

// ==================== UTILITY CONSOLE FUNCTIONS ====================

/**
 * View cart data
 */
window.viewCart = function() {
    if (app) {
        console.table(app.cart.getCartData());
    }
};

/**
 * View analytics data
 */
window.viewAnalytics = function() {
    if (app) {
        console.table(app.analytics.getReport());
    }
};

/**
 * View app state
 */
window.viewAppState = function() {
    if (app) {
        app.logState();
    }
};

/**
 * Clear cart
 */
window.clearCart = function() {
    if (app) {
        app.cart.clearCart();
        console.log('✅ Cart cleared');
    }
};

console.log('%c💡 Tip: Use viewCart(), viewAnalytics(), viewAppState(), clearCart() in console!', 'color: #ff6b6b; font-style: italic;');
