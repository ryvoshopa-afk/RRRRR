import React from 'react';
import { WorkPermit, Worker, Establishment } from '../types';
import { getDaysRemaining } from '../utils/helpers';

interface AjeerMobileVerifyViewProps {
  permit: WorkPermit;
  worker: Worker;
  issuingEst: Establishment;
  hostEst: Establishment;
  pageHeaderTitle?: string;
  pageHeaderSubtitle?: string;
  maskIdEnabled?: boolean;
}

export const AjeerMobileVerifyView: React.FC<AjeerMobileVerifyViewProps> = ({
  permit,
  worker,
  issuingEst,
  hostEst,
  pageHeaderTitle = 'التصريح أُجْرِ لحلول الموارد البشرية',
  pageHeaderSubtitle = 'تم تحميل البيانات بنجاح',
  maskIdEnabled = false,
}) => {
  const daysLeft = getDaysRemaining(permit.expiryDate);
  const isActive = permit.status === 'active' && daysLeft > 0;
  const isExpired = permit.status === 'expired' || daysLeft <= 0;
  const isRevoked = permit.status === 'revoked';

  // Format ID according to privacy
  const displayIqama = maskIdEnabled
    ? `${worker.iqamaNumber.slice(0, 3)}****${worker.iqamaNumber.slice(-3)}`
    : worker.iqamaNumber;

  return (
    <div className="min-h-screen bg-[#ede8f5] text-slate-800 font-['Cairo',Arial,sans-serif] py-6 px-4 flex flex-col items-center justify-start select-none" dir="rtl">
      <div className="w-full max-w-[440px] space-y-4">
        {/* Top Header Box */}
        <div className="bg-white rounded-xl shadow-xs py-3.5 px-4 text-center border border-purple-100/50">
          <h1 className="text-[16px] font-bold text-slate-900 leading-tight">
            {pageHeaderTitle}
          </h1>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            {pageHeaderSubtitle}
          </p>
        </div>

        {/* Card 1: Permit Information (معلومات التصريح) */}
        <div className="bg-white rounded-xl shadow-xs border border-purple-100/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-900">
              معلومات التصريح
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-right">
            {/* 1. اسم الموظف */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                اسم الموظف
              </div>
              <div className="text-[13.5px] font-bold text-slate-900">
                {worker.fullNameAr}
              </div>
            </div>

            {/* 2. حالة التصريح */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <div>
                <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                  حالة التصريح
                </div>
                <div className="mt-0.5">
                  {isActive ? (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#d1f4e0] text-[#008744] border border-[#a6e8c1]">
                      ساري
                    </span>
                  ) : isRevoked ? (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      ملغى
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      منتهي
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. تاريخ بداية التصريح */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                تاريخ بداية التصريح
              </div>
              <div className="text-[13px] font-semibold text-slate-800 font-mono">
                {permit.issueDate}
              </div>
            </div>

            {/* 4. تاريخ انتهاء التصريح */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                تاريخ انتهاء التصريح
              </div>
              <div className="text-[13px] font-semibold text-slate-800 font-mono">
                {permit.expiryDate}
              </div>
            </div>

            {/* 5. رقم التصريح */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                رقم التصريح
              </div>
              <div className="text-[13.5px] font-bold text-slate-900 font-mono">
                {permit.permitNumber}
              </div>
            </div>

            {/* 6. رقم الهوية */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                رقم الهوية
              </div>
              <div className="text-[13.5px] font-bold text-slate-900 font-mono">
                {displayIqama}
              </div>
            </div>

            {/* 7. المهنة */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                المهنة
              </div>
              <div className="text-[13px] font-semibold text-slate-900">
                {permit.authorizedProfession || worker.profession}
              </div>
            </div>

            {/* 8. الجنسية */}
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                الجنسية
              </div>
              <div className="text-[13px] font-semibold text-slate-900">
                {worker.nationality}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Beneficiary Establishment (المنشأة المستفيدة) */}
        <div className="bg-white rounded-xl shadow-xs border border-purple-100/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-900">
              المنشأة المستفيدة
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-right">
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                اسم المنشأة
              </div>
              <div className="text-[13.5px] font-bold text-slate-900">
                {hostEst.nameAr}
              </div>
            </div>

            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                رقم المنشأة
              </div>
              <div className="text-[13px] font-bold text-slate-800 font-mono">
                {hostEst.unifiedNumber700}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Service Provider Establishment (المنشأة المقدمة للخدمة) */}
        <div className="bg-white rounded-xl shadow-xs border border-purple-100/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-900">
              المنشأة المقدمة للخدمة
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-right">
            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                اسم المنشأة
              </div>
              <div className="text-[13.5px] font-bold text-slate-900">
                {issuingEst.nameAr}
              </div>
            </div>

            <div className="px-4 py-2.5">
              <div className="text-[11.5px] text-slate-400 font-medium mb-0.5">
                رقم المنشأة
              </div>
              <div className="text-[13px] font-bold text-slate-800 font-mono">
                {issuingEst.unifiedNumber700}
              </div>
            </div>
          </div>
        </div>

        {/* Footer (التذييل) */}
        <footer className="pt-2 pb-6 text-center text-slate-500 text-[11px] leading-[1.6]">
          <div className="font-semibold text-slate-600 mb-1">أجير</div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">سياسات الخصوصية</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600 transition-colors">الشروط والأحكام</a>
          </div>
          <div className="mt-1 text-[10.5px] text-slate-400 font-sans">
            © هـ ١٤٤٦ / أُجْرِ لحلول الموارد البشرية
          </div>
        </footer>
      </div>
    </div>
  );
};
