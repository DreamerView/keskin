'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';

export default function CropTool({ src, onDone, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [mode, setMode] = useState('square');
    const [aspect, setAspect] = useState(1 / 1);
    const [customAspectInput, setCustomAspectInput] = useState(1 / 1);

    const aspectGroups = {
        square: [
            { label: 'Current', value: 1 / 1 }
        ],
        portrait: [
            { label: 'Original', value: null },
            { label: 'Wallpaper', value: 9 / 16 },
            { label: '4:5', value: 4 / 5 },
            { label: '5:7', value: 5 / 7 },
            { label: '3:4', value: 3 / 4 },
            { label: '3:5', value: 3 / 5 },
            { label: '2:3', value: 2 / 3 }
        ],
        landscape: [
            { label: 'Original', value: null },
            { label: 'Wallpaper', value: 16 / 9 },
            { label: '5:4', value: 5 / 4 },
            { label: '7:5', value: 7 / 5 },
            { label: '4:3', value: 4 / 3 },
            { label: '5:3', value: 5 / 3 },
            { label: '3:2', value: 3 / 2 }
        ],
        custom: []
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleDone = async () => {
        const croppedImage = await getCroppedImg(src, croppedAreaPixels);
        onDone(croppedImage);
    };

    const handleCustomAspectSubmit = (e) => {
        e.preventDefault();
        const sanitized = customAspectInput.replace(/[^\d:/]/g, '');
        const [w, h] = sanitized.split(/[:\/]/).map(Number);
        if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
            setAspect(w / h);
        }
    };

    return (
        <div>
            <div className="crop-container position-relative" style={{ width: '100%', height: '400px' }} data-aos="fade">
                <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect || 1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="bg-body-tertiary rounded-5 p-3 my-4 d-flex flex-column gap-4" data-aos="fade" data-aos-delay="250">
                <div className="d-flex justify-content-center gap-2">
                    <button
                        className={`btn rounded-4 ${mode === 'square' ? 'btn-light' : 'btn-outline-light border-0'}`}
                        onClick={() => setMode('square')}
                    >
                        <i className="bi bi-app"></i>
                    </button>
                    <button
                        className={`btn rounded-4 ${mode === 'portrait' ? 'btn-light' : 'btn-outline-light border-0'}`}
                        onClick={() => setMode('portrait')}
                    >
                        <i className="bi bi-clipboard2"></i>
                    </button>
                    <button
                        className={`btn rounded-4 ${mode === 'landscape' ? 'btn-light' : 'btn-outline-light border-0'}`}
                        onClick={() => setMode('landscape')}
                    >
                        <i className="bi bi-phone-landscape"></i>
                    </button>
                    <button
                        className={`btn rounded-4 ${mode === 'custom' ? 'btn-light' : 'btn-outline-light border-0'}`}
                        onClick={() => setMode('custom')}
                    >
                        <i className="bi bi-gear-wide-connected"></i>
                    </button>
                    <button className="ms-4 btn rounded-4 btn-primary" onClick={handleDone}>
                        Done
                    </button>
                    <button className="btn rounded-4 btn-outline-secondary border-0" onClick={onCancel}>
                        Cancel
                    </button>
                </div>

                {mode === 'custom' ? (
                    <div className="text-center">
                        <form
                            className="d-flex justify-content-center gap-2"
                            onSubmit={handleCustomAspectSubmit}
                        >
                            <input
                                type="tel"
                                pattern="[0-9:/]*"
                                value={customAspectInput}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(/[^0-9:/]/g, '');
                                    setCustomAspectInput(sanitized);
                                }}
                                className="form-control w-auto rounded-4 px-4 bg-body-light"
                                placeholder="Enter ratio (e.g. 3/2 or 3:2)"
                            />
                            <button
                                className="btn rounded-4 btn-outline-light border-0"
                                type="submit"
                            >
                                Apply
                            </button>
                        </form>
                    </div>
                ) : (
                    aspectGroups[mode].length !== 0 && (
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                            {aspectGroups[mode].map((preset) => (
                                <button
                                    key={preset.label}
                                    className={`btn rounded-4 ${aspect === preset.value
                                            ? 'btn-light'
                                            : 'btn-outline-light border-0'
                                        }`}
                                    onClick={() => setAspect(preset.value)}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    )
                )}

            </div>

        </div>
    );
}
