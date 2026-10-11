import React, { useEffect, useState } from 'react';
import { Home, CalendarCheck, TrendingUp } from 'lucide-react';
import Loader from '../../components/Loader';
import { getMyListings } from '../../services/listingService';
import { getHostBookings } from '../../services/bookingService';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card-surface flex items-center gap-4 p-5">
    <div className="rounded-full bg-pine-50 p-3 text-pine-700">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-semibold text-pine-900">{value}</p>
      <p className="text-sm text-pine-400">{label}</p>
    </div>
  </div>
);

const HostOverview = () => {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyListings(), getHostBookings()])
      .then(([l, b]) => {
        setListings(l);
        setBookings(b);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your dashboard…" />;

  const today = new Date();
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.checkIn) >= today);
  const earnings = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Home} label="Total listings" value={listings.length} />
        <StatCard icon={CalendarCheck} label="Upcoming reservations" value={upcoming.length} />
        <StatCard icon={TrendingUp} label="Estimated earnings" value={`$${earnings}`} />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg text-pine-900">Upcoming reservations</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-pine-400">No upcoming reservations right now.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((b) => (
              <div key={b._id} className="card-surface flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-pine-900">{b.listing?.title}</p>
                  <p className="text-sm text-pine-500">
                    {b.guest?.name} · {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-pine-900">${b.totalPrice}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostOverview;
