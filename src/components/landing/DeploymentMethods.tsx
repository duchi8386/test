import Reveal from "@/components/Reveal";
import illu1 from "@/assets/illu/1.png";
import illu2 from "@/assets/illu/2.jpeg";
import illu3 from "@/assets/illu/3.jpeg";
import illu4 from "@/assets/illu/4.jpeg";
import illu5 from "@/assets/illu/5.jpeg";
import illu6 from "@/assets/illu/6.jpeg";

/* ─── Design tokens — mirrors site's gold / ivory system ─────────────────── */
const G = {
  gold: "#c9a96e",
  goldMid: "#d4a853",
  goldDp: "#a07d3c",
  goldLt: "#e8d5b0",
  goldPle: "#f0e2c0",
  cream: "#fdf8f0",
  ivoryBg: "#faf5ed",
  skin: "#f5cba7",
  darkMd: "#5c3d10",
  dark: "#2a1a06",
  white: "#ffffff",
  shadow: "rgba(180,130,50,0.15)",
};

/* ══════════════════════════════════════════════════════════
   ILLUSTRATIONS  (viewBox 200 × 160, consistent across all)
══════════════════════════════════════════════════════════ */

const IlluSocial = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <ellipse cx="100" cy="150" rx="70" ry="9" fill={G.goldLt} opacity=".35" />
    {/* tilted back-phone */}
    <g transform="rotate(-14,68,88)">
      <rect
        x="46"
        y="52"
        width="44"
        height="72"
        rx="8"
        fill={G.goldPle}
        stroke={G.goldDp}
        strokeWidth="1.5"
      />
      <rect x="50" y="59" width="36" height="40" rx="4" fill={G.goldLt} />
      <circle cx="68" cy="106" r="4" fill={G.goldDp} opacity=".4" />
    </g>
    {/* main phone */}
    <rect
      x="84"
      y="22"
      width="52"
      height="90"
      rx="10"
      fill={G.white}
      stroke={G.gold}
      strokeWidth="2"
    />
    <rect x="89" y="31" width="42" height="54" rx="5" fill={G.ivoryBg} />
    <rect x="91" y="33" width="18" height="24" rx="3" fill={G.goldLt} />
    <rect
      x="111"
      y="33"
      width="18"
      height="24"
      rx="3"
      fill={G.goldMid}
      opacity=".55"
    />
    <rect x="91" y="59" width="38" height="23" rx="3" fill={G.goldPle} />
    <ellipse cx="110" cy="68" rx="7" ry="9" fill={G.gold} opacity=".4" />
    <circle cx="110" cy="63" r="4" fill={G.skin} opacity=".75" />
    <rect x="89" y="88" width="30" height="5" rx="2.5" fill={G.goldLt} />
    <rect x="89" y="88" width="19" height="5" rx="2.5" fill={G.gold} />
    <circle
      cx="110"
      cy="105"
      r="4"
      fill={G.goldLt}
      stroke={G.gold}
      strokeWidth="1"
    />
    {/* person */}
    <circle cx="110" cy="97" r="10" fill={G.skin} />
    <path d="M100 93 q10-13 20 0" fill={G.darkMd} />
    <path d="M96 136 q-4-26 6-30 h16 q10 4 6 30z" fill={G.goldMid} />
    <path
      d="M96 112 q-10-7-6-20"
      stroke={G.skin}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* engagement bubbles */}
    <g transform="translate(150,44)">
      <circle
        r="15"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh1)"
      />
      <path
        d="M-5 0 C-5-4 0-7 0-2 C0-7 5-4 5 0 C5 4 0 8 0 8 S-5 4-5 0z"
        fill="#e87878"
        opacity=".85"
      />
    </g>
    <g transform="translate(54,65)">
      <rect
        x="-14"
        y="-12"
        width="28"
        height="20"
        rx="8"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh1)"
      />
      <path
        d="M-5 8 l5 7 l5-7"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="-9" y="-5" width="18" height="3" rx="1.5" fill={G.goldLt} />
      <rect x="-9" y="1" width="12" height="3" rx="1.5" fill={G.goldPle} />
    </g>
    <g transform="translate(162,92)">
      <circle
        r="13"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh1)"
      />
      <circle cx="-4" cy="0" r="2.5" fill={G.gold} opacity=".7" />
      <circle cx="4" cy="-4" r="2.5" fill={G.gold} opacity=".7" />
      <circle cx="4" cy="4" r="2.5" fill={G.gold} opacity=".7" />
      <line
        x1="-2"
        y1="-1"
        x2="3"
        y2="-4"
        stroke={G.goldDp}
        strokeWidth="1"
        opacity=".5"
      />
      <line
        x1="-2"
        y1="1"
        x2="3"
        y2="4"
        stroke={G.goldDp}
        strokeWidth="1"
        opacity=".5"
      />
    </g>
    <path
      d="M150 22 l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"
      fill={G.goldMid}
      opacity=".7"
    />
    <path
      d="M50 44 l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"
      fill={G.goldLt}
      opacity=".8"
    />
    <defs>
      <filter id="sh1">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={G.shadow} />
      </filter>
    </defs>
  </svg>
);

