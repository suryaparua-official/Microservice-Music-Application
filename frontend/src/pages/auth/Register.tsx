import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../context/user/UserContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { registerUser, btnloading } = useUserData();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    registerUser(name, email, password, navigate);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-[#121212] rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Sign up to Music App
        </h2>

        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Enter Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-[#2a2a2a] text-white text-sm
                         px-3 py-2 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Enter Email
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-[#2a2a2a] text-white text-sm
                         px-3 py-2 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Enter Password
            </label>
            <input
              type="password"
              placeholder="Enter a password"
              className="w-full bg-[#2a2a2a] text-white text-sm
                         px-3 py-2 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={btnloading}
            className="w-full mt-6 bg-[#1DB954] text-black
                       font-semibold py-2 rounded-full
                       hover:scale-[1.02] transition disabled:opacity-60"
          >
            {btnloading ? "Please wait..." : "Sign up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to={"/login"}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
