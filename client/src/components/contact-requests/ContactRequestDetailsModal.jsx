import React from "react";
import { User, Headphones, Clock } from "lucide-react";
import Modal, { ModalFooter } from "../common/Modal";
import Button from "../common/Button";
import { getStatusDisplay, getSubjectDisplay, formatDate } from "./contactRequestDisplay";

// ContactRequestDetailsModal — read-only view of a single request, migrated
// from the inline fixed/backdrop markup in the old MyContactRequests.jsx onto
// the shared Modal primitive. Content and copy are unchanged.
const ContactRequestDetailsModal = ({ request, user, onClose }) => {
  if (!request) return null;

  const statusDisplay = getStatusDisplay(request.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={getSubjectDisplay(request.subject)}
      description={`פנייה מתאריך ${formatDate(request.createdAt)}`}
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6" dir="rtl">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="bg-indigo-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <span className="font-semibold text-slate-800 text-sm sm:text-base">
                {user?.fullName || "את/ה"}
              </span>
              <div className="flex items-center text-slate-500">
                <span className="hidden sm:inline text-sm">•</span>
                <span className="text-xs sm:text-sm sm:mr-2">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-card sm:rounded-card-lg rounded-tr-sm sm:rounded-tr-lg p-3 sm:p-4 border border-indigo-100">
              <p className="text-slate-800 leading-relaxed text-sm sm:text-base break-words">
                {request.description}
              </p>
            </div>
          </div>
        </div>

        {request.adminResponse ? (
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-full flex-shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <span className="font-semibold text-slate-800 text-sm sm:text-base">
                  {request.respondedBy?.fullName || "צוות התמיכה"}
                </span>
                <div className="flex items-center text-slate-500">
                  <span className="hidden sm:inline text-sm">•</span>
                  <span className="text-xs sm:text-sm sm:mr-2">
                    {formatDate(request.respondedAt)}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-card sm:rounded-card-lg rounded-tr-sm sm:rounded-tr-lg p-3 sm:p-4 border border-emerald-100">
                <p className="text-slate-800 leading-relaxed text-sm sm:text-base break-words">
                  {request.adminResponse}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-slate-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              ממתין לתגובת הצוות
            </p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              נחזור אליך בהקדם האפשרי
            </p>
          </div>
        )}
      </div>

      <ModalFooter className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-5 mt-6">
        <span
          className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${statusDisplay.color}`}
        >
          <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          {statusDisplay.text}
        </span>
        <div className="flex-1" />
        <Button type="button" variant="secondary" onClick={onClose}>
          סגור
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactRequestDetailsModal;
