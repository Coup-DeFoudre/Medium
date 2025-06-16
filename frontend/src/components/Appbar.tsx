import { useState, useEffect, useRef } from "react";
import { Avatar } from "./BlogCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, BookOpen } from "lucide-react";
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
  const isAllPostsPage = location.pathname === "/blogs" || location.pathname === "/";

  const [tokenPresent, setTokenPresent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUser();

  const userName = loading ? "" : user?.name || "Guest";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenPresent(!!token);
  }, []);

  // Handle scroll effect for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className={` sticky z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex gap-[2px] transition-transform duration-200 group-hover:scale-110">
              <div className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
              Medium
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/blogs"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isAllPostsPage
                ? 'bg-gray-100 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={16} />
            <span className="font-medium">All Posts</span>
          </Link>
          
          {tokenPresent && (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/dashboard"
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/profile"
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Profile</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Write/Publish Button */}
          {isCreatePage ? (
            <button
              onClick={onPublish}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2.5 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>Publish</span>
              <LuUpload size={16} />
            </button>
          ) : (
            <Link to="/create-blog">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 transform hover:scale-105">
                <TfiWrite size={16} />
                <span>Write</span>
              </button>
            </Link>
          )}

          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 relative">
              <Bell size={20} />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </button>

            {/* Enhanced Tooltip */}
            <div className="absolute right-0 top-full mt-2 px-4 py-2 text-sm text-gray-600 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>3 new notifications</span>
              </div>
            </div>
          </div>

          {/* User Avatar & Dropdown */}
          {tokenPresent ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1 rounded-full hover:ring-2 hover:ring-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                <Avatar name={userName} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <Avatar name={userName} />
                      <div>
                        <div className="font-semibold text-gray-900">{userName}</div>
                        <div className="text-sm text-gray-500">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/blogs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <BookOpen size={16} />
                      <span>All Posts</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appbar;