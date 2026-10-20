import React from 'react';
import { WorkPermit, Worker, Establishment, InspectionRecord, SystemSettings } from '../types';
import { getDaysRemaining, formatDateAr, getPermitStatusBadge, maskId } from '../utils/helpers';
import {
  FileCheck2,
  Users2,
  AlertTriangle,
  Building2,
  ClipboardCheck,
  PlusCircle,
  QrCode,
  ArrowUpRight,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DashboardProps {
  permits: WorkPermit[];
  workers: Worker[];
  establishments: Establishment[];
  inspections: InspectionRecord[];
  settings: SystemSettings;
  onOpenNewPermit: () => void;
  onOpenNewWorker: () => void;
  onSelectPermitForPrint: (permit: WorkPermit) => void;
  onSelectPermitForVerify: (permit: WorkPermit) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  permits,
  workers,
  establishments,
  inspections,
  settings,
  onOpenNewPermit,
  onOpenNewWorker,
  onSelectPermitForPrint,
  onSelectPermitForVerify,
  onNavigateTab,
}) => {
  const activePermits = permits.filter((p) => {
    if (p.status !== 'active') return false;
    return getDaysRemaining(p.expiryDate) > 0;
  });

  const expiringSoon = permits.filter((p) => {
    if (p.status !== 'active') return false;
    const days = getDaysRemaining(p.expiryDate);
    return days > 0 && days <= 30;
  });

  const expiredPermits = permits.filter((p) => {
    return p.status === 'expired' || getDaysRemaining(p.expiryDate) <= 0;
  });

  return (
    <div className="space-y-6">
      {/* Welcome & Fast Actions Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              بوابة المنشآت المعتمدة
            </span>
            <span className="text-xs text-slate-500">نظام الرقابة والامتثال التعاقدي</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">لوحة القيادة والمؤشرات التشغيلية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            مرحباً بك، <span className="font-semibold text-slate-700">{settings.currentUserName}</span> | الوضع الحالي:{' '}
            <span className="text-emerald-700 font-bold">
              {settings.currentRole === 'admin'
                ? 'مشرف النظام الكامل'
                : settings.currentRole === 'hr_manager'
                ? 'مدير موارد بشرية'
                : settings.currentRole === 'inspector'
                ? 'مفتش رقابي ميداني'
                : 'مدقق نظامي'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('verify')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
          >
            <QrCode className="w-4 h-4 text-slate-700" />
            <span>مسح وتحقق QR</span>
          </button>
          <button
            onClick={onOpenNewWorker}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>تسجيل عامل جديد</span>
          </button>
          <button
            onClick={onOpenNewPermit}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إصدار تصريح عمل</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Permits */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">التصاريح السارية</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activePermits.length}</span>
            <span className="text-xs text-slate-500">من إجمالي {permits.length} تصريح</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
            <span>نسبة الامتثال النشط</span>
            <span>{Math.round((activePermits.length / Math.max(1, permits.length)) * 100)}%</span>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">تنتهي خلال 30 يوماً</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{expiringSoon.length}</span>
            <span className="text-xs text-amber-800">تتطلب التجديد الفوري</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>منتهية فعلياً:</span>
            <span className="font-bold text-rose-600">{expiredPermits.length}</span>
          </div>
        </div>

        {/* Registered Workers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">العمالة المصرح لها</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{workers.length}</span>
            <span className="text-xs text-slate-500">عامل موثق بالنظام</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>تأمين صحي سارٍ:</span>
            <span className="font-semibold text-emerald-700">
              {workers.filter((w) => w.healthInsuranceStatus === 'active').length}
            </span>
          </div>
        </div>

        {/* Establishments & Inspections */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">المنشآت والتفتيش</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{establishments.length}</span>
            <span className="text-xs text-slate-500">منشأة مسجلة (700)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>جولات التفتيش المنفذة:</span>
            <span className="font-semibold text-slate-800">{inspections.length} جولة</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Attention & Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring / Active Permits list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">التصاريح النشطة والأحدث إصداراً</h3>
              <p className="text-xs text-slate-500">متابعة سريعة لحالة التصاريح وأزرار الطباعة والتحقق</p>
            </div>
            <button
              onClick={() => onNavigateTab('permits')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>عرض كل التصاريح ({permits.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">رقم التصريح</th>
                  <th className="p-3">العامل المصرح له</th>
                  <th className="p-3">المنشأة المصرحة</th>
                  <th className="p-3">الانتهاء</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permits.slice(0, 5).map((pmt) => {
                  const worker = workers.find((w) => w.id === pmt.workerId);
                  const est = establishments.find((e) => e.id === pmt.issuingEstablishmentId);
                  const badge = getPermitStatusBadge(pmt.status, pmt.expiryDate);
                  return (
                    <tr key={pmt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{pmt.permitNumber}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{worker?.fullNameAr || 'عامل غير محدد'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {maskId(worker?.iqamaNumber || '', settings.maskSensitiveData)}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 truncate max-w-[150px]">{est?.nameAr || '-'}</td>
                      <td className="p-3 font-mono text-slate-600">{formatDateAr(pmt.expiryDate)}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectPermitForPrint(pmt)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="معاينة وطباعة A4 رسمي"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectPermitForVerify(pmt)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="تحقق فوري من QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspections & Compliance Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">سجل الرقابة والتفتيش</h3>
              <button
                onClick={() => onNavigateTab('inspection')}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                فتح السجل
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {inspections.slice(0, 3).map((insp) => (
                <div key={insp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{insp.permitNumber}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        insp.status === 'compliant'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {insp.status === 'compliant' ? 'مطابق ونظامي' : 'مخالفة / منتهي'}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium mt-1">{insp.workerName}</div>
                  <div className="text-slate-400 text-[11px] truncate mt-0.5">{insp.locationChecked}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{insp.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('audit-report')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>مراجعة تقرير الامتثال الشامل (10 نقاط)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
