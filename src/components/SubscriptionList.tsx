import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, RefreshCw, Search, Plus, X, SlidersHorizontal, Sparkles, Cloud } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Subscription } from '../types';

const categoryColors: Record<string, string> = {
  Entertainment: 'bg-purple-100 text-purple-800 border-purple-200',
  Education: 'bg-blue-100 text-blue-800 border-blue-200',
  Health: 'bg-green-100 text-green-800 border-green-200',
  Fitness: 'bg-orange-100 text-orange-800 border-orange-200',
  Productivity: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Utilities: 'bg-gray-100 text-gray-800 border-gray-200',
  Food: 'bg-red-100 text-red-800 border-red-200',
  Other: 'bg-pink-100 text-pink-800 border-pink-200',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-gray-100 text-gray-800 border-gray-200',
};

const searchPlaceholders = [
  'Search by name...',
  'Try "Netflix"...',
  'Find subscriptions...',
  'Search services...'
];

const SubscriptionList = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: '',
    frequency: '',
  });

  // Rotate search placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/sign-in');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5500/api/v1/subscriptions/user/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/sign-in');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }

        const data = await response.json();
        setSubscriptions(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate, user]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      priceRange: '',
      frequency: '',
    });
  };

  const filterSubscriptions = (subs: Subscription[]) => {
    return subs.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || sub.category === filters.category;
      const matchesStatus = !filters.status || sub.status === filters.status;
      const matchesFrequency = !filters.frequency || sub.frequency === filters.frequency;
      
      let matchesPriceRange = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPriceRange = sub.price >= min && sub.price <= max;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesFrequency && matchesPriceRange;
    });
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/sign-in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5500/api/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Remove the deleted subscription from the list
      setSubscriptions(prev => prev.filter(sub => sub._id !== subscriptionId));
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    }
  };

  const filteredSubscriptions = filterSubscriptions(subscriptions);

  const filterPanelVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: {
        height: {
          type: "spring",
          stiffness: 500,
          damping: 40
        },
        opacity: {
          duration: 0.2
        }
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 24,
      transition: {
        height: {
          type: "spring",
          stiffness: 500,
          damping: 40,
          mass: 1
        },
        opacity: {
          duration: 0.4
        }
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white/30 backdrop-blur-lg rounded-xl border border-white/20">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-hover:text-indigo-500" />
            <input
              type="text"
              placeholder={searchPlaceholders[placeholderIndex]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/30 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 ${
              showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white/30'
            } backdrop-blur-lg border border-white/20 rounded-xl shadow-lg transition-all duration-300 `}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </motion.button>
          <Link
            to="/app/subscriptions/new"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </div>
      </div>

      <AnimatePresence mode="sync">
        {showFilters && (
          <motion.div
            variants={filterPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: 0.1,
                  duration: 0.3
                }
              }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  Filter Subscriptions
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-indigo-600 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    delay: 0.2,
                    duration: 0.3
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categoryColors).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Any Price</option>
                    <option value="0-10">$0 - $10</option>
                    <option value="10-25">$10 - $25</option>
                    <option value="25-50">$25 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-1000">&gt; $100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={filters.frequency}
                    onChange={(e) => handleFilterChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Frequencies</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
      {filteredSubscriptions.length > 0 ? (
  filteredSubscriptions.map((subscription, index) => (
    <motion.div
      key={subscription._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {subscription.name}
            </h3>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[subscription.category]}`}>
                {subscription.category}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColors[subscription.status]}`}>
                {subscription.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              ${subscription.price}
            </p>
            <p className="text-sm text-gray-500 capitalize">{subscription.frequency}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center text-gray-600 bg-white/50 rounded-lg p-3 transition-all duration-300"
          >
            <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium">{format(new Date(subscription.startDate), 'MMM d, yyyy')}</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center text-gray-600 bg-white/50 rounded-lg p-3 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-3 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Renewal Date</p>
              <p className="text-sm font-medium">{format(new Date(subscription.renewalDate), 'MMM d, yyyy')}</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center text-gray-600 bg-white/50 rounded-lg p-3 transition-all duration-300"
          >
            <DollarSign className="w-5 h-5 mr-3 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium">{subscription.paymentMethod}</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex space-x-4">
          <Link
            to={`/app/subscriptions/edit/${subscription._id}`}
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-300 font-medium text-center backdrop-blur-sm"
          >
            Edit
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCancelSubscription(subscription._id)}
            className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 font-medium backdrop-blur-sm"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  ))
) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white/30 backdrop-blur-lg rounded-xl border border-white/20"
      >
        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No subscriptions found matching your criteria</p>
      </motion.div>
      )}
        </div>
        </motion.div>
      );
      };

export default SubscriptionList;