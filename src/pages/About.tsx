import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'We put our users first in everything we do, creating intuitive and helpful solutions for subscription management.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously innovate and improve our platform to provide the best subscription management experience.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about helping people take control of their digital subscriptions and financial well-being.'
    }
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
            About
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              SubScape
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500"
          >
            We're on a mission to simplify subscription management for everyone
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 prose prose-lg mx-auto text-gray-500"
        >
          <p>
            SubScape was born from a simple observation: managing multiple digital subscriptions
            has become increasingly complex in today's world. We believed there had to be a better way
            to handle this modern challenge.
          </p>
          <p>
            Our platform combines powerful technology with user-friendly design to help you track,
            manage, and optimize your subscriptions. Whether you're an individual looking to better
            manage personal subscriptions or a business handling multiple service subscriptions,
            SubScape provides the tools you need.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{value.title}</h3>
              <p className="mt-2 text-gray-500">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
          <p className="mt-4 text-xl text-gray-500">
            We'd love to hear from you. Reach out to us at{' '}
            <a href="mailto:contact@subscape.com" className="text-indigo-600 hover:text-indigo-500">
              contact@subscape.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;