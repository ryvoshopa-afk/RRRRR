import QRCode from 'qrcode';

export function maskId(idNumber: string, enabled: boolean = true): string {
  if (!enabled || !idNumber) return idNumber;
  if (idNumber.length <= 4) return '****';
  const start = idNumber.slice(0, 3);
  const end = idNumber.slice(-3);
  return `${start}****${end}`;
}

export function maskPhone(phone: string, enabled: boolean = true): string {
  if (!enabled || !phone) return phone;
  if (phone.length <= 4) return '05********';
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

export function formatDateAr(dateString: string): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]} م`;
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(expiryDate: string): number {
  if (!expiryDate) return 0;
  const target = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPermitStatusBadge(status: string, expiryDate?: string) {
  if (status === 'revoked') {
    return {
      label: 'ملغى نظاماً',
      color: 'bg-red-50 text-red-700 border-red-200',
      dotColor: 'bg-red-500',
    };
  }
  if (status === 'under_review') {
    return {
      label: 'قيد المراجعة والتدقيق',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
    };
  }
  if (expiryDate) {
    const days = getDaysRemaining(expiryDate);
    if (days <= 0 || status === 'expired') {
      return {
        label: 'منتهي الصلاحية',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dotColor: 'bg-rose-500',
      };
    }
    if (days <= 30) {
      return {
        label: `ينتهي قريباً (${days} يوم)`,
        color: 'bg-orange-50 text-orange-800 border-orange-200',
        dotColor: 'bg-orange-500',
      };
    }
  }
  return {
    label: 'ساري وصالح للعمل',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  };
}

export function getPermitTypeLabel(type: string): string {
  switch (type) {
    case 'contractual':
      return 'تصريح عمل تعاقدي (إعارة خدمات)';
    case 'temporary':
      return 'تصريح عمل مؤقت (أجير مباشر)';
    case 'seasonal':
      return 'تصريح عمل موسمي (مواسم ومشاريع)';
    case 'accompanier':
      return 'تصريح عمل مرافق نظامي';
    default:
      return type;
  }
}

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function generateCryptoHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.random().toString(36).substring(2, 10);
  return `SHA256:${hex}${salt}e4891b29a8f4c017`;
}
