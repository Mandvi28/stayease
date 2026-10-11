import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/format.js";

const statusStyles = {
  confirmed: "bg-ink-100 text-ink-700",
  completed: "bg-sand-100 text-sand-700",
  cancelled: "bg-red-50 text-red-600",
};

const Trips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancelBooking = async (id) => {
    setCancellingId(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">My trips</h1>

      {loading ? (
        <LoadingSpinner label="Loading your trips" />
      ) : bookings.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-500">You haven't booked any stays yet.</p>
          <Link to="/listings" className="btn-primary mt-4 inline-flex">
            Find a stay
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card flex flex-col gap-4 p-4 sm:flex-row">
              <img
                src={booking.listing?.images?.[0]?.url}
                alt=""
                className="h-32 w-full rounded-xl object-cover sm:w-44"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/listings/${booking.listing?._id}`}
                      className="font-medium text-ink-800 hover:underline"
                    >
                      {booking.listing?.title}
                    </Link>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-500">
                    {booking.listing?.city}, {booking.listing?.country}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {booking.guests} guest
                    {booking.guests > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-medium text-ink-800">{formatCurrency(booking.totalPrice)}</p>
                  {booking.status === "confirmed" && new Date(booking.checkIn) > new Date() && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="text-sm text-red-600 underline"
                    >
                      {cancellingId === booking._id ? "Cancelling..." : "Cancel booking"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;
