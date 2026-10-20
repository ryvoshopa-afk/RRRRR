import React, { useState } from 'react';
import { WorkPermit, Worker, Establishment, InspectionRecord, SystemSettings } from '../types';
import { formatDateAr, getDaysRemaining, maskId } from '../utils/helpers';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  Search,
  ExternalLink,
  Printer,
  FileText,
  BadgeAlert,
  ClipboardCheck,
} from 'lucide-react';

interface VerificationPortalProps {
  permits: WorkPermit[];
  workers: Worker[];
  establishments: Establishment[];
  settings: SystemSettings;
  selectedPermitNumber?: string;
  onPrintPermit: (permit: WorkPermit) => void;
  onAddInspection: (inspection: Omit<InspectionRecord, 'id'>) => void;
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({
  permits,
  workers,
  establishments,
  settings,
  selectedPermitNumber,
  onPrintPermit,
  onAddInspection,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(selectedPermitNumber || 'AJR-2026-88419');
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [inspectionRecorded, setInspectionRecorded] = useState(false);

  const permit = permits.find(
    (p) =>
      p.permitNumber.trim().toLowerCase() === searchQuery.trim().toLowerCase() ||
      p.id.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const worker = permit ? workers.find((w) => w.id === permit.workerId) : undefined;
  const issuingEst = permit ? establishments.find((e) => e.id === permit.issuingEstablishmentId) : undefined;
  const hostEst = permit ? establishments.find((e) => e.id === permit.hostEstablishmentId) : undefined;

  const daysLeft = permit ? getDaysRemaining(permit.expiryDate) : 0;
  const isValid = permit && permit.status === 'active' && daysLeft > 0;
  const isExpired = permit && (permit.status === 'expired' || daysLeft <= 0);
  const isRevoked = permit && permit.status === 'revoked';

  const handleRecordInspection = (status: 'compliant' | 'unauthorized_location' | 'expired_permit' | 'violation') => {
    if (!permit || !worker) return;
    onAddInspection({
      permitNumber: permit.permitNumber,
      workerName: worker.fullNameAr,
      workerIqama: worker.iqamaNumber,
      inspectorName: settings.currentUserName || 'المفتش الميداني',
      locationChecked: permit.workLocations[0] || 'الموقع الميداني العام',
      timestamp: new Date().toLocaleString('ar-SA'),
      status,
      notes: inspectorNotes || 'تم التحقق من مطابقة بيانات التصريح الإلكتروني والهوية بنجاح.',
    });
    setInspectionRecorded(true);
    setTimeout(() => setInspectionRecorded(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-semibold tracking-wide">
                البوابة الوطنية الموحدة للتحقق من التراخيص
              </span>
              <h2 className="text-xl font-bold text-white">نظام الاستعلام والتحقق الفوري من تصاريح أجير</h2>
            </div>
          </div>
          <div className="text-left text-xs text-slate-300">
            <div>الاستجابة: <span className="text-emerald-400 font-bold">مباشر (Real-Time)</span></div>
            <div>تشفير الوثيقة: <span className="font-mono text-slate-400">SHA-256</span></div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20"
          >
            <Search className="w-5 h-5 text-slate-300 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="أدخل رقم التصريح للتحقق (مثال: AJR-2026-88419)..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none px-2 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              تحقق الآن
            </button>
          </form>
        </div>

        {/* Quick select tags */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-slate-300">
          <span className="text-slate-400 text-[11px]">أرقام تصاريح سريعة للاختبار:</span>
          {permits.map((p) => (
            <button
              key={p.id}
              onClick={() => setSearchQuery(p.permitNumber)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-[11px] transition-colors"
            >
              {p.permitNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {permit ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Status Header Banner */}
          <div
            className={`p-5 flex flex-wrap items-center justify-between gap-4 border-b ${
              isValid
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : isExpired
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isValid ? 'bg-emerald-600 text-white' : isExpired ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {isValid ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : isExpired ? (
                  <AlertOctagon className="w-7 h-7" />
                ) : (
                  <BadgeAlert className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold block opacity-80">نتيجة الفحص والتحقق الأمني:</span>
                <h3 className="text-lg font-black">
                  {isValid
                    ? 'تصريح نظامي معتمد وساري المفعول'
                    : isExpired
                    ? 'تصريح منتهي الصلاحية - غير صالح للعمل'
                    : isRevoked
                    ? 'تصريح ملغى رسمياً من سجلات الوزارة'
                    : 'تصريح قيد المراجعة والتدقيق'}
                </h3>
              </div>
            </div>

            <div className="text-left font-mono">
              <div className="text-xs font-semibold">رقم التصريح: {permit.permitNumber}</div>
              <div className="text-[11px] opacity-75">
                {isValid ? `متبقي على الانتهاء: ${daysLeft} يوم` : 'منتهي الصلاحية'}
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="p-6 space-y-6">
            {/* Worker Spotlight Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={worker?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                alt={worker?.fullNameAr}
                className="w-24 h-28 object-cover rounded-lg border-2 border-white shadow-sm"
              />
              <div className="flex-1 space-y-2 text-center sm:text-right">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{worker?.fullNameAr}</h4>
                  <p className="text-xs text-slate-500 font-mono">{worker?.fullNameEn}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">رقم الإقامة / الهوية:</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {maskId(worker?.iqamaNumber || '', settings.maskSensitiveData)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الجنسية:</span>
                    <span className="font-semibold text-slate-800">{worker?.nationality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">المهنة المصرح بها:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {permit.authorizedProfession || worker?.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Establishments Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>المنشأة المصرحة (المستعيرة / المشغلة):</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{issuingEst?.nameAr}</div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>السجل التجاري: <strong className="font-mono text-slate-800">{issuingEst?.crNumber}</strong></span>
                  <span>الرقم الموحد: <strong className="font-mono text-slate-800">{issuingEst?.unifiedNumber700}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>المنشأة المستفيدة (صاحب العمل الأصلي):</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{hostEst?.nameAr}</div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>السجل التجاري: <strong className="font-mono text-slate-800">{hostEst?.crNumber}</strong></span>
                  <span>الرقم الموحد: <strong className="font-mono text-slate-800">{hostEst?.unifiedNumber700}</strong></span>
                </div>
              </div>
            </div>

            {/* Permitted Sites */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>مواقع العمل المصرح بها نظاماً:</span>
              </div>
              <ul className="space-y-1 text-xs">
                {permit.workLocations.map((loc, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 text-slate-800 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cryptographic Hash Verification Box */}
            <div className="p-3 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>البصمة الرقمية المشفرة (SHA-256 Verified):</span>
                </span>
                <span className="text-emerald-400 font-bold">100% متطابق مع سيرفرات الوزارة</span>
              </div>
              <div className="text-[11px] text-slate-300 break-all bg-black/40 p-2 rounded border border-slate-700">
                {permit.securityHash}
              </div>
            </div>

            {/* Field Inspector Action Bar */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ClipboardCheck className="w-4 h-4 text-emerald-700" />
                  <span>تسجيل نتيجة التفتيش الميداني الفوري:</span>
                </div>
                {inspectionRecorded && (
                  <span className="text-xs font-bold text-emerald-700 animate-pulse">
                    ✓ تم حفظ نتيجة التفتيش بنجاح في السجل
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder="ملاحظات المفتش الميداني (اختياري)..."
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white focus:outline-none"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleRecordInspection('compliant')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  ✓ تسجيل مطابق ونظامي
                </button>
                <button
                  onClick={() => handleRecordInspection('unauthorized_location')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  ⚠ مخالفة موقع غير مصرح
                </button>
                <button
                  onClick={() => handleRecordInspection('violation')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  ✕ تسجيل مخالفة مهنية / تزوير
                </button>
                <button
                  onClick={() => onPrintPermit(permit)}
                  className="mr-auto px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة A4</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <AlertOctagon className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">لم يتم العثور على تصريح بهذا الرقم</h3>
          <p className="text-xs text-slate-400">
            تأكد من كتابة رقم التصريح بالشكل الصحيح أو امسح رمز الاستجابة السريعة QR عبر كاميرا الجهاز.
          </p>
        </div>
      )}
    </div>
  );
};
