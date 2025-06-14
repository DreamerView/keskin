'use client';

import { useState, useEffect } from 'react';

export default function ResizeTool({ src, onDone, onCancel }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [localWidth, setLocalWidth] = useState('');
  const [localHeight, setLocalHeight] = useState('');
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectFixedBy, setAspectFixedBy] = useState('width'); // 'width' or 'height'
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setLocalWidth(String(img.naturalWidth));
      setLocalHeight(String(img.naturalHeight));
      generatePreview(img.naturalWidth, img.naturalHeight);
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    setLocalWidth(String(width));
  }, [width]);

  useEffect(() => {
    setLocalHeight(String(height));
  }, [height]);

  useEffect(() => {
    if (
      keepAspect &&
      naturalWidth &&
      naturalHeight &&
      width > 0 &&
      height > 0
    ) {
      if (aspectFixedBy === 'width') {
        const newHeight = Math.round((width / naturalWidth) * naturalHeight);
        if (newHeight !== height) {
          setHeight(newHeight);
          setLocalHeight(String(newHeight));
          generatePreview(width, newHeight);
        } else {
          generatePreview(width, height);
        }
      } else if (aspectFixedBy === 'height') {
        const newWidth = Math.round((height / naturalHeight) * naturalWidth);
        if (newWidth !== width) {
          setWidth(newWidth);
          setLocalWidth(String(newWidth));
          generatePreview(newWidth, height);
        } else {
          generatePreview(width, height);
        }
      }
    } else if (width > 0 && height > 0) {
      generatePreview(width, height);
    }
  }, [width, height, keepAspect, aspectFixedBy, naturalWidth, naturalHeight]);

  const generatePreview = (w, h) => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }, 'image/png');
    };
    img.src = src;
  };

  const clampTo9999 = (value) => {
    if (value === '') return '';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return '';
    if (num > 9999) return 9999;
    return num;
  };

  const handleApply = () => {
    if (!src || width <= 0 || height <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'resized.png', { type: 'image/png' });
        onDone(file);
      }, 'image/png');
    };
    img.src = src;
  };

  return (
    <div className="container">
      <div className="row">
        {/* Preview (8 columns) */}
        <div
          className="col-12 col-md-8 d-flex justify-content-center align-items-center mb-4 mb-md-0"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="700"
        >
          <div className="bg-body-tertiary p-md-5 rounded-5 w-100 d-flex justify-content-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview resized"
                className="img-fluid rounded"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <p>Loading preview...</p>
            )}
          </div>
        </div>

        {/* Controls (4 columns) */}
        <div
          className="col-12 col-md-4"
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="700"
        >
          <div className="bg-body-tertiary rounded-5 p-md-5 p-4">
            <div className="mb-3">
              <label className="form-label">Width (px):</label>
              <input
                type="text"
                maxLength={4}
                className="form-control rounded-4 px-4 py-2"
                value={localWidth}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 4);
                  if (/^\d*$/.test(val)) {
                    setLocalWidth(val);
                  }
                }}
                onBlur={() => {
                  const val = clampTo9999(localWidth);
                  if (val !== '') setWidth(val);
                  else setLocalWidth(String(width));
                }}
                disabled={keepAspect && aspectFixedBy === 'height'}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Height (px):</label>
              <input
                type="text"
                maxLength={4}
                className="form-control rounded-4 px-4 py-2"
                value={localHeight}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 4);
                  if (/^\d*$/.test(val)) {
                    setLocalHeight(val);
                  }
                }}
                onBlur={() => {
                  const val = clampTo9999(localHeight);
                  if (val !== '') setHeight(val);
                  else setLocalHeight(String(height));
                }}
                disabled={keepAspect && aspectFixedBy === 'width'}
              />
            </div>
            <div className="form-check mb-3 d-flex justify-content-center">
              <div className="d-flex gap-3">
                <input
                  type="checkbox"
                  id="keepAspect"
                  className="form-check-input"
                  checked={keepAspect}
                  onChange={() => setKeepAspect(!keepAspect)}
                />
                <label htmlFor="keepAspect" className="form-check-label">
                  Keep aspect ratio
                </label>
              </div>
            </div>
            {keepAspect && (
              <div className="mt-4">
                <label className="form-label">Fix aspect ratio by:</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="aspectFixedBy"
                      id="fixWidth"
                      value="width"
                      checked={aspectFixedBy === 'width'}
                      onChange={() => setAspectFixedBy('width')}
                    />
                    <label className="form-check-label" htmlFor="fixWidth">
                      Width
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="aspectFixedBy"
                      id="fixHeight"
                      value="height"
                      checked={aspectFixedBy === 'height'}
                      onChange={() => setAspectFixedBy('height')}
                    />
                    <label className="form-check-label" htmlFor="fixHeight">
                      Height
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-primary w-50 rounded-4 text-nowrap"
                onClick={handleApply}
                disabled={width <= 0 || height <= 0}
              >
                Apply
              </button>
              <button
                className="btn btn-outline-secondary rounded-4 border-0 w-50"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
