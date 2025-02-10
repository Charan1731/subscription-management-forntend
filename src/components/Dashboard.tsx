import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Calendar, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const stats = [
    { 
      icon: CreditCard,
      label: 'Active Subscriptions',
      value: '12',
      change: '+2 from last month',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      label: 'Monthly Spend',
      value: '$249.99',
      change: '+$24.99 from last month',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Calendar,
      label: 'Next Renewal',
      value: format(new Date(), 'MMM dd, yyyy'),
      change: 'Netflix Premium',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: AlertCircle,
      label: 'Expiring Soon',
      value: '2',
      change: 'Within next 7 days',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const recentActivity = [
    {
      type: 'renewal',
      service: 'Spotify Premium',
      amount: 9.99,
      date: '2024-02-28',
    },
    {
      type: 'new',
      service: 'ChatGPT Plus',
      amount: 20.00,
      date: '2024-02-25',
    },
    {
      type: 'cancelled',
      service: 'Adobe Creative Cloud',
      amount: 52.99,
      date: '2024-02-20',
    },
  ];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
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
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{label}</h3>
              <p className={`mt-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                {value}
              </p>
              <p className="mt-2 text-sm text-gray-500">{change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'renewal' ? 'bg-green-100 text-green-600' :
                    activity.type === 'new' ? 'bg-blue-100 text-blue-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.service}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(activity.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${activity.amount.toFixed(2)}</p>
                  <p className={`text-sm capitalize ${
                    activity.type === 'renewal' ? 'text-green-600' :
                    activity.type === 'new' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {activity.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Spending Breakdown</h3>
            <select className="text-sm text-gray-600 border rounded-md px-2 py-1">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="space-y-4">
            {[
              { category: 'Entertainment', amount: 45.97, percentage: 35 },
              { category: 'Productivity', amount: 29.99, percentage: 25 },
              { category: 'Education', amount: 19.99, percentage: 20 },
              { category: 'Other', amount: 15.99, percentage: 20 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="font-medium text-gray-900">${item.amount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;