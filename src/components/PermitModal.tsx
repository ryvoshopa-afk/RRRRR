import React, { useState } from 'react';
import { WorkPermit, Worker, Establishment, PermitType, PermitStatus } from '../types';
import { generateCryptoHash } from '../utils/helpers';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PermitModalProps {
  permit?: WorkPermit | null;
  workers: Worker[];
  establishments: Establishment[];
  onSave: (permit: WorkPermit) => void;
  onClose: () => void;
}

export const PermitModal: React.FC<PermitModalProps> = ({
  permit,
  workers,
  establishments,
  onSave,
  onClose,
}) => {
  const isEditing = !!permit;

  const [permitNumber, setPermitNumber] = useState(
    permit?.permitNumber || `AJR-2026-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [permitType, setPermitType] = useState<PermitType>(permit?.permitType || 'contractual');
  const [workerId, setWorkerId] = useState(permit?.workerId || (workers[0]?.id || ''));
  const [issuingEstablishmentId, setIssuingEstablishmentId] = useState(
    permit?.issuingEstablishmentId || (establishments[0]?.id || '')
  );
  const [hostEstablishmentId, setHostEstablishmentId] = useState(
    permit?.hostEstablishmentId || (establishments[1]?.id || establishments[0]?.id || '')
  );
  const [authorizedProfession, setAuthorizedProfession] = useState(
    permit?.authorizedProfession || (workers.find((w) => w.id === workerId)?.profession || '')
  );
  const [issueDate, setIssueDate] = useState(
    permit?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    permit?.expiryDate ||
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<PermitStatus>(permit?.status || 'active');
  const [contractNumber, setContractNumber] = useState(
    permit?.contractNumber || `CTR-SA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [workLocations, setWorkLocations] = useState<string[]>(
    permit?.workLocations?.length
      ? permit.workLocations
      : ['مشروع الرياض الجديد - الموقع الرئيسي']
  );
  const [newLocationInput, setNewLocationInput] = useState('');
  const [notes, setNotes] = useState(permit?.notes || '');

  const handleAddLocation = () => {
    if (!newLocationInput.trim()) return;
    setWorkLocations([...workLocations, newLocationInput.trim()]);
    setNewLocationInput('');
  };

  const handleRemoveLocation = (index: number) => {
    setWorkLocations(workLocations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId || !issuingEstablishmentId || !hostEstablishmentId) {
      alert('الرجاء اختيار العامل والمنشأتين');
      return;
    }

    const updatedPermit: WorkPermit = {
      id: permit?.id || `pmt-${Date.now()}`,
      permitNumber: permitNumber.trim(),
      permitType,
      workerId,
      issuingEstablishmentId,
      hostEstablishmentId,
      authorizedProfession: authorizedProfession.trim() || 'فني متخصص',
      issueDate,
      expiryDate,
      status,
      workLocations: workLocations.length ? workLocations : ['الموقع العام'],
      contractNumber: contractNumber.trim(),
      securityHash: permit?.securityHash || generateCryptoHash(permitNumber),
      qrVerificationCode:
        permit?.qrVerificationCode ||
        `https://ajeer.mol.gov.sa/verify/${permitNumber}?hash=${Math.random().toString(36).slice(2, 10)}`,
      conditionsAndTerms: permit?.conditionsAndTerms || [
        'يقتصر عمل العامل المصرح له على المواقع المذكورة فقط.',
        'الالتزام بكافة أنظمة العمل وقواعد السلامة المعتمدة.',
        'يعتبر هذا التصريح وثيقة رسمية خاضعة للتفتيش والرقابة الميدانية.',
      ],
      notes,
      supervisorNotes: permit?.supervisorNotes || [],
      createdAt: permit?.createdAt || new Date().toISOString(),
    };

    onSave(updatedPermit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden text-right">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {isEditing ? `تعديل تصريح العمل (${permit.permitNumber})` : 'إصدار تصريح عمل جديد (أجير)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">رقم التصريح الرسمي:</label>
              <input
                type="text"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">نوع التصريح:</label>
              <select
                value={permitType}
                onChange={(e) => setPermitType(e.target.value as PermitType)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                <option value="contractual">تصريح عمل تعاقدي (إعارة خدمات)</option>
                <option value="temporary">تصريح عمل مؤقت (أجير مباشر)</option>
                <option value="seasonal">تصريح عمل موسمي (مواسم ومشاريع)</option>
                <option value="accompanier">تصريح عمل مرافق</option>
              </select>
            </div>
          </div>

          {/* Worker Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">اختيار العامل المصرح له:</label>
              <select
                value={workerId}
                onChange={(e) => {
                  setWorkerId(e.target.value);
                  const selWorker = workers.find((w) => w.id === e.target.value);
                  if (selWorker) setAuthorizedProfession(selWorker.profession);
                }}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.fullNameAr} ({w.iqamaNumber}) - {w.profession}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">المهنة المصرح بمزاولتها:</label>
              <input
                type="text"
                value={authorizedProfession}
                onChange={(e) => setAuthorizedProfession(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Establishments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">المنشأة المصرحة (المستعيرة):</label>
              <select
                value={issuingEstablishmentId}
                onChange={(e) => setIssuingEstablishmentId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                {establishments.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nameAr} (س.ت: {est.crNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">المنشأة المستفيدة (صاحب العمل الأصلي):</label>
              <select
                value={hostEstablishmentId}
                onChange={(e) => setHostEstablishmentId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                {establishments.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nameAr} (س.ت: {est.crNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">تاريخ الإصدار:</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">تاريخ نهاية الصلاحية:</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">حالة التصريح:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PermitStatus)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                <option value="active">ساري وصالح للعمل</option>
                <option value="under_review">قيد المراجعة والتدقيق</option>
                <option value="expired">منتهي الصلاحية</option>
                <option value="revoked">ملغى نظاماً</option>
              </select>
            </div>
          </div>

          {/* Contract Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">رقم العقد المرجعي بين الطرفين:</label>
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Work Locations */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              مواقع ومشاريع العمل المصرح بها (موقع أو عدة مواقع):
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="أضف موقع عمل جديد (مثال: مشروع القدية - بوابة رقم 3)..."
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLocation();
                  }
                }}
                className="flex-1 p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {workLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(idx)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ملاحظات إدارية إضافية:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات خاصة بالتصريح..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
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
              {isEditing ? 'حفظ التعديلات' : 'إصدار واعتماد التصريح'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
