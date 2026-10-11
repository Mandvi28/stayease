import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

const ImageCarousel = ({ images = [], className = "" }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className={`flex items-center justify-center bg-ink-100 text-ink-400 ${className}`}>
        <ImageOff size={32} />
      </div>
    );
  }

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className={`group relative overflow-hidden bg-ink-100 ${className}`}>
      <img
        src={images[index].url}
        alt=""
        className="h-full w-full object-cover transition-opacity duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
