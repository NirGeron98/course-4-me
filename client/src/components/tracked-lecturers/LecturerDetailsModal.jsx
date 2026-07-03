import React from "react";
import { User, Building, Mail, Hash, Calendar } from "lucide-react";
import Modal from "../common/Modal";

const LecturerDetailsModal = ({ lecturer, onClose }) => {
  if (!lecturer) return null;

  return (
    <Modal isOpen onClose={onClose} title={lecturer.name} size="md">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-200 p-3 rounded-full">
          <User className="w-6 h-6 text-purple-700" />
        </div>
        <span className="text-gray-600 text-sm">פרטי מרצה</span>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-500" />
          <span>מחלקה: {lecturer.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-500" />
          <span>אימייל: {lecturer.email}</span>
        </div>
        {lecturer.academicInstitution && (
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-500" />
            <span>מוסד אקדמי: {lecturer.academicInstitution}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>
            נוצר בתאריך:{" "}
            {new Date(lecturer.createdAt).toLocaleDateString("he-IL")}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default LecturerDetailsModal;
