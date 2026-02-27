import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import Booking from "./pages/Booking";
import BookingsManagement from "./pages/BookingsManagement";
import Analytics from "./pages/Analytics";
import Customers from "./pages/Customers";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout title="BikesZone" subtitle="B2B Marketplace">
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute>
            <DashboardLayout title="Bikes" subtitle="Select Your Ride">
              <Bikes />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <DashboardLayout title="Orders" subtitle="Management">
              <BookingsManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/book/:bikeId" element={
          <ProtectedRoute>
            <DashboardLayout title="Booking" subtitle="Secure Your Ride">
              <Booking />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/quote/:bikeId" element={
          <ProtectedRoute>
            <DashboardLayout title="Booking" subtitle="Secure Your Ride">
              <Booking />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/bike/:bikeId" element={
          <ProtectedRoute>
            <DashboardLayout title="Bike Details" subtitle="Product">
              <Booking />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <DashboardLayout title="Market Analytics" subtitle="Insights">
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dealers" element={
          <ProtectedRoute>
            <DashboardLayout title="Dealer Network" subtitle="Partners">
              <Customers />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <DashboardLayout title="Messages" subtitle="Communication">
              <Contact />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout title="Settings" subtitle="Configuration">
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/terms" element={
          <ProtectedRoute>
            <DashboardLayout title="Legal" subtitle="Terms & Policies">
              <Terms />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;