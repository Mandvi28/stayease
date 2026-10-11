import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const tabs = [
  { to: "/host", label: "Overview", end: true },
  { to: "/host/listings", label: "My listings" },
  { to: "/host/listings/new", label: "Create listing" },
];

const HostLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <div className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive ? "border-ink-800 text-ink-900" : "border-transparent text-ink-500 hover:text-ink-800"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default HostLayout;
