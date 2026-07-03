import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Modal, { ModalFooter } from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Alert from "../common/Alert";

// ContactRequestEditModal — the previous inline "Edit Modal" migrated onto
// the shared Modal primitive. Owns only form-field state; validation and the
// actual update call stay in the parent shell (same split as
// CourseFormModal / LecturerFormModal). The subject field stays a native
// <select> since Input has no select variant, matching the admin panels'
// convention of using a raw <select> for status/subject dropdowns.

const SUBJECT_OPTIONS = [
  { value: "", label: "בחר נושא..." },
  { value: "add_lecturer_to_course", label: "הוספת מרצה לקורס" },
  { value: "add_course_to_lecturer", label: "הוספת קורס למרצה" },
  { value: "add_course_to_system", label: "הוספת קורס למערכת" },
  { value: "add_lecturer_to_system", label: "הוספת מרצה למערכת" },
  { value: "general_inquiry", label: "פנייה כללית" },
];

const ContactRequestEditModal = ({
  request,
  submitting = false,
  error = "",
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({ subject: "", description: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (request) {
      setFormData({ subject: request.subject, description: request.description });
      setLocalError("");
    }
  }, [request]);

  if (!request) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.subject?.trim() || !formData.description?.trim()) {
      setLocalError("נושא ותיאור הם שדות חובה");
      return;
    }
    setLocalError("");
    onSubmit?.({
      subject: formData.subject.trim(),
      description: formData.description.trim(),
    });
  };

  const displayError = localError || error;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="עריכת פנייה"
      description="ערוך את פרטי הפנייה שלך"
      size="lg"
    >
      <form
        id="contact-request-edit-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:gap-6"
        dir="rtl"
      >
        {displayError && <Alert type="error" message={displayError} />}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            נושא הפנייה <span className="text-danger mr-1">*</span>
          </label>
          <select
            value={formData.subject}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, subject: event.target.value }))
            }
            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand text-sm sm:text-base"
            required
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          as="textarea"
          label="תיאור הפנייה"
          required
          rows={5}
          maxLength={1000}
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="פרט את בקשתך או שאלתך..."
          hint={`${formData.description.length}/1000 תווים`}
        />
      </form>

      <ModalFooter className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-5 mt-6">
        <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
          ביטול
        </Button>
        <Button
          type="submit"
          form="contact-request-edit-form"
          variant="primary"
          loading={submitting}
          leftIcon={Save}
        >
          שמור שינויים
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactRequestEditModal;
