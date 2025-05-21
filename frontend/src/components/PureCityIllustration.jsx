// src/components/PureCityIllustration.jsx
import React from 'react';

const PureCityIllustration = () => {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice" // Ini memastikan SVG menutupi seluruh area (full screen) sambil mempertahankan rasio aspek
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Sky background */}
      <rect width="1200" height="800" fill="#F0F9FF" />

      {/* Sun */}
      <circle cx="900" cy="150" r="70" fill="#FEF3C7" />
      <circle cx="900" cy="150" r="60" fill="#FBBF24" />

      {/* Background hills */}
      <path d="M0,500 Q300,420 600,500 T1200,480 V800 H0 Z" fill="#D1FAE5" />

      {/* Far background buildings */}
      <g>
        {[...Array(18)].map((_, i) => {
          const x = 20 + i * 65;
          const height = 150 + Math.random() * 200;
          const width = 35 + Math.random() * 25;
          return (
            <rect key={`bg-building-${i}`} x={x} y={800 - height} width={width} height={height} fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1" />
          );
        })}
      </g>

      {/* Mid-ground buildings */}
      <g>
        {[...Array(14)].map((_, i) => {
          const x = 15 + i * 85;
          const height = 200 + Math.random() * 250;
          const width = 50 + Math.random() * 30;

          // Windows for the buildings
          const windows = [];
          for (let wx = 0; wx < width - 10; wx += 12) {
            for (let wy = 0; wy < height - 20; wy += 20) {
              if (Math.random() > 0.3) { // Some windows are lit, some are not
                windows.push(
                  <rect key={`window-${i}-${wx}-${wy}`} x={x + 5 + wx} y={800 - height + 10 + wy} width="6" height="12" fill="#E2E8F0" stroke="#A0AEC0" strokeWidth="0.5" />
                );
              }
            }
          }

          return (
            <g key={`mid-building-${i}`}>
              <rect x={x} y={800 - height} width={width} height={height} fill="#A0AEC0" stroke="#718096" strokeWidth="1" />
              {windows}
            </g>
          );
        })}
      </g>

      {/* Foreground landmark buildings */}
      <g>
        {/* Skyscraper 1 */}
        <rect x="300" y="300" width="80" height="500" fill="#718096" />
        <rect x="310" y="320" width="60" height="460" fill="#A0AEC0" />
        <rect x="320" y="250" width="40" height="50" fill="#718096" />

        {/* Skyscraper 2 - Chrysler-inspired */}
        <g transform="translate(500, 300)">
          <rect x="0" y="0" width="100" height="500" fill="#718096" />
          <rect x="10" y="20" width="80" height="460" fill="#A0AEC0" />
          <polygon points="20,0 80,0 60,-50 40,-50" fill="#718096" />
          <rect x="40" y="-70" width="20" height="20" fill="#718096" />
        </g>

        {/* Skyscraper 3 */}
        <g transform="translate(700, 350)">
          <rect x="0" y="0" width="120" height="450" fill="#718096" />
          <rect x="10" y="20" width="100" height="410" fill="#A0AEC0" />
          <polygon points="30,0 90,0 70,-40 50,-40" fill="#718096" />
        </g>

        {/* Skyscraper 4 */}
        <g transform="translate(900, 400)">
          <rect x="0" y="0" width="90" height="400" fill="#718096" />
          <rect x="10" y="20" width="70" height="360" fill="#A0AEC0" />
          <rect x="30" y="-30" width="30" height="30" fill="#718096" />
        </g>
      </g>

      {/* Parks and Green Spaces */}
      <g>
        {/* Central Park */}
        <rect x="150" y="650" width="300" height="150" fill="#10B981" />
        <ellipse cx="200" cy="700" rx="30" ry="40" fill="#059669" />
        <ellipse cx="300" cy="720" rx="40" ry="30" fill="#059669" />
        <ellipse cx="400" cy="690" rx="35" ry="35" fill="#059669" />

        {/* Trees in central park */}
        {[...Array(15)].map((_, i) => {
          const x = 170 + Math.random() * 260;
          const y = 660 + Math.random() * 130;
          return (
            <g key={`park1-tree-${i}`}>
              <rect x={x - 2} y={y} width="4" height="12" fill="#7C2D12" />
              <circle cx={x} cy={y - 8} r="8" fill="#059669" />
            </g>
          );
        })}

        {/* Second Park */}
        <rect x="600" y="680" width="200" height="120" fill="#10B981" />
        <ellipse cx="650" cy="720" rx="25" ry="35" fill="#059669" />
        <ellipse cx="720" cy="740" rx="30" ry="25" fill="#059669" />
        <ellipse cx="780" cy="710" rx="30" ry="30" fill="#059669" />

        {/* Trees in second park */}
        {[...Array(8)].map((_, i) => {
          const x = 620 + Math.random() * 160;
          const y = 690 + Math.random() * 100;
          return (
            <g key={`park2-tree-${i}`}>
              <rect x={x - 2} y={y} width="4" height="10" fill="#7C2D12" />
              <circle cx={x} cy={y - 6} r="6" fill="#059669" />
            </g>
          );
        })}

        {/* Third Park */}
        <rect x="900" y="700" width="150" height="100" fill="#10B981" />
        <ellipse cx="940" cy="730" rx="20" ry="30" fill="#059669" />
        <ellipse cx="990" cy="750" rx="25" ry="20" fill="#059669" />
        <ellipse cx="1030" cy="720" rx="25" ry="25" fill="#059669" />

        {/* Trees in third park */}
        {[...Array(6)].map((_, i) => {
          const x = 910 + Math.random() * 130;
          const y = 710 + Math.random() * 80;
          return (
            <g key={`park3-tree-${i}`}>
              <rect x={x - 1.5} y={y} width="3" height="8" fill="#7C2D12" />
              <circle cx={x} cy={y - 5} r="5" fill="#059669" />
            </g>
          );
        })}

        {/* Street trees */}
        {[...Array(25)].map((_, i) => {
          const x = 30 + i * 48;
          const y = 780;
          return (
            <g key={`street-tree-${i}`}>
              <rect x={x - 3} y={y - 15} width="6" height="15" fill="#7C2D12" />
              <circle cx={x} cy={y - 20} r="10" fill="#16A34A" />
            </g>
          );
        })}
      </g>

      {/* Streets and roads */}
      <rect x="0" y="785" width="1200" height="15" fill="#9CA3AF" />

      {/* People silhouettes - stick figures */}
      <g>
        {[...Array(60)].map((_, i) => {
          const x = 50 + Math.random() * 1100;
          const y = 775;
          const height = 10;
          return (
            <g key={`person-${i}`} transform={`translate(${x}, ${y})`}>
              <circle cx="0" cy={-height} r={height / 3} fill="#475569" />
              <rect x={-height / 6} y={-height * 0.9} width={height / 3} height={height * 0.9} fill="#475569" />
              <line x1={-height / 2} y1={-height / 2} x2={-height} y2={-height / 5} stroke="#475569" strokeWidth={height / 5} />
              <line x1={height / 2} y1={-height / 2} x2={height} y2={-height / 5} stroke="#475569" strokeWidth={height / 5} />
              <line x1={-height / 4} y1={0} x2={-height / 2} y2={height / 1.5} stroke="#475569" strokeWidth={height / 5} />
              <line x1={height / 4} y1={0} x2={height / 2} y2={height / 1.5} stroke="#475569" strokeWidth={height / 5} />
            </g>
          );
        })}
      </g>

      {/* Cars */}
      <g>
        {[...Array(15)].map((_, i) => {
          const x = 80 + i * 70 + Math.random() * 20;
          const y = 780;
          const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <g key={`car-${i}`} transform={`translate(${x}, ${y})`}>
              <rect x="-12" y="-8" width="24" height="8" fill={color} rx="2" />
              <rect x="-8" y="-12" width="16" height="4" fill={color} rx="1" />
              <circle cx="-8" cy="0" r="3" fill="#1F2937" />
              <circle cx="8" cy="0" r="3" fill="#1F2937" />
            </g>
          );
        })}
      </g>

      {/* Birds in the sky */}
      <g>
        {[...Array(15)].map((_, i) => {
          const x = 100 + Math.random() * 1000;
          const y = 100 + Math.random() * 200;
          return (
            <path
              key={`bird-${i}`}
              d={`M${x},${y} c2,-1 5,-2 8,0 c3,-2 6,-1 8,0`}
              stroke="#4B5563"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </g>

      {/* Clouds */}
      <g>
        {[...Array(8)].map((_, i) => {
          const x = 100 + i * 150 + Math.random() * 50;
          const y = 80 + Math.random() * 120;
          const scale = 0.7 + Math.random() * 0.6;

          return (
            <g key={`cloud-${i}`} transform={`translate(${x}, ${y}) scale(${scale})`}>
              <ellipse cx="0" cy="0" rx="30" ry="20" fill="white" />
              <ellipse cx="25" cy="-5" rx="25" ry="15" fill="white" />
              <ellipse cx="-20" cy="5" rx="20" ry="15" fill="white" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default PureCityIllustration;