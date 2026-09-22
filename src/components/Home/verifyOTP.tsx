import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import api from "../../lib/apis/apis";

export const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
const location = useLocation();
  const email = location.state?.email;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };



const handleVerify = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length !== 6) {
    setError("Please enter the complete 6-digit OTP");
    return;
  }

  if (!email) {
    setError("Email not found. Please register again.");
    return;
  }

  try {
    setIsLoading(true);
    setError("");

    console.log("Verifying email OTP:", enteredOtp);

    const response = await api.post(
      "/auth/verify-email-otp",
      {
        email,
        otp: enteredOtp,
      }
    );

    console.log(
      "Email verification successful:",
      response.data
    );

    // OTP verified successfully
    navigate("/email-verified", {
      replace: true,
    });

  } catch (error: any) {
    console.error(
      "Email verification error:",
      error
    );

    setError(
      error?.response?.data?.message ||
        "Invalid or expired OTP"
    );
  } finally {
    setIsLoading(false);
  }
};



const handleResendOtp = async () => {
  if (!email) {
    setError("Email not found. Please register again.");
    return;
  }

  try {
    setIsLoading(true);
    setError("");

    console.log("Resending email OTP...");

    const response = await api.post(
      "/auth/send-email-otp",
      {
        email,
      }
    );

    console.log(
      "OTP resent successfully:",
      response.data
    );

    // Reset OTP inputs
    setOtp(["", "", "", "", "", ""]);

    // Restart your timer here if you have one
    setTimeLeft(60);

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
    setIsLoading(false);
  }
};

  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div
        className="
          w-full
          max-w-md
          bg-zinc-950
          border
          border-yellow-400/30
          rounded-2xl
          overflow-hidden
          shadow-2xl
          shadow-yellow-500/10
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
            Verify Your Account
          </h1>

          <p className="text-sm mt-2 font-medium">
            Enter the verification code sent to you
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <p className="text-zinc-400 text-sm">
              Enter the 6-digit OTP to verify your account
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  w-11
                  h-14
                  sm:w-12
                  sm:h-16
                  text-center
                  text-xl
                  font-bold
                  text-white
                  bg-black
                  border
                  border-zinc-700
                  rounded-lg
                  outline-none
                  transition-all
                  focus:border-yellow-400
                  focus:ring-2
                  focus:ring-yellow-400/30
                "
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mt-5
                text-red-400
                text-sm
                text-center
              "
            >
              {error}
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="
              w-full
              mt-8
              py-6
              rounded-xl
              bg-yellow-400
              text-black
              font-semibold
              text-base
              hover:bg-yellow-300
              transition-all
              hover:scale-[1.02]
            "
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-zinc-400">
              Didn't receive the code?
            </p>

            <button
              onClick={handleResendOtp}
              className="
                mt-2
                text-sm
                font-semibold
                text-yellow-400
                hover:text-yellow-300
                transition
              "
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function setTimeLeft(_arg0: number) {
  throw new Error("Function not implemented.");
}
