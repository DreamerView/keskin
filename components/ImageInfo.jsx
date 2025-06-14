'use client';

export default function ImageInfo({ originalImageInfo, imageInfo, onBack }) {
  return (
    <div className="text-start mx-auto mb-3" style={{ maxWidth: 500 }}>
      <h5>Image Information</h5>
      <hr />
      <h6>Original Image</h6>
      <p><strong>Type:</strong> {originalImageInfo.type || '—'}</p>
      <p><strong>Size:</strong> {originalImageInfo.sizeKB} KB</p>
      <p><strong>Dimensions:</strong> {originalImageInfo.width} × {originalImageInfo.height} px</p>
      <hr />
      <h6>Modified Image</h6>
      <p><strong>Type:</strong> {imageInfo.type || '—'}</p>
      <p><strong>Size:</strong> {imageInfo.sizeKB} KB</p>
      <p><strong>Dimensions:</strong> {imageInfo.width} × {imageInfo.height} px</p>

      <div className="d-flex flex-wrap justify-content-center gap-2 mt-5">
        <button type="button" className="btn bg-body-secondary px-4 rounded-4" onClick={onBack}>
          Back to Preview
        </button>
      </div>
    </div>
  );
}
