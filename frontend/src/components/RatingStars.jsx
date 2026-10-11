import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 14, showValue = true, count }) => (
  <div className="flex items-center gap-1 text-sm text-pine-700">
    <Star size={size} className="fill-amber-500 text-amber-500" />
    {showValue && <span className="font-medium">{rating > 0 ? rating.toFixed(1) : 'New'}</span>}
    {typeof count === 'number' && <span className="text-pine-300">({count})</span>}
  </div>
);

export default RatingStars;
