import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../context/user/UserContext";

const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const navigate                = useNavigate();
  const { registerUser, btnloading } = useUserData();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser(name, email, password, navigate);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-dim">Join Music App for free</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-2xl border border-divider p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-dim uppercase tracking-wide">
              Full name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-elevated text-white text-sm px-3.5 py-2.5 rounded-lg
                         border border-divider
                         focus:outline-none focus:ring-2 focus:ring-accent
                         placeholder:text-muted transition-colors duration-150"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-dim uppercase tracking-wide">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-elevated text-white text-sm px-3.5 py-2.5 rounded-lg
                         border border-divider
                         focus:outline-none focus:ring-2 focus:ring-accent
                         placeholder:text-muted transition-colors duration-150"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-dim uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-elevated text-white text-sm px-3.5 py-2.5 rounded-lg
                         border border-divider
                         focus:outline-none focus:ring-2 focus:ring-accent
                         placeholder:text-muted transition-colors duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={btnloading}
            className="mt-1 w-full bg-accent hover:bg-accent-light text-black font-semibold
                       py-2.5 rounded-full transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {btnloading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-dim mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-semibold hover:text-accent transition-colors duration-150"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
