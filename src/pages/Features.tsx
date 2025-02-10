import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Shield, BarChart3, Zap, 
  Bell, Wallet, Clock, Settings,
  RefreshCw, PieChart, Lock, Smartphone,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Subscription Tracking',
      description: 'Track all your subscriptions in one place with detailed insights into spending patterns and usage.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get timely reminders for upcoming renewals and payment due dates to avoid any surprises.'
    },
    {
      icon: BarChart3,
      title: 'Spending Analytics',
      description: 'Visualize your subscription expenses with detailed charts and spending breakdowns.'
    },
    {
      icon: Wallet,
      title: 'Budget Management',
      description: 'Set budgets for different categories and get alerts when you are approaching limits.'
    },
    {
      icon: Clock,
      title: 'Renewal Timeline',
      description: 'View all your upcoming renewals in an interactive timeline for better planning.'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Your subscription data is encrypted and stored with bank-level security protocols.'
    },
    {
      icon: RefreshCw,
      title: 'Auto-Sync',
      description: 'Automatically sync and update subscription details across all your devices.'
    },
    {
      icon: PieChart,
      title: 'Category Insights',
      description: 'Understand your spending patterns across different subscription categories.'
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Your data is protected with end-to-end encryption and never shared with third parties.'
    },
    {
      icon: Settings,
      title: 'Custom Categories',
      description: 'Create and manage custom categories to organize subscriptions your way.'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Get personalized recommendations to optimize your subscription spending.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Access your subscription dashboard anytime, anywhere with our mobile-friendly interface.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            Powerful Features for
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Smart Subscription Management
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500"
          >
            Everything you need to take control of your digital subscriptions
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="absolute -top-6 left-6">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-4 text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;