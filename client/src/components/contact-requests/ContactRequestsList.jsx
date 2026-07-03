import React from "react";
import { MessageSquare } from "lucide-react";
import ElegantLoadingSpinner from "../common/ElegantLoadingSpinner";
import EmptyState from "../common/EmptyState";
import ContactRequestRow from "./ContactRequestRow";

// ContactRequestsList — the card container that used to be inlined in
// MyContactRequests.jsx. Owns only presentation: loading spinner, empty
// state (now the shared EmptyState primitive instead of hand-rolled markup),
// or the row list. All data and handlers are passed down from the page shell.
const ContactRequestsList = ({ requests, loading, onEdit, onDelete, onView }) => (
  <div className="bg-white rounded-card sm:rounded-card-lg shadow-sm border border-slate-200">
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800">
        הפניות שלך ({requests.length})
      </h2>
    </div>

    {loading && requests.length === 0 ? (
      <ElegantLoadingSpinner message="טוען את הפניות שלך..." size="large" />
    ) : requests.length === 0 ? (
      <EmptyState
        icon={MessageSquare}
        title="אין פניות עדיין"
        description="לא יצרת עדיין פניות למערכת"
        className="border-0 bg-transparent rounded-none"
      />
    ) : (
      <div className="divide-y divide-slate-100 animate-fadeIn">
        {requests.map((request, index) => (
          <ContactRequestRow
            key={request._id}
            request={request}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    )}
  </div>
);

export default ContactRequestsList;
