import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar.jsx";
import Filters from "../components/Filters.jsx";
import ListingCard from "../components/ListingCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  const paramsObj = Object.fromEntries(searchParams.entries());

  const fetchListings = useCallback(() => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams(searchParams);
    api
      .get(`/listings?${query.toString()}`)
      .then((res) => setListings(res.data.listings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    api
      .get("/wishlist")
      .then((res) => setWishlistIds(res.data.wishlist.map((w) => w.listing._id)))
      .catch(() => {});
  }, [user]);

  const applyFilters = (filters) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else {
        next.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    });
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (paramsObj.destination) next.set("destination", paramsObj.destination);
    setSearchParams(next);
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      toast.error("Log in to save listings");
      return;
    }
    const isSaved = wishlistIds.includes(listingId);
    try {
      if (isSaved) {
        await api.delete(`/wishlist/${listingId}`);
        setWishlistIds((prev) => prev.filter((id) => id !== listingId));
      } else {
        await api.post(`/wishlist/${listingId}`);
        setWishlistIds((prev) => [...prev, listingId]);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar initial={paramsObj} compact />
        <Filters filters={paramsObj} onApply={applyFilters} onClear={clearFilters} />
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner label="Finding stays" />
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-600">{error}</p>
        ) : listings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-ink-700">No stays match your search</p>
            <p className="mt-1 text-sm text-ink-500">Try adjusting your dates, guests, or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                isWishlisted={wishlistIds.includes(listing._id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
