'use client';

import { useState } from 'react';

export default function MoreModal({ show, onClose, onExport, onExportAs, onConvertPWA, onInfo }) {
  const [exportAsOpen, setExportAsOpen] = useState(false);
  const [format, setFormat] = useState('jpeg'); // jpeg, png, webp
  const [quality, setQuality] = useState(90);

  if (!show) return null;

  const qualityApplicable = format === 'jpeg' || format === 'webp';

  const handleExportAsClick = () => {
    onExportAs(format, quality);
    onClose();
  };

  return (
    <div className="container py-4" style={{ maxWidth: 500, width: '100%' }}>
      <h3 className="mb-5">More Options</h3>
      <div className="d-flex flex-column gap-3">

        <button
          type="button"
          className="btn bg-body-secondary rounded-4 py-2"
          onClick={() => {
            onExport();
            onClose();
          }}
        >
          Export
        </button>

        <button
          type="button"
          className="btn bg-body-secondary rounded-4 py-2"
          onClick={() => setExportAsOpen(!exportAsOpen)}
          aria-expanded={exportAsOpen}
          aria-controls="exportAsCollapse"
        >
          Export As {exportAsOpen ? '▲' : '▼'}
        </button>

        <div className={`collapse ${exportAsOpen ? 'show' : ''}`} id="exportAsCollapse">
          <div className="card card-body bg-body-light my-2 rounded-4">
            <div className="mb-3">
              <label className="form-label fw-bold">Format</label>
              <div>
                {['jpeg', 'png', 'webp'].map((f) => (
                  <div className="form-check form-check-inline" key={f}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exportFormat"
                      id={`format-${f}`}
                      value={f}
                      checked={format === f}
                      onChange={() => setFormat(f)}
                    />
                    <label className="form-check-label" htmlFor={`format-${f}`}>
                      {f.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {qualityApplicable && (
              <div className="mb-3">
                <label htmlFor="qualityRange" className="form-label fw-bold">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="qualityRange"
                  min="10"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </div>
            )}

            <button className="btn btn-primary w-100" onClick={handleExportAsClick}>
              Export As
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn bg-body-secondary rounded-4 py-2"
          onClick={() => {
            onConvertPWA();
            onClose();
          }}
        >
          Convert PWA
        </button>

        <button
          type="button"
          className="btn bg-body-secondary rounded-4 py-2"
          onClick={() => {
            onInfo();
            onClose();
          }}
        >
          Info about image
        </button>

        <button
          type="button"
          className="btn btn-danger mt-4 rounded-4 py-2"
          onClick={onClose}
        >
          Back
        </button>
      </div>
    </div>
  );
}
