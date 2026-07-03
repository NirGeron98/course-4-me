import { Clock, CheckCircle2, RefreshCw } from "lucide-react";

// Shared display helpers for the user-facing contact-requests page.
// Kept separate from the components so ContactRequestRow and
// ContactRequestDetailsModal can both format the same way without duplication.

export const SUBJECT_MAP = {
  add_lecturer_to_course: "הוספת מרצה לקורס",
  add_course_to_lecturer: "הוספת קורס למרצה",
  add_course_to_system: "הוספת קורס למערכת",
  add_lecturer_to_system: "הוספת מרצה למערכת",
  general_inquiry: "פנייה כללית",
};

export const STATUS_MAP = {
  pending: {
    text: "ממתין לטיפול",
    icon: Clock,
    color: "text-amber-700 bg-amber-100 border-amber-200",
    dotColor: "bg-amber-500",
  },
  in_progress: {
    text: "בטיפול",
    icon: RefreshCw,
    color: "text-blue-700 bg-blue-100 border-blue-200",
    dotColor: "bg-blue-500",
  },
  answered: {
    text: "נענתה",
    icon: CheckCircle2,
    color: "text-emerald-700 bg-emerald-100 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
};

export const getSubjectDisplay = (subject) => SUBJECT_MAP[subject] || subject;
export const getStatusDisplay = (status) => STATUS_MAP[status] || STATUS_MAP.pending;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
