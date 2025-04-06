import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const subscriptionTypes = [
    {
      name: "Entertainment",
      examples: "Netflix, Spotify, Disney+",
      color: "from-purple-600 to-indigo-600",
      path: "/app/subscriptions/new?category=Entertainment"
    },
    {
      name: "Education",
      examples: "Coursera, Udemy, Skillshare",
      color: "from-blue-600 to-sky-500",
      path: "/app/subscriptions/new?category=Education"
    },
    {
      name: "Health",
      examples: "Gym, Meditation apps, Health insurance",
      color: "from-green-600 to-emerald-500",
      path: "/app/subscriptions/new?category=Health"
    },
    {
      name: "Productivity",
      examples: "Adobe, Microsoft 365, Notion",
      color: "from-indigo-600 to-purple-600",
      path: "/app/subscriptions/new?category=Productivity"
    },
    {
      name: "Other",
      examples: "Other subscription types",
      color: "from-gray-600 to-slate-500",
      path: "/app/subscriptions/new?category=Other"
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full shadow-xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Create New Subscription
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Select a category to get started with your new subscription:
            </p>
            
            <div className="grid gap-3">
              {subscriptionTypes.map((type, index) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={type.path}
                    className="block"
                    onClick={onClose}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r ${type.color}`}>
                            {type.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{type.examples}</p>
                        </div>
                        <div className={`p-2 rounded-full bg-gradient-to-r ${type.color} text-white`}>
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <Link
                to="/app/subscriptions/new"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={onClose}
              >
                Or create a custom subscription
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateSubscriptionModal; 