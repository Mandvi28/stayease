import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Building2, Mountain, Warehouse, Trees, TreePalm } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";
import ListingCard from "../components/ListingCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";

const categories = [
  { label: "Villas", icon: Building2, type: "Villa" },
  { label: "Cabins", icon: TreePalm, type: "Cabin" },
  { label: "Cottages", icon: HomeIcon, type: "Cottage" },
  { label: "Lofts", icon: Warehouse, type: "Loft" },
  { label: "Farmstays", icon: Trees, type: "Farmstay" },
  { label: "Mountain", icon: Mountain, type: "House" },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings?limit=8")
      .then((res) => setListings(res.data.listings))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="max-w-2xl text-4xl font-medium leading-tight text-sand-50 sm:text-5xl">
            Stays that feel like somewhere, not anywhere
          </h1>
          <p className="mt-4 max-w-xl text-ink-200">
            Independent hosts, honest photos, real neighborhoods. Search thousands of
            places to stay for your next trip.
          </p>
          <div className="mt-8 w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium text-ink-800">Browse by property type</h2>
        <div className="mt-5 flex gap-6 overflow-x-auto pb-2">
          {categories.map(({ label, icon: Icon, type }) => (
            <Link
              key={label}
              to={`/listings?propertyType=${type}`}
              className="flex shrink-0 flex-col items-center gap-2 text-ink-600 hover:text-ink-900"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-200 bg-white">
                <Icon size={22} />
              </span>
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-ink-800">Featured stays</h2>
          <Link to="/listings" className="text-sm text-ink-600 underline">
            View all
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading featured stays" />
        ) : listings.length === 0 ? (
          <p className="mt-6 text-sm text-ink-500">
            No listings yet — run the seed script to populate sample data.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-ink-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-medium text-ink-800">Have a place worth sharing?</h2>
          <p className="max-w-lg text-ink-500">
            List your space on StayEase and start hosting guests from around the world.
            Setting up a listing takes just a few minutes.
          </p>
          <Link to="/host" className="btn-primary">
            Become a host
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
