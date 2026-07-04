import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import AddLecturerPopup from "../components/tracked-lecturers/AddLecturerPopup";
import TrackedLecturerCard from "../components/tracked-lecturers/TrackedLecturerCard";
import { getLecturerSlug } from '../utils/slugUtils';
import { SkeletonCardGrid } from '../components/common/Skeleton';
import PageLayout from '../components/common/PageLayout';
import EmptyState from '../components/common/EmptyState';

const TRACKED_LECTURERS_CACHE_KEY = 'tracked_lecturers_data';
const TRACKED_LECTURERS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isTrackedLecturersCacheValid() {
  const cacheData = localStorage.getItem(TRACKED_LECTURERS_CACHE_KEY);
  if (!cacheData) return false;
  try {
    const { timestamp } = JSON.parse(cacheData);
    return Date.now() - timestamp < TRACKED_LECTURERS_CACHE_DURATION;
  } catch {
    return false;
  }
}

function getTrackedLecturersFromCache() {
  try {
    const cacheData = localStorage.getItem(TRACKED_LECTURERS_CACHE_KEY);
    if (!cacheData) return null;
    const { trackedLecturers } = JSON.parse(cacheData);
    return trackedLecturers;
  } catch {
    localStorage.removeItem(TRACKED_LECTURERS_CACHE_KEY);
    return null;
  }
}

function saveTrackedLecturersToCache(data) {
  try {
    localStorage.setItem(TRACKED_LECTURERS_CACHE_KEY, JSON.stringify({ trackedLecturers: data, timestamp: Date.now() }));
  } catch (error) {
    // ignore
  }
}

