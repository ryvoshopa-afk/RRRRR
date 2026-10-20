import React, { useState } from 'react';
import { Establishment, WorkPermit, SystemSettings } from '../types';
import { Building2, PlusCircle, Edit3, Trash2, Phone, Mail, MapPin, X, CheckCircle2 } from 'lucide-react';

interface EstablishmentsListProps {
  establishments: Establishment[];
  permits: WorkPermit[];
  settings: SystemSettings;
  onSaveEstablishment: (est: Establishment) => void;
  onDeleteEstablishment: (id: string) => void;
}

export const EstablishmentsList: React.FC<EstablishmentsListProps> = ({
  establishments,
  permits,
  settings,
  onSaveEstablishment,
  onDeleteEstablishment,
}) => {
  const [editingEst, setEditingEst] = useState<Establishment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [unifiedNumber700, setUnifiedNumber700] = useState('');
  const [activity, setActivity] = useState('');
  const [city, setCity] = useState('الرياض');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');

  const handleOpenAdd = () => {
    setEditingEst(null);
    setNameAr('');
    setNameEn('');
    setCrNumber('');
    setUnifiedNumber700('700');
    setActivity('المقاولات والإنشاءات');
    setCity('الرياض');
    setPhone('011');
    setEmail('');
    setManagerName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (est: Establishment) => {
    setEditingEst(est);
    setNameAr(est.nameAr);
    setNameEn(est.nameEn);
    setCrNumber(est.crNumber);
    setUnifiedNumber700(est.unifiedNumber700);
    setActivity(est.activity);
    setCity(est.city);
    setPhone(est.phone);
    setEmail(est.email);
    setManagerName(est.managerName);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !crNumber || !unifiedNumber700) {
      alert('الرجاء تعبئة اسم المنشأة والسجل التجاري والرقم الموحد 700');
      return;
    }

    const saved: Establishment = {
      id: editingEst?.id || `est-${Date.now()}`,
      nameAr,
      nameEn: nameEn || nameAr,
      crNumber,
      unifiedNumber700,
      activity: activity || 'الخدمات العامة',
      city,
      address: editingEst?.address || `المملكة العربية السعودية - ${city}`,
      phone,
      email,
      managerName: managerName || 'الممثل النظامي للمنشأة',
    };

    onSaveEstablishment(saved);
    setIsModalOpen(false);
  };

  const isReadOnly = settings.currentRole === 'auditor';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">سجل المنشآت والشركاء (الرقم الموحد 700)</h2>
          <p className="text-xs text-slate-500">
            المنشآت المصرحة والمستفيدة، أرقام السجلات التجارية، وبيانات الاتصال والمسؤولين
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة منشأة جديدة</span>
          </button>
        )}
      </div>

      {/* Grid of Establishments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {establishments.map((est) => {
          const issuingCount = permits.filter((p) => p.issuingEstablishmentId === est.id).length;
          const hostCount = permits.filter((p) => p.hostEstablishmentId === est.id).length;

          return (
            <div
              key={est.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{est.nameAr}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{est.nameEn}</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                    {est.city}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">السجل التجاري (CR):</span>
                    <span className="font-mono font-bold text-slate-800">{est.crNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">الرقم الموحد بوزارة الموارد (700):</span>
                    <span className="font-mono font-bold text-emerald-800">{est.unifiedNumber700}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">النشاط التجاري:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">{est.activity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">المسؤول المفوض:</span>
                    <span className="text-slate-800 font-semibold">{est.managerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{est.phone}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{est.email}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500 text-[11px]">
                  <span>تصاريح مُصدرة: <strong className="text-emerald-700 font-bold">{issuingCount}</strong></span>
                  <span className="mx-1.5">|</span>
                  <span>تصاريح مستفادة: <strong className="text-blue-700 font-bold">{hostCount}</strong></span>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(est)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="تعديل المنشأة"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {establishments.length > 1 && (
                      <button
                        onClick={() => onDeleteEstablishment(est.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="حذف المنشأة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden text-right">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingEst ? `تعديل المنشأة (${editingEst.nameAr})` : 'إضافة منشأة جديدة'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المنشأة بالعربية:</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Establishment Name (English):</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">رقم السجل التجاري (CR):</label>
                  <input
                    type="text"
                    value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الرقم الموحد (700):</label>
                  <input
                    type="text"
                    value={unifiedNumber700}
                    onChange={(e) => setUnifiedNumber700(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المدينة:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الممثل النظامي / المدير:</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الهاتف:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">النشاط الاقتصادي المعتمد:</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors"
                >
                  حفظ بيانات المنشأة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
