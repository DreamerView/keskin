'use client';

import { useState, useEffect } from 'react';

import ImageDropZone from './ImageDropZone';
import CropTool from './CropTool';
import ResizeTool from './ResizeTool';
import EditTool from './EditTool'; 
import ImageInfo from './ImageInfo';
import MoreModal from './MoreModal';
import ConfirmModal from './ConfirmModal'; // Подтверждение для reset/close

export default function ImageUploadClient() {
  const [originalFile, setOriginalFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [mode, setMode] = useState('preview');
  const [showInfo, setShowInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

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
    if (!imageUrl) {
      setImageInfo({ type: '', sizeKB: 0, width: 0, height: 0 });
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageInfo(prev => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!selectedFile) {
      setImageInfo(prev => ({ ...prev, type: '', sizeKB: 0 }));
      return;
    }
    setImageInfo(prev => ({
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
      setOriginalImageInfo(prev => ({
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
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedFile]);

  const handleImage = (file) => {
    if (!originalFile) setOriginalFile(file);
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
    setMode('preview');
    setShowInfo(false);
    setShowMore(false);
  };

  // Подтверждение сброса — открываем ConfirmModal
  const resetToOriginal = () => setShowResetConfirm(true);
  const confirmReset = () => {
    handleImage(originalFile);
    setShowResetConfirm(false);
  };
  const cancelReset = () => setShowResetConfirm(false);

  // Подтверждение закрытия — ConfirmModal
  const clear = () => setShowCloseConfirm(true);
  const confirmClose = () => {
    setOriginalFile(null);
    setSelectedFile(null);
    setImageUrl(null);
    setMode('preview');
    setShowInfo(false);
    setShowMore(false);
    setShowCloseConfirm(false);
  };
  const cancelClose = () => setShowCloseConfirm(false);

  // Заглушки для новых пунктов меню
  const handleExport = () => {
    if (!selectedFile) {
      alert('No image to export');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAs = () => alert('Export As clicked');
  const handleConvertPWA = () => alert('Convert PWA clicked');
  const handleInfo = () => {
    setShowInfo(true);
    setShowMore(false);
  };

  const handleCropDone = (croppedFile) => {
    setSelectedFile(croppedFile);
    setImageUrl(URL.createObjectURL(croppedFile));
    setMode('preview');
    setShowInfo(false);
    setShowMore(false);
  };

  const handleResizeDone = (resizedFile) => {
    setSelectedFile(resizedFile);
    setImageUrl(URL.createObjectURL(resizedFile));
    setMode('preview');
    setShowInfo(false);
    setShowMore(false);
  };

  const handleEditDone = (editedFile) => {
    setSelectedFile(editedFile);
    setImageUrl(URL.createObjectURL(editedFile));
    setMode('preview');
    setShowInfo(false);
    setShowMore(false);
  };

  if (!selectedFile) {
    return (
      <div className="text-center" data-aos="fade-down">
        <ImageDropZone onFileSelect={handleImage} />
      </div>
    );
  }
  if (mode === 'crop') {
    return (
      <div className="text-center" data-aos="zoom-in">
        <CropTool src={imageUrl} onDone={handleCropDone} onCancel={() => setMode('preview')} />
      </div>
    );
  }
  if (mode === 'resize') {
    return (
      <div className="text-center" data-aos="zoom-in">
        <ResizeTool src={imageUrl} onDone={handleResizeDone} onCancel={() => setMode('preview')} />
      </div>
    );
  }
  if (mode === 'edit') {
    return (
      <div className="text-center" data-aos="zoom-in">
        <EditTool src={imageUrl} onDone={handleEditDone} onCancel={() => setMode('preview')} />
      </div>
    );
  }
  if (showInfo) {
    return (
      <div className="text-center" data-aos="fade">
        <ImageInfo originalImageInfo={originalImageInfo} imageInfo={imageInfo} onBack={() => setShowInfo(false)} />
      </div>
    );
  }
  if (showMore) {
    return (
      <div className="text-center" data-aos="fade">
        <MoreModal
          show={showMore}
          onClose={() => setShowMore(false)}
          onExport={handleExport}
          onExportAs={handleExportAs}
          onConvertPWA={handleConvertPWA}
          onInfo={handleInfo}
        />
      </div>
    );
  }
  if (showResetConfirm) {
    return (
      <div className="text-center" data-aos="fade">
        <ConfirmModal
          show={showResetConfirm}
          title="Reset Image"
          message="Are you sure you want to reset to the original image?"
          onConfirm={confirmReset}
          onCancel={cancelReset}
        />
      </div>
    );
  }
  if (showCloseConfirm) {
    return (
      <div className="text-center" data-aos="fade">
        <ConfirmModal
          show={showCloseConfirm}
          title="Start Again?"
          message="All unsaved changes will be lost. Are you sure you want to start fresh?"
          onConfirm={confirmClose}
          onCancel={cancelClose}
        />
      </div>
    );
  }

  // Основной просмотр и кнопки
  return (
    <div className="text-center" data-aos="fade" data-aos-delay="100">
      <img
        src={imageUrl}
        alt="Preview"
        className="img-fluid rounded-5 mb-3 p-4 bg-body-secondary"
        style={{ maxHeight: '400px' }}
      />
      <div
        className="d-flex flex-wrap justify-content-center gap-4 mt-3 mx-auto bg-body-tertiary p-3 rounded-5"
        style={{ maxWidth: 700, width: '100%' }}
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
          onClick={() => setMode('edit')}
        >
          <i className="bi bi-sliders"></i>Edit
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
    </div>
  );
}
