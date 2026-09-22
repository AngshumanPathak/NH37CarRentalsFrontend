
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home/home";
import SelfDrive from "./components/Home/selfdriver";
import WithDriver from "./components/Home/withDriver";
import LoginSignup from "./components/Home/loginSignup";
import { VerifyOtp } from "./components/Home/verifyOTP";
import ForgotPassword from "./components/Home/forgotPassword";
import VerifyResetOtp from "./components/Home/verifyResetOTP";
import ResetPassword from "./components/Home/resetPassword";
import PasswordResetSuccess from "./components/Home/resetPasswordSuccess";
import EmailVerified from "./components/Home/emailVerified";
import AddCar from "./components/Cars/addCar";
import Booking from "./components/Booking/booking";
import MyBookings from "./components/Booking/myBookings";
import BookingConfirmation  from "./components/Booking/bookingConfirmation";
import AdminBookings from "./components/Admin/adminBooking";
import AdminBookingDetails from "./components/Admin/adminBookingDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/self-drive" element={<SelfDrive />} />

      <Route path="/with-driver" element={<WithDriver />} />

      <Route path="/login-signup" element={<LoginSignup />} />

      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/verify-reset-otp"
        element={<VerifyResetOtp />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/password-reset-success"
        element={<PasswordResetSuccess />}
      />

      <Route
        path="/email-verified"
        element={<EmailVerified />}
      />

      <Route
        path="/admin/add-car"
        element={<AddCar />}
      />

      <Route
        path="/booking/:carId"
        element={<Booking />}
      />
      <Route 
       path="/bookings/my" 
       element={<MyBookings />} />
      <Route
        path="/bookings/:bookingId/confirmation"
        element={<BookingConfirmation/>} />

      <Route
    path="/admin/bookings"
    element={<AdminBookings />}
  />

  <Route
  path="/admin/bookings/:id"
  element={<AdminBookingDetails />}
/>
    </Routes>

    
      
  
  );
}

export default App;

