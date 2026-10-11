import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { getMyListings, deleteListing } from '../../services/listingService';

const HostListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyListings()
      .then(setListings)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteListing(id);
      toast.success('Listing deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader label="Loading your listings…" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg text-pine-900">Your listings</h2>
        <Link to="/host/listings/new" className="btn-primary">
          <Plus size={16} /> New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="You haven't listed a property yet"
          description="Create your first listing to start welcoming guests."
          action={
            <Link to="/host/listings/new" className="btn-primary mt-2">
              Create a listing
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing._id} className="card-surface flex items-center gap-4 p-4">
              <img
                src={listing.images?.[0]?.url}
                alt={listing.title}
                className="h-20 w-28 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-pine-900">{listing.title}</p>
                <p className="text-sm text-pine-500">{listing.city}, {listing.country}</p>
                <p className="text-sm text-pine-700">${listing.pricePerNight} / night</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/host/listings/${listing._id}/edit`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-100 hover:bg-pine-50"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-500 hover:bg-red-50"
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
