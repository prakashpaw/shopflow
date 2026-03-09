import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, AlertCircle, TrendingUp, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view your orders.');
      setIsLoading(false);
      return;
    }

    fetch('/api/orders/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
         if(!res.ok) throw new Error("Unauthorized");
         return res.json();
      })
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch orders. Your session might have expired.');
        setIsLoading(false);
      });
  }, []);

  const getStatusConfig = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock };
      case 'completed':
      case 'shipped':
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Package };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Order History</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">Track and manage your recent purchases.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100"></div>
          ))}
        </div>
      ) : error ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-slate-900/20">
            Go to Login
          </Link>
        </motion.div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={36} />
          </div>
          <h3 className="text-2xl font-bold font-heading text-slate-800 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't made your first purchase. Explore our catalogue to find something you'll love!</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5">
            Start Shopping <TrendingUp size={18} />
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {orders.map(o => {
            const statusStyle = getStatusConfig(o.status);
            const StatusIcon = statusStyle.icon;

            return (
              <motion.div 
                key={o.id} 
                variants={item}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-xl border ${statusStyle.color} bg-opacity-50`}>
                    <Package size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-800">Order #{o.id.toString().padStart(4, '0')}</h3>
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${statusStyle.color}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                      <StatusIcon size={14} /> Placed recently
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-slate-100">
                  <div className="text-center sm:text-right flex-1">
                    <p className="text-sm text-slate-400 font-medium mb-1">Items</p>
                    <p className="text-xl font-bold font-heading text-slate-800">{o.items.length}</p>
                  </div>
                  <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-200 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