const IlluCheckin = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <ellipse cx="100" cy="150" rx="70" ry="9" fill={G.goldLt} opacity=".35" />
    <rect x="34" y="72" width="132" height="80" rx="6" fill={G.goldPle} />
    <rect
      x="34"
      y="72"
      width="132"
      height="22"
      rx="6"
      fill={G.goldMid}
      opacity=".45"
    />
    <rect
      x="58"
      y="75"
      width="84"
      height="16"
      rx="4"
      fill={G.white}
      opacity=".8"
    />
    <rect x="64" y="80" width="22" height="4" rx="2" fill={G.gold} />
    <rect x="90" y="80" width="28" height="4" rx="2" fill={G.goldLt} />
    <rect
      x="84"
      y="107"
      width="32"
      height="45"
      rx="4"
      fill={G.goldDp}
      opacity=".3"
    />
    <circle cx="112" cy="130" r="2" fill={G.gold} opacity=".9" />
    <rect
      x="42"
      y="98"
      width="28"
      height="22"
      rx="3"
      fill={G.white}
      opacity=".6"
    />
    <rect
      x="130"
      y="98"
      width="28"
      height="22"
      rx="3"
      fill={G.white}
      opacity=".6"
    />
    <line x1="56" y1="98" x2="56" y2="120" stroke={G.goldLt} strokeWidth="1" />
    <line x1="42" y1="109" x2="70" y2="109" stroke={G.goldLt} strokeWidth="1" />
    <line
      x1="144"
      y1="98"
      x2="144"
      y2="120"
      stroke={G.goldLt}
      strokeWidth="1"
    />
    <line
      x1="130"
      y1="109"
      x2="158"
      y2="109"
      stroke={G.goldLt}
      strokeWidth="1"
    />
    {/* person */}
    <circle cx="100" cy="89" r="11" fill={G.skin} />
    <path d="M89 85 q11-14 22 0" fill={G.dark} />
    <path d="M88 152 q-2-26 6-30 h12 q8 4 6 30z" fill={G.gold} />
    <path
      d="M88 115 q-14-4-10-17"
      stroke={G.skin}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M112 115 q14-4 10-17"
      stroke={G.skin}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x="114"
      y="93"
      width="13"
      height="20"
      rx="3"
      fill={G.white}
      stroke={G.goldDp}
      strokeWidth="1.5"
    />
    <rect x="116" y="96" width="9" height="12" rx="2" fill={G.goldLt} />
    {/* pin */}
    <path
      d="M100 8 C89 8 78 18 78 29 C78 43 100 58 100 58 C100 58 122 43 122 29 C122 18 111 8 100 8Z"
      fill={G.gold}
      opacity=".9"
    />
    <circle cx="100" cy="29" r="9" fill={G.white} />
    <circle cx="100" cy="29" r="4.5" fill={G.gold} />
    <circle
      cx="100"
      cy="29"
      r="22"
      stroke={G.gold}
      strokeWidth="1.5"
      opacity=".22"
      fill="none"
    />
    <circle
      cx="100"
      cy="29"
      r="30"
      stroke={G.gold}
      strokeWidth="1"
      opacity=".1"
      fill="none"
    />
    <path
      d="M40 60 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z"
      fill={G.goldMid}
      opacity=".7"
    />
    <path
      d="M157 52 l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
      fill={G.goldLt}
    />
  </svg>
);

