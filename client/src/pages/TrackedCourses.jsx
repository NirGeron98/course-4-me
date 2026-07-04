import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../hooks/useApi";
import { Plus, BookOpen } from "lucide-react";
import AddCoursePopup from "../components/tracked-courses/AddCoursePopup";
import TrackedCourseCard from "../components/tracked-courses/TrackedCourseCard";
import CourseDetailsModal from "../components/tracked-courses/CourseDetailsModal";
import {
  useCourseDataContext,
  COURSE_MUTATED_EVENT,
} from "../contexts/CourseDataContext";
import { SkeletonCardGrid } from '../components/common/Skeleton';
import PageLayout from '../components/common/PageLayout';
import EmptyState from '../components/common/EmptyState';

const CACHE_KEY = 'tracked_courses_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isTrackedCoursesCacheValid() {
  const cacheData = localStorage.getItem(CACHE_KEY);
  if (!cacheData) return false;
  try {
    const { timestamp } = JSON.parse(cacheData);
    return Date.now() - timestamp < CACHE_DURATION;
  } catch {
    return false;
  }
}

function getTrackedCoursesFromCache() {
  try {
    const cacheData = localStorage.getItem(CACHE_KEY);
    if (!cacheData) return null;
    const { trackedCourses } = JSON.parse(cacheData);
    return trackedCourses;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function saveTrackedCoursesToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ trackedCourses: data, timestamp: Date.now() }));
  } catch (error) {
    console.error('שגיאה בשמירת נתונים במטמון:', error);
  }
}

