// Cart Management System
class CartManager {
    constructor() {
        this.apiBase = '/api';
        this.sessionId = this.getOrCreateSessionId();
        this.cart = null;
        this.init();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('solara_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('solara_session_id', sessionId);
        }
        return sessionId;
    }

    async init() {
        await this.loadCart();
        this.setupEventListeners();
        this.updateCartCount();
    }

    async loadCart() {
        try {
            const response = await fetch(`${this.apiBase}/cart`, {
                headers: {
                    'X-Session-ID': this.sessionId
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.cart = data.data;
                this.renderCart();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.showNotification('Error loading cart', 'error');
        }
    }

    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch(`${this.apiBase}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.data;
                this.updateCartCount();
                this.showNotification('Product added to cart!', 'success');
                
                // Update cart page if we're on it
                if (window.location.pathname.includes('cart.html')) {
                    this.renderCart();
                }
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Error adding to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
        }
    }

    async updateCartItem(productId, quantity) {
        try {
            const response = await fetch(`${this.apiBase}/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.data;
                this.renderCart();
                this.updateCartCount();
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Error updating cart', 'error');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            this.showNotification('Error updating cart', 'error');
        }
    }

    async removeFromCart(productId) {
        try {
            const response = await fetch(`${this.apiBase}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'X-Session-ID': this.sessionId
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.data;
                this.renderCart();
                this.updateCartCount();
                this.showNotification('Item removed from cart', 'success');
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Error removing item', 'error');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Error removing item', 'error');
        }
    }

    async clearCart() {
        try {
            const response = await fetch(`${this.apiBase}/cart`, {
                method: 'DELETE',
                headers: {
                    'X-Session-ID': this.sessionId
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.cart = data.data;
                this.renderCart();
                this.updateCartCount();
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    }

    renderCart() {
        if (!window.location.pathname.includes('cart.html')) {
            return;
        }

        const loadingElement = document.getElementById('cart-loading');
        const contentElement = document.getElementById('cart-content');
        const emptyElement = document.getElementById('cart-empty');
        const itemsContainer = document.getElementById('cart-items-container');

        if (loadingElement) loadingElement.style.display = 'none';
        if (contentElement) contentElement.style.display = 'block';

        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            if (emptyElement) emptyElement.style.display = 'block';
            if (itemsContainer) itemsContainer.innerHTML = '';
            this.updateOrderSummary();
            return;
        }

        if (emptyElement) emptyElement.style.display = 'none';
        
        if (itemsContainer) {
            itemsContainer.innerHTML = this.cart.items.map(item => this.createCartItemHTML(item)).join('');
            this.attachCartItemListeners();
        }

        this.updateOrderSummary();
    }

    createCartItemHTML(item) {
        const product = this.getProductInfo(item.productId);
        if (!product) return '';

        return `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="item-image">
                    <div class="product-bottle-preview ${item.productId}"></div>
                </div>
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p class="item-spf">${product.spf}</p>
                    <p class="item-description">${product.description}</p>
                    <div class="item-price">Rs. ${product.price}</div>
                </div>
                <div class="item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-product-id="${item.productId}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-product-id="${item.productId}">
                        <button class="quantity-btn increase" data-product-id="${item.productId}">+</button>
                    </div>
                </div>
                <div class="item-subtotal">
                    Rs. ${product.price * item.quantity}
                </div>
                <div class="item-remove">
                    <button class="remove-btn" data-product-id="${item.productId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getProductInfo(productId) {
        const products = {
            'oily-skin-solution': { name: 'Oily Skin Solution', spf: 'SPF 50+ PA+++', price: 599, description: 'Oil-free formula with mattifying effect' },
            'dry-skin-comfort': { name: 'Dry Skin Comfort', spf: 'SPF 50+ PA+++', price: 599, description: 'Hydrating formula with hyaluronic acid' },
            'combination-skin-balance': { name: 'Combination Skin Balance', spf: 'SPF 50+ PA+++', price: 599, description: 'Perfect balance of hydration and oil control' },
            'acne-prone-shield': { name: 'Acne-Prone Skin Shield', spf: 'SPF 50+ PA+++', price: 649, description: 'Salicylic acid formula for acne-prone skin' },
            'tinted-oily-skin': { name: 'Tinted Oily Skin Solution', spf: 'SPF 50+ PA+++', price: 699, description: 'Light coverage with oil control' },
            'luxury-dry-skin': { name: 'Luxury Dry Skin Formula', spf: 'SPF 50+ PA++++', price: 899, description: 'Premium formula with peptides and botanical extracts' }
        };
        return products[productId] || null;
    }

    attachCartItemListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
                let quantity = parseInt(input.value);
                
                if (e.target.classList.contains('decrease')) {
                    quantity = Math.max(1, quantity - 1);
                } else if (e.target.classList.contains('increase')) {
                    quantity = Math.min(10, quantity + 1);
                }
                
                input.value = quantity;
                this.updateCartItem(productId, quantity);
            });
        });

