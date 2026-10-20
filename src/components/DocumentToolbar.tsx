import React, { useRef } from 'react';
import { WorkPermit, Worker, Establishment } from '../types';
import { Printer, Upload, Edit3, RefreshCw, LayoutTemplate, Database } from 'lucide-react';

interface DocumentToolbarProps {
  permits: WorkPermit[];
  selectedPermitId: string;
  onSelectPermit: (id: string) => void;
  onOpenEditModal: () => void;
  onPrint: () => void;
  onUploadMohrsdLogo: (dataUrl: string) => void;
  onUploadAjeerLogo: (dataUrl: string) => void;
  onResetLogos: () => void;
  hasCustomLogos: boolean;
  viewMode: 'document' | 'mobile_verify' | 'admin';
  onChangeViewMode: (mode: 'document' | 'mobile_verify' | 'admin') => void;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  permits,
  selectedPermitId,
  onSelectPermit,
  onOpenEditModal,
  onPrint,
  onUploadMohrsdLogo,
  onUploadAjeerLogo,
  onResetLogos,
  hasCustomLogos,
  viewMode,
  onChangeViewMode,
}) => {
  const mohrsdInputRef = useRef<HTMLInputElement>(null);
  const ajeerInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        callback(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="no-print bg-neutral-900 text-white border-b border-neutral-700 py-2.5 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-[210mm] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Record Selector from Database */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">اختر تصريحاً من السجل:</span>
          <select
            value={selectedPermitId}
            onChange={(e) => onSelectPermit(e.target.value)}
            className="bg-neutral-800 border border-neutral-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          >
            {permits.map((p) => (
              <option key={p.id} value={p.id}>
                {p.permitNumber} - {p.authorizedProfession}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit current permit data */}
          <button
            onClick={onOpenEditModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-neutral-200 transition-colors"
            title="تعديل نصوص وبيانات هذا التصريح"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>تعديل البيانات</span>
          </button>

          {/* Upload Ministry Logo */}
          <button
            onClick={() => mohrsdInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-neutral-200 transition-colors"
            title="رفع الشعار الأصلي لوزارة الموارد البشرية"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>رفع شعار الوزارة</span>
          </button>
          <input
            type="file"
            ref={mohrsdInputRef}
            onChange={(e) => handleFileChange(e, onUploadMohrsdLogo)}
            accept="image/*"
            className="hidden"
          />

          {/* Upload Ajeer Logo */}
          <button
            onClick={() => ajeerInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-neutral-200 transition-colors"
            title="رفع الشعار الأصلي لمنصة أجير"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>رفع شعار أجير</span>
          </button>
          <input
            type="file"
            ref={ajeerInputRef}
            onChange={(e) => handleFileChange(e, onUploadAjeerLogo)}
            accept="image/*"
            className="hidden"
          />

          {/* Reset custom logos if applied */}
          {hasCustomLogos && (
            <button
              onClick={onResetLogos}
              className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-neutral-400 hover:text-white"
              title="استعادة الشعارات الافتراضية"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Main Print / PDF Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition-colors"
            title="طباعة على مقاس A4 أو حفظ كملف PDF"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة A4 / حفظ PDF</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-neutral-800 p-0.5 rounded border border-neutral-700">
            <button
              onClick={() => onChangeViewMode('document')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                viewMode === 'document'
                  ? 'bg-neutral-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              مستند A4 الرسمي
            </button>
            <button
              onClick={() => onChangeViewMode('mobile_verify')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                viewMode === 'mobile_verify'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              صفحة التحقق (QR)
            </button>
            <button
              onClick={() => onChangeViewMode('admin')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                viewMode === 'admin'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              لوحة الإدارة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
