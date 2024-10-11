import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, ChevronRight } from "lucide-react";
import Toast from "../shared/components/Toast";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const credentials = {
    admin: {
      email: "admin@gmail.com",
      password: "admin123",
    },
    
  };

  useEffect(() => {
    // Check if the user is already logged in
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
        (
          email === credentials.admin.email &&
          password === credentials.admin.password) 
    )
       {
        // Store login status in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify({ role, email }));
        setIsLoggedIn(true);
        Toast("Login successful!", "success");
        if (role === "admin") {
          navigate("/dashboard"); // Redirect to admin route
        } 
      } else {
        // Show error toast if credentials are wrong
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
    <div className="bg-gradient-to-r from-blue-500 to-red-300">
    <div><center><h1>welcome</h1></center></div>
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-r from-red-300 to-blue-500 p-12 text-white flex flex-col justify-center items-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center" // Added this line
            >
              <img src={Logo} alt="" />
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg text-center">
                Log in to access your Erase Poverty dashboard.
              </p>
            </motion.div>
          </div>

          <div className="md:w-1/2 p-12">
            <motion.h3
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-semibold mb-6 text-gray-800"
            >
              Login to Your Account
            </motion.h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-black pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-black pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>
             
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-400 hover:to-blue-600 transition-colors duration-200 flex items-center justify-center"
              >
                Login <ChevronRight className="ml-2" />
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
}
