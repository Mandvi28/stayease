import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UploadCloud, X } from 'lucide-react';
import Loader from '../../components/Loader';
import {
  createListing,
  updateListing,
  getListingById,
  uploadImages,
} from '../../services/listingService';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Studio', 'Farmhouse'];
const AMENITIES = ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Washer', 'Workspace', 'Fireplace', 'Gym access', 'Hot tub', 'BBQ grill', 'Beach access'];

const ListingForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isEdit) {
      getListingById(id)
        .then((listing) => {
          reset(listing);
          setImages(listing.images || []);
          setAmenities(listing.amenities || []);
        })
        .catch((err) => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadImages(files);
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (publicId, url) => {
    setImages((prev) => prev.filter((img) => (img.publicId || img.url) !== (publicId || url)));
  };

  const toggleAmenity = (item) => {
    setAmenities((prev) => (prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]));
  };

  const onSubmit = async (values) => {
    if (images.length === 0) {
      return toast.error('Add at least one photo of the property');
    }
    const payload = {
      ...values,
      pricePerNight: Number(values.pricePerNight),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      guests: Number(values.guests),
      images,
      amenities,
    };

    try {
      if (isEdit) {
        await updateListing(id, payload);
        toast.success('Listing updated');
      } else {
        await createListing(payload);
        toast.success('Listing created');
      }
      navigate('/host/listings');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader label="Loading listing…" />;

  return (
    <div>
      <h2 className="mb-6 font-display text-lg text-pine-900">
        {isEdit ? 'Edit listing' : 'Create a new listing'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm text-pine-700">Property title</label>
          <input className="input-field" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-pine-700">Description</label>
          <textarea
            className="input-field min-h-[110px]"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-pine-700">Property type</label>
            <select className="input-field" {...register('propertyType', { required: true })}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-pine-700">Price per night ($)</label>
            <input
              type="number"
              min="1"
              className="input-field"
              {...register('pricePerNight', { required: 'Price is required', min: 1 })}
            />
            {errors.pricePerNight && (
              <p className="mt-1 text-xs text-red-600">{errors.pricePerNight.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-pine-700">Street / area (location)</label>
          <input className="input-field" {...register('location', { required: 'Location is required' })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-pine-700">City</label>
            <input className="input-field" {...register('city', { required: 'City is required' })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-pine-700">Country</label>
            <input className="input-field" {...register('country', { required: 'Country is required' })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-pine-700">Bedrooms</label>
            <input type="number" min="0" className="input-field" {...register('bedrooms', { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-pine-700">Bathrooms</label>
            <input type="number" min="0" className="input-field" {...register('bathrooms', { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-pine-700">Max guests</label>
            <input type="number" min="1" className="input-field" {...register('guests', { required: true })} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-pine-700">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleAmenity(item)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  amenities.includes(item)
                    ? 'border-pine-700 bg-pine-700 text-sand-50'
                    : 'border-pine-100 text-pine-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-pine-700">Photos</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-pine-200 py-8 text-sm text-pine-500 hover:border-pine-400">
            <UploadCloud size={22} />
            {uploading ? 'Uploading…' : 'Click to upload images'}
            <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
          </label>

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div key={img.publicId || img.url} className="relative">
                  <img src={img.url} alt="" className="h-20 w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.publicId, img.url)}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
        </button>
      </form>
    </div>
  );
};

export default ListingForm;
