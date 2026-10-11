import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { formatCurrency } from "../utils/format.js";

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/listings")
      .then((res) => setListings(res.data.listings))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this listing from the platform?")) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      toast.success("Listing removed");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading listings" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">Listings</h1>
      <div className="mt-6 space-y-3">
        {listings.map((listing) => (
          <div key={listing._id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink-800">{listing.title}</p>
              <p className="text-sm text-ink-500">
                {listing.city}, {listing.country} · Host: {listing.host?.name} ·{" "}
                {formatCurrency(listing.pricePerNight)}/night
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(listing._id)}
              className="text-sm text-red-600 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminListings;
