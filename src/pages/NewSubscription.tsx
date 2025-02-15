import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Calendar, DollarSign, Tag, Clock, CreditCardIcon, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NewSubscription = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    frequency: '',
    startDate: '',
    paymentMethod: '',
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/api/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add subscription');
      }

      navigate('/app/subscriptions');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to add subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

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
            Add New Subscription
          </h2>
        </div>

        {error && (
          <p>${error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                disabled={isSubmitting}
              />
            </motion.div>
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
                disabled={isSubmitting}
              >
                <option value="">Select frequency</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
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
                disabled={isSubmitting}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
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
                disabled={isSubmitting}
              >
                <option value="">Select payment method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="notes" className={labelClasses}>
              <div className="flex items-center mb-1">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                <span>Notes (Optional)</span>
              </div>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={`${inputClasses} min-h-[120px] resize-none`}
              placeholder="Add any additional notes about this subscription..."
              disabled={isSubmitting}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end space-x-4 pt-4"
          >
            <Link
              to="/app/subscriptions"
              className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              tabIndex={isSubmitting ? -1 : undefined}
              onClick={e => isSubmitting && e.preventDefault()}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Subscription'}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default NewSubscription;