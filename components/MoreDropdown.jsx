'use client';

import { useState, useRef, useEffect } from 'react';

export default function MoreDropdown({ onExport, onExportAs, onConvertPWA, onInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="btn btn-outline-success dropdown-toggle"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        More
      </button>
      <ul className={`dropdown-menu${open ? ' show' : ''}`}>
        <li>
          <button
            className="dropdown-item"
            onClick={() => {
              onExport();
              setOpen(false);
            }}
          >
            Export
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => {
              onExportAs();
              setOpen(false);
            }}
          >
            Export As
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => {
              onConvertPWA();
              setOpen(false);
            }}
          >
            Convert PWA
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => {
              onInfo();
              setOpen(false);
            }}
          >
            ℹ️ Info
          </button>
        </li>
      </ul>
    </div>
  );
}
