import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";

const Profile = () => {
  const { user } = useAuth(); // Ensure setUser is available to update context
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false); // Close the modal
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${user?._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/sign-in");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      setSuccess("Account deleted successfully. Redirecting to sign-in...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);

      // Construct update payload (avoid sending empty password)
      const updateData: { name: string; password?: string } = { name };
      if (password) updateData.password = password;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/sign-in");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
      setSuccess("Profile updated successfully navigating to sign-in");
      setPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto px-4 py-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-sm p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-500/40" />
        <div className="relative flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <div className="w-full h-full p-4 flex items-center justify-center text-white bg-gray-800">
                  <span className="text-4xl">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user?.name.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl mt-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Profile
          </h2>
          
          {/* Delete Button Moved Outside the Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 text-red-600 bg-red-100 opacity-90 hover:opacity-100 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🌀</span>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className={labelClasses}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="Enter your name"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="password" className={labelClasses}>
                Password (Leave blank to keep current)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="Enter your new password"
              />
            </motion.div>
          </div>

          {/* Update Button Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end pt-4"
          >
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🌀</span>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </motion.div>

          {/* Error and Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-center"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-center"
            >
              {success}
            </motion.div>
          )}
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
    </motion.div>
  );
};

export default Profile;