import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HostLayout from "./layouts/HostLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import ListingDetails from "./pages/ListingDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Trips from "./pages/Trips.jsx";
import Profile from "./pages/Profile.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import HostListings from "./pages/HostListings.jsx";
import HostListingForm from "./pages/HostListingForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminListings from "./pages/AdminListings.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={["guest", "host", "admin"]}>
            <HostLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/host" element={<HostDashboard />} />
        <Route
          path="/host/listings"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/listings/new"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/listings/:id/edit"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostListingForm />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
