import React from 'react';
import { UserRole, SystemSettings } from '../types';
import { ShieldCheck, Eye, EyeOff, UserCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  settings: SystemSettings;
  onUpdateRole: (role: UserRole) => void;
  onToggleMask: () => void;
  activeTab: string;
  onOpenPublicVerify?: () => void;
  onOpenDocument?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateRole,
  onToggleMask,
  onOpenPublicVerify,
  onOpenDocument,
}) => {
  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Ministry Bar */}
      <div className="bg-emerald-800 text-emerald-100 text-xs py-1 px-4 border-b border-emerald-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold">{settings.vision2030Text}</span>
            <span className="text-emerald-400">|</span>
            <span>{settings.ministryName}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              بوابة أجير وقوى - متصل ومزامن (v2.4)
            </span>
            <span className="text-emerald-300">اليوم: {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-md border border-emerald-500/40">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{settings.platformName}</h1>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                منصة معتمدة
              </span>
            </div>
            <p className="text-xs text-slate-400">إدارة تصاريح العمل التعاقدي والمؤقت والتحقق الفوري عبر الكود الرقمي</p>
          </div>
        </div>

        {/* Role & Security Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sensitive Data Masking Button */}
          <button
            onClick={onToggleMask}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              settings.maskSensitiveData
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="حماية أرقام الإقامات والجوازات والهواتف من الظهور العلني"
          >
            {settings.maskSensitiveData ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>حجب البيانات الحساسة (مفعل)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>البيانات الحساسة مكشوفة</span>
              </>
            )}
          </button>

          {/* Role Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>الصلاحية:</span>
            </span>
            <select
              value={settings.currentRole}
              onChange={(e) => onUpdateRole(e.target.value as UserRole)}
              className="bg-slate-900 text-white rounded px-2.5 py-1 text-xs border border-slate-600 focus:outline-none focus:border-emerald-500"
            >
              <option value="admin">مشرف عام (Admin - كامل الصلاحيات)</option>
              <option value="hr_manager">مدير الموارد البشرية (HR Manager)</option>
              <option value="inspector">مفتش ميداني (Inspector - تحقق ورقابة)</option>
              <option value="auditor">مدقق نظامي (Auditor - قراءة فقط)</option>
            </select>
          </div>

          {/* Public Verify & Document Preview Buttons */}
          {onOpenPublicVerify && (
            <button
              onClick={onOpenPublicVerify}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-700 hover:bg-purple-600 text-white transition-colors"
              title="معاينة صفحة التحقق العامة النظيفة (QR)"
            >
              صفحة التحقق العامة (QR)
            </button>
          )}

          {onOpenDocument && (
            <button
              onClick={onOpenDocument}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
              title="معاينة المستند الرسمي A4 للطباعة"
            >
              مستند A4 للطباعة
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
