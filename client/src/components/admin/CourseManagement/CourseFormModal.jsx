import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Hash, BookOpen, Save, Plus } from "lucide-react";
import Modal, { ModalFooter } from "../../common/Modal";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Alert from "../../common/Alert";
import selectStyles from "../../common/admin/selectStyles";

// CourseFormModal — add / edit form wrapped in the Modal primitive, mirroring
// LecturerFormModal.jsx. Only owns form-field state; the parent shell builds
// the actual API payload (credits parsing, prerequisites join, createdBy)
// so the request shape sent to /api/courses stays byte-for-byte identical
// to the previous flat CourseManagement.jsx implementation.

const EMPTY_FORM = {
  courseNumber: "",
  title: "",
  description: "",
  lecturers: [],
  academicInstitution: "מכללת אפקה",
  credits: "",
  department: "",
  prerequisites: [],
};

const hydrateFromCourse = (course) => {
  if (!course) return EMPTY_FORM;
  return {
    courseNumber: course.courseNumber,
    title: course.title,
    description: course.description,
    lecturers: course.lecturers.map((l) => l._id),
    academicInstitution: course.academicInstitution,
    credits: course.credits.toString(),
    department: course.department || "",
    prerequisites: course.prerequisites
      ? course.prerequisites.split(",").map((s) => s.trim())
      : [],
  };
};

const CourseFormModal = ({
  isOpen,
  mode = "create",
  course = null,
  lecturers = [],
  courses = [],
  submitting = false,
  error = "",
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState(() => hydrateFromCourse(course));

  useEffect(() => {
    if (isOpen) {
      setFormData(hydrateFromCourse(course));
    }
  }, [isOpen, course]);

  const lecturerOptions = lecturers.map((lecturer) => ({
    value: lecturer._id,
    label: lecturer.name,
  }));
  const selectedLecturers = lecturerOptions.filter((opt) =>
    formData.lecturers.includes(opt.value)
  );

  const prerequisiteOptions = courses
    .filter((c) => c.courseNumber !== formData.courseNumber)
    .map((c) => ({
      value: c.title,
      label: `${c.title} (${c.courseNumber})`,
    }));
  const selectedPrerequisites = formData.prerequisites.map((prereq) => ({
    value: prereq,
    label: prereq,
  }));

  const handleChange = (field) => (event) =>
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  const handleLecturersChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      lecturers: Array.isArray(selected) ? selected.map((o) => o.value) : [],
    }));
  };

  const handlePrerequisitesChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: Array.isArray(selected) ? selected.map((o) => o.value) : [],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "עריכת קורס" : "הוספת קורס חדש"}
      description={isEdit ? formData.title || "" : "מלא את פרטי הקורס החדש"}
      size="lg"
    >
      <form
        id="course-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        dir="rtl"
      >
        {error && <Alert type="error" message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="מספר קורס"
            required
            leftIcon={Hash}
            value={formData.courseNumber}
            onChange={handleChange("courseNumber")}
            placeholder="123456"
          />
          <Input
            label="נקודות זכות"
            required
            type="number"
            min="1"
            max="20"
            value={formData.credits}
            onChange={handleChange("credits")}
            placeholder="4"
          />
        </div>

        <Input
          label="שם הקורס"
          required
          leftIcon={BookOpen}
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="שם הקורס"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            מרצים (ניתן לבחור יותר מאחד)
          </label>
          <Select
            isMulti
            value={selectedLecturers}
            onChange={handleLecturersChange}
            options={lecturerOptions}
            placeholder="בחר מרצים..."
            isSearchable
            classNamePrefix="react-select"
            styles={selectStyles}
            noOptionsMessage={() => "לא נמצאו מרצים"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            דרישות קדם (ניתן לחפש ולבחור יותר מקורס אחד)
          </label>
          <Select
            isMulti
            value={selectedPrerequisites}
            onChange={handlePrerequisitesChange}
            options={prerequisiteOptions}
            placeholder="חפש ובחר קורסים..."
            isSearchable
            isClearable
            classNamePrefix="react-select"
            styles={selectStyles}
            noOptionsMessage={() => "לא נמצאו קורסים"}
          />
        </div>

        <Input
          as="textarea"
          rows={4}
          label="תיאור הקורס"
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="תיאור מפורט של הקורס..."
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
          form="course-form"
          variant="primary"
          loading={submitting}
          leftIcon={isEdit ? Save : Plus}
        >
          {isEdit ? "שמור שינויים" : "הוסף קורס"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CourseFormModal;
