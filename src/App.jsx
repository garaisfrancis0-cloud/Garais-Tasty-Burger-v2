import React, { useState } from 'react';
import './App.css';

// Data ng mga burger menu kasama ang kanilang mga presyo
const burgersData = [
  {
    id: 1,
    title: 'Classic Burger',
    heroTitle: 'OUR CLASSIC',
    description: 'Juicy beef patty topped with sweet caramelized onions, melted cheese, and savory sauce.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Signature Burger',
    heroTitle: 'OUR SIGNATURE',
    description: 'Premium picanha beef, crispy bacon, melted cheese, and rich signature sauce.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Crabby Burger',
    heroTitle: 'OUR CRABBY',
    description: 'Juicy turkey patty with fresh lettuce, tomato, and creamy special sauce.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Veggie Burger',
    heroTitle: 'VEGGIE BURGER',
    description: 'Flavorful veggie patty with special spices, fresh organic vegetables, and creamy sauce.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop',
  },
];

export default function App() {
  const [selectedBurger, setSelectedBurger] = useState(burgersData[0]);
  const [quantities, setQuantities] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleIncrease = (e, id) => {
    e.stopPropagation();
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrease = (e, id) => {
    e.stopPropagation();
    setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  };

  // Add to Cart na may tamang pagkalkula ng total price
  const handleAddToCart = (e, burger) => {
    e.stopPropagation();
    const qty = quantities[burger.id];
    if (qty === 0) {
      alert('Magdagdag muna ng quantity gamit ang (+) bago i-add sa cart.');
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === burger.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === burger.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prevCart, { ...burger, qty }];
    });

    setQuantities(prev => ({ ...prev, [burger.id]: 0 }));
    alert(`Tagumpay! Nai-add sa cart ang ${qty} pcs ng ${burger.title}.`);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="burger-page-container">
      {/* 1. Navigation Bar na may Logo at Cart */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="crab-logo-badge">
            <span className="crab-icon">🦀</span>
          </div>
          <span className="brand-name">Crabby Patty</span>
        </div>

        <ul className="nav-links">
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#menu" className="active">OUR MENU</a></li>
          <li><a href="#shop">SHOP</a></li>
          <li><a href="#contact">CONTACT</a></li>
          <li className="cart-item-wrapper" onClick={() => setIsCartOpen(true)}>
            <span className="cart-icon">🛒</span>
            {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
          </li>
        </ul>
      </nav>

      {/* 2. Hero Spotlight Section */}
      <main className="hero-section">
        <div className="hero-left">
          <h1 className="hero-title">{selectedBurger.heroTitle}</h1>
          <p className="hero-description">{selectedBurger.description}</p>
        </div>

        <div className="hero-center">
          <div className="image-wrapper">
            <img src={selectedBurger.image} alt={selectedBurger.title} className="featured-image" />
            <div className="price-tag">ONLY ₱{selectedBurger.price}</div>
          </div>
        </div>

        <div className="hero-right">
          <button className="order-now-btn" onClick={() => setIsCartOpen(true)}>
            VIEW CART (₱{totalPrice})
          </button>
        </div>
      </main>

      {/* 3. Menu Cards na may Live Total Price computation */}
      <section className="burgers-grid-container">
        <div className="burgers-grid">
          {burgersData.map((burger) => {
            const currentQty = quantities[burger.id];
            const calculatedTotal = burger.price * currentQty;

            return (
              <div
                key={burger.id}
                className={`burger-card ${selectedBurger.id === burger.id ? 'active-card' : ''}`}
                onClick={() => setSelectedBurger(burger)}
              >
                <div className="card-img-box">
                  <img src={burger.image} alt={burger.title} />
                </div>

                <h3 className="card-title">{burger.title}</h3>
                <p className="card-desc">{burger.description}</p>
                <div className="card-price">₱{burger.price}</div>

                {/* Quantity Controls (- 0 +) */}
                <div className="qty-controls">
                  <button className="qty-btn" onClick={(e) => handleDecrease(e, burger.id)}>-</button>
                  <span className="qty-value">{currentQty}</span>
                  <button className="qty-btn" onClick={(e) => handleIncrease(e, burger.id)}>+</button>
                </div>

                {/* Live Computed Total Price Display para sa card na ito */}
                <div className="calculated-total-display">
                  Total: <span>₱{calculatedTotal}</span>
                </div>

                {/* Add to Cart Button */}
                <button className="add-cart-btn" onClick={(e) => handleAddToCart(e, burger)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Cart Modal / Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Your Shopping Cart 🛒</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">Walang laman ang iyong cart.</p>
            ) : (
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <span>{item.title} (x{item.qty})</span>
                    <span className="cart-item-price">₱{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="cart-total">
                  <strong>Total Amount: ₱{totalPrice}</strong>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    alert(`Salamat sa iyong pag-order! Kabuuang binayaran: ₱${totalPrice}`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                >
                  PLACE ORDER NOW
                </button>
              </div>
            )}
            <button className="close-modal-btn" onClick={() => setIsCartOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}