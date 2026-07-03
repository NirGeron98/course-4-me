import React from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

// Kept as a thin wrapper so existing call sites keep working; the actual
// dialog behavior (portal, escape, scroll lock, focus) comes from ConfirmDialog.
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, confirmLabel }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onCancel}
    onConfirm={onConfirm}
    title={title || "אישור מחיקה"}
    message={message || "האם אתה בטוח שברצונך למחוק את הביקורת? פעולה זו אינה ניתנת לביטול."}
    confirmLabel={confirmLabel || "מחק ביקורת"}
    variant="danger"
    confirmIcon={Trash2}
  />
);

export default DeleteConfirmationModal;
