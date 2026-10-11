import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Profile = () => {
  const { user, updateUser, becomeHost } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/me", { name });
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeHost = async () => {
    try {
      await becomeHost();
      toast.success("You're now a host! Head to your host dashboard to create a listing.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-ink-800">Profile</h1>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-ink-700">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-700">Email</label>
          <input value={user?.email} disabled className="input-field bg-ink-50 text-ink-400" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-700">Role</label>
          <input value={user?.role} disabled className="input-field bg-ink-50 capitalize text-ink-400" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {user?.role === "guest" && (
        <div className="mt-8 rounded-xl border border-ink-100 p-4">
          <p className="font-medium text-ink-800">Want to host on StayEase?</p>
          <p className="mt-1 text-sm text-ink-500">
            Switch your account to a host account to start creating listings.
          </p>
          <button type="button" onClick={handleBecomeHost} className="btn-secondary mt-3">
            Become a host
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
