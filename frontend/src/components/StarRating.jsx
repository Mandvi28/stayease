import { Star } from "lucide-react";

const StarRating = ({ rating = 0, size = 16, showValue = true }) => (
  <span className="inline-flex items-center gap-1">
    <Star size={size} className="fill-sand-500 text-sand-500" />
    {showValue && (
      <span className="text-sm font-medium text-ink-700">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
    )}
  </span>
);

export default StarRating;
