'use client';

import { useState,useEffect } from 'react';

const FILTERS = [
  { key: 'blur', label: 'Blur', unit: 'px', min: 0, max: 20, step: 1, default: 0 },
  { key: 'brightness', label: 'Brightness', unit: '%', min: 0, max: 200, step: 1, default: 100 },
  { key: 'contrast', label: 'Contrast', unit: '%', min: 0, max: 200, step: 1, default: 100 },
  { key: 'grayscale', label: 'Grayscale', unit: '%', min: 0, max: 100, step: 1, default: 0 },
  { key: 'hueRotate', label: 'Hue Rotate', unit: '°', min: 0, max: 360, step: 1, default: 0 },
  { key: 'invert', label: 'Invert', unit: '%', min: 0, max: 100, step: 1, default: 0 },
  { key: 'saturate', label: 'Saturate', unit: '', min: 0, max: 2, step: 0.1, default: 1 },
  { key: 'sepia', label: 'Sepia', unit: '%', min: 0, max: 100, step: 1, default: 0 },
];

export default function EditTool({ src, onDone, onCancel,reset }) {
  const [filters, setFilters] = useState(() =>
    FILTERS.reduce((acc, f) => ({ ...acc, [f.key]: f.default }), {})
  );

  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);

  useEffect(() => {
    if (reset) {
      const resetValues = {};
      FILTERS.forEach(f => resetValues[f.key] = f.default);
      setFilters(resetValues);
    }
  }, [reset]);

  const filterStyle = {
    filter: `
      blur(${filters.blur}px)
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
      saturate(${filters.saturate})
      sepia(${filters.sepia}%)
    `.replace(/\s+/g, ' ').trim()
  };

  const applyFiltersToCanvas = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        ctx.filter = filterStyle.filter;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const file = new File([blob], 'edited.png', { type: 'image/png' });
          resolve(file);
        }, 'image/png');
      };
      img.src = src;
    });
  };

  const handleDone = async () => {
    const editedFile = await applyFiltersToCanvas();
    onDone(editedFile);
  };

  const handleReset = () => {
    const resetValues = {};
    FILTERS.forEach(f => resetValues[f.key] = f.default);
    setFilters(resetValues);
  };

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const currentFilter = FILTERS.find(f => f.key === activeFilter);

  return (
    <div className="container text-center">
      <div className="row align-items-center">
        {/* Preview col-8 */}
        <div className="col-12">
          <div className=''>
            <img
              src={src}
              alt="Editing Preview"
              className='img-fluid'
              style={{ maxHeight:300, filter: filterStyle.filter, borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Controls col-4 */}
        <div className="col-12 my-5 mx-auto" style={{maxWidth:900,width:"100%"}}>
          <div className='bg-body-tertiary p-4 rounded-5'>
            {/* Filter Buttons with values */}
            <div className="d-flex justify-content-lg-center flex-nowrap gap-2 mb-4 overflow-x-auto">
              {FILTERS.map(f => {
                const val = filters[f.key];
                const isDefault = val === f.default;
                return (
                  <button
                    key={f.key}
                    className={`btn rounded-4 ${activeFilter === f.key ? 'btn-light' : 'btn-outline-light border-0 text-nowrap'}`}
                    onClick={() => setActiveFilter(f.key)}
                    type="button"
                  >
                    {f.label}
                    {!isDefault && (
                      <span className="ms-1" style={{ fontWeight: 'normal', opacity: 0.7 }}>
                        ({val}{f.unit})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Filter Slider */}
            <div className="mt-2 px-3">
              <input
                type="range"
                min={currentFilter.min}
                max={currentFilter.max}
                step={currentFilter.step}
                value={filters[currentFilter.key]}
                onChange={(e) => handleChange(currentFilter.key, Number(e.target.value))}
                className="form-range"
              />
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-2 flex-wrap">
              <button className="btn btn-primary rounded-4" onClick={handleDone}>Apply</button>
              <button className="btn btn-outline-secondary border-0 rounded-4" onClick={onCancel}>Cancel</button>
              <button className="btn btn-outline-danger border-0 rounded-4" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
