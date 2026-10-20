import React, { useEffect, useState } from 'react';
import { WorkPermit, Worker, Establishment, SystemSettings } from '../types';
import { formatDateAr, getPermitTypeLabel, generateQrDataUrl, maskId } from '../utils/helpers';
import { Printer, ArrowRight, ShieldCheck, QrCode, CheckCircle, Edit3, Lock } from 'lucide-react';

interface PermitPrintViewProps {
  permit: WorkPermit;
  workers: Worker[];
  establishments: Establishment[];
  settings: SystemSettings;
  onBack: () => void;
  onVerify: (permit: WorkPermit) => void;
  onEdit: (permit: WorkPermit) => void;
}

export const PermitPrintView: React.FC<PermitPrintViewProps> = ({
  permit,
  workers,
  establishments,
  settings,
  onBack,
  onVerify,
  onEdit,
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const worker = workers.find((w) => w.id === permit.workerId);
  const issuingEst = establishments.find((e) => e.id === permit.issuingEstablishmentId);
  const hostEst = establishments.find((e) => e.id === permit.hostEstablishmentId);

  useEffect(() => {
    // Generate QR pointing to the live verification portal for this permit
    const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(permit.permitNumber)}`;
    generateQrDataUrl(verifyUrl).then(setQrSrc);
  }, [permit.permitNumber]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar (hidden on print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع إلى قائمة التصاريح</span>
        </button>

        <div className="flex items-center gap-2">
          {settings.currentRole !== 'auditor' && (
            <button
              onClick={() => onEdit(permit)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>تعديل هذا التصريح</span>
            </button>
          )}

          <button
            onClick={() => onVerify(permit)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>فتح صفحة التحقق الإلكتروني</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة فورية / حفظ كملف PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* The Printable A4 Container */}
      <div className="printable-permit bg-white mx-auto p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 max-w-[210mm] min-h-[297mm] text-slate-900 relative font-['Cairo',sans-serif]">
        {/* Subtle Watermark */}
        {settings.showWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none overflow-hidden z-0">
            <div className="text-4xl md:text-5xl font-black text-slate-900 -rotate-45 text-center leading-relaxed max-w-xl">
              {settings.watermarkText || 'وثيقة رسمية معتمدة - منصة أجير'}
            </div>
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Official Document Header */}
          <div className="border-b-2 border-emerald-800 pb-3 flex items-start justify-between gap-4">
            {/* Right: Kingdom Emblem & Ministry */}
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                {/* Two swords and palm emblem */}
                <div className="w-9 h-9 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center p-1.5 shadow-xs">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C10.5 4 10 6 10 8c0 1.5.5 3 2 4 1.5-1 2-2.5 2-4 0-2-.5-4-2-4zm-4 4c-.5 1-.8 2-.8 3 0 1.2.4 2.2 1.3 3 .8-.8 1.5-1.8 1.5-3 0-1-.3-2-2-3zm8 0c-1.7 1-2 2-2 3 0 1.2.7 2.2 1.5 3 .9-.8 1.3-1.8 1.3-3 0-1-.3-2-.8-3zm-9 7l-5 5v1h2l4-4-1-2zm10 0l-1 2 4 4h2v-1l-5-5zm-5 1v6h2v-6h-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-700">المملكة العربية السعودية</h3>
                  <h2 className="text-sm font-extrabold text-emerald-800">{settings.ministryName}</h2>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">{settings.platformName}</div>
            </div>

            {/* Center: Title & Badge */}
            <div className="text-center space-y-1">
              <div className="inline-block bg-emerald-800 text-white font-black text-sm px-4 py-1 rounded shadow-xs">
                {settings.headerBadgeText || 'تصريح عمل مؤقت / تعاقدي موثق (أجير)'}
              </div>
              <div className="text-xs font-bold text-emerald-800">{getPermitTypeLabel(permit.permitType)}</div>
              <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                رقم التصريح: {permit.permitNumber}
              </div>
            </div>

            {/* Left: Vision 2030 & Status */}
            <div className="text-left space-y-1">
              <div className="text-xs font-black text-slate-800 tracking-wider">VISION رؤيـــة</div>
              <div className="text-sm font-black text-emerald-700">2030</div>
              <div className="text-[10px] text-slate-500 font-medium">وثيقة رقمية معتمدة</div>
            </div>
          </div>

          {/* Barcode & Issue / Expiry Meta Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">تاريخ الإصدار:</span>
              <span className="font-bold text-slate-800 font-mono">{formatDateAr(permit.issueDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">تاريخ نهاية الصلاحية:</span>
              <span className="font-bold text-emerald-800 font-mono">{formatDateAr(permit.expiryDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">رقم العقد المرجعي:</span>
              <span className="font-mono font-bold text-slate-800">{permit.contractNumber || 'CTR-2026-SA'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">حالة الاعتماد:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ساري ومعتمد نظاماً</span>
              </span>
            </div>
          </div>

          {/* Table 1: Worker Details */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 flex items-center justify-between">
              <span>أولاً: بيانات العامل المصرح له (Worker Information)</span>
              <span className="text-[10px] font-mono opacity-80">ID: {permit.workerId}</span>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-3 bg-white">
              {/* Worker Photo */}
              <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded border border-slate-200">
                <img
                  src={worker?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                  alt={worker?.fullNameAr}
                  className="w-20 h-24 object-cover rounded border border-slate-300 shadow-2xs"
                />
                <span className="text-[9px] text-slate-500 mt-1 font-mono">الصورة المعتمدة</span>
              </div>

              {/* Data Grid */}
              <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">الاسم الكامل (عربي):</span>
                  <span className="font-bold text-slate-900">{worker?.fullNameAr || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Full Name (English):</span>
                  <span className="font-semibold text-slate-800 font-mono">{worker?.fullNameEn || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">رقم الإقامة / الهوية:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {maskId(worker?.iqamaNumber || '', settings.maskSensitiveData)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">الجنسية:</span>
                  <span className="font-semibold text-slate-800">{worker?.nationality || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">المهنة المصرح بمزاولتها:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {permit.authorizedProfession || worker?.profession}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">رقم الجواز / الحدود:</span>
                  <span className="font-mono text-slate-700">
                    {maskId(worker?.borderNumber || worker?.passportNumber || 'N/A', settings.maskSensitiveData)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">حالة التأمين الطبي:</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    {worker?.healthInsuranceStatus === 'active' ? 'مؤمن طبياً (ساري المفعول)' : 'غير مؤمن'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">رقم هاتف الاتصال:</span>
                  <span className="font-mono text-slate-700">
                    {maskId(worker?.phone || '05xxxxxxxx', settings.maskSensitiveData)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table 2: Establishments Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Issuing Establishment (المستعيرة / المشغلة) */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5">
                ثانياً: المنشأة المصرحة (المستعيرة / المشغلة)
              </div>
              <div className="p-3 bg-white space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">اسم المنشأة:</span>
                  <span className="font-bold text-slate-900">{issuingEst?.nameAr || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px]">السجل التجاري (CR):</span>
                    <span className="font-mono font-bold text-slate-800">{issuingEst?.crNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">الرقم الموحد (700):</span>
                    <span className="font-mono font-bold text-slate-800">{issuingEst?.unifiedNumber700 || '-'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600">المدينة: {issuingEst?.city || 'المملكة العربية السعودية'}</div>
              </div>
            </div>

            {/* Host Establishment (صاحب العمل الأصلي / المستفيدة) */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5">
                ثالثاً: المنشأة المستفيدة (صاحب العمل الأصلي)
              </div>
              <div className="p-3 bg-white space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">اسم المنشأة:</span>
                  <span className="font-bold text-slate-900">{hostEst?.nameAr || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px]">السجل التجاري (CR):</span>
                    <span className="font-mono font-bold text-slate-800">{hostEst?.crNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">الرقم الموحد (700):</span>
                    <span className="font-mono font-bold text-slate-800">{hostEst?.unifiedNumber700 || '-'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600">المدينة: {hostEst?.city || 'المملكة العربية السعودية'}</div>
              </div>
            </div>
          </div>

          {/* Table 3: Work Locations */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 flex items-center justify-between">
              <span>رابعاً: مواقع ومشاريع العمل المصرح بها نظاماً (Authorized Work Sites)</span>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.2 rounded">
                التواجد خارجها يعتبر مخالفة
              </span>
            </div>
            <div className="p-3 bg-white">
              <ul className="space-y-1 text-xs list-disc list-inside text-slate-800 font-medium">
                {permit.workLocations.map((loc, idx) => (
                  <li key={idx} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Table 4: Terms and Conditions */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[10px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 text-xs mb-1">الشروط والأحكام النظامية للتصريح:</div>
            {(permit.conditionsAndTerms || settings.defaultTerms).slice(0, 4).map((term, index) => (
              <div key={index} className="flex items-start gap-1">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{term}</span>
              </div>
            ))}
          </div>

          {/* Verification Barcode, QR Code & Official Stamp */}
          <div className="border-t-2 border-slate-300 pt-3 flex flex-wrap items-center justify-between gap-4">
            {/* QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white border-2 border-slate-800 rounded shadow-xs">
                {qrSrc ? (
                  <img src={qrSrc} alt="Verification QR Code" className="w-24 h-24 object-contain" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-xs">جاري التوليد...</div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 block">امسح للتحقق الفوري:</span>
                <span className="text-xs font-bold text-emerald-800 block">بوابة التحقق الحكومية</span>
                <span className="text-[9px] text-slate-500 font-mono block">ajeer.mol.gov.sa/verify</span>
                <span className="text-[8px] text-slate-400 font-mono truncate max-w-[140px] block">
                  {permit.securityHash.slice(0, 24)}...
                </span>
              </div>
            </div>

            {/* Simulated Code128 Barcode */}
            <div className="text-center space-y-1">
              <div className="h-9 w-44 bg-repeating-linear-stripes border border-slate-400 mx-auto flex items-center justify-center p-1 bg-white">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  {/* barcode stripes pattern */}
                  <rect x="2" y="0" width="2" height="20" fill="#000" />
                  <rect x="6" y="0" width="1" height="20" fill="#000" />
                  <rect x="9" y="0" width="3" height="20" fill="#000" />
                  <rect x="14" y="0" width="2" height="20" fill="#000" />
                  <rect x="18" y="0" width="1" height="20" fill="#000" />
                  <rect x="21" y="0" width="4" height="20" fill="#000" />
                  <rect x="27" y="0" width="1" height="20" fill="#000" />
                  <rect x="30" y="0" width="2" height="20" fill="#000" />
                  <rect x="34" y="0" width="3" height="20" fill="#000" />
                  <rect x="39" y="0" width="1" height="20" fill="#000" />
                  <rect x="42" y="0" width="2" height="20" fill="#000" />
                  <rect x="46" y="0" width="4" height="20" fill="#000" />
                  <rect x="52" y="0" width="1" height="20" fill="#000" />
                  <rect x="55" y="0" width="3" height="20" fill="#000" />
                  <rect x="60" y="0" width="2" height="20" fill="#000" />
                  <rect x="64" y="0" width="1" height="20" fill="#000" />
                  <rect x="67" y="0" width="3" height="20" fill="#000" />
                  <rect x="72" y="0" width="2" height="20" fill="#000" />
                  <rect x="76" y="0" width="1" height="20" fill="#000" />
                  <rect x="79" y="0" width="4" height="20" fill="#000" />
                  <rect x="85" y="0" width="2" height="20" fill="#000" />
                  <rect x="89" y="0" width="1" height="20" fill="#000" />
                  <rect x="92" y="0" width="3" height="20" fill="#000" />
                  <rect x="97" y="0" width="2" height="20" fill="#000" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block">{permit.permitNumber}</span>
            </div>

            {/* Official Stamp & Electronic Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-700 p-1 flex flex-col items-center justify-center text-center text-emerald-800 bg-emerald-50/50 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mb-0.5" />
                <span className="text-[8px] font-black leading-tight">اعتماد إلكتروني رسمي</span>
                <span className="text-[7px] font-bold">منصة أجير - قوى</span>
                <span className="text-[7px] font-mono text-emerald-600 mt-0.5">2026-CERTIFIED</span>
              </div>
              <span className="text-[9px] text-slate-500 font-semibold mt-1">الختم الرقمي المشفر</span>
            </div>
          </div>

          {/* Document Footer Warning */}
          <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-slate-100">
            {settings.footerNoticeText}
          </div>
        </div>
      </div>
    </div>
  );
};
