import React, { useEffect, useState } from 'react';
import { WorkPermit, Worker, Establishment } from '../types';
import { generateQrDataUrl } from '../utils/helpers';
import { MohrsdLogo, AjeerLogo } from './OfficialLogos';

interface AjeerOfficialDocumentProps {
  permit: WorkPermit;
  worker: Worker;
  issuingEst: Establishment;
  hostEst: Establishment;
  mohrsdLogoUrl?: string;
  ajeerLogoUrl?: string;
  contractBrief?: string;
  declarationsList?: string[];
  referenceNumber?: string;
}

export const AjeerOfficialDocument: React.FC<AjeerOfficialDocumentProps> = ({
  permit,
  worker,
  issuingEst,
  hostEst,
  mohrsdLogoUrl,
  ajeerLogoUrl,
  contractBrief = 'تقديم خدمات مساندة وتشغيلية وإعارة عمالة بموجب عقد الخدمات المشترك المبرم بين الطرفين.',
  declarationsList,
  referenceNumber,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const displayRefNumber = referenceNumber || permit.permitNumber || 'AJ-2026-98124';

  useEffect(() => {
    // Generate authentic verification QR that opens the isolated public verification page when scanned
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ajeer.com.sa';
    const verifyUrl = `${currentOrigin}/verify/${encodeURIComponent(displayRefNumber)}`;
    generateQrDataUrl(verifyUrl).then(setQrCodeDataUrl);
  }, [displayRefNumber]);

  const defaultDeclarations = declarationsList || [
    'صحة جميع البيانات المسجلة في هذا التصريح ومطابقتها للعقد المبرم بين الطرفين.',
    'أن العامل المصرح له يعمل تحت إشراف المنشأة المستفيدة وفق المهنة المحددة في التصريح فقط.',
    'التزام المنشأة بصرف أجور العامل وتوفير الرعاية الصحية والتأمين الطبي وإصابات العمل طوال فترة سريان العقد والتصريح.',
    'عدم تمكين العامل من العمل لدى أي طرف ثالث غير المنشأة المستفيدة المذكورة في هذا التصريح.',
    'تقديم هذا التصريح للجهات المختصة عند طلبه لإثبات نظامية تواجد العامل في موقع العمل وعدم مخالفته لنظام العمل.',
  ];

  return (
    <div className="ajeer-document">
      {/* 1. Header Box: Horizontal Rectangle with thin gray border */}
      <div className="border border-neutral-400 p-2.5 mb-3 flex items-center justify-between text-black">
        {/* Right: Logos */}
        <div className="flex items-center gap-4">
          {/* Ministry Logo at the far right */}
          <div className="h-12 flex items-center">
            <MohrsdLogo customUrl={mohrsdLogoUrl} className="h-11 w-auto object-contain" />
          </div>

          {/* Vertical subtle divider */}
          <div className="h-9 w-[1px] bg-neutral-300"></div>

          {/* Ajeer Logo to the left of Ministry Logo */}
          <div className="h-12 flex items-center">
            <AjeerLogo customUrl={ajeerLogoUrl} className="h-10 w-auto object-contain" />
          </div>
        </div>

        {/* Center: Title */}
        <div className="text-center px-2">
          <h1 className="text-[17px] font-bold text-black tracking-tight whitespace-nowrap">
            تصريح أجير - تعاقد أجير
          </h1>
        </div>

        {/* Left: QR Code and Reference Number */}
        <div className="flex flex-col items-center justify-center text-center pl-1">
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt="QR Code" className="w-[68px] h-[68px] object-contain" />
          ) : (
            <div className="w-[68px] h-[68px] border border-neutral-300 bg-neutral-100 flex items-center justify-center text-[9px]">
              رمز QR
            </div>
          )}
          <span className="text-[9.5px] font-bold text-black font-mono mt-0.5 tracking-tight">
            {displayRefNumber}
          </span>
        </div>
      </div>

      {/* 2. Introductory Paragraph */}
      <div className="text-[11.5px] leading-[1.65] text-black text-justify mb-3 px-0.5">
        نشعركم أنه تم التعاقد مع قبلنا كجهة مقدمة للخدمة مع الجهة المستفيدة من الخدمة حسب المعلومات المبينة أدناه، ولذلك تم تسجيل معلومات العقد لتكون بحوزة العامل لإثبات عدم مخالفته لنظام العمل ولتقديمها إلى من يهمه الأمر من الجهات المختصة عند طلبها للتحقق من صحة تواجده في مكان تقديم الخدمة
      </div>

      {/* 3. Table 1: Worker Information (بيانات العامل) */}
      <table className="ajeer-table">
        <tbody>
          <tr>
            <td colSpan={4} className="section-header">
              بيانات العامل
            </td>
          </tr>
          <tr>
            <td className="cell-label" style={{ width: '18%' }}>
              اسم العامل
            </td>
            <td className="cell-value" style={{ width: '32%' }}>
              {worker.fullNameAr}
            </td>
            <td className="cell-label" style={{ width: '22%' }}>
              رقم الهوية / الإقامة
            </td>
            <td className="cell-value" style={{ width: '28%' }}>
              {worker.iqamaNumber}
            </td>
          </tr>
          <tr>
            <td className="cell-label">المهنة</td>
            <td className="cell-value">{permit.authorizedProfession || worker.profession}</td>
            <td className="cell-label">الجنسية</td>
            <td className="cell-value">{worker.nationality}</td>
          </tr>
        </tbody>
      </table>

      {/* 4. Table 2: Service Provider Information (بيانات مقدم الخدمة) */}
      <table className="ajeer-table">
        <tbody>
          <tr>
            <td colSpan={4} className="section-header">
              بيانات مقدم الخدمة
            </td>
          </tr>
          <tr>
            <td className="cell-label" style={{ width: '25%' }}>
              المنشأة المقدمة للخدمة
            </td>
            <td className="cell-value" style={{ width: '75%' }} colSpan={3}>
              {issuingEst.nameAr}
            </td>
          </tr>
          <tr>
            <td className="cell-label">
              رقم المنشأة في وزارة الموارد البشرية والتنمية الاجتماعية
            </td>
            <td className="cell-value" colSpan={3}>
              {issuingEst.unifiedNumber700}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 5. Table 3: Beneficiary Information (بيانات المستفيد من الخدمة) */}
      <table className="ajeer-table">
        <tbody>
          <tr>
            <td colSpan={4} className="section-header">
              بيانات المستفيد من الخدمة
            </td>
          </tr>
          <tr>
            <td className="cell-label" style={{ width: '25%' }}>
              المنشأة المستفيدة من الخدمة
            </td>
            <td className="cell-value" style={{ width: '75%' }} colSpan={3}>
              {hostEst.nameAr}
            </td>
          </tr>
          <tr>
            <td className="cell-label">
              رقم المنشأة في وزارة الموارد البشرية والتنمية الاجتماعية
            </td>
            <td className="cell-value" colSpan={3}>
              {hostEst.unifiedNumber700}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 6. Table 4: Permit Information (بيانات التصريح) */}
      <table className="ajeer-table">
        <tbody>
          <tr>
            <td colSpan={4} className="section-header">
              بيانات التصريح
            </td>
          </tr>
          <tr>
            <td className="cell-label" style={{ width: '22%' }}>
              نبذة عن التعاقد
            </td>
            <td className="cell-value" colSpan={3}>
              {contractBrief}
            </td>
          </tr>
          <tr>
            <td className="cell-label">تاريخ بداية التصريح</td>
            <td className="cell-value" style={{ width: '28%' }}>
              {permit.issueDate}
            </td>
            <td className="cell-label" style={{ width: '22%' }}>
              تاريخ نهاية التصريح
            </td>
            <td className="cell-value" style={{ width: '28%' }}>
              {permit.expiryDate}
            </td>
          </tr>
          <tr>
            <td className="cell-label">موقع العمل</td>
            <td className="cell-value" colSpan={3}>
              {permit.workLocations && permit.workLocations.length > 0
                ? permit.workLocations.join(' - ')
                : 'موقع العمل المحدد للمشروع في مدينة الرياض'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 7. Declarations Section (قسم الإقرارات) */}
      <div className="mt-3 text-black text-[11px] leading-[1.6]">
        <h3 className="font-bold text-[12px] mb-1">إقرارات</h3>
        <p className="font-semibold mb-1">
          أقر أنا المنشأة المقدمة للخدمة والموضحة بياناتي أعلاه وأتعهد بـ:
        </p>
        <ul className="list-disc list-inside space-y-0.5 pr-1">
          {defaultDeclarations.map((item, index) => (
            <li key={index} className="text-justify">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 8. Footer Section (التذييل) */}
      <div className="mt-5 pt-3 border-t border-neutral-300 text-black text-[11px] leading-[1.5]">
        <div className="flex items-center gap-1">
          <span>للتحقق من صحة التصريح، يرجى مسح الرمز أو زيارة الرابط:</span>
          <a
            href="https://ajeer.com.sa/verify-permit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-mono font-medium"
          >
            https://ajeer.com.sa/verify-permit
          </a>
        </div>
        <div className="mt-1 text-[10.5px] text-neutral-800">
          هذا التصريح وثيقة نظامية رسمية معتمدة صادرة من منصة أجير التابعة لوزارة الموارد البشرية والتنمية الاجتماعية، ولا يتطلب ختماً أو توقيعاً يدوياً.
        </div>
      </div>
    </div>
  );
};
