import React, { useState, useEffect } from 'react';
import {
  WorkPermit,
  Worker,
  Establishment,
  InspectionRecord,
  SystemSettings,
  AjeerApiConfig,
  UserRole,
} from './types';
import {
  INITIAL_ESTABLISHMENTS,
  INITIAL_WORKERS,
  INITIAL_PERMITS,
  INITIAL_INSPECTIONS,
  INITIAL_SETTINGS,
  INITIAL_AJEER_CONFIG,
} from './data/initialData';
import { AjeerOfficialDocument } from './components/AjeerOfficialDocument';
import { AjeerMobileVerifyView } from './components/AjeerMobileVerifyView';
import { DocumentToolbar } from './components/DocumentToolbar';
import { AjeerDocumentEditorModal } from './components/AjeerDocumentEditorModal';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { PermitsList } from './components/PermitsList';
import { PermitModal } from './components/PermitModal';
import { WorkersList } from './components/WorkersList';
import { WorkerModal } from './components/WorkerModal';
import { EstablishmentsList } from './components/EstablishmentsList';
import { VerificationPortal } from './components/VerificationPortal';
import { FieldInspection } from './components/FieldInspection';
import { AdminSettings } from './components/AdminSettings';
import { AjeerIntegration } from './components/AjeerIntegration';
import { AuditReport } from './components/AuditReport';
import { getDaysRemaining } from './utils/helpers';

