import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { formatCurrency } from "../utils/format.js";

const HostListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/listings/host/mine")
      .then((res) => setListings(res.data.listings))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success("Listing deleted");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-ink-800">My listings</h1>
        <Link to="/host/listings/new" className="btn-primary">
          <Plus size={16} /> New listing
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading your listings" />
      ) : listings.length === 0 ? (
        <p className="mt-6 text-sm text-ink-500">You haven't created any listings yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {listings.map((listing) => (
            <div key={listing._id} className="card flex items-center gap-4 p-4">
              <img
                src={listing.images?.[0]?.url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-ink-800">{listing.title}</p>
                <p className="text-sm text-ink-500">
                  {listing.city}, {listing.country} · {formatCurrency(listing.pricePerNight)}/night
                </p>
                <p className="text-xs text-ink-400">{listing.isActive ? "Active" : "Hidden"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/host/listings/${listing._id}/edit`}
                  aria-label="Edit listing"
                  className="rounded-full border border-ink-200 p-2 hover:bg-ink-50"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(listing._id)}
                  aria-label="Delete listing"
                  className="rounded-full border border-ink-200 p-2 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostListings;
