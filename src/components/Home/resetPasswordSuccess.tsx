import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

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
            All Set!
          </h1>

          <p className="text-sm mt-2 font-medium">
            Your account is secure
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10 text-center">

          {/* Success Circle */}
          <div
            className="
              mx-auto
              w-20
              h-20
              rounded-full
              bg-yellow-400
              flex
              items-center
              justify-center
              mb-7
              shadow-lg
              shadow-yellow-500/20
            "
          >
            <span className="text-4xl font-bold text-black">
              ✓
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white">
            Password Reset Successfully
          </h2>

          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Your password has been updated successfully.
            You can now login and continue your journey
            with NH37 Car Rentals.
          </p>

          <Button
            onClick={() => navigate("/login-signup")}
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
              mt-8
            "
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;