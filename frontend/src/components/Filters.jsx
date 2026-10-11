import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { AMENITIES_LIST, PROPERTY_TYPES } from "../utils/format.js";

const Filters = ({ filters, onApply, onClear }) => {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(filters);

  const toggleAmenity = (amenity) => {
    const current = local.amenities || [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setLocal({ ...local, amenities: next });
  };

  const apply = () => {
    onApply(local);
    setOpen(false);
  };

  const clear = () => {
    const cleared = {};
    setLocal(cleared);
    onClear();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-secondary"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-ink-100 bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close filters">
              <X size={18} className="text-ink-400" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Price per night</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={local.minPrice || ""}
                  onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
                  className="input-field"
                />
                <span className="text-ink-400">–</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={local.maxPrice || ""}
                  onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Property type</label>
              <select
                value={local.propertyType || ""}
                onChange={(e) => setLocal({ ...local, propertyType: e.target.value })}
                className="input-field"
              >
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-500">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={local.bedrooms || ""}
                  onChange={(e) => setLocal({ ...local, bedrooms: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-500">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  value={local.bathrooms || ""}
                  onChange={(e) => setLocal({ ...local, bathrooms: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((amenity) => {
                  const active = (local.amenities || []).includes(amenity);
                  return (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        active
                          ? "border-ink-800 bg-ink-800 text-sand-50"
                          : "border-ink-200 text-ink-600 hover:border-ink-400"
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button type="button" onClick={clear} className="text-sm text-ink-500 underline">
              Clear all
            </button>
            <button type="button" onClick={apply} className="btn-primary">
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
