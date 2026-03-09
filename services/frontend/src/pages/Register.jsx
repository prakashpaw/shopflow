import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, ArrowRight, Shield } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        navigate('/');
        window.location.reload();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-brand-600 dark:text-brand-400 mb-6 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                <UserPlus size={28} />
              </div>
              <h2 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-white">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join Shopflow today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl text-sm font-medium text-center">
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                    placeholder="johndoe"
                    value={username} onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-70 group"
                >
                  {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign Up <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </div>
            </form>
            
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
