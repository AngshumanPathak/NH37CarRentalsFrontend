
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import api from "../../lib/apis/apis";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/forgot-password/send-otp",
        {
          email,
        }
      );

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });
    } catch (error: any) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            Forgot Password?
          </h1>

          <p className="text-sm mt-2 font-medium">
            Let's get you back on the road
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-5"
        >
          <div className="text-center mb-6">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Enter the email address associated with your
              account. We'll send you a 6-digit OTP to verify
              your identity.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white">
              Email Address
            </Label>

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              disabled:opacity-50
              disabled:hover:scale-100
            "
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>

          {/* Back */}
          <div className="text-center text-sm text-zinc-400 pt-2">
            Remember your password?

            <button
              type="button"
              onClick={() =>
                navigate("/login-signup")
              }
              className="
                ml-2
                text-yellow-400
                font-semibold
                hover:text-yellow-300
              "
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

