// Small helper to build a Mongoose filter object for listing search/filters
// from Express req.query. Keeping this separate keeps the controller readable.
function buildListingFilter(query) {
  const filter = { isActive: true };

  if (query.city) {
    filter.city = { $regex: query.city, $options: 'i' };
  }
  if (query.country) {
    filter.country = { $regex: query.country, $options: 'i' };
  }
  if (query.destination) {
    filter.$or = [
      { city: { $regex: query.destination, $options: 'i' } },
      { country: { $regex: query.destination, $options: 'i' } },
      { title: { $regex: query.destination, $options: 'i' } },
    ];
  }
  if (query.guests) {
    filter.guests = { $gte: Number(query.guests) };
  }
  if (query.minPrice || query.maxPrice) {
    filter.pricePerNight = {};
    if (query.minPrice) filter.pricePerNight.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.pricePerNight.$lte = Number(query.maxPrice);
  }
  if (query.propertyType) {
    filter.propertyType = query.propertyType;
  }
  if (query.bedrooms) {
    filter.bedrooms = { $gte: Number(query.bedrooms) };
  }
  if (query.bathrooms) {
    filter.bathrooms = { $gte: Number(query.bathrooms) };
  }
  if (query.amenities) {
    const amenitiesArr = Array.isArray(query.amenities)
      ? query.amenities
      : query.amenities.split(',');
    filter.amenities = { $all: amenitiesArr };
  }
  if (query.host) {
    filter.host = query.host;
  }

  return filter;
}

module.exports = { buildListingFilter };
