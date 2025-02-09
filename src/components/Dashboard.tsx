import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const stats = [
    { 
      icon: CreditCard,
      label: 'Active Subscriptions',
      value: '12',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      label: 'Monthly Spend',
      value: '$249.99',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Calendar,
      label: 'Next Renewal',
      value: format(new Date(), 'MMM dd, yyyy'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: AlertCircle,
      label: 'Expiring Soon',
      value: '2',
      color: 'from-orange-500 to-red-600'
    }
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
        {stats.map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{label}</h3>
              <p className="mt-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color}">
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Dashboard;