const IlluViral = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <ellipse cx="100" cy="150" rx="70" ry="9" fill={G.goldLt} opacity=".35" />
    <line
      x1="90"
      y1="108"
      x2="68"
      y2="148"
      stroke={G.goldDp}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="90"
      y1="108"
      x2="90"
      y2="148"
      stroke={G.goldDp}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="90"
      y1="108"
      x2="112"
      y2="148"
      stroke={G.goldDp}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <rect x="58" y="72" width="64" height="40" rx="8" fill={G.dark} />
    <rect x="62" y="76" width="56" height="32" rx="6" fill={G.darkMd} />
    <circle
      cx="86"
      cy="92"
      r="17"
      fill={G.dark}
      stroke={G.goldDp}
      strokeWidth="2"
    />
    <circle cx="86" cy="92" r="12" fill={G.darkMd} />
    <circle cx="86" cy="92" r="6" fill="#12121e" />
    <circle cx="83" cy="89" r="2.5" fill={G.white} opacity=".28" />
    <rect
      x="108"
      y="78"
      width="18"
      height="11"
      rx="3"
      fill={G.goldDp}
      opacity=".7"
    />
    <circle cx="116" cy="100" r="5.5" fill="#d94040" opacity=".85" />
    <circle cx="116" cy="100" r="3" fill="#ff6060" opacity=".7" />
    <rect
      x="60"
      y="78"
      width="16"
      height="8"
      rx="2"
      fill="#d94040"
      opacity=".8"
    />
    <text
      x="68"
      y="85"
      textAnchor="middle"
      fontSize="5.5"
      fontWeight="bold"
      fill={G.white}
      fontFamily="sans-serif"
    >
      REC
    </text>
    {/* person */}
    <circle cx="150" cy="64" r="13" fill={G.skin} />
    <path d="M137 60 q13-16 26 0" fill={G.dark} />
    <path
      d="M137 74 q-2-8 6-11 h14 q8 3 6 11 l-4 38-2 38h-14l-2-38z"
      fill={G.goldMid}
    />
    <path
      d="M137 76 q-14-2-12-18"
      stroke={G.skin}
      strokeWidth="6.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* play bubbles */}
    <g transform="translate(30,45)">
      <circle
        r="19"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh2)"
      />
      <polygon points="-5,-9 -5,9 11,0" fill={G.gold} opacity=".9" />
    </g>
    <g transform="translate(164,40)">
      <circle
        r="15"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh2)"
      />
      <polygon points="-4,-7 -4,7 9,0" fill={G.goldMid} opacity=".8" />
    </g>
    <g transform="translate(174,98)">
      <circle
        r="13"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh2)"
      />
      <polygon points="-3,-5.5 -3,5.5 7.5,0" fill={G.goldDp} opacity=".7" />
    </g>
    <rect
      x="154"
      y="16"
      width="42"
      height="16"
      rx="8"
      fill={G.goldPle}
      stroke={G.goldLt}
      strokeWidth="1"
    />
    <text
      x="175"
      y="27.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fill={G.goldDp}
      fontFamily="sans-serif"
    >
      1M+ views
    </text>
    <path
      d="M165 60 l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
      fill={G.goldMid}
    />
    <path
      d="M20 74 l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"
      fill={G.gold}
      opacity=".65"
    />
    <defs>
      <filter id="sh2">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={G.shadow} />
      </filter>
    </defs>
  </svg>
);

