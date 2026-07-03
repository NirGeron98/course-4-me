import React from "react";
import Modal, { ModalFooter } from "./Modal";
import Button from "./Button";

// ConfirmDialog — thin confirmation wrapper over Modal.
// Renders a message (and/or custom children), a cancel button, and a confirm
// button. Pass variant="danger" for destructive confirmations.
// While `loading` is true the dialog cannot be dismissed and the confirm
// button shows a spinner.
const ConfirmDialog = ({
  isOpen,
  title,
  description,
  message,
  children,
  confirmLabel = "אישור",
  cancelLabel = "ביטול",
  variant = "primary",
  loading = false,
  confirmIcon,
  onConfirm,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={loading ? () => {} : onClose}
    title={title}
    description={description}
    size="sm"
    closeOnBackdrop={!loading}
  >
    {message && (
      <p className="text-gray-700 text-base leading-relaxed">{message}</p>
    )}
    {children}
    <ModalFooter className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-5 mt-5">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant}
        onClick={onConfirm}
        loading={loading}
        leftIcon={confirmIcon}
      >
        {confirmLabel}
      </Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmDialog;
