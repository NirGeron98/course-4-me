import React, { useEffect, useState } from "react";
import { Save, Plus, Building } from "lucide-react";
import Modal, { ModalFooter } from "../../common/Modal";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Alert from "../../common/Alert";

// DepartmentFormModal — add / edit form wrapped in the Modal primitive,
// mirroring LecturerFormModal.jsx. Owns the Hebrew->English code
// auto-generation that previously lived inline in DepartmentManagement.jsx.

const EMPTY_FORM = { name: "", code: "", description: "" };

const HEBREW_TO_ENGLISH = {
  מדעי: "cs",
  מחשב: "computer",
  הנדסת: "eng",
  הנדסה: "eng",
  תוכנה: "software",
  חשמל: "electricity",
  מכנית: "mechanical",
  ביורפואית: "biomedical",
  תעשייה: "industrial",
  ניהול: "management",
  נתונים: "data",
  אנגלית: "english",
  כללי: "general",
};

const generateCodeFromName = (name) => {
  const lower = name.toLowerCase();
  const match = Object.keys(HEBREW_TO_ENGLISH).find((hebrew) =>
    lower.includes(hebrew.toLowerCase())
  );
  if (match) return HEBREW_TO_ENGLISH[match];
  return name.replace(/\s+/g, "").toLowerCase().slice(0, 8);
};

const hydrateFromDepartment = (department) => {
  if (!department) return EMPTY_FORM;
  return {
    name: department.name || "",
    code: department.code || "",
    description: department.description || "",
  };
};

const DepartmentFormModal = ({
  isOpen,
  mode = "create",
  department = null,
  submitting = false,
  error = "",
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState(() => hydrateFromDepartment(department));
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(hydrateFromDepartment(department));
      setLocalError("");
    }
  }, [isOpen, department]);

  const handleNameChange = (event) => {
    const name = event.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate code only on create, and only while the user hasn't typed one.
      code: !isEdit && !prev.code ? generateCodeFromName(name) : prev.code,
    }));
  };

  const handleChange = (field) => (event) =>
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setLocalError("יש למלא שם וקוד מחלקה");
      return;
    }
    setLocalError("");
    onSubmit?.({
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description,
    });
  };

  const displayError = localError || error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "עריכת מחלקה" : "הוספת מחלקה חדשה"}
      description={isEdit ? department?.name || "" : "מלא את פרטי המחלקה החדשה"}
      size="lg"
    >
      <form
        id="department-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        dir="rtl"
      >
        {displayError && <Alert type="error" message={displayError} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="שם המחלקה"
            required
            leftIcon={Building}
            value={formData.name}
            onChange={handleNameChange}
            placeholder="לדוגמה: מדעי המחשב"
          />
          <Input
            label="קוד המחלקה"
            hint="באנגלית"
            required
            value={formData.code}
            onChange={handleChange("code")}
            placeholder="לדוגמה: cs"
          />
        </div>

        <Input
          as="textarea"
          rows={3}
          label="תיאור (אופציונלי)"
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="תיאור קצר של המחלקה..."
        />
      </form>

      <ModalFooter className="-mx-6 -mb-5 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={submitting}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          form="department-form"
          variant="primary"
          loading={submitting}
          leftIcon={isEdit ? Save : Plus}
        >
          {isEdit ? "שמור שינויים" : "הוסף מחלקה"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DepartmentFormModal;
