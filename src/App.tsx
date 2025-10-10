import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import MainLayout from "./Layout/MainLayout";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Pages/Login";
import PageNotFound from "./Pages/PageNotFound";
import Signup from "./Pages/Signup";
import CarBooking from "./Pages/CarBooking";
import MyBookings from "./Pages/MyBookings";
import MyProfile from "./Pages/MyProfile";
import AdminDashboard from "./Pages/AdminDashboard";
import EditBooking from "./Pages/EditBooking";
import ForgotPassword from "./Pages/forgotPassword";
import Support_Bookings from "./Pages/Support_Bookings";
import Support_Users from "./Pages/Support_Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Home />} />
          <Route path='/cars/car-booking/:carId' element={<CarBooking/>}/>
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path="/my-bookings/edit-booking/:bookingId" element={<EditBooking/>}/>
          <Route path="/my-profile" element={<MyProfile/>}/> 
          <Route path="/dashboard" element={<AdminDashboard/>}/> 
          <Route path="/support-bookings" element={<Support_Bookings/>}/>
          <Route path="/user-verification" element={<Support_Users/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
        <Route element={<AuthLayout />}>
          {/* login and signup page for testing purpose add your code in the particular component  */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
