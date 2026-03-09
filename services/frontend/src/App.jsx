import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, User, LogOut, Menu, X, Sparkles, ShoppingCart } from 'lucide-react';

import { CartProvider, useCart } from './context/CartContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';

function NavLink({ to, children, icon: Icon, isActive }) {
  return (
    <Link to={to} className="relative flex items-center gap-2 px-4 py-2 font-medium transition-colors text-slate-600 hover:text-brand-600 rounded-lg group">
      <Icon size={18} className={isActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"} />
      <span className={isActive ? "text-brand-700" : ""}>{children}</span>
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-brand-50 rounded-lg -z-10"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

function NavBar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'user';
  const { getCartCount } = useCart();
  const cartItemCount = getCartCount();

  const navItems = [
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Orders', path: '/orders', icon: Package },
  ];

  if (userRole === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: User });
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-2 rounded-xl text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="font-heading text-xl font-bold text-slate-800 tracking-tight">Shop<span className="text-brand-600">flow</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  icon={item.icon} 
                  isActive={location.pathname === item.path || (location.pathname === '/' && item.path === '/products')}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Theme Toggle & External Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 mr-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                <ShoppingCart size={20} className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Link>

              <button onClick={toggleDarkMode} className="p-2 mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                {darkMode ? "☀️" : "🌙"}
              </button>
              {isAuthenticated ? (
                <button 
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.reload(); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-sm hover:border-red-200 dark:hover:border-red-900"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-500 rounded-xl transition-all shadow-sm">
                  <User size={16} /> Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 inset-x-0 bg-white/90 backdrop-blur-xl border-b shadow-xl z-40 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${location.pathname === item.path ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}
                >
                  <item.icon size={20} className={location.pathname === item.path ? 'text-brand-600' : 'text-slate-400'} />
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium ${location.pathname === '/cart' ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} className={location.pathname === '/cart' ? 'text-brand-600' : 'text-slate-400'} />
                  Shopping Cart
                </div>
                {cartItemCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={toggleDarkMode} className="flex items-center w-full gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 mb-2 bg-slate-50 dark:bg-slate-800">
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                {isAuthenticated ? (
                  <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.reload(); }} className="flex items-center w-full gap-3 px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10">
                    <LogOut size={20} /> Sign Out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white bg-slate-900 dark:bg-brand-600 rounded-xl">
                    <User size={18} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Products />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden transition-colors duration-300 antialiased">
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
        
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <AnimatedOutlet />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
