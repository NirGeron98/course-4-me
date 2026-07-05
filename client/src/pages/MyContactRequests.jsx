import React, { useEffect, useState } from "react";
import { MessageSquare, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import Alert from "../components/common/Alert";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ContactRequestsList from "../components/contact-requests/ContactRequestsList";
import ContactRequestDetailsModal from "../components/contact-requests/ContactRequestDetailsModal";
import ContactRequestEditModal from "../components/contact-requests/ContactRequestEditModal";
import PageLayout from "../components/common/PageLayout";
import PageHero from "../components/common/PageHero";
import { useContactRequests } from "../hooks/useContactRequests";

// MyContactRequests — thin page shell (Phase 6 refactor). Data fetching and
// the update/delete mutations are unchanged: they still flow through
// useContactRequests exactly as before. The page now only owns UI state
// (which modal is open, in-flight flags) and delegates rendering to the
// contact-requests feature components.
//
// Two intentional, UI-only behavior changes made during this pass (no logic
// touched):
//  - The blocking "success" modal is now an auto-dismissing Alert banner,
//    consistent with how the rest of the design system surfaces success
//    messages (still shown for the same 3 seconds).
//  - The edit form's validation message and the delete/update failure
//    messages now render via the shared Alert component instead of native
//    window.alert() popups.
const MyContactRequests = ({ user }) => {
  const { requests, loading, error, refetch, updateRequest, deleteRequest } =
    useContactRequests();

  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "הפניות שלי - Course4Me";
    return () => {
      document.title = "Course4Me";
    };
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timeout = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!editingRequest) return;
    setSaving(true);
    setActionError("");
    try {
      const updated = await updateRequest(editingRequest._id, payload);
      if (selectedRequest && selectedRequest._id === editingRequest._id) {
        setSelectedRequest(updated);
      }
      setEditingRequest(null);
      setSuccessMessage("הפנייה עודכנה בהצלחה!");
    } catch (err) {
      setActionError("שגיאה בעדכון הפנייה: " + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteRequest(deleteTargetId);
      if (selectedRequest && selectedRequest._id === deleteTargetId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      setActionError("שגיאה במחיקת הפנייה: " + (err?.message || ""));
    } finally {
      setDeleteTargetId(null);
      setDeleting(false);
    }
  };

  const hero = (
    <PageHero
      icon={MessageSquare}
      title="הפניות שלי"
      subtitle="עקבו אחר הפניות שלכם לצוות התמיכה וסטטוס הטיפול בהן"
      badge={`נמצאו ${requests.length} פניות`}
    />
  );

  return (
    <PageLayout accent="slate" header={hero}>
        {(error || actionError) && (
          <Alert
            type="error"
            message={error || actionError}
            onDismiss={actionError ? () => setActionError("") : undefined}
            className="mb-4"
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage("")}
            className="mb-4"
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-card border border-slate-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-center hover:shadow-card transition-shadow duration-ui">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 ml-2">
                {requests.length}
              </span>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-1.5 rounded-card ml-2">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                </div>
                <span className="text-xs sm:text-sm text-slate-600">הפניות שלי</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-slate-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-center hover:shadow-card transition-shadow duration-ui">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 ml-2">
                {requests.filter((r) => r.status === "answered").length}
              </span>
              <div className="flex items-center">
                <div className="bg-emerald-100 p-1.5 rounded-card ml-2">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm text-slate-600">נענו</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-slate-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-center hover:shadow-card transition-shadow duration-ui">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-amber-500 ml-2">
                {requests.filter((r) => r.status === "pending").length}
              </span>
              <div className="flex items-center">
                <div className="bg-amber-100 p-1.5 rounded-card ml-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                </div>
                <span className="text-xs sm:text-sm text-slate-600">ממתינות</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-slate-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-center hover:shadow-card transition-shadow duration-ui">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-blue-500 ml-2">
                {requests.filter((r) => r.status === "in_progress").length}
              </span>
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-card ml-2">
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                </div>
                <span className="text-xs sm:text-sm text-slate-600">בטיפול</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="col-span-2 lg:col-span-1 bg-white rounded-card border border-slate-200 flex items-center justify-center px-3 sm:px-4 py-3 text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 ${refreshing ? "animate-spin" : ""}`} />
            <span className="text-xs sm:text-sm">{refreshing ? "מרענן..." : "רענן"}</span>
          </button>
        </div>

        <ContactRequestsList
          requests={requests}
          loading={loading}
          onEdit={setEditingRequest}
          onDelete={setDeleteTargetId}
          onView={setSelectedRequest}
        />

      {selectedRequest && (
        <ContactRequestDetailsModal
          request={selectedRequest}
          user={user}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {editingRequest && (
        <ContactRequestEditModal
          request={editingRequest}
          submitting={saving}
          error={actionError}
          onClose={() => setEditingRequest(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="מחיקת פנייה"
        message="האם אתה בטוח שברצונך למחוק את הפנייה? לא ניתן יהיה לשחזר אותה לאחר המחיקה."
        confirmLabel="מחק סופית"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </PageLayout>
  );
};

export default MyContactRequests;
