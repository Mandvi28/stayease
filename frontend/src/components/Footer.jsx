import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-ink-100 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-800">StayEase</p>
          <p className="mt-2 text-sm text-ink-500">
            Independent stays, chosen by the people who host them.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700">Explore</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-500">
            <li><Link to="/listings">All stays</Link></li>
            <li><Link to="/host">Become a host</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700">Account</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-500">
            <li><Link to="/trips">My trips</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700">About</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-500">
            <li>Portfolio project</li>
            <li>Not affiliated with Airbnb</li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-xs text-ink-400">
        © {new Date().getFullYear()} StayEase. Built as a demo project.
      </p>
    </div>
  </footer>
);

export default Footer;
