import { useCallback, useRef, useState } from "react";
import Modal from "./Modal";

/**
 * Confirmation modal for delete/remove actions.
 * Prefer useConfirmDialog() for a Promise-based confirm() API.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isConfirming ? () => {} : onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-all disabled:opacity-50"
          >
            {isConfirming ? "Please wait..." : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-gray-600 leading-relaxed">{message}</p>
    </Modal>
  );
};

/**
 * Hook: await confirm({ title, message, confirmLabel }) → boolean
 * Render `dialog` once in the component tree.
 */
export const useConfirmDialog = () => {
  const resolveRef = useRef(null);
  const [state, setState] = useState({
    isOpen: false,
    title: "Confirm",
    message: "Are you sure?",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  });

  const close = useCallback((result) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  const confirm = useCallback(
    ({
      title = "Confirm",
      message = "Are you sure?",
      confirmLabel = "Delete",
      cancelLabel = "Cancel",
    } = {}) =>
      new Promise((resolve) => {
        resolveRef.current = resolve;
        setState({
          isOpen: true,
          title,
          message,
          confirmLabel,
          cancelLabel,
        });
      }),
    [],
  );

  const dialog = (
    <ConfirmDialog
      isOpen={state.isOpen}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      onClose={() => close(false)}
      onConfirm={() => close(true)}
    />
  );

  return { confirm, dialog };
};

export default ConfirmDialog;
