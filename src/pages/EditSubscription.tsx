import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Calendar, DollarSign, Tag, Clock, CreditCardIcon, FileText, Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Subscription } from '../types';

const EditSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Subscription>>({
    name: '',
    category: undefined,
    price: 0,
    frequency: undefined,
    startDate: '',
    paymentMethod: '',
    currency: 'USD',
    status: 'active'
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/sign-in');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5500
/api/v1/subscriptions/${id}`, {
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
          throw new Error('Failed to fetch subscription');
        }

        const data = await response.json();
        const subscription = data.data;

        // Format the date to YYYY-MM-DD for the input field
        const formattedStartDate = new Date(subscription.startDate)
          .toISOString()
          .split('T')[0];

        setFormData({
          ...subscription,
          startDate: formattedStartDate
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/sign-in');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5500
/api/v1/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      navigate('/app/subscriptions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  if (loading && !formData.name) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <Link
            to="/app/subscriptions"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Edit Subscription
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <CreditCard className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Service Name</span>
                </div>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., Netflix, Spotify"
              />
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="category" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Category</span>
                </div>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select a category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Productivity">Productivity</option>
                <option value="Utilities">Utilities</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="price" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Price</span>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className={`${inputClasses} pl-8`}
                  placeholder="0.00"
                />
              </div>
            </motion.div>

            {/* Currency */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="currency" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Currency</span>
                </div>
              </label>
              <select
                id="currency"
                name="currency"
                required
                value={formData.currency}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
              </select>
            </motion.div>

            {/* Billing Frequency */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="frequency" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Billing Frequency</span>
                </div>
              </label>
              <select
                id="frequency"
                name="frequency"
                required
                value={formData.frequency}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select frequency</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </motion.div>

            {/* Start Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="startDate" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Start Date</span>
                </div>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="paymentMethod" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <CreditCardIcon className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Payment Method</span>
                </div>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select payment method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="status" className={labelClasses}>
                <div className="flex items-center mb-1">
                  <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Status</span>
                </div>
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-end space-x-4 pt-4"
          >
            <Link
              to="/app/subscriptions"
              className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Subscription'
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditSubscription;