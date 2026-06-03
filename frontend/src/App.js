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
// SignUp disabled — only pre-approved accounts can access the app
import LiveLocation from "./pages/LiveLocation";
import ManageDealers from "./pages/ManageDealers";
import MessagesDashboard from "./pages/MessagesDashboard";
import Payment from "./pages/Payment";
import FeedbackSubmission from "./pages/FeedbackSubmission";
import UserFeedbackDashboard from "./pages/UserFeedbackDashboard";

const GlobalLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff5ec', fontFamily: 'Outfit, sans-serif' }}>
    <style>{`
      .global-spinner { width: 50px; height: 50px; border: 3px solid rgba(135, 206, 235, 0.1); border-top-color: #87ceeb; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
    <div className="global-spinner"></div>
    <p style={{ color: '#003366', fontWeight: 700, letterSpacing: '0.05em' }}>BIKESZONE SECURE GATEWAY</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  if (!user) return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  if (!user) return <Navigate to="/" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  // Auto-redirect to dashboard when the user is logged in
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/" />} />
        <Route path="/dashboard" element={
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
            <DashboardLayout title="FeedBack" subtitle="Community Support">
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
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <DashboardLayout title="Messages & Feedback" subtitle="Admin Control">
              <MessagesDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <DashboardLayout title="Feedback" subtitle="Your Thoughts">
              <FeedbackSubmission />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/feedback-history" element={
          <ProtectedRoute>
            <DashboardLayout title="Your Feedback" subtitle="History">
              <UserFeedbackDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/live-location" element={
          <AdminRoute>
            <DashboardLayout title="Live Location" subtitle="Real-time Tracking">
              <LiveLocation />
            </DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/dealers" element={
          <AdminRoute>
            <DashboardLayout title="Dealer Management" subtitle="Admin Control">
              <ManageDealers />
            </DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/terms" element={
          <ProtectedRoute>
            <DashboardLayout title="Legal" subtitle="Terms & Policies">
              <Terms />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/payment/:bookingId" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;