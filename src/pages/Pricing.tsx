import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 subscriptions',
        'Basic analytics',
        'Email notifications',
        'Mobile access',
      ],
    },
    {
      name: 'Pro',
      price: '9.99',
      description: 'Best for active users',
      features: [
        'Unlimited subscriptions',
        'Advanced analytics',
        'Priority support',
        'Custom categories',
        'Spending insights',
        'Budget tracking',
        'Multiple payment methods',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '29.99',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Audit logs',
        'SSO authentication',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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
            Simple, Transparent
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Pricing for Everyone
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500"
          >
            Choose the perfect plan for your subscription management needs
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative p-8 bg-white rounded-2xl shadow-xl ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-indigo-600" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Link
                  to="/sign-up"
                  className="block w-full py-3 px-6 text-center rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-medium"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5 inline" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;