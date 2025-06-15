'use client';

export default function ConfirmModal({ show, onConfirm, onCancel, title = "Confirm", message = "Are you sure?" }) {
  if (!show) return null;

  return (
    <div className="container py-4" style={{ maxWidth: 400, width: '100%' }} data-aos="fade-up">
      <h4 className="mb-3">{title}</h4>
      <p className="opacity-75">{message}</p>
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-danger flex-grow-1 rounded-4" onClick={onConfirm}>Confirm</button>
        <button className="btn bg-body-secondary flex-grow-1 rounded-4" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
