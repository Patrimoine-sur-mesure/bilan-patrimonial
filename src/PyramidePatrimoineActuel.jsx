import React from "react";

export default function PyramidePatrimoineActuel({
  euro,
  stockCT = 0,
  stockMT = 0,
  stockLT = 0,
  fluxCT = 0,
  fluxMT = 0,
  fluxLT = 0,
}) {
  const fmt = (v) => (euro ? euro(v) : `${Number(v || 0).toLocaleString("fr-FR")} €`);

  return (
    <div className="mt-10 border-2 border-black bg-[#f3f3f3] p-4">
      <svg
        viewBox="0 0 1600 900"
        className="w-full h-auto"
        role="img"
        aria-label="Pyramide du patrimoine actuel"
      >
        {/* Fond */}
        <rect x="0" y="0" width="1600" height="900" fill="#f3f3f3" />

        {/* Titre */}
        <text
          x="800"
          y="70"
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fill="#c6923f"
        >
          Stocks / Flux actuels
        </text>

        {/* Axe gauche */}
        <text x="25" y="95" fontSize="30" fontWeight="800" fill="#000">
          PERFORMANT
        </text>
        <rect x="32" y="130" width="16" height="620" fill="#2b2840" />
        <polygon points="40,80 5,130 75,130" fill="#2b2840" />
        <circle cx="110" cy="110" r="38" fill="#000" />
        <text
          x="110"
          y="124"
          textAnchor="middle"
          fontSize="50"
          fontWeight="700"
          fill="#fff"
        >
          +
        </text>

        {/* Axe droit */}
        <text x="1160" y="95" fontSize="30" fontWeight="800" fill="#000">
          CONTRAIGNANT
        </text>
        <rect x="1290" y="130" width="16" height="620" fill="#2b2840" />
        <polygon points="1298,80 1263,130 1333,130" fill="#2b2840" />
        <circle cx="1230" cy="110" r="38" fill="#000" />
        <text
          x="1230"
          y="124"
          textAnchor="middle"
          fontSize="50"
          fontWeight="700"
          fill="#fff"
        >
          +
        </text>

        {/* Labels droite */}
        <text x="1560" y="260" textAnchor="end" fontSize="24" fontWeight="700" fill="#ff5a36">
          Bloqué ; Fixé
        </text>
        <text x="1560" y="315" textAnchor="end" fontSize="24" fontWeight="700" fill="#ff5a36">
          Bloqué ; Non Fixé
        </text>
        <text x="1560" y="495" textAnchor="end" fontSize="24" fontWeight="700" fill="#ff5a36">
          Non Bloqué ; Non Fixé
        </text>
        <text x="1560" y="690" textAnchor="end" fontSize="24" fontWeight="700" fill="#ff5a36">
          Épargne de précaution
        </text>

        {/* Flux gauche */}
        <text x="60" y="240" fontSize="22" fontWeight="700" fill="#000">
          Long terme :
        </text>
        <rect x="132" y="220" width="115" height="38" rx="4" fill="#eadfc8" />
        <text x="190" y="246" textAnchor="middle" fontSize="22" fontWeight="700" fill="#6c2bd9">
          {fmt(fluxLT)}/mois
        </text>
        <rect x="95" y="270" width="48" height="18" fill="#c6923f" />
        <polygon points="143,261 168,279 143,297" fill="#c6923f" />

        <text x="60" y="430" fontSize="22" fontWeight="700" fill="#000">
          Moyen terme :
        </text>
        <rect x="132" y="410" width="115" height="38" rx="4" fill="#eadfc8" />
        <text x="190" y="436" textAnchor="middle" fontSize="22" fontWeight="700" fill="#6c2bd9">
          {fmt(fluxMT)}/mois
        </text>
        <rect x="95" y="460" width="48" height="18" fill="#c6923f" />
        <polygon points="143,451 168,469 143,487" fill="#c6923f" />

        <text x="60" y="690" fontSize="22" fontWeight="700" fill="#000">
          Court terme :
        </text>
        <rect x="132" y="670" width="115" height="38" rx="4" fill="#eadfc8" />
        <text x="190" y="696" textAnchor="middle" fontSize="22" fontWeight="700" fill="#6c2bd9">
          {fmt(fluxCT)}/mois
        </text>
        <rect x="95" y="720" width="48" height="18" fill="#c6923f" />
        <polygon points="143,711 168,729 143,747" fill="#c6923f" />

        {/* Pyramide */}
        <polygon
          points="800,140 1080,760 520,760"
          fill="#e8ddc6"
          stroke="#c6923f"
          strokeWidth="2"
        />

        {/* Séparations */}
        <line
          x1="665"
          y1="330"
          x2="935"
          y2="330"
          stroke="#000"
          strokeWidth="3"
          strokeDasharray="8,6"
        />
        <line
          x1="610"
          y1="515"
          x2="990"
          y2="515"
          stroke="#000"
          strokeWidth="3"
          strokeDasharray="8,6"
        />

        {/* LT */}
        <text x="800" y="235" textAnchor="middle" fontSize="34" fontWeight="700" fill="#6c2bd9">
          {fmt(stockLT)}
        </text>
        <text x="800" y="275" textAnchor="middle" fontSize="22" fill="#c6923f">
          Immo locatif, SCPI, PER, AV
        </text>
        <text x="800" y="315" textAnchor="middle" fontSize="28" fontWeight="500" fill="#000">
          Long terme
        </text>

        {/* MT */}
        <text x="800" y="445" textAnchor="middle" fontSize="34" fontWeight="700" fill="#6c2bd9">
          {fmt(stockMT)}
        </text>
        <text x="800" y="485" textAnchor="middle" fontSize="22" fill="#c6923f">
          PEL, AV, PEA, ES
        </text>
        <text x="800" y="525" textAnchor="middle" fontSize="28" fontWeight="500" fill="#000">
          Moyen terme
        </text>

        {/* CT */}
        <text x="800" y="665" textAnchor="middle" fontSize="22" fill="#c6923f">
          Livrets bancaires (LA, LB, LDDS, CC Perso &amp; Pro) :
          <tspan fontWeight="700" fill="#6c2bd9"> {fmt(stockCT)}</tspan>
        </text>
        <text x="800" y="725" textAnchor="middle" fontSize="30" fontWeight="500" fill="#000">
          Court terme
        </text>

        {/* Barre diagonale résidence principale */}
        <g transform="rotate(39 1035 470)">
          <rect
            x="1018"
            y="255"
            width="34"
            height="430"
            fill="#f3f3f3"
            stroke="#c6923f"
            strokeWidth="2"
          />
        </g>

        <text
          x="1035"
          y="455"
          textAnchor="middle"
          fontSize="28"
          fill="#000"
          transform="rotate(58 1035 455)"
        >
          Résidence Principale
        </text>
      </svg>
    </div>
  );
}