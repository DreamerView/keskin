'use client';
import { useState } from 'react';

export default function ImageDropZone({ onFileSelect }) {
  const [highlight, setHighlight] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  return (
    <div data-aos="fade-up" data-aos-delay="100">
      <div
        className={`bg-body-tertiary rounded-5 p-5 text-center mb-3 ${highlight ? 'border-primary bg-light' : 'border-secondary'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setHighlight(true);
        }}
        onDragLeave={() => setHighlight(false)}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
      >
        <p className="mb-0">
          <strong>Drag & Drop</strong> your image here<br />
          or
        </p>
        <label className="btn btn-primary rounded-4 mt-2">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </label>
      </div>
    </div>
  );
}
