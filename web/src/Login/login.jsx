import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";
import Toast from "../shared/components/Toast";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const credentials = {
    admin: {
      email: "admin@gmail.com",
      password: "admin123",
    },
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = "admin";

    if (role && email && password) {
      if (
        email === credentials.admin.email &&
        password === credentials.admin.password
      ) {
        localStorage.setItem("loggedInUser", JSON.stringify({ role, email }));
        setIsLoggedIn(true);
        Toast("Login successful!", "success");
        if (role === "admin") {
          navigate("/dashboard");
        }
      } else {
        Toast("Incorrect email or password.", "error");
      }
    } else {
      Toast("Please fill all fields.", "error");
    }
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      if (loggedInUser.role === "admin") {
        navigate("/dashboard");
      } else if (loggedInUser.role === "cashier") {
        navigate("/cashier/billing");
      }
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-blue-600"></div>
      <div className="flex-1 bg-blue-100"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12">
              <h2 className="text-3xl font-bold mb-8">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-50 text-black pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-50 text-black pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  Login <ChevronRight className="ml-2" />
                </motion.button>
              </form>
              
            </div>
            <div className="md:w-1/2 bg-gray-50 p-12 flex flex-col justify-center items-center">
              <img src={Logo} alt="Project Progress" className="mb-8" />
              <h3 className="text-2xl font-bold mb-4">Welcome</h3>
              <p className="text-center text-gray-600 mb-8">
              Welcome to the admin panel of Erase Poverty. Please log in to manage donation campaigns, track contributions, and oversee the progress of initiatives aimed at eradicating poverty. Authorized access only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}