
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

import api from "../../lib/apis/apis";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState<string[]>(
    Array(6).fill("")
  );

  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  // Redirect if page is opened directly
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", {
        replace: true,
      });
    }
  }, [email, navigate]);

  // OTP timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = Array(6).fill("");

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password/verify-otp",
        {
          email,
          otp: otpValue,
        }
      );

      const { resetToken } = response.data;

      if (!resetToken) {
        setError(
          "Reset token was not received. Please try again."
        );
        return;
      }

      navigate("/reset-password", {
        state: {
          email,
          resetToken,
        },
      });
    } catch (error: any) {
      console.error(
        "Verify reset OTP error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/auth/forgot-password/send-otp",
        {
          email,
        }
      );

      setTimer(60);
      setOtp(Array(6).fill(""));

      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error(
        "Resend OTP error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

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
            Verify OTP
          </h1>

          <p className="text-sm mt-2 font-medium">
            Verify your identity to continue
          </p>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-8"
        >
          {/* Email */}
          <div className="text-center mb-8">
            <p className="text-zinc-400 text-sm">
              We've sent a 6-digit OTP to
            </p>

            <p className="text-yellow-400 font-semibold mt-1">
              {email}
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                onPaste={handlePaste}
                className="
                  w-11
                  h-13
                  sm:w-12
                  sm:h-14
                  text-center
                  text-lg
                  sm:text-xl
                  font-bold
                  bg-black
                  border
                  border-zinc-700
                  text-white
                  rounded-xl
                  outline-none
                  transition
                  focus:border-yellow-400
                  focus:ring-1
                  focus:ring-yellow-400
                "
              />
            ))}
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
                mt-5
              "
            >
              {error}
            </div>
          )}

          {/* Verify */}
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
              mt-7
              disabled:opacity-50
              disabled:hover:scale-100
            "
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </Button>

          {/* Resend */}
          <div className="text-center mt-6">
            {timer > 0 ? (
              <p className="text-sm text-zinc-500">
                Resend OTP in{" "}
                <span className="text-yellow-400 font-semibold">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="
                  text-sm
                  text-yellow-400
                  font-semibold
                  hover:text-yellow-300
                  disabled:opacity-50
                "
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Back */}
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
              className="
                text-sm
                text-zinc-400
                hover:text-white
                transition
              "
            >
              ← Change email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyResetOtp;

