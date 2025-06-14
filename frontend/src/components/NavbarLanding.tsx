import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const NavbarLanding = () => {
  const [tokenPresent, setTokenPresent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenPresent(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setTokenPresent(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 border-b border-gray-300">
      <div className="text-3xl font-serif font-semibold">Medium</div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-900">
        <div className="hover:text-black transition duration-200 cursor-not-allowed">Our story</div>
        <div className="hover:text-black transition duration-200 cursor-not-allowed">Membership</div>
        <Link to="/create-blog" className="hover:text-black transition duration-200">Write</Link>

        {!tokenPresent ? (
          <Link to="/signin" className="hover:text-black transition duration-200">Sign in</Link>
        ) : (
          <button onClick={handleSignOut} className="hover:text-black transition duration-200">Sign out</button>
        )}

        <Link to="/blogs">
          <button className="bg-black text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200">
            Get started
          </button>
        </Link>
      </nav>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        {!menuOpen ? (
          <Menu size={24} className="cursor-pointer" onClick={() => setMenuOpen(true)} />
        ) : (
          <X size={24} className="cursor-pointer" onClick={() => setMenuOpen(false)} />
        )}
      </div>

      {/* Mobile Menu Modal */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-start px-6 py-8 gap-6 text-lg font-medium shadow-md">
          <button
            className="self-end text-2xl"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>

          <div className="mt-6 flex flex-col gap-4 text-gray-800 w-full">
            <div className="cursor-not-allowed">Our story</div>
            <div className="cursor-not-allowed">Membership</div>
            <Link to="/create-blog" onClick={() => setMenuOpen(false)}>Write</Link>

            {!tokenPresent ? (
              <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
            ) : (
              <button onClick={handleSignOut}>Sign out</button>
            )}

            <Link to="/blogs" onClick={() => setMenuOpen(false)}>
              <button className="bg-black text-white w-full px-4 py-2 rounded-full">
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarLanding;
