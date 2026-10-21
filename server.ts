import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Ensure data directory exists
const DATA_DIR = path.resolve('data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Memory Database structure
interface DBStructure {
  adminAccount: {
    username: string;
    passwordHash: string;
    fullName: string;
    createdAt: string;
  } | null;
  sessions: Record<string, { username: string; expiresAt: number }>;
  workers: any[];
  establishments: any[];
  permits: any[];
  settings: any;
  auditLogs: {
    id: string;
    action: string;
    details: string;
    user: string;
    timestamp: string;
    ip?: string;
  }[];
}

// Initial default database state
function getInitialDB(): DBStructure {
  return {
    adminAccount: null,
    sessions: {},
    workers: [
      {
        id: 'wrk-ref-ibrahim',
        iqamaNumber: '2596858304',
        borderNumber: '3948271625',
        passportNumber: 'A89230192',
        fullNameAr: 'إبراهيم حامد عبد الحليم الحضري',
        fullNameEn: 'Ibrahim Hamed Abdelhalim El-Hadary',
        nationality: 'مصر',
        profession: 'عامل تحميل وتنزيل',
        gender: 'male',
        birthDate: '1992-04-15',
        phone: '0568912340',
        healthInsuranceStatus: 'active',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        primaryEstablishmentId: 'est-ref-provider',
        status: 'active',
        notes: 'تصريح عمل تعاقدي لخدمات التحميل والتنزيل',
      },
      {
        id: 'wrk-1',
        iqamaNumber: '2481928374',
        borderNumber: '3948271625',
        passportNumber: 'P89230192',
        fullNameAr: 'كمال الدين عبد الرحيم عثمان',
        fullNameEn: 'Kamal Eldin Abdelrahim Osman',
        nationality: 'سوداني',
        profession: 'مهندس موقع ميكانيكي',
        gender: 'male',
        birthDate: '1989-06-14',
        phone: '0568912340',
        healthInsuranceStatus: 'active',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        primaryEstablishmentId: 'est-1',
        status: 'active',
        notes: 'حاصل على اعتماد الهيئة السعودية للمهندسين - ساري المفعول حتى 2027',
      },
    ],
    establishments: [
      {
        id: 'est-ref-beneficiary',
        nameAr: 'شركة السبق العربي للتجارة والمقاولات',
        nameEn: 'Arab Precedence Trading & Contracting Co.',
        crNumber: '1010385921',
        unifiedNumber700: '7003859210',
        activity: 'المقاولات العامة والإنشاءات والتشييد',
        city: 'الرياض',
        address: 'طريق الملك فهد، حي الصحافة، الرياض',
        phone: '0112345678',
        email: 'info@alsabaq.sa',
        managerName: 'أ. خالد بن سلطان بن عبد العزيز',
      },
      {
        id: 'est-ref-provider',
        nameAr: 'مؤسسة قمة العاصمة للمقاولات العامة',
        nameEn: 'Qimmat Al-Aasima General Contracting Est.',
        crNumber: '1010492817',
        unifiedNumber700: '7004928176',
        activity: 'المقاولات العامة للمباني والصيانة والتشغيل',
        city: 'الرياض',
        address: 'حي العليا، طريق العروبة، الرياض',
        phone: '0119876543',
        email: 'contact@qimmat-alaasima.sa',
        managerName: 'م. فهد بن محمد الشمري',
      },
    ],
    permits: [
      {
        id: 'pmt-ref-wt3853097',
        permitNumber: 'WT3853097',
        permitType: 'contractual',
        workerId: 'wrk-ref-ibrahim',
        issuingEstablishmentId: 'est-ref-provider',
        hostEstablishmentId: 'est-ref-beneficiary',
        authorizedProfession: 'عامل تحميل وتنزيل',
        issueDate: '2026-09-30',
        expiryDate: '2027-03-30',
        status: 'active',
        verificationToken: 'WT3853097',
        verificationDisabled: false,
        workLocations: ['مواقع العمل المعتمدة لشركة السبق العربي للتجارة والمقاولات'],
        contractNumber: 'CTR-AJEER-2026-WT3853097',
        securityHash: 'c7a419b882e3f421a99564177b912c3f8101a882419a4bc71029e91823719284',
        qrVerificationCode: 'https://ajeer.com.sa/verify-permit?ref=WT3853097',
        conditionsAndTerms: [
          'يقتصر عمل العامل المصرح له فقط على نطاق المواقع والمشاريع المحددة في هذا التصريح.',
          'يحظر على المنشأة المستفيدة تشغيل العامل في غير المهنة المصرح بها في سجلات الوزارة.',
        ],
        createdAt: '2026-09-30T00:00:00Z',
      },
    ],
    settings: {
      platformName: 'منصة تصاريح العمل وأجير - نظام الإدارة المشفر',
      ministryName: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      vision2030Text: 'رؤية المملكة 2030',
      headerBadgeText: 'تصريح عمل تعاقدي معتمد - أجير',
      footerNoticeText: 'هذا التصريح صادر وفق الضوابط واللوائح المعتمدة بنظام العمل بالمملكة العربية السعودية.',
      defaultTerms: ['يقتصر عمل العامل المصرح له على المواقع المذكورة فقط.'],
      maskSensitiveData: false,
      footerLogos: ['/logos/logo-takamol.svg', '/logos/logo-mohrsd.svg', '/logos/logo-vision2030.svg'],
      footerLogo1: '/logos/logo-takamol.svg',
      footerLogo2: '/logos/logo-mohrsd.svg',
      footerLogo3: '/logos/logo-vision2030.svg',
    },
    auditLogs: [],
  };
}

let db: DBStructure;
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
    if (!db.settings.footerLogos || !db.settings.footerLogos.some((l: string) => l && l.trim())) {
      db.settings.footerLogos = ['/logos/logo-takamol.svg', '/logos/logo-mohrsd.svg', '/logos/logo-vision2030.svg'];
      db.settings.footerLogo1 = '/logos/logo-takamol.svg';
      db.settings.footerLogo2 = '/logos/logo-mohrsd.svg';
      db.settings.footerLogo3 = '/logos/logo-vision2030.svg';
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
  } else {
    db = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }
} catch (e) {
  console.error('Error loading db file, falling back to initial', e);
  db = getInitialDB();
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db to disk:', err);
  }
}

