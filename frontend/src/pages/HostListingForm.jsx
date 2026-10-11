import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { AMENITIES_LIST, PROPERTY_TYPES } from "../utils/format.js";

const emptyForm = {
  title: "",
  description: "",
  propertyType: "Apartment",
  pricePerNight: "",
  address: "",
  city: "",
  country: "",
  bedrooms: 1,
  bathrooms: 1,
  maxGuests: 1,
  amenities: [],
};

const HostListingForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/listings/${id}`)
      .then((res) => {
        const l = res.data.listing;
        setForm({
          title: l.title,
          description: l.description,
          propertyType: l.propertyType,
          pricePerNight: l.pricePerNight,
          address: l.address,
          city: l.city,
          country: l.country,
          bedrooms: l.bedrooms,
          bathrooms: l.bathrooms,
          maxGuests: l.maxGuests,
          amenities: l.amenities || [],
        });
        setImages(l.images || []);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prev) => [...prev, ...res.data.images]);
      toast.success("Images uploaded");
    } catch (err) {
      toast.error(
        "Image upload failed. Make sure Cloudinary credentials are configured on the backend."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.pricePerNight || !form.address || !form.city || !form.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    const payload = { ...form, images };
    try {
      if (isEditing) {
        await api.put(`/listings/${id}`, payload);
        toast.success("Listing updated");
      } else {
        await api.post("/listings", payload);
        toast.success("Listing created");
      }
      navigate("/host/listings");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading listing" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">
        {isEditing ? "Edit listing" : "Create a new listing"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm text-ink-700">Property title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-700">Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-700">Property type</label>
            <select
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              className="input-field"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700">Price per night (USD)</label>
            <input
              type="number"
              required
              min="1"
              value={form.pricePerNight}
              onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-700">Address</label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-700">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700">Country</label>
            <input
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-700">Bedrooms</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700">Bathrooms</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700">Max guests</label>
            <input
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-700">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((amenity) => {
              const active = form.amenities.includes(amenity);
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

        <div>
          <label className="mb-1 block text-sm text-ink-700">Photos</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="mt-1 text-xs text-ink-500">Uploading...</p>}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-20 w-28 overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create listing"}
        </button>
      </form>
    </div>
  );
};

export default HostListingForm;
