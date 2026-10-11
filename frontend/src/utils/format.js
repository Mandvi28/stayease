export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(Math.round(ms / (1000 * 60 * 60 * 24)), 0);
};

export const AMENITIES_LIST = [
  "Wifi",
  "Kitchen",
  "Parking",
  "Pool",
  "Air conditioning",
  "Heating",
  "Washer",
  "Fireplace",
  "Gym access",
  "Self check-in",
  "Sea view",
  "Terrace",
  "Garden",
  "Breakfast available",
];

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Cabin",
  "Cottage",
  "Loft",
  "Farmstay",
];
