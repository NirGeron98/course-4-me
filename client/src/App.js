import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/common/Navbar";
import LoadingSpinner from "./components/common/LoadingSpinner";
import NotFound from "./components/common/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { CourseDataProvider } from "./contexts/CourseDataContext";
import { initializeCacheCleanup, clearAllUserCache } from "./utils/cacheUtils";
import preloadUserData, { abortPreload } from "./utils/preloadUserData";
import { apiFetch } from "./hooks/useApi";

// Every route except Login (the landing page) and Dashboard (first screen
// after login, and the target of the post-login preload events) is
// lazy-loaded so the initial bundle stays small.
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TrackedCourses = lazy(() => import("./pages/TrackedCourses"));
const TrackedLecturers = lazy(() => import("./pages/TrackedLecturers"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const LecturerPage = lazy(() => import("./pages/LecturerPage"));
const ProfileManagement = lazy(() => import("./pages/ProfileManagement"));
const MyReviewsPage = lazy(() => import("./pages/MyReviewsPage"));
const MyContactRequests = lazy(() => import("./pages/MyContactRequests"));

const PageLoader = () => <LoadingSpinner message="טוען עמוד..." />;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize cache cleanup on app start
    initializeCacheCleanup();

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // A token in localStorage only proves a session existed at some point —
    // it may have expired since (e.g. the tab was closed and reopened days
    // later from a bookmark). Revalidate against the backend and hydrate
    // from the fresh user doc instead of trusting the cached localStorage
    // fields, so a stale/expired token can't leave the UI stuck in a
    // half-logged-in state where personal data silently fails to load.
    (async () => {
      const requiresPasswordReset =
        localStorage.getItem("requiresPasswordReset") === "true";

      try {
        const freshUser = await apiFetch("/api/user/me", { token });

        localStorage.setItem("userFullName", freshUser.fullName);
        localStorage.setItem("userRole", freshUser.role);
        localStorage.setItem("userId", freshUser._id);

        setUser({
          token,
          user: freshUser,
          requiresPasswordReset,
        });
      } catch (error) {
        // Invalid/expired token — treat as logged out rather than showing a
        // UI that looks authenticated but can't load any user-specific data.
        localStorage.removeItem("token");
        localStorage.removeItem("userFullName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("requiresPasswordReset");
        clearAllUserCache();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogin = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userFullName", userData.user.fullName);
    localStorage.setItem("userRole", userData.user.role);
    localStorage.setItem("userId", userData.user._id);
    localStorage.setItem("requiresPasswordReset", userData.requiresPasswordReset || false);
    
    setUser(userData);
    
    if (userData.token && userData.user._id) {
      try {
        const loadingEvent = new CustomEvent('userDataPreloading', { 
          detail: { status: 'loading' } 
        });
        window.dispatchEvent(loadingEvent);
        
        const loadedData = await preloadUserData(userData.token, userData.user._id);
        
        const completedEvent = new CustomEvent('userDataPreloaded', { 
          detail: { status: 'completed', data: loadedData } 
        });
        window.dispatchEvent(completedEvent);
        
      } catch (error) {
        console.error("שגיאה בטעינת נתונים:", error);
        
        const errorEvent = new CustomEvent('userDataPreloaded', { 
          detail: { status: 'error', error } 
        });
        window.dispatchEvent(errorEvent);
      }
    }
  };

  const handleLogout = () => {
    // Cancel any in-flight preload from a prior login before we wipe the
    // session so stale responses cannot land in the next user's cache.
    abortPreload();

    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("requiresPasswordReset");

    // clearAllUserCache() walks every registered CacheManager prefix
    // (dashboard_, course_, lecturer_) plus the per-feature localStorage
    // blobs, so there is nothing else to scrub here.
    clearAllUserCache();

    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Component to protect routes when password reset is required
  const ProtectedRoute = ({ children }) => {
    const requiresPasswordReset = user?.requiresPasswordReset || localStorage.getItem("requiresPasswordReset") === "true";
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (requiresPasswordReset) {
      return <Navigate to="/reset-password" />;
    }
    
    return children;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CourseDataProvider>
      <Router>
        <div className="App">
          <Toaster
            dir="rtl"
            position="top-center"
            richColors
            closeButton
            toastOptions={{ style: { fontFamily: "inherit" } }}
          />
          <Navbar user={user} onLogout={handleLogout} />
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} user={user} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Signup onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password"
              element={
                user ? (
                  <ResetPassword user={user} onLogout={handleLogout} updateUser={updateUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <AdvancedSearch user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reviews"
              element={<ProtectedRoute><MyReviewsPage user={user} /></ProtectedRoute>}
            />
            <Route
              path="/my-contact-requests"
              element={<ProtectedRoute><MyContactRequests user={user} /></ProtectedRoute>}
            />
            <Route
              path="/tracked-courses"
              element={<ProtectedRoute><TrackedCourses /></ProtectedRoute>}
            />
            <Route
              path="/lecturers"
              element={<ProtectedRoute><TrackedLecturers /></ProtectedRoute>}
            />
            <Route
              path="/course/:courseNumber"
              element={<ProtectedRoute><CoursePage user={user} /></ProtectedRoute>}
            />
            <Route
              path="/lecturer/:slug"
              element={<ProtectedRoute><LecturerPage user={user} /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {user?.user?.role === "admin" ? (
                    <AdminPanel user={user} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route
              path="/"
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound isLoggedIn={!!user} />} />
          </Routes>
          </Suspense>
        </div>
      </Router>
    </CourseDataProvider>
  );
}

export default App;