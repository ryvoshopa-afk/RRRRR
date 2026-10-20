import React from 'react';

// Official Ministry of Human Resources and Social Development Logo (Vector Replica)
export const MohrsdLogo: React.FC<{ className?: string; customUrl?: string }> = ({
  className = 'h-14 w-auto object-contain',
  customUrl,
}) => {
  if (customUrl) {
    return <img src={customUrl} alt="وزارة الموارد البشرية والتنمية الاجتماعية" className={className} />;
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Emblem SVG */}
      <svg viewBox="0 0 160 60" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Palm Tree and Crossing Swords Graphic in Gold and Forest Green */}
        <g transform="translate(115, 6)">
          <path d="M22 2C21 5 19 8 16 10C19 12 21 15 22 18C23 15 25 12 28 10C25 8 23 5 22 2Z" fill="#1b6d38" />
          <path d="M12 9C15 11 18 13 18 16C15 17 12 18 8 17C10 14 11 11 12 9Z" fill="#1b6d38" />
          <path d="M32 9C33 11 34 14 36 17C32 18 29 17 26 16C26 13 29 11 32 9Z" fill="#1b6d38" />
          <path d="M14 20C17 21 19 23 19 26C16 27 13 27 10 26C11 24 12 22 14 20Z" fill="#1b6d38" />
          <path d="M30 20C32 22 33 24 34 26C31 27 28 27 25 26C25 23 27 21 30 20Z" fill="#1b6d38" />
          {/* Trunk */}
          <path d="M20 18H24V32H20V18Z" fill="#a37e2c" />
          {/* Curved Crossing Swords */}
          <path d="M9 36C15 36 24 33 32 28L30 26C23 30 15 33 9 33V36Z" fill="#a37e2c" />
          <path d="M35 36C29 36 20 33 12 28L14 26C21 30 29 33 35 33V36Z" fill="#a37e2c" />
          {/* Sword Handles */}
          <circle cx="8" cy="35" r="2" fill="#a37e2c" />
          <circle cx="36" cy="35" r="2" fill="#a37e2c" />
        </g>
        {/* Ministry Typography */}
        <text x="110" y="22" textAnchor="end" fill="#1b6d38" fontSize="11" fontWeight="bold" fontFamily="Arial, 'Noto Naskh Arabic', sans-serif">
          وزارة الموارد البشرية
        </text>
        <text x="110" y="36" textAnchor="end" fill="#a37e2c" fontSize="10" fontWeight="bold" fontFamily="Arial, 'Noto Naskh Arabic', sans-serif">
          والتنمية الاجتماعية
        </text>
        <text x="110" y="47" textAnchor="end" fill="#444444" fontSize="6.5" fontFamily="Arial, sans-serif">
          Ministry of Human Resources and Social Development
        </text>
      </svg>
    </div>
  );
};

// Official Ajeer Logo (Vector Replica)
export const AjeerLogo: React.FC<{ className?: string; customUrl?: string }> = ({
  className = 'h-11 w-auto object-contain',
  customUrl,
}) => {
  if (customUrl) {
    return <img src={customUrl} alt="شعار أجير Ajeer" className={className} />;
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <svg viewBox="0 0 110 45" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Modern geometric green Ajeer brandmark */}
        <g transform="translate(4, 4)">
          {/* Logo Icon */}
          <path d="M8 32V10L19 4L30 10V32L19 38L8 32Z" stroke="#009639" strokeWidth="2.5" fill="none" />
          <path d="M19 4V38" stroke="#009639" strokeWidth="2" strokeDasharray="2 2" />
          <circle cx="19" cy="18" r="4" fill="#009639" />
          {/* Brand Wordmark in Arabic & English */}
          <text x="38" y="24" fill="#009639" fontSize="21" fontWeight="800" fontFamily="Arial, 'Noto Naskh Arabic', sans-serif">
            أجـيـر
          </text>
          <text x="39" y="34" fill="#666666" fontSize="8.5" fontWeight="600" letterSpacing="1" fontFamily="Arial, sans-serif">
            AJEER
          </text>
        </g>
      </svg>
    </div>
  );
};
