'use client';

import { useState } from 'react';

export default function MoreModal({ show, onClose, onExport, onExportAs, onConvertPWA, onInfo }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">More Options</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex flex-column gap-3">
            <button className="btn btn-outline-primary w-100" onClick={() => { onExport(); onClose(); }}>
              Export
            </button>
            <button className="btn btn-outline-primary w-100" onClick={() => { onExportAs(); onClose(); }}>
              Export As
            </button>
            <button className="btn btn-outline-primary w-100" onClick={() => { onConvertPWA(); onClose(); }}>
              Convert PWA
            </button>
            <hr />
            <button className="btn btn-outline-secondary w-100" onClick={() => { onInfo(); onClose(); }}>
              ℹ️ Info
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