        // Quantity input change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                let quantity = parseInt(e.target.value);
                quantity = Math.max(1, Math.min(10, quantity));
                e.target.value = quantity;
                this.updateCartItem(productId, quantity);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-btn').dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }

    updateOrderSummary() {
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        const checkoutTotalElement = document.getElementById('checkout-total');

        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            if (subtotalElement) subtotalElement.textContent = 'Rs. 0';
            if (taxElement) taxElement.textContent = 'Rs. 0';
            if (totalElement) totalElement.textContent = 'Rs. 0';
            if (checkoutTotalElement) checkoutTotalElement.textContent = 'Rs. 0';
            return;
        }

        const subtotal = this.cart.total;
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = `Rs. ${subtotal}`;
        if (taxElement) taxElement.textContent = `Rs. ${tax}`;
        if (totalElement) totalElement.textContent = `Rs. ${total}`;
        if (checkoutTotalElement) checkoutTotalElement.textContent = `Rs. ${total}`;
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.cart && this.cart.items ? this.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    setupEventListeners() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.openCheckoutModal());
        }

        // Modal controls
        const closeModal = document.getElementById('close-modal');
        const cancelCheckout = document.getElementById('cancel-checkout');
        
        if (closeModal) closeModal.addEventListener('click', () => this.closeCheckoutModal());
        if (cancelCheckout) cancelCheckout.addEventListener('click', () => this.closeCheckoutModal());

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }

        // Success modal actions
        const continueShopping = document.getElementById('continue-shopping');
        const viewOrder = document.getElementById('view-order');
        
        if (continueShopping) continueShopping.addEventListener('click', () => {
            this.closeSuccessModal();
            window.location.href = 'products.html';
        });
        
        if (viewOrder) viewOrder.addEventListener('click', () => {
            const orderId = document.getElementById('order-id').textContent;
            this.closeSuccessModal();
            // In a real app, this would navigate to order details page
            this.showNotification(`Order ${orderId} placed successfully!`, 'success');
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeCheckoutModal();
                this.closeSuccessModal();
            }
        });
    }

    openCheckoutModal() {
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        const modal = document.getElementById('checkout-modal');
        const checkoutItems = document.getElementById('checkout-items');
        
        if (checkoutItems) {
            checkoutItems.innerHTML = this.cart.items.map(item => {
                const product = this.getProductInfo(item.productId);
                return `
                    <div class="checkout-item">
                        <span>${product.name} x ${item.quantity}</span>
                        <span>Rs. ${product.price * item.quantity}</span>
                    </div>
                `;
            }).join('');
        }

        this.updateOrderSummary();
        
        if (modal) modal.style.display = 'block';
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.style.display = 'none';
    }

    closeSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) modal.style.display = 'none';
    }

    async handleCheckout(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const customerInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            pincode: formData.get('pincode'),
            country: formData.get('country')
        };

        const paymentMethod = formData.get('payment-method');

        try {
            const response = await fetch(`${this.apiBase}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({ customerInfo, paymentMethod })
            });

            if (response.ok) {
                const data = await response.json();
                this.closeCheckoutModal();
                this.showSuccessModal(data.data.id);
                
                // Clear cart after successful order
                await this.clearCart();
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Error placing order', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            this.showNotification('Error placing order', 'error');
        }
    }

    showSuccessModal(orderId) {
        const modal = document.getElementById('success-modal');
        const orderIdElement = document.getElementById('order-id');
        
        if (orderIdElement) orderIdElement.textContent = orderId;
        if (modal) modal.style.display = 'block';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'linear-gradient(135deg, #2a9d8f, #264653)',
            error: 'linear-gradient(135deg, #e76f51, #f4a261)',
            info: 'linear-gradient(135deg, #f4a261, #e9c46a)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager
let cartManager;

// Cart page specific initialization
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize cart manager if we're on the cart page
    if (window.location.pathname.includes('cart.html')) {
        cartManager = new CartManager();
    }
});

// Export for global access
window.cartManager = cartManager;
