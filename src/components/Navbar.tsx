import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, List, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const links = [
    { to: '/app', icon: Home, label: 'Dashboard' },
    { to: '/app/subscriptions', icon: List, label: 'Subscriptions' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="relative flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {location.pathname === to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-indigo-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name}
            </span>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;