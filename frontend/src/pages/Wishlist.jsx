import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListingCard from "../components/ListingCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/wishlist")
      .then((res) => setItems(res.data.wishlist))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (listingId) => {
    try {
      await api.delete(`/wishlist/${listingId}`);
      setItems((prev) => prev.filter((i) => i.listing._id !== listingId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">Wishlist</h1>
      {loading ? (
        <LoadingSpinner label="Loading your wishlist" />
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-ink-500">
          Nothing saved yet. Tap the heart on any stay to add it here.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ListingCard
              key={item._id}
              listing={item.listing}
              isWishlisted
              onToggleWishlist={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
