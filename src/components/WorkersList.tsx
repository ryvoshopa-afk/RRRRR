import React, { useState } from 'react';
import { Worker, Establishment, WorkPermit, SystemSettings } from '../types';
import { maskId, maskPhone } from '../utils/helpers';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Building2,
  IdCard,
} from 'lucide-react';

interface WorkersListProps {
  workers: Worker[];
  establishments: Establishment[];
  permits: WorkPermit[];
  settings: SystemSettings;
  onOpenNewWorker: () => void;
  onEditWorker: (worker: Worker) => void;
  onDeleteWorker: (workerId: string) => void;
  onIssuePermitForWorker: (workerId: string) => void;
}

export const WorkersList: React.FC<WorkersListProps> = ({
  workers,
  establishments,
  permits,
  settings,
  onOpenNewWorker,
  onEditWorker,
  onDeleteWorker,
  onIssuePermitForWorker,
}) => {
  const [search, setSearch] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState<'all' | 'active' | 'expired'>('all');

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.fullNameAr.toLowerCase().includes(search.toLowerCase()) ||
      w.fullNameEn.toLowerCase().includes(search.toLowerCase()) ||
      w.iqamaNumber.includes(search) ||
      w.profession.toLowerCase().includes(search.toLowerCase()) ||
      w.nationality.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (insuranceFilter !== 'all' && w.healthInsuranceStatus !== insuranceFilter) {
      return false;
    }

    return true;
  });

  const isReadOnly = settings.currentRole === 'auditor';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">سجل العمالة المعتمدة وتصاريحهم</h2>
          <p className="text-xs text-slate-500">
            بيانات العمالة، الإقامات، المهن المعتمدة، والتأمين الصحي وحالة التصاريح المرتبطة
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={onOpenNewWorker}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل عامل جديد</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث باسم العامل، رقم الإقامة، المهنة، الجنسية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">التأمين الطبي:</span>
          <select
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none"
          >
            <option value="all">كافة الحالات ({workers.length})</option>
            <option value="active">مؤمن طبياً ساري</option>
            <option value="expired">تأمين منتهي / يلزم التجديد</option>
          </select>
        </div>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => {
          const establishment = establishments.find((e) => e.id === worker.primaryEstablishmentId);
          const workerPermits = permits.filter((p) => p.workerId === worker.id);
          const hasActivePermit = workerPermits.some((p) => p.status === 'active');

          return (
            <div
              key={worker.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={worker.photoUrl}
                    alt={worker.fullNameAr}
                    className="w-14 h-16 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{worker.fullNameAr}</h3>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{worker.fullNameEn}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {worker.nationality}
                      </span>
                      <span className="text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-100">
                        {worker.profession}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">رقم الإقامة:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {maskId(worker.iqamaNumber, settings.maskSensitiveData)}
                    </span>
                  </div>

                  {worker.borderNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">رقم الحدود:</span>
                      <span className="font-mono text-slate-600">
                        {maskId(worker.borderNumber, settings.maskSensitiveData)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">المنشأة التابع لها:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[170px]">
                      {establishment?.nameAr || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">التأمين الطبي:</span>
                    <span
                      className={`font-semibold text-[11px] flex items-center gap-1 ${
                        worker.healthInsuranceStatus === 'active' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {worker.healthInsuranceStatus === 'active' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>ساري المفعول</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>منتهي / يلزم التجديد</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">رقم الجوال:</span>
                    <span className="font-mono text-slate-600">
                      {maskPhone(worker.phone, settings.maskSensitiveData)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">التصاريح المرتبطة:</span>
                    <span className="text-slate-800 font-semibold">
                      {workerPermits.length} تصريح ({hasActivePermit ? 'سارٍ' : 'لا يوجد سارٍ'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!isReadOnly ? (
                  <>
                    <button
                      onClick={() => onIssuePermitForWorker(worker.id)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>إصدار تصريح</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditWorker(worker)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="تعديل بيانات العامل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteWorker(worker.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="حذف العامل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-slate-400 text-xs">عرض فقط (صلاحية مدقق)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