// Middleware
app.use(express.json({ limit: '20mb' }));

// Auth Token Verification Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح: يلزم تسجيل الدخول كمسؤول' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    if (session) delete db.sessions[token];
    return res.status(401).json({ error: 'جلسة تسجيل الدخول منتهية، يرجى إعادة تسجيل الدخول' });
  }

  (req as any).adminUser = session.username;
  next();
}

// ---------------- API ROUTES ----------------

// 1. Auth Status Check
app.get('/api/auth/status', (req: Request, res: Response) => {
  const hasAdmin = !!db.adminAccount;
  const authHeader = req.headers.authorization;
  let isAuthenticated = false;
  let username: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = db.sessions[token];
    if (session && session.expiresAt > Date.now()) {
      isAuthenticated = true;
      username = session.username;
    }
  }

  res.json({
    hasAdmin,
    isAuthenticated,
    user: username,
    adminFullName: db.adminAccount?.fullName,
  });
});

// 2. Setup First Admin (Self-registration allowed ONLY ONCE when no admin exists)
app.post('/api/auth/setup-admin', (req: Request, res: Response) => {
  if (db.adminAccount) {
    return res.status(403).json({ error: 'تم تهيئة حساب المسؤول مسبقاً. التسجيل الذاتي مغلق.' });
  }

  const { username, passwordHash, fullName } = req.body;
  if (!username || !passwordHash || !fullName) {
    return res.status(400).json({ error: 'يرجى تقديم كافة بيانات حساب المسؤول' });
  }

  db.adminAccount = {
    username: String(username).trim(),
    passwordHash: String(passwordHash),
    fullName: String(fullName).trim(),
    createdAt: new Date().toISOString(),
  };

  // Generate secure token
  const token = `adm_${crypto.randomBytes(32).toString('hex')}`;
  db.sessions[token] = {
    username: db.adminAccount.username,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'تهيئة حساب المسؤول الأول',
    details: `تم إنشاء وتثبيت حساب المسؤول: ${db.adminAccount.username}`,
    user: db.adminAccount.username,
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });

  saveDB();
  res.json({ success: true, token, user: db.adminAccount.username, fullName: db.adminAccount.fullName });
});

// 3. Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  if (!db.adminAccount) {
    return res.status(400).json({ error: 'لم يتم تهيئة حساب المسؤول بعد. يرجى تهيئة الحساب الأول.' });
  }

  const { username, passwordHash } = req.body;
  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
  }

  if (
    db.adminAccount.username.toLowerCase() === String(username).trim().toLowerCase() &&
    db.adminAccount.passwordHash === String(passwordHash)
  ) {
    const token = `adm_${crypto.randomBytes(32).toString('hex')}`;
    db.sessions[token] = {
      username: db.adminAccount.username,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'تسجيل دخول مسؤول',
      details: `تسجيل دخول ناجح للمسؤول: ${db.adminAccount.username}`,
      user: db.adminAccount.username,
      timestamp: new Date().toISOString(),
      ip: req.ip,
    });

    saveDB();
    return res.json({
      success: true,
      token,
      user: db.adminAccount.username,
      fullName: db.adminAccount.fullName,
    });
  }

  res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

// 4. Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    delete db.sessions[token];
    saveDB();
  }
  res.json({ success: true });
});

