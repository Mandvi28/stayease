import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-sand-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-semibold text-ink-800">
          StayEase
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/listings" className="text-sm text-ink-600 hover:text-ink-900">
            Explore stays
          </Link>
          {user?.role !== "host" && user?.role !== "admin" && (
            <Link to="/host" className="text-sm text-ink-600 hover:text-ink-900">
              Become a host
            </Link>
          )}
          {user && (
            <Link to="/wishlist" className="text-ink-600 hover:text-ink-900" aria-label="Wishlist">
              <Heart size={19} />
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5"
              >
                <User size={16} />
                <span className="text-sm">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg">
                  <Link
                    to="/trips"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50"
                  >
                    My trips
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50"
                  >
                    Profile
                  </Link>
                  {(user.role === "host" || user.role === "admin") && (
                    <Link
                      to="/host"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50"
                    >
                      <LayoutDashboard size={15} /> Host dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50"
                    >
                      <ShieldCheck size={15} /> Admin dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-ink-100 px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-sand-50"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-ink-700">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Sign up
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/listings" onClick={() => setMobileOpen(false)}>
              Explore stays
            </Link>
            <Link to="/host" onClick={() => setMobileOpen(false)}>
              Become a host
            </Link>
            {user ? (
              <>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
                  Wishlist
                </Link>
                <Link to="/trips" onClick={() => setMobileOpen(false)}>
                  My trips
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    Admin dashboard
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="text-left">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
