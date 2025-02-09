import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, BarChart3, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Track Subscriptions',
      description: 'Monitor all your subscriptions in one place with detailed insights and reminders.'
    },
    {
      icon: BarChart3,
      title: 'Spending Analytics',
      description: 'Visualize your subscription spending patterns with intuitive charts and reports.'
    },
    {
      icon: Shield,
      title: 'Secure Management',
      description: 'Your subscription data is encrypted and securely stored with bank-level security.'
    },
    {
      icon: Zap,
      title: 'Smart Alerts',
      description: 'Get notified about upcoming renewals, price changes, and optimization opportunities.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-6 pb-16 sm:pb-24">
            <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link to="/" className="flex items-center space-x-2">
                    <CreditCard className="h-8 w-8 text-indigo-600" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      SubScape
                    </span>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-10">
                <Link to="/features" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  About
                </Link>
              </div>
              <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                <div className="inline-flex items-center space-x-4">
                  <Link to="/sign-in" className="text-base font-medium text-gray-600 hover:text-indigo-600">
                    Sign in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24"
            >
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Take Control of Your</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Digital Subscriptions
                  </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Effortlessly manage all your subscriptions in one place. Track spending, get renewal reminders, and optimize your subscription costs.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/sign-up"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10"
                    >
                      Start Managing Now
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 bg-white/50 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to manage subscriptions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features to help you take control of your digital spending
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="pt-8 text-center">
                    <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-4 text-base text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-100">Start managing your subscriptions today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex rounded-md shadow"
            >
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;