import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../hooks/useApi";
import CourseManagement from "../components/admin/CourseManagement";
import LecturerManagement from "../components/admin/LecturerManagement";
import DepartmentManagement from "../components/admin/DepartmentManagement";
import ContactRequestManagement from "../components/admin/ContactRequestManagement";
import { AlertCircle, BookOpen, Users, Building, MessageSquare, Settings } from "lucide-react";
import Alert from "../components/common/Alert";
import PageHero from "../components/common/PageHero";

const TABS = [
  { key: "courses", label: "ניהול קורסים", icon: BookOpen },
  { key: "lecturers", label: "ניהול מרצים", icon: Users },
  { key: "departments", label: "ניהול מחלקות", icon: Building },
  { key: "contact-requests", label: "ניהול פניות", icon: MessageSquare },
];
const TAB_KEYS = TABS.map((tab) => tab.key);

const AdminPanel = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = TAB_KEYS.includes(tabParam) ? tabParam : "courses";
  const setActiveTab = useCallback(
    (nextTab) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", nextTab);
        return next;
      });
    },
    [setSearchParams]
  );
  const [lecturers, setLecturers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user?.user?.role === "admin";

  // Set page title
  useEffect(() => {
    document.title = 'פאנל ניהול - Course4Me';
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Course4Me';
    };
  }, []);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const data = await apiFetch(`/api/lecturers`);
        setLecturers(data);
      } catch (err) {
        console.error("Error fetching lecturers:", err);
        setLecturers([]);
      }
    };
    fetchLecturers();
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-danger-soft via-white to-danger-soft flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-danger-soft rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">אין הרשאה</h1>
          <p className="text-slate-600">דף זה מיועד למנהלי המערכת בלבד</p>
        </div>
      </div>
    );
  }

  const handleMessage = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 5000);
  };

  const handleError = (err) => {
    setError(err);
    setMessage("");
    setTimeout(() => setError(""), 7000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-tint via-white to-brand-soft" dir="rtl">
      <PageHero
        icon={Settings}
        title="פאנל ניהול מערכת"
        subtitle="ניהול קורסים ומרצים במערכת"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-card-lg shadow-card border border-brand-soft">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                aria-current={activeTab === key ? "page" : undefined}
                className={`flex-1 min-w-max whitespace-nowrap py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-center font-medium transition-colors duration-ui ${
                  activeTab === key
                    ? "text-brand border-b-2 border-brand bg-brand-tint"
                    : "text-slate-600 hover:text-brand"
                }`}
              >
                <Icon className="w-5 h-5 inline-block ml-2" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {message && (
            <Alert
              type="success"
              message={message}
              onDismiss={() => setMessage("")}
              className="m-3 sm:m-6"
            />
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              onDismiss={() => setError("")}
              className="m-3 sm:m-6"
            />
          )}

          {activeTab === "courses" && (
            <CourseManagement
              lecturers={lecturers}
              onMessage={handleMessage}
              onError={handleError}
            />
          )}

          {activeTab === "lecturers" && (
            <LecturerManagement
              onMessage={handleMessage}
              onError={handleError}
              onLecturersUpdate={setLecturers}
            />
          )}

          {activeTab === "departments" && (
            <DepartmentManagement
              onMessage={handleMessage}
              onError={handleError}
            />
          )}

          {activeTab === "contact-requests" && (
            <ContactRequestManagement
              onMessage={handleMessage}
              onError={handleError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
