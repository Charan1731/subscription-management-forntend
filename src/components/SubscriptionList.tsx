import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, RefreshCw, Search, Plus, X, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Subscription } from '../types';

const categoryColors: Record<string, string> = {
  Entertainment: 'bg-purple-100 text-purple-800',
  Education: 'bg-blue-100 text-blue-800',
  Health: 'bg-green-100 text-green-800',
  Fitness: 'bg-orange-100 text-orange-800',
  Productivity: 'bg-indigo-100 text-indigo-800',
  Utilities: 'bg-gray-100 text-gray-800',
  Food: 'bg-red-100 text-red-800',
  Other: 'bg-pink-100 text-pink-800',
};

const SubscriptionList = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: '',
    frequency: '',
  });

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
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
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

      setSubscriptions(prev => prev.filter(sub => sub._id !== subscriptionId));
    } catch (err) {
      console.error('Error cancelling subscription:', err);
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
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 ${
              showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white'
            } border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          <Link
            to="/app/subscriptions/new"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden"
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
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          filteredSubscriptions.map((subscription) => (
            <motion.div
              key={subscription._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${categoryColors[subscription.category]}`}>
                      {subscription.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      ${subscription.price}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{subscription.frequency}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                    <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium">{format(new Date(subscription.startDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                    <RefreshCw className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="text-sm font-medium">{subscription.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium capitalize">{subscription.status}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <Link
                    to={`/app/subscriptions/edit/${subscription._id}`}
                    className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleCancelSubscription(subscription._id)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No subscriptions found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionList;