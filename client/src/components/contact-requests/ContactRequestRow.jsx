import React from "react";
import { Calendar, CheckCircle2, Edit3, Eye, Trash2 } from "lucide-react";
import { getStatusDisplay, getSubjectDisplay, formatDate } from "./contactRequestDisplay";

// ContactRequestRow — presentational card for a single request in the list.
// Pure extraction from the old monolithic MyContactRequests.jsx; markup and
// classNames are unchanged, only wired to props instead of closures.
const ContactRequestRow = ({ request, index, onEdit, onDelete, onView }) => {
  const statusDisplay = getStatusDisplay(request.status);

  return (
    <div
      className="p-4 sm:p-6 hover:bg-slate-50 transition-all duration-ui animate-fadeIn"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-3">
            <span
              className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${statusDisplay.color} w-fit`}
            >
              <div className={`w-2 h-2 rounded-full ${statusDisplay.dotColor} ml-2`} />
              {statusDisplay.text}
            </span>
            <div className="flex items-center text-xs sm:text-sm text-slate-500 sm:mr-4">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              {formatDate(request.createdAt)}
            </div>
          </div>

          <div className="mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">כותרת: </span>
            <span className="text-base sm:text-lg font-bold text-slate-800 break-words">
              {getSubjectDisplay(request.subject)}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3 line-clamp-2 break-words">
            {request.description}
          </p>

          {request.adminResponse && (
            <div className="flex items-center text-xs sm:text-sm text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 flex-shrink-0" />
              <span className="break-words">קיבלת תגובה מהצוות</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 justify-end sm:justify-start">
          {request.status !== "answered" && (
            <button
              onClick={() => onEdit(request)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-card transition-all group"
              title="ערוך פנייה"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(request._id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-card transition-all group"
            title="מחק פנייה"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onView(request)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-card transition-all"
            title="הצג פרטים"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactRequestRow;
