import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, LogOut, CreditCard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { to: '/app', icon: Home, label: 'Dashboard' },
    { to: '/app/subscriptions', icon: List, label: 'Subscriptions' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/app" className="flex items-center space-x-2 mr-8">
              <CreditCard className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                BudgetBox
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative group flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                  {location.pathname === to && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
          <Link to={`/app/profile/${user?._id}`} className="relative group flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
          </Link>
            
            <motion.button
              onClick={signOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 bg-red-50 opacity-90 hover:opacity-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="flex flex-col space-y-4 mt-4">
                {links.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="relative group flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                    {location.pathname === to && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <motion.button
                  onClick={signOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 mt-4 rounded-lg text-red-600 bg-red-50 opacity-90 hover:opacity-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;