export default function App() {
  // Database states with LocalStorage persistence
  const [establishments, setEstablishments] = useState<Establishment[]>(() => {
    const saved = localStorage.getItem('ajeer_establishments');
    return saved ? JSON.parse(saved) : INITIAL_ESTABLISHMENTS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('ajeer_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [permits, setPermits] = useState<WorkPermit[]>(() => {
    const saved = localStorage.getItem('ajeer_permits');
    return saved ? JSON.parse(saved) : INITIAL_PERMITS;
  });

  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    const saved = localStorage.getItem('ajeer_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('ajeer_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [ajeerConfig, setAjeerConfig] = useState<AjeerApiConfig>(() => {
    const saved = localStorage.getItem('ajeer_config');
    return saved ? JSON.parse(saved) : INITIAL_AJEER_CONFIG;
  });

  // Custom Logos uploaded by user
  const [mohrsdLogoUrl, setMohrsdLogoUrl] = useState<string>(() => {
    return localStorage.getItem('ajeer_custom_mohrsd_logo') || '';
  });

  const [ajeerLogoUrl, setAjeerLogoUrl] = useState<string>(() => {
    return localStorage.getItem('ajeer_custom_ajeer_logo') || '';
  });

  // Selected Permit for Document View
  const [selectedPermitId, setSelectedPermitId] = useState<string>(() => {
    return permits[0]?.id || 'pmt-1';
  });

  // Contract Brief and Declarations customization
  const [contractBrief, setContractBrief] = useState<string>(() => {
    return (
      localStorage.getItem('ajeer_contract_brief') ||
      'تقديم خدمات مساندة وتشغيلية وإعارة عمالة بموجب عقد الخدمات المشترك المبرم بين الطرفين.'
    );
  });

  const [declarationsList, setDeclarationsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('ajeer_declarations_list');
    return saved
      ? JSON.parse(saved)
      : [
          'صحة جميع البيانات المسجلة في هذا التصريح ومطابقتها للعقد المبرم بين الطرفين.',
          'أن العامل المصرح له يعمل تحت إشراف المنشأة المستفيدة وفق المهنة المحددة في التصريح فقط.',
          'التزام المنشأة بصرف أجور العامل وتوفير الرعاية الصحية والتأمين الطبي وإصابات العمل طوال فترة سريان العقد والتصريح.',
          'عدم تمكين العامل من العمل لدى أي طرف ثالث غير المنشأة المستفيدة المذكورة في هذا التصريح.',
          'تقديم هذا التصريح للجهات المختصة عند طلبه لإثبات نظامية تواجد العامل في موقع العمل وعدم مخالفته لنظام العمل.',
        ];
  });

  // Modal State for editing document
  const [isDocEditorOpen, setIsDocEditorOpen] = useState(false);

  // App Routing:
  // - /verify/:token: Public isolated verification page (no toolbar, no admin buttons)
  // - /admin: Management dashboard and administrative tools
  // - /document/:id: Official printable A4 document view
  interface AppRoute {
    view: 'verify' | 'document' | 'admin';
    param: string;
  }

  const parseAppRoute = (): AppRoute => {
    if (typeof window === 'undefined') {
      return { view: 'document', param: '' };
    }
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // 1. Verify route
    if (pathname.startsWith('/verify') || searchParams.has('verify') || searchParams.has('token')) {
      let token = '';
      const match = pathname.match(/^\/verify\/?(.*)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1]);
      } else {
        token = searchParams.get('verify') || searchParams.get('token') || '';
      }
      return { view: 'verify', param: token };
    }

    // 2. Admin route
    if (pathname.startsWith('/admin') || searchParams.get('view') === 'admin') {
      return { view: 'admin', param: '' };
    }

    // 3. Document route
    if (pathname.startsWith('/document') || searchParams.get('view') === 'document') {
      let docId = '';
      const match = pathname.match(/^\/document\/?(.*)/);
      if (match && match[1]) {
        docId = decodeURIComponent(match[1]);
      } else {
        docId = searchParams.get('id') || searchParams.get('doc') || '';
      }
      return { view: 'document', param: docId };
    }

    return { view: 'document', param: '' };
  };

  const [route, setRoute] = useState<AppRoute>(parseAppRoute);

  const navigate = (view: 'verify' | 'document' | 'admin', param: string = '') => {
    let url = '/';
    if (view === 'verify') {
      url = param ? `/verify/${encodeURIComponent(param)}` : '/verify';
    } else if (view === 'document') {
      url = param ? `/document/${encodeURIComponent(param)}` : '/document';
    } else if (view === 'admin') {
      url = '/admin';
    }
    try {
      window.history.pushState({}, '', url);
    } catch (e) {
      console.error(e);
    }
    setRoute({ view, param });
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseAppRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync selected permit when document route specifies an id
  useEffect(() => {
    if (route.view === 'document' && route.param) {
      const found = permits.find(
        (p) =>
          p.id.toLowerCase() === route.param.toLowerCase() ||
          p.permitNumber.trim().toLowerCase() === route.param.trim().toLowerCase()
      );
      if (found) {
        setSelectedPermitId(found.id);
      }
    }
  }, [route, permits]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedVerifyPermitNumber, setSelectedVerifyPermitNumber] = useState<string>('');

  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState<WorkPermit | null>(null);

  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ajeer_establishments', JSON.stringify(establishments));
  }, [establishments]);

  useEffect(() => {
    localStorage.setItem('ajeer_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('ajeer_permits', JSON.stringify(permits));
  }, [permits]);

  useEffect(() => {
    localStorage.setItem('ajeer_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('ajeer_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ajeer_config', JSON.stringify(ajeerConfig));
  }, [ajeerConfig]);

  useEffect(() => {
    if (mohrsdLogoUrl) {
      localStorage.setItem('ajeer_custom_mohrsd_logo', mohrsdLogoUrl);
    } else {
      localStorage.removeItem('ajeer_custom_mohrsd_logo');
    }
  }, [mohrsdLogoUrl]);

  useEffect(() => {
    if (ajeerLogoUrl) {
      localStorage.setItem('ajeer_custom_ajeer_logo', ajeerLogoUrl);
    } else {
      localStorage.removeItem('ajeer_custom_ajeer_logo');
    }
  }, [ajeerLogoUrl]);

  useEffect(() => {
    localStorage.setItem('ajeer_contract_brief', contractBrief);
  }, [contractBrief]);

  useEffect(() => {
    localStorage.setItem('ajeer_declarations_list', JSON.stringify(declarationsList));
  }, [declarationsList]);

  // Current selected Permit & Entities for Document Rendering
  const currentPermit = permits.find((p) => p.id === selectedPermitId) || permits[0];
  const currentWorker =
    workers.find((w) => w.id === currentPermit?.workerId) ||
    workers[0] || {
      id: 'wrk-default',
      fullNameAr: 'محمد طارق العبدالله',
      fullNameEn: 'Mohammed Tariq',
      iqamaNumber: '2481928374',
      nationality: 'سوداني',
      profession: 'مهندس موقع',
      healthInsuranceStatus: 'active',
      phone: '0568912340',
      photoUrl: '',
      primaryEstablishmentId: 'est-1',
      birthDate: '1990-01-01',
      gender: 'male',
    };

  const currentIssuingEst =
    establishments.find((e) => e.id === currentPermit?.issuingEstablishmentId) ||
    establishments[0] || {
      id: 'est-1',
      nameAr: 'شركة الفنار للمقاولات العامة',
      nameEn: 'Al-Fanar Co.',
      crNumber: '1010294819',
      unifiedNumber700: '7001827364',
      activity: 'المقاولات العامة',
      city: 'الرياض',
      address: 'الرياض',
      phone: '0114920192',
      email: 'info@alfanar.sa',
      managerName: 'م. فهد العتيبي',
    };

  const currentHostEst =
    establishments.find((e) => e.id === currentPermit?.hostEstablishmentId) ||
    establishments[1] ||
    establishments[0] || {
      id: 'est-2',
      nameAr: 'شركة البحر الأحمر للتطوير العمراني',
      nameEn: 'Red Sea Dev.',
      crNumber: '4030192837',
      unifiedNumber700: '7002938475',
      activity: 'إدارة وتطوير المشاريع',
      city: 'جدة',
      address: 'جدة',
      phone: '0126938471',
      email: 'contact@redsea.sa',
      managerName: 'أ. سامي الزهراني',
    };

  const handlePrint = () => {
    window.print();
  };

  const handleResetLogos = () => {
    setMohrsdLogoUrl('');
    setAjeerLogoUrl('');
  };

  const [verifyPageTitle, setVerifyPageTitle] = useState(() => {
    return localStorage.getItem('ajeer_verify_title') || 'التصريح أُجْرِ لحلول الموارد البشرية';
  });

  const [verifyPageSubtitle, setVerifyPageSubtitle] = useState(() => {
    return localStorage.getItem('ajeer_verify_subtitle') || 'تم تحميل البيانات بنجاح';
  });

  const handleSaveDocEditor = (data: {
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
  }) => {
    // Update worker
    const updatedWorkers = workers.map((w) =>
      w.id === currentWorker.id
        ? {
            ...w,
            fullNameAr: data.workerName,
            iqamaNumber: data.iqamaNumber,
            profession: data.profession,
            nationality: data.nationality,
          }
        : w
    );
    setWorkers(updatedWorkers);

    // Update issuing establishment
    const updatedEstablishments = establishments.map((e) => {
      if (e.id === currentIssuingEst.id) {
        return {
          ...e,
          nameAr: data.issuingEstName,
          unifiedNumber700: data.issuingEst700,
        };
      }
      if (e.id === currentHostEst.id) {
        return {
          ...e,
          nameAr: data.hostEstName,
          unifiedNumber700: data.hostEst700,
        };
      }
      return e;
    });
    setEstablishments(updatedEstablishments);

    // Update permit
    const updatedPermits = permits.map((p) =>
      p.id === currentPermit.id
        ? {
            ...p,
            permitNumber: data.referenceNumber,
            authorizedProfession: data.profession,
            issueDate: data.issueDate,
            expiryDate: data.expiryDate,
            workLocations: [data.workLocation],
            status: data.status,
          }
        : p
    );
    setPermits(updatedPermits);

    // Update brief & declarations & titles
    setContractBrief(data.contractBrief);
    setDeclarationsList(data.declarationsList);
    setVerifyPageTitle(data.pageHeaderTitle);
    setVerifyPageSubtitle(data.pageHeaderSubtitle);
    localStorage.setItem('ajeer_verify_title', data.pageHeaderTitle);
    localStorage.setItem('ajeer_verify_subtitle', data.pageHeaderSubtitle);
  };

  // Full CRUD operations for System View
  const handleSavePermit = (permit: WorkPermit) => {
    const exists = permits.some((p) => p.id === permit.id);
    if (exists) {
      setPermits(permits.map((p) => (p.id === permit.id ? permit : p)));
    } else {
      setPermits([permit, ...permits]);
    }
    setIsPermitModalOpen(false);
    setEditingPermit(null);
  };

  const handleDeletePermit = (permitId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصريح؟')) {
      setPermits(permits.filter((p) => p.id !== permitId));
      if (selectedPermitId === permitId && permits.length > 1) {
        const next = permits.find((p) => p.id !== permitId);
        if (next) setSelectedPermitId(next.id);
      }
    }
  };

  const handleRenewPermit = (permitId: string) => {
    const pmt = permits.find((p) => p.id === permitId);
    if (!pmt) return;
    const currentExpiry = new Date(pmt.expiryDate);
    const newExpiry = new Date(currentExpiry.getTime() + 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const updated = {
      ...pmt,
      expiryDate: newExpiry,
      status: 'active' as const,
    };
    handleSavePermit(updated);
  };

  const handleRevokePermit = (permitId: string) => {
    const pmt = permits.find((p) => p.id === permitId);
    if (!pmt) return;
    const updated = {
      ...pmt,
      status: 'revoked' as const,
    };
    handleSavePermit(updated);
  };

  const handleSaveWorker = (worker: Worker) => {
    const exists = workers.some((w) => w.id === worker.id);
    if (exists) {
      setWorkers(workers.map((w) => (w.id === worker.id ? worker : w)));
    } else {
      setWorkers([worker, ...workers]);
    }
    setIsWorkerModalOpen(false);
    setEditingWorker(null);
  };

  const handleDeleteWorker = (workerId: string) => {
    if (window.confirm('هل تريد حذف هذا العامل؟')) {
      setWorkers(workers.filter((w) => w.id !== workerId));
    }
  };

  const handleSaveEstablishment = (est: Establishment) => {
    const exists = establishments.some((e) => e.id === est.id);
    if (exists) {
      setEstablishments(establishments.map((e) => (e.id === est.id ? est : e)));
    } else {
      setEstablishments([...establishments, est]);
    }
  };

  const handleDeleteEstablishment = (estId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المنشأة؟')) {
      setEstablishments(establishments.filter((e) => e.id !== estId));
    }
  };

  const handleAddInspection = (inspection: Omit<InspectionRecord, 'id'>) => {
    const newRecord: InspectionRecord = {
      id: `insp-${Date.now()}`,
      ...inspection,
    };
    setInspections([newRecord, ...inspections]);
  };

  const handleExportAllData = () => {
    const backupData = {
      establishments,
      workers,
      permits,
      inspections,
      settings,
      ajeerConfig,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ajeer_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    if (parsed.establishments) setEstablishments(parsed.establishments);
    if (parsed.workers) setWorkers(parsed.workers);
    if (parsed.permits) setPermits(parsed.permits);
    if (parsed.inspections) setInspections(parsed.inspections);
  };

  const handleResetToDefaults = () => {
    setEstablishments(INITIAL_ESTABLISHMENTS);
    setWorkers(INITIAL_WORKERS);
    setPermits(INITIAL_PERMITS);
    setInspections(INITIAL_INSPECTIONS);
    setSettings(INITIAL_SETTINGS);
    setAjeerConfig(INITIAL_AJEER_CONFIG);
    setMohrsdLogoUrl('');
    setAjeerLogoUrl('');
    localStorage.clear();
  };

  const expiringPermitsCount = permits.filter((p) => {
    const d = getDaysRemaining(p.expiryDate);
    return p.status === 'active' && d > 0 && d <= 30;
  }).length;

  // 1. ISOLATED PUBLIC VERIFICATION PAGE (Read-Only)
  // When scanned via QR code or opened via /verify/:token:
  // - ZERO black toolbar or administrative controls in React component tree
  // - ZERO empty placeholder spaces at the top
  // - Starts directly from the top header card:
  //   «التصريح أُجْرِ لحلول الموارد البشرية»
  //   «تم تحميل البيانات بنجاح»
  // - Followed by «معلومات التصريح»، «المنشأة المستفيدة»، «المنشأة المقدمة للخدمة»، and footer
  if (route.view === 'verify') {
    const targetPermit =
      (route.param
        ? permits.find(
            (p) =>
              p.permitNumber.trim().toLowerCase() === route.param.trim().toLowerCase() ||
              p.id.toLowerCase() === route.param.trim().toLowerCase()
          )
        : null) || currentPermit;

    const targetWorker =
      workers.find((w) => w.id === targetPermit.workerId) || currentWorker;

    const targetIssuingEst =
      establishments.find((e) => e.id === targetPermit.issuingEstablishmentId) ||
      currentIssuingEst;

    const targetHostEst =
      establishments.find((e) => e.id === targetPermit.hostEstablishmentId) ||
      currentHostEst;

    return (
      <AjeerMobileVerifyView
        permit={targetPermit}
        worker={targetWorker}
        issuingEst={targetIssuingEst}
        hostEst={targetHostEst}
        pageHeaderTitle={verifyPageTitle}
        pageHeaderSubtitle={verifyPageSubtitle}
        maskIdEnabled={settings.maskSensitiveData}
      />
    );
  }

  // 2. OFFICIAL PRINTABLE A4 DOCUMENT PAGE
  // Displays the exact 1:1 authentic A4 contract document with administrative toolbar for printing & editing
  if (route.view === 'document') {
    return (
      <div className="min-h-screen bg-[#d8d8d8] text-black">
        <DocumentToolbar
          permits={permits}
          selectedPermitId={selectedPermitId}
          onSelectPermit={(id) => {
            setSelectedPermitId(id);
            navigate('document', id);
          }}
          onOpenEditModal={() => setIsDocEditorOpen(true)}
          onPrint={handlePrint}
          onUploadMohrsdLogo={(url) => setMohrsdLogoUrl(url)}
          onUploadAjeerLogo={(url) => setAjeerLogoUrl(url)}
          onResetLogos={handleResetLogos}
          hasCustomLogos={!!mohrsdLogoUrl || !!ajeerLogoUrl}
          viewMode="document"
          onChangeViewMode={(mode) => {
            if (mode === 'mobile_verify') {
              navigate('verify', currentPermit?.permitNumber || currentPermit?.id);
            } else if (mode === 'admin') {
              navigate('admin');
            } else {
              navigate('document', selectedPermitId);
            }
          }}
        />

        <div className="py-4 md:py-8 px-2 flex justify-center">
          <div className="bg-white shadow-xl print:shadow-none">
            <AjeerOfficialDocument
              permit={currentPermit}
              worker={currentWorker}
              issuingEst={currentIssuingEst}
              hostEst={currentHostEst}
              mohrsdLogoUrl={mohrsdLogoUrl}
              ajeerLogoUrl={ajeerLogoUrl}
              contractBrief={contractBrief}
              declarationsList={declarationsList}
              referenceNumber={currentPermit?.permitNumber}
            />
          </div>
        </div>

        {/* Quick Document Editor Modal */}
        {isDocEditorOpen && (
          <AjeerDocumentEditorModal
            permit={currentPermit}
            worker={currentWorker}
            issuingEst={currentIssuingEst}
            hostEst={currentHostEst}
            contractBrief={contractBrief}
            declarationsList={declarationsList}
            referenceNumber={currentPermit?.permitNumber}
            pageHeaderTitle={verifyPageTitle}
            pageHeaderSubtitle={verifyPageSubtitle}
            onSave={handleSaveDocEditor}
            onClose={() => setIsDocEditorOpen(false)}
          />
        )}
      </div>
    );
  }

  // 3. FULL ADMINISTRATIVE PORTAL (/admin)
  return (
    <div className="bg-slate-100 min-h-screen">
      <Header
        settings={settings}
        onUpdateRole={(role: UserRole) => setSettings({ ...settings, currentRole: role })}
        onToggleMask={() => setSettings({ ...settings, maskSensitiveData: !settings.maskSensitiveData })}
        activeTab={activeTab}
        onOpenPublicVerify={() => navigate('verify', currentPermit?.permitNumber || currentPermit?.id)}
        onOpenDocument={() => navigate('document', selectedPermitId)}
      />
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        counts={{
          permits: permits.length,
          workers: workers.length,
          expiringPermits: expiringPermitsCount,
          inspections: inspections.length,
        }}
      />
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            permits={permits}
            workers={workers}
            establishments={establishments}
            inspections={inspections}
            settings={settings}
            onOpenNewPermit={() => {
              setEditingPermit(null);
              setIsPermitModalOpen(true);
            }}
            onOpenNewWorker={() => {
              setEditingWorker(null);
              setIsWorkerModalOpen(true);
            }}
            onSelectPermitForPrint={(pmt) => {
              setSelectedPermitId(pmt.id);
              navigate('document', pmt.id);
            }}
            onSelectPermitForVerify={(pmt) => {
              navigate('verify', pmt.permitNumber);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'permits' && (
          <PermitsList
            permits={permits}
            workers={workers}
            establishments={establishments}
            settings={settings}
            onOpenNewPermit={() => {
              setEditingPermit(null);
              setIsPermitModalOpen(true);
            }}
            onSelectPermitForPrint={(pmt) => {
              setSelectedPermitId(pmt.id);
              navigate('document', pmt.id);
            }}
            onSelectPermitForVerify={(pmt) => {
              navigate('verify', pmt.permitNumber);
            }}
            onEditPermit={(pmt) => {
              setEditingPermit(pmt);
              setIsPermitModalOpen(true);
            }}
            onDeletePermit={handleDeletePermit}
            onRenewPermit={handleRenewPermit}
            onRevokePermit={handleRevokePermit}
          />
        )}
        {activeTab === 'workers' && (
          <WorkersList
            workers={workers}
            establishments={establishments}
            permits={permits}
            settings={settings}
            onOpenNewWorker={() => {
              setEditingWorker(null);
              setIsWorkerModalOpen(true);
            }}
            onEditWorker={(worker) => {
              setEditingWorker(worker);
              setIsWorkerModalOpen(true);
            }}
            onDeleteWorker={handleDeleteWorker}
            onIssuePermitForWorker={(workerId) => {
              setEditingPermit({
                id: `pmt-${Date.now()}`,
                permitNumber: `AJR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                permitType: 'contractual',
                workerId,
                issuingEstablishmentId: establishments[0]?.id || '',
                hostEstablishmentId: establishments[1]?.id || establishments[0]?.id || '',
                authorizedProfession: workers.find((w) => w.id === workerId)?.profession || '',
                issueDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
                status: 'active',
                workLocations: ['موقع العمل الميداني الرئيسي'],
                contractNumber: `CTR-SA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                securityHash: `SHA256:${Math.random().toString(36).slice(2, 12)}`,
                qrVerificationCode: '',
                conditionsAndTerms: settings.defaultTerms,
                createdAt: new Date().toISOString(),
              });
              setIsPermitModalOpen(true);
            }}
          />
        )}
        {activeTab === 'establishments' && (
          <EstablishmentsList
            establishments={establishments}
            permits={permits}
            settings={settings}
            onSaveEstablishment={handleSaveEstablishment}
            onDeleteEstablishment={handleDeleteEstablishment}
          />
        )}
        {activeTab === 'verify' && (
          <VerificationPortal
            permits={permits}
            workers={workers}
            establishments={establishments}
            settings={settings}
            selectedPermitNumber={selectedVerifyPermitNumber}
            onPrintPermit={(pmt) => {
              setSelectedPermitId(pmt.id);
              navigate('document', pmt.id);
            }}
            onAddInspection={handleAddInspection}
          />
        )}
        {activeTab === 'inspection' && (
          <FieldInspection
            inspections={inspections}
            permits={permits}
            workers={workers}
            settings={settings}
            onAddInspection={handleAddInspection}
            onSelectPermitForVerify={(pmt) => {
              setSelectedVerifyPermitNumber(pmt.permitNumber);
              setActiveTab('verify');
            }}
          />
        )}
        {activeTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
            onExportAllData={handleExportAllData}
            onImportData={handleImportData}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
        {activeTab === 'ajeer-api' && (
          <AjeerIntegration
            config={ajeerConfig}
            permits={permits}
            workers={workers}
            onUpdateConfig={(newConfig) => setAjeerConfig(newConfig)}
          />
        )}
        {activeTab === 'audit-report' && (
          <AuditReport onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Global Modals for Full System Management */}
      {isPermitModalOpen && (
        <PermitModal
          permit={editingPermit}
          workers={workers}
          establishments={establishments}
          onSave={handleSavePermit}
          onClose={() => {
            setIsPermitModalOpen(false);
            setEditingPermit(null);
          }}
        />
      )}

      {isWorkerModalOpen && (
        <WorkerModal
          worker={editingWorker}
          establishments={establishments}
          onSave={handleSaveWorker}
          onClose={() => {
            setIsWorkerModalOpen(false);
            setEditingWorker(null);
          }}
        />
      )}
    </div>
  );
}
