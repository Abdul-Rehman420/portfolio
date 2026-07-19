'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">Sign in to manage your portfolio</p>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="••••••••" />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all cursor-pointer">
              Sign In
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
