
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import MainLogo from "../../assets/images/MainLogo.png";

import { useAuth } from "../../context/AuthContext";


export const UniversalNavBar = () => {
  const navigate = useNavigate();

  // Temporary login state
  // Replace this later with your actual authentication state
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    navigate("/login-signup");
  };

  const handleProfileClick = () => {
    setShowMenu((prev) => !prev);
  };



  return (
    <div className="relative">

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-30">

        <div
          className="
            flex items-center justify-between
            px-5 sm:px-8 md:px-12
            py-0
            bg-gradient-to-l
            from-black via-zinc-950 to-yellow-500/80
            border-b border-yellow-400/30
            shadow-lg
          "
        >

          {/* Logo */}
          <div
            className="
              cursor-pointer
              transition-transform
              duration-300
              hover:scale-105
            "
            onClick={() => navigate("/")}
          >
            <img
              src={MainLogo}
              alt="NH37 Car Rentals"
              className="h-auto w-auto object-contain"
            />
          </div>


          {/* Right Side */}
          <div className="relative">

            {isLoading ? null : !isLoggedIn ? (

              /* LOGIN BUTTON */
              <Button
                onClick={() => navigate("/login-signup")}
                className="
                  rounded-full
                  px-6
                  bg-yellow-400
                  text-black
                  font-semibold
                  hover:bg-yellow-300
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                Login
              </Button>

            ) : (

              /* LOGGED IN */
              <div className="flex flex-col items-center">

                {/* Profile Icon */}
                <button
                  onClick={handleProfileClick}
                  className="
                    h-11
                    w-11
                    rounded-full
                    bg-yellow-400
                    flex
                    items-center
                    justify-center
                    text-black
                    font-bold
                    shadow-md
                    hover:bg-yellow-300
                    hover:scale-105
                    transition-all
                    duration-300
                  "
                  aria-label="Account"
                >
                  <span className="text-xl">
                    👤
                  </span>
                </button>

                {/* Welcome Username */}
                <span
                  className="
                    text-white
                    text-xs
                    mt-1
                    whitespace-nowrap
                  "
                >
                  Welcome {user?.name}
                </span>


                {/* Account Dropdown */}
                {showMenu && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[70px]
                      w-56
                      bg-black
                      border
                      border-yellow-400/30
                      rounded-xl
                      shadow-2xl
                      shadow-black/50
                      overflow-hidden
                    "
                  >

                    {/* User Header */}
                    <div
                      className="
                        px-4
                        py-4
                        border-b
                        border-zinc-800
                      "
                    >
                      <p className="text-white font-semibold">
                        Welcome back!
                      </p>

                      <p className="text-yellow-400 text-sm mt-1">
                        {user?.name}
                      </p>

                      {user?.email && (
                        <p className="text-zinc-500 text-xs mt-1 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>


                    {/* My Bookings */}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (user?.role === "ADMIN") 
                          { 
                          navigate("/admin/bookings"); 
                          } 
                        else 
                          { navigate("/bookings/my"); 

                          }
                      }}
                      className="
                        w-full
                        px-4
                        py-3
                        text-left
                        text-white
                        text-sm
                        hover:bg-zinc-900
                        transition
                      "
                    >
                      <span className="mr-3">
                        📋
                      </span>

                      My Bookings
                    </button>
                    
                    {user?.role === "ADMIN" && (
      <button
        onClick={() => {
          setShowMenu(false);
          navigate("/admin/add-car");
        }}
        className="
          w-full
          px-4
          py-3
          text-left
          text-yellow-300
          text-sm
          border-t
          border-zinc-800
          hover:bg-zinc-900
          transition
        "
      >
        <span className="mr-3">
          🚗
        </span>

        Add Car Self-Drive
      </button>
    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        px-4
                        py-3
                        text-left
                        text-red-400
                        text-sm
                        border-t
                        border-zinc-800
                        hover:bg-zinc-900
                        transition
                      "
                    >
                      <span className="mr-3">
                        ↪
                      </span>

                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </nav>
    </div>
      
  );
};