const IlluLivestream = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <ellipse cx="100" cy="150" rx="70" ry="9" fill={G.goldLt} opacity=".35" />
    <rect
      x="50"
      y="35"
      width="100"
      height="115"
      rx="10"
      fill={G.dark}
      opacity=".07"
    />
    <rect
      x="54"
      y="39"
      width="92"
      height="107"
      rx="8"
      fill={G.ivoryBg}
      stroke={G.goldLt}
      strokeWidth="1.5"
    />
    <rect x="60" y="46" width="38" height="14" rx="5" fill="#d94040" />
    <text
      x="79"
      y="57"
      textAnchor="middle"
      fontSize="8"
      fontWeight="bold"
      fill={G.white}
      fontFamily="sans-serif"
    >
      ⬤ LIVE
    </text>
    <rect
      x="104"
      y="46"
      width="36"
      height="14"
      rx="5"
      fill={G.dark}
      opacity=".45"
    />
    <text
      x="122"
      y="57"
      textAnchor="middle"
      fontSize="7"
      fill={G.white}
      fontFamily="sans-serif"
    >
      👁 2.4k
    </text>
    <circle cx="100" cy="88" r="14" fill={G.skin} />
    <path d="M86 83 q14-16 28 0" fill={G.darkMd} />
    <path d="M86 102 q-2-8 8-12 h12 q10 4 8 12 l-4 40h-20z" fill={G.gold} />
    <path
      d="M86 104 q-13-4-11-19"
      stroke={G.skin}
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M114 104 q13-4 11-19"
      stroke={G.skin}
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x="116"
      y="90"
      width="22"
      height="20"
      rx="3"
      fill={G.goldLt}
      stroke={G.gold}
      strokeWidth="1.5"
    />
    <line
      x1="116"
      y1="97"
      x2="138"
      y2="97"
      stroke={G.gold}
      strokeWidth="1"
      opacity=".4"
    />
    <line
      x1="127"
      y1="90"
      x2="127"
      y2="110"
      stroke={G.gold}
      strokeWidth="1"
      opacity=".4"
    />
    {/* chat bubbles */}
    <g transform="translate(164,68)">
      <rect
        x="-22"
        y="-13"
        width="44"
        height="20"
        rx="8"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh3)"
      />
      <path
        d="M-8 7 l8 9 l8-9"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="-16" y="-7" width="20" height="3" rx="1.5" fill={G.goldLt} />
      <rect x="-16" y="0" width="14" height="3" rx="1.5" fill={G.goldPle} />
    </g>
    <g transform="translate(38,76)">
      <rect
        x="-20"
        y="-11"
        width="40"
        height="18"
        rx="7"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh3)"
      />
      <path
        d="M6 7 l-6 8 l-6-8"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="-14" y="-5" width="16" height="3" rx="1.5" fill={G.goldLt} />
      <rect x="-14" y="2" width="10" height="3" rx="1.5" fill={G.goldPle} />
    </g>
    <g transform="translate(164,118)">
      <circle
        r="19"
        fill={G.white}
        stroke={G.goldLt}
        strokeWidth="1.5"
        filter="url(#sh3)"
      />
      <path
        d="M-8-7 h4 l5 11 h9 l3-8 h-13"
        stroke={G.gold}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="-2" cy="8" r="2.2" fill={G.goldDp} />
      <circle cx="7" cy="8" r="2.2" fill={G.goldDp} />
    </g>
    <path
      d="M40 45 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z"
      fill={G.goldMid}
      opacity=".65"
    />
    <path
      d="M160 34 l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
      fill={G.gold}
    />
    <defs>
      <filter id="sh3">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={G.shadow} />
      </filter>
    </defs>
  </svg>
);

const IlluAmbassador = () => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <ellipse cx="100" cy="150" rx="70" ry="9" fill={G.goldLt} opacity=".35" />
    <circle cx="100" cy="88" r="62" fill={G.ivoryBg} />
    <circle
      cx="100"
      cy="88"
      r="62"
      stroke={G.goldLt}
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="5 4"
    />
    <path d="M80 155 q-3-30 10-36 h20 q13 6 10 36z" fill={G.gold} />
    <path
      d="M88 120 l12-6 12 6"
      stroke={G.goldDp}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="100" cy="130" r="10" fill={G.goldMid} />
    <circle cx="100" cy="130" r="7" fill={G.goldDp} />
    <path d="M97 130 l2-5 1 3 3-5 1 3 2-3-2 7z" fill={G.goldLt} opacity=".9" />
    <rect x="97" y="119" width="6" height="9" rx="1" fill={G.goldLt} />
    <circle cx="100" cy="73" r="17" fill={G.skin} />
    <path d="M83 67 q17-22 34 0" fill={G.dark} />
    <path d="M83 69 C80 61 85 56 90 58" fill={G.dark} />
    <circle cx="93" cy="73" r="1.5" fill={G.darkMd} opacity=".65" />
    <circle cx="107" cy="73" r="1.5" fill={G.darkMd} opacity=".65" />
    <path
      d="M94 80 q6 4 12 0"
      stroke={G.darkMd}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity=".55"
    />
    <path
      d="M83 95 q-17-6-13-23"
      stroke={G.skin}
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M117 95 q17-6 13-23"
      stroke={G.skin}
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M128 66 l26-15 v30 l-26-15z" fill={G.goldDp} opacity=".8" />
    <rect
      x="122"
      y="73"
      width="8"
      height="16"
      rx="3"
      fill={G.gold}
      opacity=".7"
    />
    <path
      d="M157 56 q9 11 0 22"
      stroke={G.gold}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity=".45"
    />
    <path
      d="M161 51 q13 16 0 32"
      stroke={G.gold}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity=".25"
    />
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        d={`M${36 + i * 19} 38 l2 6 6 0-5 3.5 2 6-5-3.5-5 3.5 2-6-5-3.5 6 0z`}
        fill={i < 4 ? G.goldMid : G.goldLt}
        opacity=".8"
      />
    ))}
    <path
      d="M48 96 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
      fill={G.goldMid}
      opacity=".55"
    />
    <path
      d="M150 110 l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"
      fill={G.gold}
      opacity=".65"
    />
  </svg>
);

