import React, { useState } from 'react';
import { WorkPermit, Worker, Establishment } from '../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface AjeerDocumentEditorModalProps {
  permit: WorkPermit;
  worker: Worker;
  issuingEst: Establishment;
  hostEst: Establishment;
  contractBrief: string;
  declarationsList: string[];
  referenceNumber: string;
  pageHeaderTitle?: string;
  pageHeaderSubtitle?: string;
  onSave: (data: {
    workerName: string;
    iqamaNumber: string;
    profession: string;
    nationality: string;
    issuingEstName: string;
    issuingEst700: string;
    hostEstName: string;
    hostEst700: string;
    contractBrief: string;
    issueDate: string;
    expiryDate: string;
    workLocation: string;
    referenceNumber: string;
    declarationsList: string[];
    status: 'active' | 'expired' | 'revoked';
    pageHeaderTitle: string;
    pageHeaderSubtitle: string;
  }) => void;
  onClose: () => void;
}

export const AjeerDocumentEditorModal: React.FC<AjeerDocumentEditorModalProps> = ({
  permit,
  worker,
  issuingEst,
  hostEst,
  contractBrief,
  declarationsList,
  referenceNumber,
  pageHeaderTitle,
  pageHeaderSubtitle,
  onSave,
  onClose,
}) => {
  const [workerName, setWorkerName] = useState(worker.fullNameAr);
  const [iqamaNumber, setIqamaNumber] = useState(worker.iqamaNumber);
  const [profession, setProfession] = useState(permit.authorizedProfession || worker.profession);
  const [nationality, setNationality] = useState(worker.nationality);

  const [issuingEstName, setIssuingEstName] = useState(issuingEst.nameAr);
  const [issuingEst700, setIssuingEst700] = useState(issuingEst.unifiedNumber700);

  const [hostEstName, setHostEstName] = useState(hostEst.nameAr);
  const [hostEst700, setHostEst700] = useState(hostEst.unifiedNumber700);

  const [brief, setBrief] = useState(contractBrief);
  const [issueDate, setIssueDate] = useState(permit.issueDate);
  const [expiryDate, setExpiryDate] = useState(permit.expiryDate);
  const [workLocation, setWorkLocation] = useState(permit.workLocations[0] || 'الرياض');
  const [refNum, setRefNum] = useState(referenceNumber || permit.permitNumber);
  const [status, setStatus] = useState<'active' | 'expired' | 'revoked'>(permit.status as any || 'active');
  const [headerTitle, setHeaderTitle] = useState(pageHeaderTitle || 'التصريح أُجْرِ لحلول الموارد البشرية');
  const [headerSubtitle, setHeaderSubtitle] = useState(pageHeaderSubtitle || 'تم تحميل البيانات بنجاح');

  const [declarations, setDeclarations] = useState<string[]>(
    declarationsList && declarationsList.length > 0
      ? declarationsList
      : [
          'صحة جميع البيانات المسجلة في هذا التصريح ومطابقتها للعقد المبرم بين الطرفين.',
          'أن العامل المصرح له يعمل تحت إشراف المنشأة المستفيدة وفق المهنة المحددة في التصريح فقط.',
          'التزام المنشأة بصرف أجور العامل وتوفير الرعاية الصحية والتأمين الطبي وإصابات العمل طوال فترة سريان العقد والتصريح.',
          'عدم تمكين العامل من العمل لدى أي طرف ثالث غير المنشأة المستفيدة المذكورة في هذا التصريح.',
          'تقديم هذا التصريح للجهات المختصة عند طلبه لإثبات نظامية تواجد العامل في موقع العمل وعدم مخالفته لنظام العمل.',
        ]
  );
  const [newDecInput, setNewDecInput] = useState('');

  const handleAddDeclaration = () => {
    if (!newDecInput.trim()) return;
    setDeclarations([...declarations, newDecInput.trim()]);
    setNewDecInput('');
  };

  const handleRemoveDeclaration = (idx: number) => {
    setDeclarations(declarations.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      workerName: workerName.trim(),
      iqamaNumber: iqamaNumber.trim(),
      profession: profession.trim(),
      nationality: nationality.trim(),
      issuingEstName: issuingEstName.trim(),
      issuingEst700: issuingEst700.trim(),
      hostEstName: hostEstName.trim(),
      hostEst700: hostEst700.trim(),
      contractBrief: brief.trim(),
      issueDate,
      expiryDate,
      workLocation: workLocation.trim(),
      referenceNumber: refNum.trim(),
      declarationsList: declarations,
      status,
      pageHeaderTitle: headerTitle.trim(),
      pageHeaderSubtitle: headerSubtitle.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl my-6 overflow-hidden text-right">
        {/* Modal Header */}
        <div className="bg-neutral-800 text-white p-4 flex items-center justify-between">
          <h3 className="font-bold text-sm">تعديل بيانات تصريح أجير الحالي</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[82vh] overflow-y-auto">
          {/* Header Meta */}
          <div className="bg-neutral-50 p-3 rounded border border-neutral-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">الرقم المرجعي (رقم التصريح):</label>
                <input
                  type="text"
                  value={refNum}
                  onChange={(e) => setRefNum(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded font-mono font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-800 mb-1">حالة التصريح (ساري / منتهي / ملغى):</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 border border-neutral-300 rounded font-bold focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="active">ساري (شارة خضراء)</option>
                  <option value="expired">منتهي الصلاحية (شارة حمراء)</option>
                  <option value="revoked">ملغى نظاماً (شارة حمراء)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">عنوان صفحة التحقق:</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">النص أسفل العنوان:</label>
                <input
                  type="text"
                  value={headerSubtitle}
                  onChange={(e) => setHeaderSubtitle(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Worker Info */}
          <div className="space-y-2 border-t border-neutral-200 pt-3">
            <h4 className="font-bold text-neutral-900 bg-neutral-100 p-1.5 rounded">بيانات العامل</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">اسم العامل:</label>
                <input
                  type="text"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">رقم الهوية / الإقامة:</label>
                <input
                  type="text"
                  value={iqamaNumber}
                  onChange={(e) => setIqamaNumber(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">المهنة:</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">الجنسية:</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Service Provider Info */}
          <div className="space-y-2 border-t border-neutral-200 pt-3">
            <h4 className="font-bold text-neutral-900 bg-neutral-100 p-1.5 rounded">بيانات مقدم الخدمة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">المنشأة المقدمة للخدمة:</label>
                <input
                  type="text"
                  value={issuingEstName}
                  onChange={(e) => setIssuingEstName(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">رقم المنشأة بوزارة الموارد (700):</label>
                <input
                  type="text"
                  value={issuingEst700}
                  onChange={(e) => setIssuingEst700(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Beneficiary Info */}
          <div className="space-y-2 border-t border-neutral-200 pt-3">
            <h4 className="font-bold text-neutral-900 bg-neutral-100 p-1.5 rounded">بيانات المستفيد من الخدمة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">المنشأة المستفيدة من الخدمة:</label>
                <input
                  type="text"
                  value={hostEstName}
                  onChange={(e) => setHostEstName(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">رقم المنشأة بوزارة الموارد (700):</label>
                <input
                  type="text"
                  value={hostEst700}
                  onChange={(e) => setHostEst700(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Permit Info */}
          <div className="space-y-2 border-t border-neutral-200 pt-3">
            <h4 className="font-bold text-neutral-900 bg-neutral-100 p-1.5 rounded">بيانات التصريح</h4>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">نبذة عن التعاقد:</label>
              <textarea
                rows={2}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                required
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">تاريخ بداية التصريح:</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">تاريخ نهاية التصريح:</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="w-full p-2 border border-neutral-300 rounded font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">موقع العمل:</label>
              <input
                type="text"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                required
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Declarations List */}
          <div className="space-y-2 border-t border-neutral-200 pt-3">
            <h4 className="font-bold text-neutral-900 bg-neutral-100 p-1.5 rounded">بنود الإقرارات</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أضف بند إقرار جديد..."
                value={newDecInput}
                onChange={(e) => setNewDecInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeclaration();
                  }
                }}
                className="flex-1 p-2 border border-neutral-300 rounded focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddDeclaration}
                className="px-3 py-2 bg-neutral-800 text-white rounded font-medium"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {declarations.map((dec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded text-[11px]"
                >
                  <span className="flex-1 pl-2">{dec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeclaration(idx)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>تحديث المستند</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
