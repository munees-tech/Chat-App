import React, { useState } from "react";
import { useAuthStore } from "../store/useStoreAuth.js";
import { MessageSquare, User, Mail, Lock } from "lucide-react";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    // Add form validation logic here
    return formData.fullName && formData.email && formData.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signUp(formData);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex justify-center items-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              Create Your Account
            </h1>
            <p className="text-sm sm:text-base text-base-content/60">
              Start With Your Free Account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-base-content/40 absolute left-3 top-3" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Munees"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-base-content/40 absolute left-3 top-3" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-base-content/40 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-base-content/40"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full mt-6 ${
                isSigningUp ? "loading" : ""
              }`}
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex items-center justify-center bg-primary text-white p-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Welcome to Chat App!
        </h2>
      </div>
    </div>
  );
};

export default SignupPage;