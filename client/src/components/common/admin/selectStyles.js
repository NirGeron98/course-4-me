// Shared react-select styling used by admin form modals (Lecturer, Course)
// so the multi-select look stays consistent instead of drifting per-file.
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "42px",
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#10b981" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(16,185,129,0.18)" : "none",
    "&:hover": { borderColor: "#10b981" },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#ecfdf5",
    borderRadius: "6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#047857",
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#047857",
    "&:hover": { backgroundColor: "#10b981", color: "white" },
  }),
  placeholder: (provided) => ({ ...provided, color: "#94a3b8" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
      ? "#f0fdf4"
      : "white",
    color: state.isSelected ? "white" : "#334155",
  }),
};

export default selectStyles;
