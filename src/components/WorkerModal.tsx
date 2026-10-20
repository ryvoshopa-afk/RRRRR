import React, { useState } from 'react';
import { Worker, Establishment } from '../types';
import { X, UserCheck, Shield } from 'lucide-react';

interface WorkerModalProps {
  worker?: Worker | null;
  establishments: Establishment[];
  onSave: (worker: Worker) => void;
  onClose: () => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({
  worker,
  establishments,
  onSave,
  onClose,
}) => {
  const isEditing = !!worker;

  const [fullNameAr, setFullNameAr] = useState(worker?.fullNameAr || '');
  const [fullNameEn, setFullNameEn] = useState(worker?.fullNameEn || '');
  const [iqamaNumber, setIqamaNumber] = useState(worker?.iqamaNumber || '');
  const [borderNumber, setBorderNumber] = useState(worker?.borderNumber || '');
  const [passportNumber, setPassportNumber] = useState(worker?.passportNumber || '');
  const [nationality, setNationality] = useState(worker?.nationality || 'مصري');
  const [profession, setProfession] = useState(worker?.profession || '');
  const [phone, setPhone] = useState(worker?.phone || '05');
  const [birthDate, setBirthDate] = useState(worker?.birthDate || '1990-01-01');
  const [gender, setGender] = useState<'male' | 'female'>(worker?.gender || 'male');
  const [healthInsuranceStatus, setHealthInsuranceStatus] = useState<'active' | 'expired' | 'uninsured'>(
    worker?.healthInsuranceStatus || 'active'
  );
  const [photoUrl, setPhotoUrl] = useState(
    worker?.photoUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  );
  const [primaryEstablishmentId, setPrimaryEstablishmentId] = useState(
    worker?.primaryEstablishmentId || (establishments[0]?.id || '')
  );
  const [notes, setNotes] = useState(worker?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameAr.trim() || !iqamaNumber.trim() || !profession.trim()) {
      alert('الرجاء تعبئة الاسم ورقم الإقامة والمهنة');
      return;
    }

    const updatedWorker: Worker = {
      id: worker?.id || `wrk-${Date.now()}`,
      fullNameAr: fullNameAr.trim(),
      fullNameEn: fullNameEn.trim() || fullNameAr.trim(),
      iqamaNumber: iqamaNumber.trim(),
      borderNumber: borderNumber.trim() || undefined,
      passportNumber: passportNumber.trim() || undefined,
      nationality: nationality.trim(),
      profession: profession.trim(),
      gender,
      birthDate,
      phone: phone.trim(),
      healthInsuranceStatus,
      photoUrl: photoUrl.trim(),
      primaryEstablishmentId,
      notes: notes.trim() || undefined,
    };

    onSave(updatedWorker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden text-right">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {isEditing ? `تعديل بيانات العامل (${worker.fullNameAr})` : 'تسجيل عامل جديد بالنظام'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الاسم الكامل (بالعربية):</label>
              <input
                type="text"
                value={fullNameAr}
                onChange={(e) => setFullNameAr(e.target.value)}
                required
                placeholder="مثال: محمد طارق العبدالله"
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name (English):</label>
              <input
                type="text"
                value={fullNameEn}
                onChange={(e) => setFullNameEn(e.target.value)}
                placeholder="e.g. Mohammed Tariq Al-Abdullah"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* IDs & Border Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الإقامة / الهوية الوطنية (10 أرقام):</label>
              <input
                type="text"
                value={iqamaNumber}
                onChange={(e) => setIqamaNumber(e.target.value)}
                required
                maxLength={10}
                placeholder="2481928374"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الحدود (إن وجد):</label>
              <input
                type="text"
                value={borderNumber}
                onChange={(e) => setBorderNumber(e.target.value)}
                placeholder="3918273645"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الجواز:</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                placeholder="P89127364"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Nationality & Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الجنسية:</label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                <option value="سعودي">سعودي</option>
                <option value="سوداني">سوداني</option>
                <option value="مصري">مصري</option>
                <option value="هندي">هندي</option>
                <option value="باكستاني">باكستاني</option>
                <option value="يمني">يمني</option>
                <option value="نيبالي">نيبالي</option>
                <option value="بنجلاديشي">بنجلاديشي</option>
                <option value="فلبيني">فلبيني</option>
                <option value="سوري">سوري</option>
                <option value="أردني">أردني</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">المهنة الأساسية:</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                required
                placeholder="مهندس موقع، فني كهرباء، مشرف سلامة..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Establishment & Insurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">المنشأة التابع لها:</label>
              <select
                value={primaryEstablishmentId}
                onChange={(e) => setPrimaryEstablishmentId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                {establishments.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">حالة التأمين الصحي الطبي:</label>
              <select
                value={healthInsuranceStatus}
                onChange={(e) => setHealthInsuranceStatus(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                <option value="active">مؤمن طبياً (ساري المفعول في CCHI)</option>
                <option value="expired">منتهي الصلاحية (يلزم التجديد)</option>
                <option value="uninsured">غير مؤمن</option>
              </select>
            </div>
          </div>

          {/* Phone & Photo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم الجوال:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0568912340"
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">رابط الصورة الشخصية المعتمدة:</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ملاحظات واعتمادات مهنية:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اعتماد الهيئة السعودية للمهندسين، شهادات السلامة، إلخ..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              {isEditing ? 'حفظ بيانات العامل' : 'تسجيل العامل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
