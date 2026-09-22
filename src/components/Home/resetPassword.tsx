
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import api from "../../lib/apis/apis";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !resetToken) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError(
        "Please fill in both password fields"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/reset-password",
        {
          resetToken,
          newPassword: password,
          confirmPassword,
        }
      );

      navigate("/password-reset-success", {
        replace: true,
      });
    } catch (error: any) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to reset password"
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
            Create New Password
          </h1>

          <p className="text-sm mt-2 font-medium">
            Secure your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8 space-y-5"
        >
          <div className="text-center mb-6">
            <p className="text-zinc-400 text-sm">
              Create a new password for
            </p>

            <p className="text-yellow-400 text-sm font-semibold mt-1">
              {email}
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label className="text-white">
              New Password
            </Label>

            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
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

            <p className="text-xs text-zinc-500">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-white">
              Confirm New Password
            </Label>

            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
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
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
