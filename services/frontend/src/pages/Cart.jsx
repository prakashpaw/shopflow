import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, PackageX, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to complete your purchase");
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    setError(null);

    try {
      // In a real app we would map cartItems to the expected backend format
      // { product_id, quantity }
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      // Send to the Order service
      const res = await fetch('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      // Success! Clear cart and redirect
      clearCart();
      alert("Order placed successfully!");
      navigate('/orders');
      
    } catch (err) {
      console.error(err);
      setError("Failed to create order. Our systems might be down.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
          <PackageX size={40} />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collection!</p>
        <Link to="/products" className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={32} className="text-brand-500" />
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="text-slate-300" size={32} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold">${item.price}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{item.category}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-700 dark:text-slate-200 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold font-heading text-slate-800 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 dark:text-slate-200">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-slate-800 dark:text-slate-200">${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-800 dark:text-slate-200 font-bold">Total</span>
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    ${(getCartTotal() * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold py-4 px-6 rounded-xl mt-8 shadow-lg transition-all disabled:opacity-70 group"
            >
              {isCheckingOut ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={20} /> Checkout Now
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
              Secure Checkout 
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
