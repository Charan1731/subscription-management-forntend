import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import NewSubscription from './pages/NewSubscription';
import EditSubscription from './pages/EditSubscription';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import { CreditCard } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/app/*"
            element={
              <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                  <Navbar />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto px-4 py-8"
                  >
                    <div className="flex items-center justify-center mb-8">
                      <CreditCard className="w-12 h-12 text-indigo-600 mr-4" />
                      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        BudegetBox
                      </h1>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/subscriptions" element={<SubscriptionList />} />
                        <Route path="/subscriptions/new" element={<NewSubscription />} />
                        <Route path="/subscriptions/edit/:id" element={<EditSubscription />} />
                      </Routes>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </AuthGuard>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;