import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

const HostDashboard = () => {
  const { user, becomeHost } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "guest") {
      setLoading(false);
      return;
    }
    Promise.all([api.get("/listings/host/mine"), api.get("/bookings/host")])
      .then(([listingsRes, bookingsRes]) => {
        setListings(listingsRes.data.listings);
        setBookings(bookingsRes.data.bookings);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role === "guest") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-ink-800">Become a host</h1>
        <p className="mt-2 text-sm text-ink-500">
          Switch to a host account to list your space and start accepting bookings.
        </p>
        <button
          type="button"
          onClick={async () => {
            await becomeHost();
            toast.success("You're now a host!");
          }}
          className="btn-primary mt-5"
        >
          Become a host
        </button>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading dashboard" />;

  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.checkIn) > new Date());
  const earnings = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + (b.totalPrice - b.serviceFee), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">Host overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Listings", value: listings.length },
          { label: "Total bookings", value: bookings.length },
          { label: "Upcoming stays", value: upcoming.length },
          { label: "Estimated earnings", value: formatCurrency(earnings) },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-2xl font-medium text-ink-800">{stat.value}</p>
            <p className="text-xs text-ink-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-medium text-ink-800">Upcoming reservations</h2>
      {upcoming.length === 0 ? (
        <p className="mt-2 text-sm text-ink-500">No upcoming reservations right now.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {upcoming.map((b) => (
            <div key={b._id} className="card flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ink-800">{b.listing?.title}</p>
                <p className="text-sm text-ink-500">
                  {b.guest?.name} · {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </p>
              </div>
              <p className="font-medium text-ink-800">{formatCurrency(b.totalPrice)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link to="/host/listings/new" className="btn-primary">
          Create a new listing
        </Link>
      </div>
    </div>
  );
};

export default HostDashboard;
