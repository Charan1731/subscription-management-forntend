import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, RefreshCw, Search, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const mockSubscriptions = [
  {
    _id: '1',
    name: 'Netflix',
    currency: 'USD',
    price: 15.99,
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    status: 'active',
    startDate: '2024-01-01',
    renewalDate: '2024-03-01',
  },
  {
    _id: '2',
    name: 'Spotify',
    currency: 'USD',
    price: 9.99,
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'PayPal',
    status: 'active',
    startDate: '2024-01-15',
    renewalDate: '2024-03-15',
  },
] as const;

const categoryColors = {
  Entertainment: 'bg-purple-100 text-purple-800',
  Education: 'bg-blue-100 text-blue-800',
  Health: 'bg-green-100 text-green-800',
  Fitness: 'bg-orange-100 text-orange-800',
  Productivity: 'bg-indigo-100 text-indigo-800',
  Utilities: 'bg-gray-100 text-gray-800',
  Other: 'bg-pink-100 text-pink-800',
};

const SubscriptionList = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
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

      <div className="grid gap-6">
        {mockSubscriptions.map((subscription) => (
          <motion.div
            key={subscription._id}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
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
                    <p className="text-xs text-gray-500">Next Renewal</p>
                    <p className="text-sm font-medium">{format(new Date(subscription.renewalDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                  <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium">{subscription.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default SubscriptionList;