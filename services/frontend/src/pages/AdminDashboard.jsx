import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, PackagePlus, Trash2, Plus, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (username) => {
    if(!window.confirm(`Are you sure you want to delete ${username}?`)) return;
    try {
      const res = await fetch(`/api/auth/users/${username}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.username !== username));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category || 'General',
          image: newProduct.image
        })
      });
      if (res.ok) {
        alert('Product added successfully!');
        setNewProduct({ name: '', price: '', category: '', image: '' });
      } else {
        alert('Failed to add product');
      }
    } catch (err) {
      alert('Error adding product');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-brand-500" /> Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage users and add store inventory.</p>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">{error}</div>}

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* User Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Users size={24} className="text-brand-500" /> Registered Users
          </h2>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.username} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{u.username}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 bg-slate-200 dark:bg-slate-700 w-fit px-2 py-0.5 rounded">
                    {u.role}
                  </p>
                </div>
                {u.username !== 'admin' && (
                  <button onClick={() => handleDeleteUser(u.username)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors h-fit">
          <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <PackagePlus size={24} className="text-brand-500" /> Add New Product
          </h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo URL (Optional)</label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
            </div>
            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl mt-4 transition-colors">
              <Plus size={20} /> Publish Product
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