// 5. PUBLIC QR VERIFICATION ENDPOINT (/api/public/verify/:token)
// Read-Only, strictly returns published permit data, zero administrative leaks!
app.get('/api/public/verify/:token', (req: Request, res: Response) => {
  const token = req.params.token.trim().toLowerCase();

  // Find permit matching token, permitNumber, or id
  const permit = db.permits.find(
    (p) =>
      (p.verificationToken && p.verificationToken.trim().toLowerCase() === token) ||
      p.permitNumber.trim().toLowerCase() === token ||
      p.id.toLowerCase() === token
  );

  if (!permit) {
    return res.status(404).json({
      success: false,
      error: 'عذراً، التصريح غير موجود أو أن رابط التحقق غير صالح أو غير معتمد.',
    });
  }

  if (permit.verificationDisabled) {
    return res.status(403).json({
      success: false,
      error: 'تم تعطيل رابط التحقق لهذا التصريح من قبل إدارة المؤسسة.',
    });
  }

  const worker = db.workers.find((w) => w.id === permit.workerId);
  const issuingEst = db.establishments.find((e) => e.id === permit.issuingEstablishmentId);
  const hostEst = db.establishments.find((e) => e.id === permit.hostEstablishmentId);

  // Return strictly sanitized public fields
  res.json({
    success: true,
    permit: {
      permitNumber: permit.permitNumber,
      permitType: permit.permitType,
      issueDate: permit.issueDate,
      expiryDate: permit.expiryDate,
      status: permit.status,
      authorizedProfession: permit.authorizedProfession,
      workLocations: permit.workLocations,
      conditionsAndTerms: permit.conditionsAndTerms,
      contractNumber: permit.contractNumber,
    },
    worker: worker
      ? {
          fullNameAr: worker.fullNameAr,
          iqamaNumber: worker.iqamaNumber,
          profession: worker.profession,
          nationality: worker.nationality,
        }
      : null,
    issuingEst: issuingEst
      ? {
          nameAr: issuingEst.nameAr,
          unifiedNumber700: issuingEst.unifiedNumber700,
        }
      : null,
    hostEst: hostEst
      ? {
          nameAr: hostEst.nameAr,
          unifiedNumber700: hostEst.unifiedNumber700,
        }
      : null,
    footerLogos: db.settings.footerLogos || [
      db.settings.footerLogo1 || '',
      db.settings.footerLogo2 || '',
      db.settings.footerLogo3 || '',
    ],
  });
});

// ---------------- PROTECTED ADMIN DATA ROUTES ----------------

// Get all admin data
app.get('/api/admin/data', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    workers: db.workers,
    establishments: db.establishments,
    permits: db.permits,
    settings: db.settings,
    auditLogs: db.auditLogs,
  });
});

// Save / Update Workers
app.post('/api/admin/workers', requireAdminAuth, (req: Request, res: Response) => {
  const worker = req.body;
  if (!worker.id) worker.id = `wrk-${Date.now()}`;
  db.workers = [worker, ...db.workers.filter((w) => w.id !== worker.id)];

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'تسجيل/تعديل عامل',
    details: `تم تحديث بيانات العامل: ${worker.fullNameAr} (${worker.iqamaNumber})`,
    user: (req as any).adminUser,
    timestamp: new Date().toISOString(),
  });

  saveDB();
  res.json({ success: true, worker });
});

app.delete('/api/admin/workers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const worker = db.workers.find((w) => w.id === id);
  db.workers = db.workers.filter((w) => w.id !== id);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'حذف سجل عامل',
    details: `تم حذف العامل: ${worker?.fullNameAr || id}`,
    user: (req as any).adminUser,
    timestamp: new Date().toISOString(),
  });

  saveDB();
  res.json({ success: true });
});

// Save / Update Permits
app.post('/api/admin/permits', requireAdminAuth, (req: Request, res: Response) => {
  const permit = req.body;
  if (!permit.id) permit.id = `pmt-${Date.now()}`;
  db.permits = [permit, ...db.permits.filter((p) => p.id !== permit.id)];

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'إصدار/تعديل تصريح',
    details: `تم تحديث التصريح: ${permit.permitNumber} - الحالة: ${permit.status}`,
    user: (req as any).adminUser,
    timestamp: new Date().toISOString(),
  });

  saveDB();
  res.json({ success: true, permit });
});

app.delete('/api/admin/permits/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const pmt = db.permits.find((p) => p.id === id);
  db.permits = db.permits.filter((p) => p.id !== id);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'حذف تصريح',
    details: `تم حذف التصريح: ${pmt?.permitNumber || id}`,
    user: (req as any).adminUser,
    timestamp: new Date().toISOString(),
  });

  saveDB();
  res.json({ success: true });
});

// Update Settings (including 3 Footer Logos)
app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const newSettings = req.body;
  db.settings = {
    ...db.settings,
    ...newSettings,
  };

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'تحديث إعدادات وشعارات المنصة',
    details: 'تم حفظ وتحديث إعدادات المنظومة والشعارات السفلية لصفحة التحقق',
    user: (req as any).adminUser,
    timestamp: new Date().toISOString(),
  });

  saveDB();
  res.json({ success: true, settings: db.settings });
});

// Reset to Defaults
app.post('/api/admin/reset', requireAdminAuth, (req: Request, res: Response) => {
  const currentAdmin = db.adminAccount;
  const currentSessions = db.sessions;
  db = getInitialDB();
  db.adminAccount = currentAdmin;
  db.sessions = currentSessions;
  saveDB();
  res.json({ success: true });
});

// ---------------- VITE / FRONTEND SERVING ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
}

startServer();
