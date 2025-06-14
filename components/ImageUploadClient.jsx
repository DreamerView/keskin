'use client';

import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import ImageDropZone from './ImageDropZone';
import CropTool from './CropTool';
import ResizeTool from './ResizeTool';
import ImageInfo from './ImageInfo';
import MoreModal from './MoreModal';

export default function ImageUploadClient() {
  const [originalFile, setOriginalFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [mode, setMode] = useState('preview');
  const [showInfo, setShowInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [imageInfo, setImageInfo] = useState({
    type: '',
    sizeKB: 0,
    width: 0,
    height: 0,
  });

  const [originalImageInfo, setOriginalImageInfo] = useState({
    width: 0,
    height: 0,
    type: '',
    sizeKB: 0,
  });

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      setImageInfo({ type: '', sizeKB: 0, width: 0, height: 0 });
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageInfo((prev) => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!selectedFile) {
      setImageInfo((prev) => ({ ...prev, type: '', sizeKB: 0 }));
      return;
    }
    setImageInfo((prev) => ({
      ...prev,
      type: selectedFile.type,
      sizeKB: Math.round(selectedFile.size / 1024),
    }));
  }, [selectedFile]);

  useEffect(() => {
    if (!originalFile) return;
    setOriginalImageInfo({
      type: originalFile.type,
      sizeKB: Math.round(originalFile.size / 1024),
      width: 0,
      height: 0,
    });
    const img = new Image();
    img.onload = () => {
      setOriginalImageInfo((prev) => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
    img.src = URL.createObjectURL(originalFile);
  }, [originalFile]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedFile) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedFile]);

  const handleImage = (file) => {
    if (!originalFile) setOriginalFile(file);
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
    setMode('preview');
    setShowInfo(false);
  };

  const handleCropDone = (croppedFile) => {
    setSelectedFile(croppedFile);
    setImageUrl(URL.createObjectURL(croppedFile));
    setMode('preview');
    setShowInfo(false);
  };

  const handleResizeDone = (resizedFile) => {
    setSelectedFile(resizedFile);
    setImageUrl(URL.createObjectURL(resizedFile));
    setMode('preview');
    setShowInfo(false);
  };

  const resetToOriginal = () => {
    const confirmReset = window.confirm('Are you sure you want to reset to the original image?');
    if (confirmReset) handleImage(originalFile);
  };

  const clear = () => {
    setOriginalFile(null);
    setSelectedFile(null);
    setImageUrl(null);
    setMode('preview');
    setShowInfo(false);
  };

  // Заглушки для новых пунктов меню
  const handleExport = () => alert('Export clicked');
  const handleExportAs = () => alert('Export As clicked');
  const handleConvertPWA = () => alert('Convert PWA clicked');
  const handleInfo = () => {
    setShowInfo(true);
    setShowMore(false);
  };

  return (
    <div className="text-center" data-aos="fade-up">
      {!selectedFile ? (
        <div data-aos="fade-down">
          <ImageDropZone onFileSelect={handleImage} />
        </div>
      ) : mode === 'crop' ? (
        <div data-aos="zoom-in">
          <CropTool
            src={imageUrl}
            onDone={handleCropDone}
            onCancel={() => setMode('preview')}
          />
        </div>
      ) : mode === 'resize' ? (
        <div data-aos="zoom-in">
          <ResizeTool
            src={imageUrl}
            onDone={handleResizeDone}
            onCancel={() => setMode('preview')}
          />
        </div>
      ) : showInfo ? (
        <div data-aos="fade">
          <ImageInfo
            originalImageInfo={originalImageInfo}
            imageInfo={imageInfo}
            onBack={() => setShowInfo(false)}
          />
        </div>
      ) : (
        <>
          <img
            src={imageUrl}
            alt="Preview"
            className="img-fluid rounded-5 mb-3 p-4 bg-body-secondary"
            style={{ maxHeight: '400px' }}
            data-aos="fade-up"
          />

          <div
            className="d-flex flex-wrap justify-content-center gap-4 mt-3 mx-auto bg-body-tertiary p-3 rounded-5"
            style={{ maxWidth: 700, width: "100%" }}
            data-aos="fade-up" data-aos-delay="100"
          >
            <button
              type="button"
              className="btn btn-outline-light border-0 rounded-4 d-flex gap-2"
              onClick={() => setMode('crop')}
            >
              <i className="bi bi-crop"></i>Crop
            </button>
            <button
              type="button"
              className="btn btn-outline-light border-0 rounded-4 d-flex gap-2"
              onClick={() => setMode('resize')}
            >
              <i className="bi bi-bounding-box-circles"></i>Resize
            </button>

            <button
              type="button"
              className="btn btn-outline-light border-0 rounded-4 d-flex gap-2"
              onClick={() => setShowMore(true)}
            >
              <i className="bi bi-three-dots"></i>More
            </button>

            {originalFile && selectedFile !== originalFile && (
              <button
                type="button"
                className="btn btn-warning rounded-4 d-flex gap-2"
                onClick={resetToOriginal}
              >
                <i className="bi bi-skip-backward-fill"></i>Reset
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger rounded-4 d-flex gap-2"
              onClick={clear}
            >
              <i className="bi bi-x-lg"></i>Close
            </button>
          </div>

          <MoreModal
            show={showMore}
            onClose={() => setShowMore(false)}
            onExport={handleExport}
            onExportAs={handleExportAs}
            onConvertPWA={handleConvertPWA}
            onInfo={handleInfo}
          />
        </>
      )}
    </div>
  );
}