const IlluMultiPlatform = () => {
  const nodes = [
    { cx: 100, cy: 16, label: "FB", c: "#1877f2" },
    { cx: 163, cy: 49, label: "TK", c: G.dark },
    { cx: 168, cy: 112, label: "YT", c: "#ff0000" },
    { cx: 100, cy: 148, label: "IG", c: "#e1306c" },
    { cx: 32, cy: 112, label: "ZL", c: "#0068ff" },
    { cx: 37, cy: 49, label: "X", c: G.dark },
  ];
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <ellipse cx="100" cy="150" rx="65" ry="8" fill={G.goldLt} opacity=".3" />
      <circle
        cx="100"
        cy="82"
        r="64"
        stroke={G.goldLt}
        strokeWidth="1"
        strokeDasharray="5 4"
        fill="none"
      />
      {nodes.map((n, i) => (
        <line
          key={i}
          x1="100"
          y1="82"
          x2={n.cx}
          y2={n.cy}
          stroke={G.goldLt}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity=".65"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="17"
            fill={G.white}
            stroke={G.goldLt}
            strokeWidth="1.5"
            filter="url(#sh4)"
          />
          <circle cx={n.cx} cy={n.cy} r="13" fill={n.c} opacity=".12" />
          <text
            x={n.cx}
            y={n.cy + 4}
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill={n.c}
            fontFamily="sans-serif"
            opacity=".8"
          >
            {n.label}
          </text>
        </g>
      ))}
      <circle cx="100" cy="82" r="30" fill={G.gold} opacity=".1" />
      <circle
        cx="100"
        cy="82"
        r="24"
        fill={G.white}
        stroke={G.gold}
        strokeWidth="2"
      />
      <circle cx="100" cy="82" r="18" fill={G.goldLt} opacity=".35" />
      <circle cx="100" cy="77" r="7.5" fill={G.skin} />
      <path d="M92 73 q8-10 16 0" fill={G.darkMd} />
      <path
        d="M92 84 q-2-4 3-6 h10 q5 2 3 6 l-2 18h-12z"
        fill={G.goldDp}
        opacity=".65"
      />
      <defs>
        <filter id="sh4">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.5"
            floodColor={G.shadow}
          />
        </filter>
      </defs>
    </svg>
  );
};

/* ─── data ─────────────────────────────────────────────────────────────── */
const methods = [
  {
    num: "01",
    title: "Đăng ảnh & video trên MXH",
    desc: "Nội dung hình ảnh, video lan tỏa tự nhiên trên Facebook, Instagram, TikTok.",
    img: illu1,
  },
  {
    num: "02",
    title: "Check-in địa điểm / sự kiện",
    desc: "Tăng nhận diện thương hiệu tại điểm bán, sự kiện offline.",
    img: illu2,
  },
  {
    num: "03",
    title: "Quay video viral",
    desc: "Video ngắn sáng tạo, thu hút hàng triệu lượt xem.",
    img: illu3,
  },
  {
    num: "04",
    title: "Livestream bán hàng",
    desc: "Phát live trực tiếp, chốt đơn nhanh, tăng doanh thu.",
    img: illu4,
  },
  {
    num: "05",
    title: "Đại diện thương hiệu",
    desc: "KOL/Influencer trở thành gương mặt đại diện, gắn kết lâu dài.",
    img: illu5,
  },
  {
    num: "06",
    title: "Kết nối đa lĩnh vực, đa nền tảng",
    desc: "Phủ sóng trên mọi nền tảng: Facebook, TikTok, YouTube, Instagram.",
    img: illu6,
  },
];

