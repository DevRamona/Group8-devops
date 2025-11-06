import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      nav('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6] p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-card overflow-hidden">
        {/* Left: form */}
        <div className="p-10 md:p-12">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">🌿</div>
            <div className="font-extrabold text-xl tracking-tight">FarmSafe</div>
          </div>
          <p className="text-gray-700 mb-1">Join FarmSafe</p>
          <h2 className="text-4xl font-bold mb-8">Create your account</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Full Name</label>
              <input className="w-full h-12 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Email</label>
              <input className="w-full h-12 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Password</label>
              <input className="w-full h-12 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
              <p className="text-xs text-gray-500 mt-2">At least 8 characters.</p>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full h-12 bg-brand-600 text-white font-bold rounded-xl shadow-md">Create account</button>
            <p className="text-center text-gray-700">Already have an account? <Link className="text-brand-600 font-bold" to="/login">Log In</Link></p>
          </form>
          {/* Trust badges */}
          <div className="mt-10 flex items-center gap-3">
            <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">Secure by JWT</div>
            <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">Powered by MongoDB</div>
          </div>
        </div>
        {/* Right: visual panel */}
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-b from-brand-600 to-brand-700 text-white p-10 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 w-72 h-72 rounded-full bg-emerald-300/10 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=1600&auto=format&fit=crop"
            alt="Farm"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative max-w-md text-center">
            <h3 className="text-3xl font-extrabold mb-3 tracking-tight">Welcome to smarter farming</h3>
            <p className="opacity-95">Plan seasons, track prices, and manage your farm records.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

