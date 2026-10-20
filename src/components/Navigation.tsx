import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Users2,
  Building2,
  QrCode,
  ClipboardCheck,
  Settings,
  Webhook,
  FileText,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  counts: {
    permits: number;
    workers: number;
    expiringPermits: number;
    inspections: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'المؤشرات العامة',
      icon: LayoutDashboard,
    },
    {
      id: 'permits',
      label: 'تصاريح العمل',
      icon: FileCheck2,
      badge: counts.expiringPermits > 0 ? `${counts.expiringPermits} تنبيه` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'workers',
      label: 'سجل العمالة',
      icon: Users2,
      badge: `${counts.workers}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'establishments',
      label: 'المنشآت المسجلة',
      icon: Building2,
    },
    {
      id: 'verify',
      label: 'التحقق الفوري (QR)',
      icon: QrCode,
    },
    {
      id: 'inspection',
      label: 'التفتيش الميداني',
      icon: ClipboardCheck,
    },
    {
      id: 'settings',
      label: 'لوحة الإدارة والقوالب',
      icon: Settings,
    },
    {
      id: 'ajeer-api',
      label: 'تكامل أجير وقوى',
      icon: Webhook,
    },
    {
      id: 'audit-report',
      label: 'تقرير الفحص الشامل (10 نقاط)',
      icon: FileText,
      special: true,
    },
  ];

  return (
    <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? tab.special
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-emerald-700 text-white shadow-xs'
                  : tab.special
                  ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.special ? 'text-amber-700' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
