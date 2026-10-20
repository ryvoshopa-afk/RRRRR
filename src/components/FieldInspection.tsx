import React, { useState } from 'react';
import { InspectionRecord, WorkPermit, Worker, SystemSettings } from '../types';
import { formatDateAr, maskId } from '../utils/helpers';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

interface FieldInspectionProps {
  inspections: InspectionRecord[];
  permits: WorkPermit[];
  workers: Worker[];
  settings: SystemSettings;
  onAddInspection: (inspection: Omit<InspectionRecord, 'id'>) => void;
  onSelectPermitForVerify: (permit: WorkPermit) => void;
}

export const FieldInspection: React.FC<FieldInspectionProps> = ({
  inspections,
  permits,
  workers,
  settings,
  onAddInspection,
  onSelectPermitForVerify,
}) => {
  const [permitInput, setPermitInput] = useState('');
  const [selectedPermit, setSelectedPermit] = useState<WorkPermit | null>(permits[0] || null);
  const [locationChecked, setLocationChecked] = useState(
    permits[0]?.workLocations[0] || 'الموقع الإنشائي الميداني'
  );
  const [status, setStatus] = useState<'compliant' | 'unauthorized_location' | 'expired_permit' | 'violation'>('compliant');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearchPermit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = permits.find(
      (p) =>
        p.permitNumber.trim().toLowerCase() === permitInput.trim().toLowerCase() ||
        p.id.toLowerCase() === permitInput.trim().toLowerCase()
    );
    if (found) {
      setSelectedPermit(found);
      setLocationChecked(found.workLocations[0] || '');
      setToastMessage(`تم تحديد التصريح ${found.permitNumber}`);
      setTimeout(() => setToastMessage(null), 2500);
    } else {
      alert('لم يتم العثور على تصريح بهذا الرقم');
    }
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermit) {
      alert('يرجى تحديد تصريح عمل');
      return;
    }
    const worker = workers.find((w) => w.id === selectedPermit.workerId);

    onAddInspection({
      permitNumber: selectedPermit.permitNumber,
      workerName: worker?.fullNameAr || 'عامل غير محدد',
      workerIqama: worker?.iqamaNumber || '0000000000',
      inspectorName: settings.currentUserName || 'مفتش الرقابة الميدانية',
      locationChecked: locationChecked || selectedPermit.workLocations[0] || 'الموقع العام',
      timestamp: new Date().toLocaleString('ar-SA'),
      status,
      notes: notes || 'تمت المطابقة الميدانية بنجاح.',
    });

    setNotes('');
    setToastMessage('✓ تم تسجيل محضر التفتيش بنجاح');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const worker = selectedPermit ? workers.find((w) => w.id === selectedPermit.workerId) : null;

  const filteredInspections = inspections.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">وحدة التفتيش الميداني والرقابة الامتثالية</h2>
          <p className="text-xs text-slate-500">
            فحص تواجد العمالة في المواقع المصرحة وتوثيق المحاضر الرقابية وفق اشتراطات وزارة الموارد البشرية
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">المفتش المعتمد:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
            {settings.currentUserName}
          </span>
        </div>
      </div>

      {/* Inspector Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Form */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            <span>تسجيل جولة تفتيش ميدانية جديدة</span>
          </h3>

          {/* Quick Select Permit */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">اختر التصريح أو ابحث برقمه:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="رقم التصريح (مثال: AJR-2026-88419)..."
                value={permitInput}
                onChange={(e) => setPermitInput(e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearchPermit}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
              >
                بحث
              </button>
            </div>
          </div>

          {/* Permit Selector Dropdown */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">أو اختر من القائمة النشطة:</label>
            <select
              value={selectedPermit?.id || ''}
              onChange={(e) => {
                const p = permits.find((item) => item.id === e.target.value);
                if (p) {
                  setSelectedPermit(p);
                  setLocationChecked(p.workLocations[0] || '');
                }
              }}
              className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
            >
              {permits.map((p) => {
                const w = workers.find((x) => x.id === p.workerId);
                return (
                  <option key={p.id} value={p.id}>
                    {p.permitNumber} - {w?.fullNameAr} ({p.status})
                  </option>
                );
              })}
            </select>
          </div>

          {selectedPermit && worker && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{worker.fullNameAr}</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {maskId(worker.iqamaNumber, settings.maskSensitiveData)}
                </span>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold">{selectedPermit.authorizedProfession}</div>
              <div className="text-[11px] text-slate-500">
                المواقع المصرحة: {selectedPermit.workLocations.join('، ')}
              </div>
              <button
                type="button"
                onClick={() => onSelectPermitForVerify(selectedPermit)}
                className="text-[11px] text-blue-700 hover:underline font-semibold block pt-1"
              >
                ← عرض التفاصيل في صفحة التحقق الإلكتروني
              </button>
            </div>
          )}

          <form onSubmit={handleRecordSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الموقع الفعلي للجولة:</label>
              <input
                type="text"
                value={locationChecked}
                onChange={(e) => setLocationChecked(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">نتيجة التفتيش والامتثال:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg font-semibold focus:border-emerald-600 focus:outline-none"
              >
                <option value="compliant">مطابق ونظامي (مصرح له بنفس الموقع والمهنة)</option>
                <option value="unauthorized_location">مخالفة: تواجد في موقع غير مصرح به</option>
                <option value="expired_permit">مخالفة: تصريح عمل منتهي الصلاحية</option>
                <option value="violation">مخالفة: مزاولة مهنة غير مصرحة / عدم حمل إثبات</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">تفاصيل وملاحظات محضر التفتيش:</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفاصيل التفتيش، رقم المخالفة إن وجد..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              حفظ وتوثيق محضر التفتيش
            </button>
          </form>
        </div>

        {/* Inspections History Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">سجل ومحاضر التفتيش الميداني</h3>
              <p className="text-xs text-slate-500">سجل معتمد للجولات التفتيشية الموثقة مع التوقيت والنتائج</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">تصفية:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-300 rounded-md px-2 py-1 bg-white focus:outline-none text-xs"
              >
                <option value="all">كافة النتائج ({inspections.length})</option>
                <option value="compliant">مطابق ونظامي</option>
                <option value="unauthorized_location">موقع غير مصرح</option>
                <option value="expired_permit">تصريح منتهي</option>
                <option value="violation">مخالفة مهنية</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">رقم التصريح</th>
                  <th className="p-3">العامل المصرح له</th>
                  <th className="p-3">الموقع المفتش عليه</th>
                  <th className="p-3">المفتش والتاريخ</th>
                  <th className="p-3">النتيجة الرقابية</th>
                  <th className="p-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      لا توجد محاضر تفتيش مطابقة
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{record.permitNumber}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{record.workerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {maskId(record.workerIqama, settings.maskSensitiveData)}
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 max-w-[170px] truncate">{record.locationChecked}</td>
                      <td className="p-3 text-slate-600">
                        <div className="font-semibold text-slate-800">{record.inspectorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{record.timestamp}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            record.status === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {record.status === 'compliant' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>مطابق ونظامي</span>
                            </>
                          ) : record.status === 'unauthorized_location' ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-rose-700" />
                              <span>موقع غير مصرح</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-700" />
                              <span>مخالفة / منتهي</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-[200px] text-[11px]">{record.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
