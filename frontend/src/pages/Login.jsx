import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/clogo.png"; // Make sure the logo.png file is in the correct path

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password!");
    } else {
      alert("User logged in successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-blue-300 bg-opacity-50 p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700 transform hover:scale-105 transition duration-500 flex">
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img src={logo} alt="Logo" className="w-3/4" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6 whitespace-nowrap">
            ManageMate
          </h1>
          <h2 className="text-gray-800 text-3xl font-extrabold mb-6 text-center tracking-wide">
            Welcome Back
          </h2>
          {error && <p className="text-red-500 text-sm text-center bg-red-900 p-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900 w-full"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold tracking-wide transition duration-300 shadow-lg w-full"
            >
              Login
            </button>
          </form>
          <p className="text-gray-900 text-center mt-4">
            Don't have an account? 
            <Link to="/register" className="text-blue-800 hover:text-blue-500"> Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
