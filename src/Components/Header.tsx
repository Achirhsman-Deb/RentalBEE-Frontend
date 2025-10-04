import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProfileDropDown } from "./Inputs/DropDown";
import { AppDispatch, RootState } from "../store/store";
import { fetchNotifications, logoutUser } from "../slices/ThunkAPI/ThunkAPI";
import NotificationPanel from "./NotificationPanel";
import { BookCheck, Car, House } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [loggedin, setloggedin] = useState<boolean>(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [NotiOpen, setNotiOpen] = useState<boolean>(false);
  const NotificationBellRef = useRef(null);
  const { items } = useSelector((state: RootState) => state.notifications);
  const [localNotis, setLocalNotis] = useState(items);

  const getLinkClass = (path: string): string => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    return isActive
      ? "border-b-[2px] border-[#FFD60A] pb-1 text-[#222222]"
      : "hover:border-b-2 hover:border-[#E6B800] pb-1 text-[#222222]";
  };

  useEffect(() => {
    if (user) {
      setloggedin(true);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.idToken) {
        dispatch(fetchNotifications(user.idToken));
      }
    } else setloggedin(false);
  }, [user]);
  
  useEffect(() => {
    setLocalNotis(items);
  }, [items]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-[#FFFBEA] border-b border-gray-200 px-4 py-4 flex items-center justify-between fixed w-full top-0 z-[60]">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <span className="text-xl font-semibold">
              Rental
              <span className="text-[#FFD60A] font-bold">BEE</span>
            </span>
          </Link>
        </div>

        {/* Center: Links (hidden on mobile) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-sm font-medium max-[768px]:hidden">
          {user?.role === "ADMIN" ? (
            <NavLink to="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </NavLink>
          ) : (
            <>
              <NavLink to="/" className={getLinkClass("/")}>
                Home
              </NavLink>
              <NavLink to="/cars" className={getLinkClass("/cars")}>
                Cars
              </NavLink>
              {loggedin && (
                <NavLink to="/my-bookings" className={getLinkClass("/my-bookings")}>
                  My bookings
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right: Profile + Notification */}
        <div className="flex items-center space-x-4 text-sm text-[#222222]">
          {loggedin ? (
            <>
              {/* Mobile dropdown */}
              <div className="min-[864px]:hidden">
                <ProfileDropDown
                  label={``}
                  options={[
                    { value: "profile", label: "My Profile" },
                    { value: "logout", label: "Logout" },
                  ]}
                  onchange={(value) => {
                    if (value[0] === "logout") {
                      setloggedin(false);
                      localStorage.removeItem("user");
                      dispatch(logoutUser());
                      navigate("/");
                    } else if (value[0] === "profile") {
                      navigate("/my-profile");
                    }
                  }}
                >
                  <img
                    src={
                      user?.imageUrl ||
                      "https://res.cloudinary.com/duyv9y7fc/image/upload/v1756390169/20171206_01_ixegsw.jpg"
                    }
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                </ProfileDropDown>
              </div>

              {/* Desktop dropdown */}
              <span className="text-[#222222] max-[864px]:hidden cursor-pointer select-none">
                <ProfileDropDown
                  label={`Hello, ${user?.username.split(" ")[0]}`}
                  options={[
                    { value: "profile", label: "My Profile" },
                    { value: "logout", label: "Logout" },
                  ]}
                  onchange={(value) => {
                    if (value[0] === "logout") {
                      setloggedin(false);
                      localStorage.removeItem("user");
                      dispatch(logoutUser());
                      navigate("/");
                    } else if (value[0] === "profile") {
                      navigate("/my-profile");
                    }
                  }}
                >
                  <img
                    src={
                      user?.imageUrl ||
                      "https://res.cloudinary.com/duyv9y7fc/image/upload/v1756390169/20171206_01_ixegsw.jpg"
                    }
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                </ProfileDropDown>
              </span>

              {/* Notification Bell */}
              <div
                className="relative flex justify-center"
                ref={NotificationBellRef}
                onClick={() => setNotiOpen((prev) => !prev)}
              >
                <button title="Notifications" aria-label="Notifications">
                  {/* Your existing SVG bell */}
                  <svg
                    width="17"
                    height="20"
                    viewBox="0 0 17 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.7 6.80924C1.7 5.00332 2.41643 3.27136 3.69167 1.99438C4.96692 0.7174 6.69653 0 8.5 0C10.3035 0 12.0331 0.7174 13.3083 1.99438C14.5836 3.27136 15.3 5.00332 15.3 6.80924V10.8071L17 13.3606V17.0231H12.2306C12.0373 17.8689 11.563 18.624 10.8854 19.1647C10.2078 19.7055 9.36693 20 8.50043 20C7.63392 20 6.79308 19.7055 6.11545 19.1647C5.43782 18.624 4.96354 17.8689 4.7702 17.0231H0V13.3606L1.7 10.8071V6.80924ZM6.5518 17.0231C6.71702 17.4029 6.98938 17.7262 7.33546 17.9532C7.68153 18.1803 8.08627 18.3012 8.5 18.3012C8.91373 18.3012 9.31847 18.1803 9.66454 17.9532C10.0106 17.7262 10.283 17.4029 10.4482 17.0231H6.5518ZM8.5 1.70231C7.1474 1.70231 5.85019 2.24036 4.89376 3.1981C3.93732 4.15583 3.4 5.4548 3.4 6.80924V11.3229L1.7 13.8764V15.3208H15.3V13.8764L13.6 11.3229V6.80924C13.6 5.4548 13.0627 4.15583 12.1062 3.1981C11.1498 2.24036 9.8526 1.70231 8.5 1.70231Z"
                      fill="#222222"
                    />
                  </svg>
                </button>

                {/* Badge */}
                {localNotis.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1 py-0.5 text-[9px] font-bold leading-none text-white bg-red-500 rounded-full cursor-pointer select-none">
                    {localNotis.filter((n) => !n.isRead).length}
                  </span>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:text-[#E6B800]"
              onClick={() => setloggedin(true)}
            >
              Log in
            </Link>
          )}
        </div>
        {NotiOpen && (
          <NotificationPanel
            onDelete={(NotiId: string) => setLocalNotis((prev) => prev.filter((n) => n._id !== NotiId))}
            onClose={() => setNotiOpen((prev) => !prev)}
            triggerRef={NotificationBellRef}
            Notifications={localNotis}
          />
        )}
      </nav>

      {/* Mobile Bottom Navbar */}
      {user?.role !== "ADMIN" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#FFFBEA] border-t border-gray-200 flex items-center justify-around z-[60]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-[#E6B800] font-semibold" : "text-[#222222]"
              }`
            }
          >
            <House />
            <p className="font-light text-xs">Home</p>
          </NavLink>
          <NavLink
            to="/cars"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-[#E6B800] font-semibold" : "text-[#222222]"
              }`
            }
          >
            <Car/>
            <p className="font-light text-xs">Cars</p>
          </NavLink>
          {loggedin && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${isActive ? "text-[#E6B800] font-semibold" : "text-[#222222]"
                }`
              }
            >
              <BookCheck />
              <p className="font-light text-xs">My bookings</p>
            </NavLink>
          )}
        </div>
      )}

      {/* Prevent content overlap */}
      <div className="h-14 md:hidden" />
    </>
  );
};

export default Header;
