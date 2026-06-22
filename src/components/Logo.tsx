export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="sellthem-mark"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fbbf24" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#sellthem-mark)" />
      {/* Étiquette de prix */}
      <g transform="rotate(-45 20 20)">
        <rect x="9" y="14" width="22" height="12" rx="3.5" fill="white" />
        <circle cx="13.6" cy="20" r="2.2" fill="url(#sellthem-mark)" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-gray-900">Sell</span>
      <span className="text-brand-600">Them</span>
    </span>
  );
}

export function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <Wordmark className="text-xl" />
    </span>
  );
}
