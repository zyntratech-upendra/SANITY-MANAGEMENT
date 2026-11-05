import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  FaQrcode,
  FaCamera,
  FaUpload,
  FaXmark,
  FaArrowRight,
  FaCircleExclamation,
  FaSpinner,
} from 'react-icons/fa6';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef(null);

  // Extract clean TOILET-xxx code from URL or raw text
  const parseCode = (scannedText) => {
    if (!scannedText) return null;
    const match = scannedText.match(/TOILET-\d+/i) || scannedText.match(/FAC-\d+/i);
    return match ? match[0].toUpperCase() : scannedText.trim().toUpperCase();
  };

  const handleDetectedCode = async (decodedText) => {
    const code = parseCode(decodedText);
    if (code) {
      await stopCamera();
      onScanSuccess(code);
      onClose();
    } else {
      setErrorMessage(`Unrecognized code: "${decodedText}". Expected format: TOILET-101`);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setErrorMessage('');
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-viewport');
      }

      setIsScanning(true);
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleDetectedCode(decodedText);
        },
        () => {
          // Frame callback without QR (no-op)
        }
      );
    } catch (err) {
      console.warn('Camera start error:', err);
      setIsScanning(false);
      setErrorMessage(
        'Unable to access camera. Please grant camera permission or use the Image Upload / Direct Code option.'
      );
    }
  };

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      }
    } catch (err) {
      console.warn('Camera stop error:', err);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 250);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  // Handle File Upload QR scan safely
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');

    let fileScanner = null;
    try {
      await stopCamera();
      fileScanner = new Html5Qrcode('qr-reader-file-temp');
      const decodedResult = await fileScanner.scanFile(file, false);
      try {
        fileScanner.clear();
      } catch (_) {}
      handleDetectedCode(decodedResult);
    } catch (err) {
      try {
        if (fileScanner) fileScanner.clear();
      } catch (_) {}
      setErrorMessage('Could not find a valid QR code in this image. Please ensure the QR is clear and well-lit.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setErrorMessage('Please enter a toilet facility code.');
      return;
    }
    handleDetectedCode(manualCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <FaQrcode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Scan Toilet Center QR Code</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Instant hygiene inspection & feedback placard</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaCamera className="w-4 h-4" /> <span>Live Camera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaUpload className="w-4 h-4" /> <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaQrcode className="w-4 h-4" /> <span>Enter Code</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Isolated DOM node for offline file QR parsing */}
          <div id="qr-reader-file-temp" className="hidden" aria-hidden="true" />

          {/* Viewport Container with decoupled React Overlay */}
          <div className="w-full relative">
            {/* Native DOM node for Html5Qrcode - KEPT EMPTY OF REACT CHILDREN to prevent removeChild crash */}
            <div
              id="qr-reader-viewport"
              className={`w-full h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-inner ${
                activeTab !== 'camera' ? 'hidden' : ''
              }`}
            />

            {/* Sibling Overlay for Initializing state */}
            {activeTab === 'camera' && !isScanning && (
              <div className="absolute inset-0 bg-slate-950/90 rounded-2xl flex flex-col items-center justify-center text-slate-300 pointer-events-none p-4 text-center">
                <FaSpinner className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                <p className="text-sm font-semibold">Opening camera stream...</p>
                <p className="text-xs text-slate-400 mt-1">Please allow camera permissions if prompted</p>
              </div>
            )}
          </div>

          {activeTab === 'upload' && (
            <div className="w-full py-10 px-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <FaUpload className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-slate-800">Upload Restroom Placard Photo</p>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">Select an image from your device photos</p>
              <label className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer shadow-md shadow-emerald-700/20 transition-all">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="w-full space-y-4 py-2">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sanitation Complex Unique Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TOILET-101"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-base uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Inspect</span> <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-600 mb-2">Quick Select Registered Toilet Centers:</p>
                <div className="flex flex-wrap gap-2">
                  {['TOILET-101', 'TOILET-102', 'TOILET-103', 'TOILET-104', 'TOILET-105', 'TOILET-106'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleDetectedCode(c)}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-800 text-xs sm:text-sm font-mono font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          )}

          {errorMessage && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-medium animate-in fade-in">
              <FaCircleExclamation className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Align the camera with the official QR placard mounted outside the toilet complex.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
