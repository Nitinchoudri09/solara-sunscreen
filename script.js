// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Cart Functionality
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

function updateCartCount() {
    cartCountElement.textContent = cartCount;
}

// Add to Cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        
        // Get product ID from closest product card
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            // Map product card category to actual product ID
            const categoryMap = {
                'oily': 'oily-skin-solution',
                'dry': 'dry-skin-comfort',
                'combination': 'combination-skin-balance',
                'acne': 'acne-prone-shield'
            };
            
            const actualProductId = categoryMap[productCard.dataset.category] || 'oily-skin-solution';
            
            // Add to cart via API
            addToCartProduct(actualProductId, 1);
        }
    }
});

// Simplified add to cart function
async function addToCartProduct(productId, quantity = 1) {
    // Local data fallback
    const localCart = JSON.parse(localStorage.getItem('solara_cart') || '{"items": [], "total": 0}');
    
    try {
        const sessionId = getOrCreateSessionId();
        
        // Try to sync with server
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId
            },
            body: JSON.stringify({ productId, quantity })
        }).catch(err => {
            console.warn('Backend server not found, falling back to localStorage');
            return { ok: false, fallback: true };
        });

        if (response.ok) {
            const data = await response.json();
            updateCartCountFromAPI();
            showNotification('Product added to cart!', 'success');
        } else {
            // Fallback logic for local development
            const existingItem = localCart.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.items.push({ productId, quantity, addedAt: new Date() });
            }
            
            localStorage.setItem('solara_cart', JSON.stringify(localCart));
            updateCartCount(); // Update the UI from local data
            showNotification('Product added to cart (Local)!', 'success');
            
            // Add animation to cart icon
            animateCart();
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

function animateCart() {
    const cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => {
            cartIcon.classList.remove('bounce');
        }, 1000);
    }
}

function updateCartCount() {
    const localCart = JSON.parse(localStorage.getItem('solara_cart') || '{"items": [], "total": 0}');
    const count = localCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Session management
function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('solara_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('solara_session_id', sessionId);
    }
    return sessionId;
}

// Update cart count from API
async function updateCartCountFromAPI() {
    try {
        const sessionId = getOrCreateSessionId();
        const response = await fetch('/api/cart', {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const count = data.data.items ? data.data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = count;
            });
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Initial count from local storage
    updateCartCountFromAPI(); // Then sync with API if available
});

// Notification System
function showNotification(message, type = 'info') {
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
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .testimonial-card, .value-card, .tech-card, .usp-card, .cert-card');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address');
            return;
        }
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
        
        // Log form data (in a real application, this would be sent to a server)
        console.log('Form submitted:', data);
    });
}

// Header Scroll Effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Add bounce animation to cart
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
    
    .bounce {
        animation: bounce 1s ease-in-out;
    }
    
    .product-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Lazy Loading for Images (if any images are added later)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Quick View Modal (placeholder functionality)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-view')) {
        e.preventDefault();
        showNotification('Quick view feature coming soon!');
    }
});

// Newsletter Signup (placeholder)
document.addEventListener('click', (e) => {
    if (e.target.id === 'newsletter-submit') {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && emailInput.value) {
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            showNotification('Please enter your email address');
        }
    }
});

// Search Functionality (placeholder)
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search functionality here
        console.log('Searching for:', searchTerm);
    });
}

// Age Verification (placeholder for skincare products)
function verifyAge() {
    const age = confirm('Are you 18 years or older? Skincare products require adult supervision.');
    if (!age) {
        showNotification('You must be 18 or older to use this site');
        return false;
    }
    return true;
}

// Initialize tooltips (placeholder)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.875rem;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            e.target.addEventListener('mouseleave', () => {
                document.body.removeChild(tooltip);
            }, { once: true });
        });
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    // Add any scroll-dependent functionality here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    
    // Add loading animation removal
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyles);

// Console branding
console.log('%c Solara Premium Sunscreen ', 'background: linear-gradient(135deg, #f4a261, #e76f51); color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Protecting Indian skin with science-backed formulations ', 'color: #2a9d8f; font-size: 14px;');
