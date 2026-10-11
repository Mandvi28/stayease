import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/format.js";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/bookings")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading bookings" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">Bookings</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-ink-500">
            <tr className="border-b border-ink-100">
              <th className="py-2 pr-4">Listing</th>
              <th className="py-2 pr-4">Guest</th>
              <th className="py-2 pr-4">Dates</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-ink-50">
                <td className="py-2 pr-4">{b.listing?.title}</td>
                <td className="py-2 pr-4">{b.guest?.name}</td>
                <td className="py-2 pr-4">
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </td>
                <td className="py-2 pr-4">{formatCurrency(b.totalPrice)}</td>
                <td className="py-2 pr-4 capitalize">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
