import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, Calendar } from "lucide-react";

const SearchBar = ({ initial = {}, compact = false }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(initial.destination || "");
  const [checkIn, setCheckIn] = useState(initial.checkIn || "");
  const [checkOut, setCheckOut] = useState(initial.checkOut || "");
  const [guests, setGuests] = useState(initial.guests || "");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 rounded-2xl border border-ink-100 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-2 ${
        compact ? "max-w-3xl" : "max-w-4xl"
      }`}
    >
      <div className="flex flex-1 items-center gap-2 px-3 py-1.5 sm:border-r sm:border-ink-100">
        <MapPin size={16} className="shrink-0 text-ink-400" />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where are you going?"
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 px-3 py-1.5 sm:border-r sm:border-ink-100">
        <Calendar size={16} className="shrink-0 text-ink-400" />
        <input
          type="date"
          value={checkIn}
          min={todayStr}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-transparent text-sm text-ink-800 focus:outline-none"
          aria-label="Check-in date"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 px-3 py-1.5 sm:border-r sm:border-ink-100">
        <Calendar size={16} className="shrink-0 text-ink-400" />
        <input
          type="date"
          value={checkOut}
          min={checkIn || todayStr}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm text-ink-800 focus:outline-none"
          aria-label="Check-out date"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 px-3 py-1.5">
        <Users size={16} className="shrink-0 text-ink-400" />
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Guests"
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-ink-800 px-5 py-2.5 text-sm font-medium text-sand-50 transition hover:bg-ink-700"
      >
        <Search size={16} /> Search
      </button>
    </form>
  );
};

export default SearchBar;
