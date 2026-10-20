import React, { useState } from 'react';
import { SystemSettings, UserRole } from '../types';
import {
  Settings,
  Sliders,
  FileText,
  Shield,
  Download,
  Upload,
  RefreshCcw,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
} from 'lucide-react';

interface AdminSettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onExportAllData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetToDefaults: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportAllData,
  onImportData,
  onResetToDefaults,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [newTermInput, setNewTermInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddTerm = () => {
    if (!newTermInput.trim()) return;
    setFormData({
      ...formData,
      defaultTerms: [...formData.defaultTerms, newTermInput.trim()],
    });
    setNewTermInput('');
  };

  const handleRemoveTerm = (index: number) => {
    setFormData({
      ...formData,
      defaultTerms: formData.defaultTerms.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportData(text);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err: any) {
        setImportError('فشل استيراد الملف: تنسيق JSON غير صالح');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">لوحة الإدارة، تخصيص القوالب والنصوص الرسمية</h2>
          <p className="text-xs text-slate-500">
            تعديل نصوص التصاريح، الهوية البصرية، الشروط والأحكام، وضوابط حماية البيانات الحساسة
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ التعديلات وتحديث القوالب بنجاح</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Official Header & Platform Text */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>النصوص الرسمية وهوية المستندات الحكومية</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">اسم المنصة الرسمي:</label>
              <input
                type="text"
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">اسم الوزارة المصرحة:</label>
              <input
                type="text"
                value={formData.ministryName}
                onChange={(e) => setFormData({ ...formData, ministryName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">شارة رأس التصريح (Header Badge):</label>
              <input
                type="text"
                value={formData.headerBadgeText}
                onChange={(e) => setFormData({ ...formData, headerBadgeText: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">شعار وهوية رؤية 2030:</label>
              <input
                type="text"
                value={formData.vision2030Text}
                onChange={(e) => setFormData({ ...formData, vision2030Text: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">تذييل التحذير والمخالفات في أسفل المستند:</label>
            <textarea
              rows={2}
              value={formData.footerNoticeText}
              onChange={(e) => setFormData({ ...formData, footerNoticeText: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Visual Watermark & Colors */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>العلامة المائية وضبط خلفية الطباعة الرسمية</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="showWatermark"
                checked={formData.showWatermark}
                onChange={(e) => setFormData({ ...formData, showWatermark: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="showWatermark" className="font-semibold text-slate-800 cursor-pointer">
                تفعيل العلامة المائية في خلفية التصريح المطبوع لمنع التزوير
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">نص العلامة المائية:</label>
              <input
                type="text"
                value={formData.watermarkText}
                onChange={(e) => setFormData({ ...formData, watermarkText: e.target.value })}
                disabled={!formData.showWatermark}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Default Terms & Conditions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>الشروط والأحكام النظامية الافتراضية لقوالب التصاريح</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أضف بنداً نظامياً جديداً لقالب التصريح..."
                value={newTermInput}
                onChange={(e) => setNewTermInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
                className="flex-1 p-2 border border-slate-300 rounded-lg focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTerm}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة بند</span>
              </button>
            </div>

            <div className="space-y-1.5 mt-2">
              {formData.defaultTerms.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <div className="flex items-start gap-2 flex-1 pl-2">
                    <span className="font-bold text-emerald-700">{index + 1}.</span>
                    <span>{term}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(index)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                    title="حذف هذا البند"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Sensitive Data Masking */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>سياسات حماية البيانات الحساسة (Data Masking)</span>
          </h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <input
              type="checkbox"
              id="maskSensitiveData"
              checked={formData.maskSensitiveData}
              onChange={(e) => setFormData({ ...formData, maskSensitiveData: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <div>
              <label htmlFor="maskSensitiveData" className="font-semibold text-slate-800 cursor-pointer block">
                تفعيل الإخفاء التلقائي لأرقام الإقامات والجوازات وأرقام الهواتف
              </label>
              <p className="text-[11px] text-slate-500">
                عند التفعيل، يتم عرض أرقام الهويات بالصيغة المقنعة (مثال: 248****374) لحماية خصوصية العمال والمفتشين غير المصرح لهم.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع إعدادات المنصة والقوالب</span>
          </button>
        </div>
      </form>

      {/* Section 5: Data Backup, Restore & Reset */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
          <Download className="w-4 h-4 text-slate-600" />
          <span>النسخ الاحتياطي واستعادة قاعدة البيانات</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Export */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800">تصدير نسخة احتياطية كاملة</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                تنزيل جميع العمال، التصاريح، المنشآت ومحاضر التفتيش كملف JSON مشفر.
              </p>
            </div>
            <button
              onClick={onExportAllData}
              className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل النسخة الاحتياطية (JSON)</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800">استعادة بيانات من ملف</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                استرجاع بيانات سابقة من ملف JSON تم تصديره من المنصة.
              </p>
            </div>
            <label className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-semibold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>رفع واستعادة ملف (JSON)</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Reset */}
          <div className="p-3.5 bg-rose-50/50 rounded-lg border border-rose-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-rose-900">إعادة تعيين البيانات للوضع الافتراضي</h4>
              <p className="text-[11px] text-rose-700 mt-1">
                استرجاع البيانات النموذجية الأولية ومسح أي سجلات تجريبية غير متوافقة.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من إعادة تعيين قاعدة البيانات للحالة النموذجية الأولية؟')) {
                  onResetToDefaults();
                }
              }}
              className="mt-3 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين البيانات</span>
            </button>
          </div>
        </div>

        {importError && (
          <div className="p-2.5 bg-rose-100 text-rose-800 text-xs rounded-lg font-semibold">
            {importError}
          </div>
        )}
      </div>
    </div>
  );
};
