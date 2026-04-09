# Solara Skincare Website - Complete E-commerce Solution

A modern, premium skincare brand website focused on sunscreen products for Indian skin tones and climate. This is a unified full-stack e-commerce solution with backend integration for cart management and payment processing - all running on a single server!

## Features

### Frontend
- **Modern, Premium Design**: Clean, minimal aesthetic with soft colors (white, beige, light yellow, pastel tones)
- **Responsive Design**: Mobile-first approach, works seamlessly on all devices
- **Interactive Elements**: Smooth scrolling, hover effects, micro-interactions
- **Product Pages**: Detailed product information with filtering by skin type
- **Shopping Cart**: Full cart functionality with add/remove/update items
- **Checkout System**: Complete checkout flow with customer information and payment options
- **Contact Forms**: Functional contact forms with validation

### Backend
- **RESTful API**: Express.js server with comprehensive API endpoints
- **Cart Management**: Session-based cart system with persistent storage
- **Order Processing**: Complete order management system
- **Payment Integration**: Ready for Stripe/Razorpay integration
- **Security**: Helmet.js, rate limiting, CORS protection
- **Data Validation**: Input validation and error handling

## Pages

1. **Home Page** (`index.html`)
   - Hero section with brand messaging
   - Product highlights and features
   - Customer testimonials
   - Call-to-action sections

2. **Products Page** (`products.html`)
   - Product grid with filtering by skin type
   - Detailed product information
   - Add to cart functionality
   - Product comparison table

3. **Shopping Cart** (`cart.html`)
   - Cart item management
   - Quantity controls
   - Order summary with pricing
   - Checkout modal

4. **About Us** (`about.html`)
   - Brand story and mission
   - Team information
   - Company achievements

5. **Why Choose Us** (`why-choose-us.html`)
   - Unique selling propositions
   - Technology explanations
   - Expert testimonials
   - Certifications

6. **Contact Page** (`contact.html`)
   - Contact form with validation
   - Support options
   - Store locations

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
- **Font Awesome**: Icon library
- **Google Fonts**: Poppins typography

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Rate Limiting**: API protection
- **UUID**: Unique identifier generation

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart Management
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details

### Payment
- `POST /api/payment/process` - Process payment (mock implementation)

### Utility
- `GET /api/health` - Health check endpoint

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the project files**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the unified server**:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

5. **Access the complete website**:
   - **Everything**: http://localhost:3000
   - Home: http://localhost:3000/
   - Products: http://localhost:3000/products
   - Cart: http://localhost:3000/cart
   - About: http://localhost:3000/about
   - Why Choose Us: http://localhost:3000/why-choose-us
   - Contact: http://localhost:3000/contact
   - API: http://localhost:3000/api

**That's it!** No need to run separate frontend and backend servers - everything runs on a single port!

## Project Structure

```
brand/
|-- index.html              # Home page
|-- products.html           # Products page
|-- cart.html              # Shopping cart
|-- about.html             # About us page
|-- why-choose-us.html     # Why choose us page
|-- contact.html           # Contact page
|-- styles.css             # Complete styling
|-- script.js              # Frontend JavaScript
|-- cart.js                # Cart management JavaScript
|-- app.js                 # Unified server (frontend + backend)
|-- server.js              # Legacy backend server (deprecated)
|-- package.json           # Node.js dependencies
|-- .env.example           # Environment variables template
|-- README.md              # This file
```

**Key Change**: `app.js` is now the unified server that serves both frontend and backend from a single process!

## Cart & Payment Flow

1. **Add to Cart**: Users can add products to cart from any product page
2. **View Cart**: Navigate to cart page to review items
3. **Manage Cart**: Update quantities, remove items
4. **Checkout**: Fill in customer information and select payment method
5. **Order Confirmation**: Receive order confirmation with details

## Features in Detail

### Product Management
- 6 different sunscreen formulations for various skin types
- Product filtering by category (oily, dry, combination, acne-prone)
- Detailed product information with pricing
- Stock management

### Shopping Cart
- Session-based cart persistence
- Real-time cart updates
- Quantity controls with validation
- Automatic price calculation
- GST tax calculation (18%)

### Checkout Process
- Customer information collection
- Shipping address form
- Payment method selection (COD/Online)
- Order summary with total pricing
- Success confirmation with order ID

### Security Features
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Helmet.js security headers
- Error handling and logging

## Responsive Design

The website is fully responsive and works on:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1024px
- **Mobile**: 320px to 768px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Adding Products
To add new products, update the `initializeProducts()` function in `server.js`:

```javascript
{
    id: 'new-product-id',
    name: 'Product Name',
    price: 999,
    spf: 'SPF 50+ PA+++',
    category: 'category',
    description: 'Product description',
    image: '/images/product.jpg',
    stock: 100
}
```

### Styling
All colors and styles are defined in CSS variables at the top of `styles.css`:

```css
:root {
    --primary-color: #f4a261;
    --secondary-color: #e76f51;
    --accent-color: #2a9d8f;
    /* ... more variables */
}
```

## Payment Integration

The backend is ready for payment gateway integration. Currently includes:
- Mock payment processing
- Order creation and management
- Payment method selection

To integrate with real payment providers:
1. Add API keys to `.env` file
2. Update payment processing endpoint
3. Add payment gateway SDK

## Deployment

### Unified Deployment
Deploy the complete application (frontend + backend) to any Node.js hosting service:
- **Heroku**: Deploy `app.js` as a web service
- **Vercel**: Deploy as a serverless function
- **Railway**: Deploy as a web service
- **AWS EC2**: Deploy the Node.js application
- **DigitalOcean**: Deploy as a Droplet
- **Render**: Deploy as a web service

**Single Deployment**: No need to deploy frontend and backend separately - everything runs together!

## Support

For any issues or questions:
1. Check the console for error messages
2. Ensure the unified server is running on port 3000
3. Verify API endpoints are accessible at http://localhost:3000/api
4. Check network tab for failed requests
5. Make sure you're running `npm start` with `app.js`

## Future Enhancements

- User authentication system
- Order history tracking
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Real payment gateway integration
- Admin dashboard for order management
- Inventory management system
- Analytics and reporting

---

**Solara Skincare** - Premium sun protection for Indian skin
#   s o l a r a - s u n s c r e e n  
 