import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';

const MS_PER_NIGHT = 1000 * 60 * 60 * 24;
const SERVICE_FEE_RATE = 0.1;

const BookingWidget = ({ listing }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.round((checkOut - checkIn) / MS_PER_NIGHT));
  }, [checkIn, checkOut]);

  const subtotal = nights * listing.pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  const isOwnListing = user && listing.host?._id === user._id;

  const handleBook = async () => {
    if (!user) {
      toast.error('Log in to book this stay');
      return navigate('/login');
    }
    if (!checkIn || !checkOut) {
      return toast.error('Choose your check-in and check-out dates');
    }
    if (guests > listing.guests) {
      return toast.error(`This listing sleeps a maximum of ${listing.guests} guests`);
    }

    setSubmitting(true);
    try {
      await createBooking({
        listingId: listing._id,
        checkIn: checkIn.toISOString().slice(0, 10),
        checkOut: checkOut.toISOString().slice(0, 10),
        guests,
      });
      toast.success('Booking confirmed!');
      navigate('/trips');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-surface sticky top-24 p-5 shadow-sm">
      <p className="text-lg text-pine-900">
        <span className="font-display text-2xl font-semibold">${listing.pricePerNight}</span>{' '}
        <span className="text-sm text-pine-400">/ night</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-pine-100 p-2">
          <p className="text-[11px] text-pine-400">Check-in</p>
          <DatePicker
            selected={checkIn}
            onChange={setCheckIn}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            placeholderText="Add date"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="rounded-lg border border-pine-100 p-2">
          <p className="text-[11px] text-pine-400">Check-out</p>
          <DatePicker
            selected={checkOut}
            onChange={setCheckOut}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn || new Date()}
            placeholderText="Add date"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-pine-100 p-2">
        <p className="text-[11px] text-pine-400">Guests</p>
        <input
          type="number"
          min={1}
          max={listing.guests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {isOwnListing ? (
        <p className="mt-4 rounded-lg bg-pine-50 p-3 text-center text-sm text-pine-500">
          This is your own listing.
        </p>
      ) : (
        <button onClick={handleBook} disabled={submitting} className="btn-primary mt-4 w-full">
          {submitting ? 'Confirming…' : 'Confirm booking'}
        </button>
      )}

      {nights > 0 && (
        <div className="mt-4 space-y-2 border-t border-pine-100 pt-4 text-sm text-pine-600">
          <div className="flex justify-between">
            <span>${listing.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between border-t border-pine-100 pt-2 font-semibold text-pine-900">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
