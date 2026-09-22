
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login-signup", {
        replace: true,
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

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
            You're All Set!
          </h1>

          <p className="text-sm mt-2 font-medium">
            Your email has been verified
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
            Email Verified Successfully
          </h2>

          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Your email address has been verified successfully.
            Your NH37 Car Rentals account is now ready to use.
          </p>

          {/* Redirect Message */}
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
              <div
                className="
                  w-4
                  h-4
                  border-2
                  border-zinc-700
                  border-t-yellow-400
                  rounded-full
                  animate-spin
                "
              />

              <span>
                Redirecting you to login...
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="
                h-full
                bg-yellow-400
                rounded-full
                animate-[progress_2.5s_linear_forwards]
              "
            />
          </div>

        </div>
      </div>

      {/* Progress Animation */}
      <style>
        {`
          @keyframes progress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EmailVerified;

