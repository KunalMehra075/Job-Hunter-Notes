// Abstract, colorful SVG of a person writing a note — brand violet/blue palette.
const LoginArt = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 560 680"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Illustration of a person writing a reusable note"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6D28FF" />
        <stop offset="55%" stopColor="#5B3CF0" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5FF" />
      </linearGradient>
      <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C5CFC" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="560" height="680" fill="url(#bg)" />

    {/* Abstract decor */}
    <circle cx="450" cy="120" r="150" fill="#FFFFFF" opacity="0.07" />
    <circle cx="90" cy="560" r="170" fill="#FFFFFF" opacity="0.06" />
    <circle cx="470" cy="540" r="70" fill="#EC4899" opacity="0.30" />
    <circle cx="70" cy="120" r="46" fill="#F59E0B" opacity="0.30" />
    <circle cx="500" cy="300" r="14" fill="#FBBF24" opacity="0.7" />
    <circle cx="60" cy="330" r="10" fill="#F472B6" opacity="0.8" />
    <circle cx="430" cy="430" r="230" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.12" />

    {/* Floating variable chips */}
    <g opacity="0.95">
      <g transform="rotate(-8 430 180)">
        <rect x="378" y="160" width="104" height="40" rx="12" fill="#FFFFFF" opacity="0.9" />
        <text x="430" y="185" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="17" fontWeight="700" fill="#6D28FF">{"{{name}}"}</text>
      </g>
      <g transform="rotate(7 120 250)">
        <rect x="58" y="230" width="124" height="40" rx="12" fill="#FFFFFF" opacity="0.9" />
        <text x="120" y="255" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="17" fontWeight="700" fill="#3B82F6">{"{{email}}"}</text>
      </g>
    </g>

    {/* Soft shadow under note */}
    <ellipse cx="330" cy="540" rx="170" ry="26" fill="#1E1B4B" opacity="0.18" />

    {/* Note card */}
    <g transform="rotate(5 350 380)">
      <rect x="232" y="248" width="252" height="272" rx="22" fill="url(#card)" />
      {/* title chip */}
      <rect x="260" y="284" width="120" height="26" rx="13" fill="#6D28FF" />
      <text x="320" y="303" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="14" fontWeight="700" fill="#FFFFFF">{"{{name}}"}</text>
      {/* text lines */}
      <rect x="260" y="332" width="196" height="12" rx="6" fill="#E2E8F0" />
      <rect x="260" y="356" width="168" height="12" rx="6" fill="#E2E8F0" />
      {/* company chip inline */}
      <rect x="260" y="384" width="92" height="22" rx="11" fill="#3B82F6" opacity="0.9" />
      <rect x="360" y="388" width="96" height="12" rx="6" fill="#E2E8F0" />
      <rect x="260" y="420" width="180" height="12" rx="6" fill="#E2E8F0" />
      <rect x="260" y="444" width="120" height="12" rx="6" fill="#E2E8F0" />
    </g>

    {/* Person */}
    <g>
      {/* neck (its base is tucked under the shirt collar below) */}
      <rect x="167" y="376" width="44" height="96" rx="20" fill="#F1B98E" />
      {/* head */}
      <circle cx="189" cy="344" r="48" fill="#FBD3B4" />
      {/* hair */}
      <path
        d="M141 346 C141 296 168 282 192 282 C222 282 240 306 240 338 C240 324 226 316 208 316 C216 330 212 344 197 346 C186 324 167 320 152 332 C148 338 144 343 141 346 Z"
        fill="#2E1065"
      />
      {/* torso / shoulders — overlaps the neck base so they connect seamlessly */}
      <path
        d="M84 600 C84 476 130 438 189 438 C248 438 294 476 294 600 Z"
        fill="url(#shirt)"
      />
      {/* arm reaching to the note + hand + pen */}
      <path
        d="M250 486 C300 466 332 442 360 420"
        fill="none"
        stroke="url(#shirt)"
        strokeWidth="32"
        strokeLinecap="round"
      />
      <circle cx="366" cy="416" r="16" fill="#FBD3B4" />
      <g transform="rotate(42 372 414)">
        <rect x="366" y="396" width="13" height="62" rx="6" fill="#1E293B" />
        <rect x="366" y="396" width="13" height="17" rx="6" fill="#F59E0B" />
        <path d="M366 458 L372.5 472 L379 458 Z" fill="#1E293B" />
      </g>
    </g>
  </svg>
);

export default LoginArt;
