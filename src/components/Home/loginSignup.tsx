import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import api from "../../lib/apis/apis.ts"
import { useAuth } from "../../context/AuthContext.tsx";

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    // =========================
    // SIGNUP
    // =========================
    if (!isLogin) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password
      ) {
        setError("Please fill in all fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log("Signup successful:", response.data);

      // Navigate to OTP verification
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          phone: formData.phone,
        },
      });

      return;
    }

    // =========================
    // LOGIN
    // =========================

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    const response = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("Login successful:", response.data);

    // Update global authentication state
    login(response.data.user);

    // Redirect after successful login
    navigate("/");

  } catch (error: any) {
    console.error("Authentication error:", error);

    setError(
      error?.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

const switchMode = () => {
  setIsLogin(!isLogin);
  setError("");

  setFormData({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
};



  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div
        className="
          w-full
          max-w-md
          bg-zinc-950
          border
          border-yellow-400/30
          rounded-2xl
          shadow-2xl
          shadow-yellow-500/10
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-8
            py-7
            bg-gradient-to-r
            from-yellow-500
            via-yellow-400
            to-yellow-500
            text-black
            text-center
          "
        >
          <h1 className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-sm mt-2 font-medium">
            {isLogin
              ? "Login to continue your journey"
              : "Join NH37 Car Rentals today"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-5"
        >
          {/* Name */}
          {!isLogin && (
            <div className="space-y-2">
              <Label className="text-white">
                Full Name
              </Label>

              <Input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="
                  bg-black
                  border-zinc-700
                  text-white
                  placeholder:text-zinc-500
                  focus-visible:ring-yellow-400
                  focus-visible:border-yellow-400
                "
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white">
              Email Address
            </Label>

            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="
                bg-black
                border-zinc-700
                text-white
                placeholder:text-zinc-500
                focus-visible:ring-yellow-400
                focus-visible:border-yellow-400
              "
            />
          </div>

          {/* Phone */}
          {!isLogin && (
            <div className="space-y-2">
              <Label className="text-white">
                Phone Number
              </Label>

              <Input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="
                  bg-black
                  border-zinc-700
                  text-white
                  placeholder:text-zinc-500
                  focus-visible:ring-yellow-400
                  focus-visible:border-yellow-400
                "
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white">
              Password
            </Label>

            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="
                bg-black
                border-zinc-700
                text-white
                placeholder:text-zinc-500
                focus-visible:ring-yellow-400
                focus-visible:border-yellow-400
              "
            />
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="space-y-2">
              <Label className="text-white">
                Confirm Password
              </Label>

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  bg-black
                  border-zinc-700
                  text-white
                  placeholder:text-zinc-500
                  focus-visible:ring-yellow-400
                  focus-visible:border-yellow-400
                "
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="
                text-red-400
                text-sm
                text-center
                bg-red-500/10
                border
                border-red-500/20
                rounded-lg
                py-2
              "
            >
              {error}
            </div>
          )}

          {/* Forgot Password */}
          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="
                  text-sm
                  text-yellow-400
                  hover:text-yellow-300
                  transition
                "
              >
                Forgot Password?
              </button>
            </div>
          )}

{/* Submit */}
<Button
  type="submit"
  disabled={loading}
  className="
    w-full
    rounded-xl
    py-6
    text-base
    font-semibold
    bg-yellow-400
    text-black
    hover:bg-yellow-300
    transition-all
    duration-300
    hover:scale-[1.02]
    disabled:opacity-70
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  "
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      <span>
        {isLogin ? "Logging in..." : "Creating account..."}
      </span>
    </div>
  ) : (
    isLogin ? "Login" : "Create Account"
  )}
</Button>


          

          
{/* Switch Login / Signup */}
<div className="text-center text-sm text-zinc-400">
  {isLogin
    ? "Don't have an account?"
    : "Already have an account?"}

  <button
    type="button"
    onClick={switchMode}
    disabled={loading}
    className="
      ml-2
      text-yellow-400
      font-semibold
      hover:text-yellow-300
    "
  >
    {isLogin ? "Create Account" : "Login"}
  </button>
</div>


          
        </form>
      </div>
    </div>
  );
};


export default LoginSignup;