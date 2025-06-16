import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavbarLanding = () => {
  const [tokenPresent, setTokenPresent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenPresent(!!token);
  }, []);

  // Handle scroll effect
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
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="group">
          <div className="flex items-center gap-3">
            <div className="flex gap-[2px] transition-transform duration-200 group-hover:scale-110">
              <div className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse" />
              <div
                className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-gradient-to-r from-gray-800 to-black rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <div className="text-2xl font-serif font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
              Medium
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          
          <Link
            to="/ourstory"
            className=" text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            Our Story
          </Link>
          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-not-allowed opacity-60">
            Membership
          </button>

          {!tokenPresent ? (
            <>
              <Link
                to="/signin"
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                Sign in
              </Link>
              <Link to="/posts">
                <button className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Get started
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 transition-colors duration-200 font-medium"
              >
                Sign out
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {!menuOpen ? (
              <Menu size={24} className="text-gray-700" />
            ) : (
              <X size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 w-80 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="text-lg font-semibold text-gray-900">Menu</div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 flex flex-col gap-2 p-6">
                <Link
                  to="/ourstory"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Our Story
                </Link>
                <button className="text-left py-3 px-4 text-gray-500 rounded-lg cursor-not-allowed opacity-60">
                  Membership
                </button>
                <Link
                  to="/create-blog"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Write
                </Link>

                {!tokenPresent ? (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/posts"
                      onClick={() => setMenuOpen(false)}
                      className="mt-4"
                    >
                      <button className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 rounded-lg font-medium shadow-lg">
                        Get started
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/posts"
                      onClick={() => setMenuOpen(false)}
                      className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      All Posts
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-auto"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default NavbarLanding;