/* ─── section ────────────────────────────────────────────────────────────── */
const DeploymentMethods = () => (
  <section className="py-20 md:py-28 bg-[#f7f4f0] relative overflow-hidden">
    {/* ambient glow — same pattern as Stats section */}
    <div
      className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse,hsl(45 80% 60%/0.09),transparent 65%)",
      }}
    />

    <div className="container relative">
      {/* ── Heading ─────────────────────────────────────── */}
      <Reveal className="max-w-2xl mx-auto text-center mb-16">
        <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
          — Hình thức triển khai —
        </span>
        <h2 className="font-display font-medium text-4xl md:text-5xl leading-[1.2] mb-6">
          Đa dạng hình thức,{" "}
          <span className="text-gold italic">một hệ sinh thái.</span>
        </h2>
        <div className="gold-divider w-24 mx-auto mb-6" />
        <p className="text-foreground/60 text-lg font-light leading-relaxed">
          Từ nội dung mạng xã hội đến livestream, từ check-in offline đến đại sứ
          thương hiệu — TIKA bao phủ mọi hình thức.
        </p>
      </Reveal>

      {/* ── 3 × 2 grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {methods.map(({ num, title, desc, img }, idx) => (
          <Reveal key={title} delay={idx * 70}>
            {/* card — lift + gold-top-line reveal on hover */}
            <div
              className="group relative bg-white rounded-2xl border border-border/60
                            hover:border-primary/35 hover:shadow-[0_16px_40px_-12px_rgba(180,130,50,0.22)]
                            hover:-translate-y-1.5 transition-all duration-300 ease-out
                            overflow-hidden flex flex-col h-full"
            >
              {/* gold top accent bar (scaleX 0→1 on hover) */}
              <span
                className="absolute inset-x-0 top-0 h-[2.5px] origin-left scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300 ease-out rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg,#c9a96e,#e8d5b0,#c9a96e)",
                }}
                aria-hidden
              />

              {/* ── illustration area ── */}
              <div
                className="relative overflow-hidden"
                style={{ paddingBottom: "68%", background: G.cream }}
              >
                {/* large watermark number */}
                <span
                  className="absolute top-2 right-3 font-display font-bold text-5xl leading-none
                             pointer-events-none select-none transition-opacity duration-300
                             opacity-[0.07] group-hover:opacity-[0.5] z-10"
                  style={{ color: G.goldDp }}
                  aria-hidden
                >
                  {num}
                </span>

                {/* image — subtle scale on hover */}
                <img
                  src={img}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-contain p-5
                             transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
              </div>

              {/* ── gold fade separator ── */}
              <div
                className="h-px mx-0 flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,hsl(45 75% 60%/0.30),transparent)",
                }}
              />

              {/* ── text area ── */}
              <div className="px-6 pt-5 pb-6 flex flex-col gap-3 flex-1">
                {/* numbered badge */}
                <div
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full
                             text-xs font-bold tracking-wide transition-colors duration-300
                             border border-primary/25 text-primary/60
                             group-hover:border-primary/50 group-hover:text-primary"
                >
                  {num}
                </div>

                <div>
                  <h3 className="font-display font-semibold text-[25px] leading-snug text-foreground mb-1.5 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13px] text-foreground/52 leading-[1.7] font-light">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── subtle bottom label ────────────────────────── */}
      <Reveal delay={500} className="mt-12 text-center">
        <p className="text-sm text-foreground/40 font-light tracking-wide">
          6 hình thức · Phủ sóng đa nền tảng · Tùy chỉnh theo chiến dịch
        </p>
      </Reveal>
    </div>
  </section>
);

export default DeploymentMethods;
