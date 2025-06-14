import { useState, useEffect, useRef } from "react";
import { Avatar } from "./BlogCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { TfiWrite } from "react-icons/tfi";
import { LuUpload } from "react-icons/lu";
import { useUser } from "../context/UserContext";

interface AppbarProps {
  onPublish?: () => void;
}

const Appbar = ({ onPublish }: AppbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreatePage = location.pathname === "/create-blog";

  const [tokenPresent, setTokenPresent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUser();

  const userName = loading ? "" : user?.name || "Guest";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenPresent(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setTokenPresent(false);
    setDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white relative">
      {/* Left */}
      <div className="flex items-center gap-2">
        <div className="flex gap-[2px]">
          <div className="w-2 h-2 bg-black rounded-full" />
          <div className="w-2 h-2 bg-black rounded-full" />
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
        <Link to="/">
          <div className="text-sm font-medium text-gray-800">Medium</div>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">
        {isCreatePage ? (
          <div
            className="bg-green-500 px-2 py-1 rounded-lg  hover:shadow-md cursor-pointer"
            onClick={onPublish}
          >
            <button className="flex items-center space-x-1 text-gray-100 hover:text-white transition-colors duration-200">
              Publish <LuUpload />
            </button>
          </div>
        ) : (
          <Link to="/create-blog">
            <button className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors duration-200">
              <TfiWrite size={20} />
              <span className="text-sm font-medium">Write</span>
            </button>
          </Link>
        )}

        <Bell className="w-5 h-5 text-gray-700 cursor-pointer" />

        {/* Avatar dropdown */}
        {tokenPresent && (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="cursor-pointer"
            >
              <Avatar name={userName} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <div
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                >
                  Settings
                </div>
                <hr />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appbar;