const TrackedLecturers = () => {
  const [trackedLecturers, setTrackedLecturers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'המרצים שלי - Course4Me';

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  // Fetch tracked lecturers from API
  const fetchTrackedLecturers = useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh && isTrackedLecturersCacheValid()) {
        const cachedData = getTrackedLecturersFromCache();
        if (cachedData && Array.isArray(cachedData)) {
          setTrackedLecturers(cachedData);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const data = await apiFetch(`/api/tracked-lecturers`);
      const validTrackedLecturers = data.filter(({ lecturer }) => lecturer && lecturer._id);
      setTrackedLecturers(validTrackedLecturers);
      saveTrackedLecturersToCache(validTrackedLecturers);
    } catch (err) {
      console.error("Failed to fetch tracked lecturers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for tracked lecturer changes from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'trackedLecturerChanged') {
        // Force refresh when a lecturer is added/removed/updated from tracking
        fetchTrackedLecturers(true);
        // Clean up the flag
        localStorage.removeItem(e.key);
      }
    };

    // Listen for custom events for lecturer tracking changes within the same tab
    const handleTrackedLecturerChange = () => {
      fetchTrackedLecturers(true);
    };

    // Listen for review events that should update the lecturer data
    const handleReviewEvent = async (event) => {
      try {
        // Check if we have valid lecturer data in the event
        const lecturerId = event.detail?.lecturerId;
        
        // If we have a lecturer ID, fetch the specific lecturer's updated data
        if (lecturerId) {

          // First get the lecturer's updated data directly from the API to ensure accurate ratings
          const updatedLecturerData = await apiFetch(`/api/lecturers/${lecturerId}`);

          // Now update the specific lecturer in our tracked list
          if (updatedLecturerData) {
            // Update in the state
            setTrackedLecturers(prev => prev.map(item => {
              if (item.lecturer && item.lecturer._id === lecturerId) {
                return { ...item, lecturer: updatedLecturerData };
              }
              return item;
            }));
            
            const cachedData = getTrackedLecturersFromCache();
            if (cachedData && Array.isArray(cachedData)) {
              const updatedCache = cachedData.map(item => {
                if (item.lecturer && item.lecturer._id === lecturerId) {
                  return { ...item, lecturer: updatedLecturerData };
                }
                return item;
              });
              localStorage.removeItem(TRACKED_LECTURERS_CACHE_KEY);
              saveTrackedLecturersToCache(updatedCache);
              
              // Also force a cross-tab sync
              localStorage.setItem('trackedLecturerChanged', JSON.stringify({
                lecturerId: lecturerId,
                action: 'updated',
                timestamp: Date.now()
              }));
            }
          } else {
            // If we couldn't get specific lecturer data, refresh everything
            fetchTrackedLecturers(true);
          }
        } else {
          // If no specific lecturer ID was provided, refresh everything
          fetchTrackedLecturers(true);
        }
      } catch (err) {
        console.error("Error updating lecturer after review event:", err);
        // In case of error, fall back to refreshing everything
        fetchTrackedLecturers(true);
      }
    };

    // Handle specific lecturer data updates directly
    const handleLecturerDataUpdated = (event) => {
      if (event.detail && event.detail.lecturerId && event.detail.data) {

        // For review deletions, we need to be extra careful to update completely
        const isReviewDeleted = event.detail.action === 'reviewDeleted';
        
        if (isReviewDeleted) {
          // Force a full refresh instead of just updating the cache
          fetchTrackedLecturers(true);
          return;
        }
        
        // For other updates, update the specific lecturer in our state
        setTrackedLecturers(prev => prev.map(item => {
          if (item.lecturer && item.lecturer._id === event.detail.lecturerId) {
            // Create a fresh object to ensure React detects the change
            return { 
              ...item, 
              lecturer: {
                ...event.detail.data,
                // Make absolutely sure rating data is updated correctly
                averageRating: event.detail.data.ratingsCount > 0 ? event.detail.data.averageRating : null,
                ratingsCount: event.detail.data.ratingsCount || 0
              } 
            };
          }
          return item;
        }));
        
        localStorage.removeItem(TRACKED_LECTURERS_CACHE_KEY);

        // Get fresh data from the API
        apiFetch(`/api/tracked-lecturers`)
          .then(data => {
            // Filter out any tracked lecturers with null/undefined lecturer objects
            const validTrackedLecturers = data.filter(({ lecturer }) => lecturer && lecturer._id);

            // Save to cache
            saveTrackedLecturersToCache(validTrackedLecturers);

            // Update the state
            setTrackedLecturers(validTrackedLecturers);
          })
          .catch(err => {
            console.error("Failed to fetch updated tracked lecturers:", err);
          });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('trackedLecturerAdded', handleTrackedLecturerChange);
    window.addEventListener('trackedLecturerRemoved', handleTrackedLecturerChange);
    window.addEventListener('trackedLecturerUpdated', handleTrackedLecturerChange);
    window.addEventListener('reviewAdded', handleReviewEvent);
    window.addEventListener('reviewUpdated', handleReviewEvent);
    window.addEventListener('reviewDeleted', handleReviewEvent);
    window.addEventListener('lecturerDataUpdated', handleLecturerDataUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('trackedLecturerAdded', handleTrackedLecturerChange);
      window.removeEventListener('trackedLecturerRemoved', handleTrackedLecturerChange);
      window.removeEventListener('trackedLecturerUpdated', handleTrackedLecturerChange);
      window.removeEventListener('reviewAdded', handleReviewEvent);
      window.removeEventListener('reviewUpdated', handleReviewEvent);
      window.removeEventListener('reviewDeleted', handleReviewEvent);
      window.removeEventListener('lecturerDataUpdated', handleLecturerDataUpdated);
    };
  }, [fetchTrackedLecturers]);

  // Initialize component and fetch data on mount
  useEffect(() => {
    fetchTrackedLecturers();
  }, [fetchTrackedLecturers]);

  // Popup handlers
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Callback for when a new lecturer is added
  const onLecturerAdded = () => {
    fetchTrackedLecturers();
    closePopup();
  };

  // Remove lecturer from tracking list
  const handleRemoveLecturer = async (lecturerId) => {
    try {
      // Send DELETE request to API
      await apiFetch(`/api/tracked-lecturers/${lecturerId}`, {
        method: "DELETE",
      });

      // Update local state to remove the lecturer immediately
      setTrackedLecturers(prevLecturers =>
        prevLecturers.filter(({ lecturer }) => lecturer._id !== lecturerId)
      );

      // Update cache
      const updatedLecturers = trackedLecturers.filter(({ lecturer }) => lecturer._id !== lecturerId);
      saveTrackedLecturersToCache(updatedLecturers);

      // Notify other tabs/components about tracked lecturer removal
      const trackingEvent = new CustomEvent('trackedLecturerRemoved', {
        detail: { lecturerId, timestamp: Date.now() }
      });
      window.dispatchEvent(trackingEvent);

      // Update localStorage for cross-tab synchronization
      localStorage.setItem('trackedLecturerChanged', JSON.stringify({
        lecturerId,
        action: 'removed',
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error("Failed to remove lecturer from tracking:", err);
    }
  };

  // Navigate to lecturer details page
  const handleViewLecturerDetails = (lecturer) => {
    navigate(`/lecturer/${getLecturerSlug(lecturer)}`);
  };

  const hero = (
    <div className="relative bg-gradient-to-br from-accent-lecturer to-accent-lecturer-strong text-white py-8 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
        <div className="absolute top-4 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-right">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight text-white">
            המרצים שלי
          </h1>
          <p className="text-base md:text-lg text-purple-50 font-medium leading-relaxed">
            נהל את רשימת המרצים שלך ועקוב אחר עדכונים
          </p>

          {!isLoading && trackedLecturers.length > 0 && trackedLecturers.some(({ lecturer }) => lecturer) && (
            <div className="mt-3">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 text-sm">
                <span className="font-semibold">
                  {trackedLecturers.filter(({ lecturer }) => lecturer).length} מרצים במעקב
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openPopup}
          className="shrink-0 bg-white text-accent-lecturer hover:text-accent-lecturer-strong py-2.5 px-5 rounded-card font-semibold transition-all duration-ui shadow-card hover:shadow-card-hover flex items-center gap-2 group text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-accent-lecturer"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-ui" aria-hidden="true" />
          הוספת מרצה
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout accent="purple" width="max-w-[1800px]" header={hero}>
        {/* Loading: skeleton grid to avoid layout shift */}
        {isLoading ? (
          <div className="mt-4" role="status">
            <p className="sr-only">טוען מרצים...</p>
            <div className="h-7 w-48 rounded bg-slate-200 animate-pulse mb-6" aria-hidden="true" />
            <SkeletonCardGrid count={6} />
          </div>
        ) : (
          <>
            {/* Empty state - shown when no lecturers or all lecturers are null */}
            {trackedLecturers.length === 0 || trackedLecturers.every(({ lecturer }) => !lecturer) ? (
              <EmptyState
                icon={Users}
                title="עדיין לא עוקבים אחר מרצים"
                description="התחילו לעקוב אחר המרצים שמעניינים אתכם כדי לקבל גישה מהירה לביקורות ודירוגים"
                actionLabel="הוסיפו את המרצה הראשון"
                onAction={openPopup}
                className="py-16 min-h-[50vh]"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-2 sm:mt-4">
                {trackedLecturers
                  .filter(({ lecturer }) => lecturer) // Filter out null/undefined lecturers
                  .map(({ lecturer }) => (
                    <TrackedLecturerCard
                      key={lecturer._id}
                      lecturer={lecturer}
                      onRemove={handleRemoveLecturer}
                      onViewDetails={handleViewLecturerDetails}
                    />
                  ))
                }
              </div>
            )}
          </>
        )}

      {/* Modal for adding new lecturers */}
      {isPopupOpen && (
        <AddLecturerPopup onClose={closePopup} onLecturerAdded={onLecturerAdded} />
      )}
    </PageLayout>
  );
};

export default TrackedLecturers;