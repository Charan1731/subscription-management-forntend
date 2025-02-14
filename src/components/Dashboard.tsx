import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Calendar, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { format, addDays, isBefore } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Subscription } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/sign-in');
        return;
      }

      try {
        const response = await fetch(`https://budgetbox-backend.vercel.app/api/v1/subscriptions/user/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/sign-in');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }

        const data = await response.json();
        setSubscriptions(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate, user]);
  const calculateStats = () => {
    const now = new Date();
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    const monthlySpend = activeSubscriptions.reduce((total, sub) => {
      const price = sub.price;
      switch (sub.frequency) {
        case 'daily':
          return total + (price * 30);
        case 'weekly':
          return total + (price * 4);
        case 'monthly':
          return total + price;
        case 'yearly':
          return total + (price / 12);
        default:
          return total;
      }
    }, 0);

    const lastMonthSpend = monthlySpend * 0.9; 
    const spendDifference = monthlySpend - lastMonthSpend;

    const nextRenewal = activeSubscriptions
      .reduce((earliest, sub) => {
        const renewalDate = new Date(sub.renewalDate);
        return !earliest || isBefore(renewalDate, earliest.date)
          ? { date: renewalDate, name: sub.name }
          : earliest;
      }, null as { date: Date; name: string } | null);

    const expiringCount = activeSubscriptions.filter(sub => {
      const renewalDate = new Date(sub.renewalDate);
      return isBefore(renewalDate, addDays(now, 7));
    }).length;

    return [
      { 
        icon: CreditCard,
        label: 'Active Subscriptions',
        value: activeSubscriptions.length.toString(),
        change: `${activeSubscriptions.length - subscriptions.length + activeSubscriptions.length} from last month`,
        color: 'from-blue-500 to-indigo-600'
      },
      {
        icon: TrendingUp,
        label: 'Monthly Spend',
        value: `$${monthlySpend.toFixed(2)}`,
        change: `${spendDifference >= 0 ? '+' : '-'}$${Math.abs(spendDifference).toFixed(2)} from last month`,
        color: 'from-green-500 to-emerald-600'
      },
      {
        icon: Calendar,
        label: 'Next Renewal',
        value: nextRenewal ? format(nextRenewal.date, 'MMM dd, yyyy') : 'No renewals',
        change: nextRenewal?.name || 'No active subscriptions',
        color: 'from-purple-500 to-pink-600'
      },
      {
        icon: AlertCircle,
        label: 'Expiring Soon',
        value: expiringCount.toString(),
        change: 'Within next 7 days',
        color: 'from-orange-500 to-red-600'
      }
    ];
  };
  const calculateRecentActivity = () => {
    return subscriptions
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 3)
      .reverse()
      .map(sub => ({
        type: sub.status === 'active' ? 'new' : sub.status,
        service: sub.name,
        amount: sub.price,
        date: sub.startDate,
      }));
  };
  const calculateSpendingBreakdown = () => {
    const categoryTotals = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((acc, sub) => {
        const monthlyPrice = (() => {
          switch (sub.frequency) {
            case 'daily': return sub.price * 30;
            case 'weekly': return sub.price * 4;
            case 'monthly': return sub.price;
            case 'yearly': return sub.price / 12;
            default: return sub.price;
          }
        })();

        acc[sub.category] = (acc[sub.category] || 0) + monthlyPrice;
        return acc;
      }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = calculateStats();
  const recentActivity = calculateRecentActivity();
  const spendingBreakdown = calculateSpendingBreakdown();

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
            <Link to="/app/subscriptions" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'active' ? 'bg-green-100 text-green-600' :
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
                    activity.type === 'active' ? 'text-green-600' :
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
            {spendingBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="font-medium text-gray-900">${item.amount.toFixed(2)}</span>
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