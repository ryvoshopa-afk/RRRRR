export type PermitType = 'contractual' | 'temporary' | 'seasonal' | 'accompanier';

export type PermitStatus = 'active' | 'expired' | 'revoked' | 'under_review';

export type UserRole = 'admin' | 'hr_manager' | 'inspector' | 'auditor';

export interface Worker {
  id: string;
  iqamaNumber: string;
  borderNumber?: string;
  passportNumber?: string;
  fullNameAr: string;
  fullNameEn: string;
  nationality: string;
  profession: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  healthInsuranceStatus: 'active' | 'expired' | 'uninsured';
  photoUrl: string;
  primaryEstablishmentId: string;
  notes?: string;
}

export interface Establishment {
  id: string;
  nameAr: string;
  nameEn: string;
  crNumber: string; // السجل التجاري
  unifiedNumber700: string; // الرقم الموحد 700
  activity: string; // النشاط الاقتصادي
  city: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
}

export interface WorkPermit {
  id: string;
  permitNumber: string; // e.g. AJ-2026-89412
  permitType: PermitType;
  workerId: string;
  issuingEstablishmentId: string; // المنشأة المصرحة (المستعيرة / المشغلة)
  hostEstablishmentId: string; // صاحب العمل الأصلي / المنشأة المستفيدة
  authorizedProfession: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: PermitStatus;
  workLocations: string[]; // مواقع العمل المصرح بها
  contractNumber: string;
  securityHash: string; // Authentic verification hash
  qrVerificationCode: string;
  conditionsAndTerms: string[];
  notes?: string;
  supervisorNotes?: string[];
  createdAt: string;
}

export interface InspectionRecord {
  id: string;
  permitNumber: string;
  workerName: string;
  workerIqama: string;
  inspectorName: string;
  locationChecked: string;
  timestamp: string;
  status: 'compliant' | 'unauthorized_location' | 'expired_permit' | 'violation';
  notes: string;
}

export interface SystemSettings {
  platformName: string;
  ministryName: string;
  vision2030Text: string;
  platformLogoUrl: string;
  ministryLogoUrl: string;
  stampSignatureUrl: string;
  showWatermark: boolean;
  watermarkText: string;
  headerBadgeText: string;
  footerNoticeText: string;
  defaultTerms: string[];
  maskSensitiveData: boolean;
  currentRole: UserRole;
  currentUserName: string;
  primaryColor: string;
}

export interface AjeerApiConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  establishment700: string;
  autoSyncWithQiwa: boolean;
  webhookUrl: string;
  lastSyncTimestamp?: string;
  connectionStatus: 'connected' | 'disconnected' | 'testing';
}