const TrackedCourses = () => {
  const [trackedCourses, setTrackedCourses] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchCourseStats } = useCourseDataContext();

  // Set page title
  useEffect(() => {
    document.title = 'הקורסים שלי - Course4Me';

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    trackedCourses.forEach((course) => {
      if (course.course && course.course._id) {
        fetchCourseStats(course.course._id, token);
      }
    });
  }, [trackedCourses, fetchCourseStats]);


  const fetchTrackedCourses = useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh && isTrackedCoursesCacheValid()) {
        const cachedData = getTrackedCoursesFromCache();
        if (cachedData && Array.isArray(cachedData)) {
          setTrackedCourses(cachedData);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const data = await apiFetch(`/api/tracked-courses`);
      const validTrackedCourses = data.filter(({ course }) => course && course._id);
      setTrackedCourses(validTrackedCourses);
      saveTrackedCoursesToCache(validTrackedCourses);
    } catch (err) {
      console.error("Failed to fetch tracked courses:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component and fetch data on mount
  useEffect(() => {
    fetchTrackedCourses();
  }, [fetchTrackedCourses]);

  // Listen for tracked course changes from other components/tabs
  useEffect(() => {
    const handleTrackedCourseAdded = () => {
      // Refresh tracked courses when a new one is added
      fetchTrackedCourses(true);
    };

    const handleTrackedCourseRemoved = () => {
      // Refresh tracked courses when one is removed
      fetchTrackedCourses(true);
    };

    const handleTrackedCoursesPreloaded = () => {
      if (isTrackedCoursesCacheValid()) {
        fetchTrackedCourses();
      }
    };

    // Listen for localStorage changes from other tabs
    const handleStorageChange = (event) => {
      if (event.key === 'trackedCourseChanged') {
        // A tracked course was changed in another tab
        // Force refresh data from API
        fetchTrackedCourses(true);
        // Clean up the flag
        localStorage.removeItem(event.key);
      }
    };

    // Add event listeners
    window.addEventListener('trackedCourseAdded', handleTrackedCourseAdded);
    window.addEventListener('trackedCourseRemoved', handleTrackedCourseRemoved);
    window.addEventListener('trackedCoursesPreloaded', handleTrackedCoursesPreloaded);
    window.addEventListener('storage', handleStorageChange);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('trackedCourseAdded', handleTrackedCourseAdded);
      window.removeEventListener('trackedCourseRemoved', handleTrackedCourseRemoved);
      window.removeEventListener('trackedCoursesPreloaded', handleTrackedCoursesPreloaded);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchTrackedCourses]);

  // Cross-page `courseMutated` broadcast: whenever any review/follow
  // mutation bumps a course aggregate, refetch the tracked list so the
  // cards on this page reflect the latest averages and review counts.
  useEffect(() => {
    const handleCourseMutated = () => {
      fetchTrackedCourses(true);
    };
    window.addEventListener(COURSE_MUTATED_EVENT, handleCourseMutated);
    return () => {
      window.removeEventListener(COURSE_MUTATED_EVENT, handleCourseMutated);
    };
  }, [fetchTrackedCourses]);

  // Popup handlers
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Callback for when a new course is added
  const onCourseAdded = () => {
    fetchTrackedCourses(true); // Force refresh to get fresh data
    closePopup();
  };

  // Remove course from tracking list
  const handleRemoveCourse = async (courseId) => {
    try {
      // Send DELETE request to API
      await apiFetch(`/api/tracked-courses/${courseId}`, {
        method: "DELETE",
      });

      // Update local state to remove the course immediately
      const updatedCourses = trackedCourses.filter(({ course }) => course._id !== courseId);
      setTrackedCourses(updatedCourses);
      
      saveTrackedCoursesToCache(updatedCourses);

      // Notify other tabs/components about tracked course removal
      const trackingEvent = new CustomEvent('trackedCourseRemoved', {
        detail: { courseId, timestamp: Date.now() }
      });
      window.dispatchEvent(trackingEvent);

      // Update localStorage for cross-tab synchronization
      localStorage.setItem('trackedCourseChanged', JSON.stringify({
        courseId,
        action: 'removed',
        timestamp: Date.now()
      }));

      // Clear dashboard cache so it refreshes on next visit
      const dashboardCache = window.localStorage.getItem('dashboard_tracked_courses');
      if (dashboardCache) {
        window.localStorage.removeItem('dashboard_tracked_courses');
        window.localStorage.removeItem('dashboard_tracked_courses_timestamp');
      }
      
      // Refresh dashboard data if the global function is available
      if (window.refreshDashboardData) {
        window.refreshDashboardData();
      }
    } catch (err) {
      console.error("Failed to remove course from tracking:", err);
    }
  };

  // Open course details modal
  const handleViewCourseDetails = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Close course details modal and reset selected course
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const hero = (
    <div className="relative bg-gradient-to-br from-brand to-brand-strong text-white py-8 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
        <div className="absolute top-4 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-right">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight text-white">
            הקורסים שלי
          </h1>
          <p className="text-base md:text-lg text-emerald-50 font-medium leading-relaxed">
            נהל את רשימת הקורסים שלך ועקוב אחר עדכונים
          </p>

          {!isLoading && trackedCourses.length > 0 && trackedCourses.some(({ course }) => course) && (
            <div className="mt-3">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 text-sm">
                <span className="font-semibold">
                  {trackedCourses.filter(({ course }) => course).length} קורסים במעקב
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openPopup}
          className="shrink-0 bg-white text-brand hover:text-brand-strong py-2.5 px-5 rounded-card font-semibold transition-all duration-ui shadow-card hover:shadow-card-hover flex items-center gap-2 group text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-brand"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-ui" aria-hidden="true" />
          הוספת קורס
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout accent="emerald" width="max-w-[1800px]" header={hero}>
        {/* Loading: skeleton grid to avoid layout shift */}
        {isLoading ? (
          <div className="mt-4" role="status">
            <p className="sr-only">טוען קורסים...</p>
            <div className="h-7 w-48 rounded bg-slate-200 animate-pulse mb-6" aria-hidden="true" />
            <SkeletonCardGrid count={6} />
          </div>
        ) : (
          <>
            {/* Empty state - shown when no courses or all courses are null */}
            {trackedCourses.length === 0 || trackedCourses.every(({ course }) => !course) ? (
              <EmptyState
                icon={BookOpen}
                title="עדיין לא עוקבים אחר קורסים"
                description="התחילו לעקוב אחר הקורסים שמעניינים אתכם כדי לקבל עדכונים ותזכורות בזמן אמת"
                actionLabel="הוסיפו את הקורס הראשון"
                onAction={openPopup}
                className="py-16 min-h-[50vh]"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-2 sm:mt-4">
                {trackedCourses
                  .filter(({ course }) => course) // Filter out null/undefined courses
                  .map(({ course }) => (
                    <TrackedCourseCard
                      key={course._id}
                      course={course}
                      onRemove={handleRemoveCourse}
                      onViewDetails={handleViewCourseDetails}
                    />
                  ))
                }
              </div>
            )}
          </>
        )}

      {/* Modal for adding new courses */}
      {isPopupOpen && (
        <AddCoursePopup onClose={closePopup} onCourseAdded={onCourseAdded} />
      )}

      {/* Modal for viewing course details */}
      {isModalOpen && selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={closeModal}
        />
      )}
    </PageLayout>
  );
};

export default TrackedCourses;