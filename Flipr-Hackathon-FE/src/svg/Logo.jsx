const Logo = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bubbleGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00C6FF" />
        <stop offset="100%" stopColor="#0072FF" />
      </linearGradient>
    </defs>
    <g filter="url(#shadow)">
      <path
        d="M12 8C7.58 8 4 11.58 4 16V40C4 44.42 7.58 48 12 48H24L34 56V48H52C56.42 48 60 44.42 60 40V16C60 11.58 56.42 8 52 8H12Z"
        fill="url(#bubbleGradient)"
      />
      <path
        d="M20 28C20 29.1 20.9 30 22 30C23.1 30 24 29.1 24 28C24 26.9 23.1 26 22 26C20.9 26 20 26.9 20 28ZM30 28C30 29.1 30.9 30 32 30C33.1 30 34 29.1 34 28C34 26.9 33.1 26 32 26C30.9 26 30 26.9 30 28ZM42 30C43.1 30 44 29.1 44 28C44 26.9 43.1 26 42 26C40.9 26 40 26.9 40 28C40 29.1 40.9 30 42 30Z"
        fill="white"
      />
    </g>
    <defs>
      <filter id="shadow" x="0" y="0" width="100%" height="100%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.1" />
      </filter>
    </defs>
  </svg>
);

export default Logo;
