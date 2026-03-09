import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Tag, PackagePlus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }} 
          animate={{ opacity: 1, y: 0, x: '-50%' }} 
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium"
        >
          <ShoppingCart size={20} className="text-brand-400" /> {toastMessage}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Explore Products</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Curated premium items just for you.</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-sm font-semibold text-brand-700 w-fit flex items-center gap-2">
          <Tag size={16} /> Spring Sale: Up to 50% Off
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl h-80 animate-pulse border border-slate-100 shadow-sm">
              <div className="bg-slate-200 h-40 rounded-2xl w-full mb-6"></div>
              <div className="bg-slate-200 h-6 w-3/4 rounded-full mb-3"></div>
              <div className="bg-slate-200 h-5 w-1/4 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((p, idx) => (
            <motion.div 
              key={p.id} 
              variants={item}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 border border-slate-100 hover:border-brand-200 transition-all duration-300 relative overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 relative overflow-hidden group-hover:shadow-inner transition-all flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingCart size={48} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-300 transition-colors" />
                )}
                
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/50 dark:border-slate-700">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.9</span>
                </div>
                
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-white/50 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.category}</span>
                </div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-heading text-slate-800">{p.name}</h3>
                <span className="bg-slate-900 text-white font-bold px-3 py-1 rounded-lg text-sm">${p.price}</span>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                Experience the best in class functionality with the brand new {p.name}. Perfect for your daily needs.
              </p>
              
              <button 
                onClick={() => handleAddToCart(p)} 
                className="w-full bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-600 dark:hover:bg-brand-500 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 hover:border-brand-600 dark:hover:border-brand-500 active:scale-95 shadow-sm"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
