import React from 'react';
import { X, Printer, Download, Sparkles, ExternalLink } from 'lucide-react';

export default function QRCodeModal({ facility, onClose }) {
  if (!facility) return null;

  const clientUrl = window.location.origin;
  const directUrl = `${clientUrl}/report/${facility.code}`;

  const handleDownload = () => {
    if (!facility.qrCodeData) return;
    const link = document.createElement('a');
    link.href = facility.qrCodeData;
    link.download = `QR_${facility.code}_Sanitation_Signage.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Facility QR Signage</h3>
              <p className="text-[11px] text-slate-500">Printable civic compliance placard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Placard Box */}
        <div className="p-6">
          <div className="bg-white text-slate-900 rounded-2xl p-6 border-4 border-emerald-600 shadow-md text-center relative print:m-0 print:border-4">
            {/* Gov Header inside placard */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">🏛️</span>
              <span className="text-xs font-black tracking-widest text-emerald-800 uppercase">
                MUNICIPAL PUBLIC RESTROOM
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-3">
              Citizen Cleanliness Feedback & Support
            </div>

            {/* Facility Name & Code */}
            <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200">
              <div className="text-base font-extrabold text-slate-900 leading-tight">{facility.name}</div>
              <div className="text-xs text-slate-600 mt-0.5">{facility.address}</div>
              <div className="inline-block mt-2 bg-emerald-700 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                FACILITY ID: {facility.code}
              </div>
            </div>

            {/* QR Code Image */}
            <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-emerald-400 inline-block shadow-xs mb-3">
              {facility.qrCodeData ? (
                <img
                  src={facility.qrCodeData}
                  alt={`QR for ${facility.code}`}
                  className="w-52 h-52 mx-auto object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400 bg-slate-100 rounded-lg">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs font-bold text-slate-900 mb-1">
              📱 SCAN TO REPORT UNCLEAN TOILET OR ISSUES
            </div>
            <p className="text-[11px] text-slate-600 leading-tight max-w-xs mx-auto">
              Open your phone camera to submit instant cleanliness ratings. Cleaning staff will be automatically dispatched!
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Smart Sanitation Mission</span>
              <span>24/7 Helpline: 1912</span>
            </div>
          </div>

          {/* Direct Link */}
          <div className="mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 truncate max-w-[240px] font-mono text-[11px]">{directUrl}</span>
            <a
              href={directUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-xs"
            >
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Download Image</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Placard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
