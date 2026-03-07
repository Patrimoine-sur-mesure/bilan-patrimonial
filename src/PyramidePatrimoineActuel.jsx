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
  const fmt = (v) =>
    euro ? euro(v) : `${Number(v || 0).toLocaleString("fr-FR")} €`;

  const totalStock =
    Number(stockCT || 0) + Number(stockMT || 0) + Number(stockLT || 0);

  const pctCT = totalStock ? Math.round((Number(stockCT) / totalStock) * 100) : 0;
  const pctMT = totalStock ? Math.round((Number(stockMT) / totalStock) * 100) : 0;
  const pctLT = totalStock ? Math.round((Number(stockLT) / totalStock) * 100) : 0;

  let diagnostic = "Répartition patrimoniale globalement équilibrée.";
  let diagnosticColor = "#15803d";

  if (pctCT > 60) {
    diagnostic = "Surpondération court terme";
    diagnosticColor = "#c2410c";
  } else if (pctMT > 60) {
    diagnostic = "Surpondération moyen terme";
    diagnosticColor = "#c2410c";
  } else if (pctLT > 70) {
    diagnostic = "Surpondération long terme";
    diagnosticColor = "#c2410c";
  }

  return (
    <div className="mt-10 rounded-[28px] border border-[#d8c7a3] bg-[#fbf8f2] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a7b5d]">
            Banque privée
          </div>
          <h3 className="mt-2 text-4xl font-semibold text-[#1f1f1f]">
            Architecture patrimoniale actuelle
          </h3>
        </div>

        <div className="rounded-2xl border border-[#d8c7a3] bg-white px-5 py-4 text-right shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7b5d]">
            Stock total
          </div>
          <div className="mt-1 text-2xl font-semibold text-[#1f1f1f]">
            {fmt(totalStock)}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#e3d7bd] bg-white px-4 py-6">
        <svg
          viewBox="0 0 1500 860"
          className="h-auto w-full"
          role="img"
          aria-label="Pyramide patrimoniale"
        >
          <defs>
            <linearGradient id="pyramidFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#efe6d4" />
              <stop offset="100%" stopColor="#e2d2b5" />
            </linearGradient>

            <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#faf6ee" />
              <stop offset="100%" stopColor="#f1e7d5" />
            </linearGradient>
          </defs>

          {/* titres latéraux */}
          <text
            x="70"
            y="80"
            fontSize="24"
            fontWeight="700"
            letterSpacing="4"
            fill="#3d3528"
          >
            PERFORMANCE
          </text>

          <text
            x="1290"
            y="80"
            textAnchor="end"
            fontSize="24"
            fontWeight="700"
            letterSpacing="4"
            fill="#3d3528"
          >
            CONTRAINTE
          </text>

          {/* axes */}
          <line x1="70" y1="130" x2="70" y2="710" stroke="#2d2a26" strokeWidth="5" />
          <polygon points="70,95 52,130 88,130" fill="#2d2a26" />
          <circle cx="118" cy="112" r="24" fill="#111111" />
          <text
            x="118"
            y="121"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill="#ffffff"
          >
            +
          </text>

          <line x1="1430" y1="130" x2="1430" y2="710" stroke="#2d2a26" strokeWidth="5" />
          <polygon points="1430,95 1412,130 1448,130" fill="#2d2a26" />
          <circle cx="1382" cy="112" r="24" fill="#111111" />
          <text
            x="1382"
            y="121"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill="#ffffff"
          >
            +
          </text>

          {/* labels flux gauche */}
          <text x="105" y="255" fontSize="22" fontWeight="600" fill="#1f1f1f">
            Long terme
          </text>
          <rect x="105" y="270" rx="14" ry="14" width="150" height="44" fill="url(#barFill)" />
          <text x="180" y="298" textAnchor="middle" fontSize="22" fontWeight="700" fill="#4f46e5">
            {fmt(fluxLT)}/m
          </text>

          <text x="105" y="440" fontSize="22" fontWeight="600" fill="#1f1f1f">
            Moyen terme
          </text>
          <rect x="105" y="455" rx="14" ry="14" width="150" height="44" fill="url(#barFill)" />
          <text x="180" y="483" textAnchor="middle" fontSize="22" fontWeight="700" fill="#4f46e5">
            {fmt(fluxMT)}/m
          </text>

          <text x="105" y="675" fontSize="22" fontWeight="600" fill="#1f1f1f">
            Court terme
          </text>
          <rect x="105" y="690" rx="14" ry="14" width="150" height="44" fill="url(#barFill)" />
          <text x="180" y="718" textAnchor="middle" fontSize="22" fontWeight="700" fill="#4f46e5">
            {fmt(fluxCT)}/m
          </text>

          {/* pyramide */}
          <polygon
            points="750,120 1060,760 440,760"
            fill="url(#pyramidFill)"
            stroke="#c8ae7d"
            strokeWidth="2.5"
          />

          {/* séparations */}
          <line
            x1="612"
            y1="330"
            x2="888"
            y2="330"
            stroke="#6e6251"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <line
            x1="545"
            y1="545"
            x2="955"
            y2="545"
            stroke="#6e6251"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* LT */}
          <text
            x="750"
            y="235"
            textAnchor="middle"
            fontSize="16"
            letterSpacing="3"
            fontWeight="700"
            fill="#9b8356"
          >
            LONG TERME
          </text>
          <text
            x="750"
            y="282"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#4338ca"
          >
            {fmt(stockLT)}
          </text>
          <text
            x="750"
            y="314"
            textAnchor="middle"
            fontSize="18"
            fill="#7f6d4a"
          >
            Immobilier locatif · SCPI · PER · Capitalisation longue
          </text>

          {/* MT */}
          <text
            x="750"
            y="450"
            textAnchor="middle"
            fontSize="16"
            letterSpacing="3"
            fontWeight="700"
            fill="#9b8356"
          >
            MOYEN TERME
          </text>
          <text
            x="750"
            y="498"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#4338ca"
          >
            {fmt(stockMT)}
          </text>
          <text
            x="750"
            y="530"
            textAnchor="middle"
            fontSize="18"
            fill="#7f6d4a"
          >
            Assurance vie · PEA · PEL · Supports intermédiaires
          </text>

          {/* CT */}
          <text
            x="750"
            y="645"
            textAnchor="middle"
            fontSize="16"
            letterSpacing="3"
            fontWeight="700"
            fill="#9b8356"
          >
            COURT TERME
          </text>
          <text
            x="750"
            y="695"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#4338ca"
          >
            {fmt(stockCT)}
          </text>
          <text
            x="750"
            y="728"
            textAnchor="middle"
            fontSize="18"
            fill="#7f6d4a"
          >
            Liquidités · Livrets · Épargne disponible · Précaution
          </text>

          {/* résidence principale */}
          <g transform="rotate(38 1020 470)">
            <rect
              x="1007"
              y="260"
              width="26"
              height="390"
              rx="8"
              fill="#f8f4ec"
              stroke="#c8ae7d"
              strokeWidth="2"
            />
          </g>
          <text
            x="1020"
            y="470"
            textAnchor="middle"
            fontSize="20"
            fill="#2b2b2b"
            transform="rotate(58 1020 470)"
          >
            Résidence principale
          </text>

          {/* labels droite */}
          <text x="1360" y="250" textAnchor="end" fontSize="20" fontWeight="600" fill="#d4552d">
            Fixé · Bloqué
          </text>
          <text x="1360" y="315" textAnchor="end" fontSize="20" fontWeight="600" fill="#d4552d">
            Non Fixé · Bloqué
          </text>
          <text x="1360" y="505" textAnchor="end" fontSize="20" fontWeight="600" fill="#d4552d">
            Non Fixé · Non Bloqué
          </text>
          <text x="1360" y="695" textAnchor="end" fontSize="20" fontWeight="600" fill="#d4552d">
            Liquidité immédiate
          </text>
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#d8c7a3] bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7b5d]">
            Court terme
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#1f1f1f]">{pctCT}%</div>
        </div>

        <div className="rounded-2xl border border-[#d8c7a3] bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7b5d]">
            Moyen terme
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#1f1f1f]">{pctMT}%</div>
        </div>

        <div className="rounded-2xl border border-[#d8c7a3] bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7b5d]">
            Long terme
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#1f1f1f]">{pctLT}%</div>
        </div>

        <div className="rounded-2xl border border-[#d8c7a3] bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7b5d]">
            Diagnostic
          </div>
          <div className="mt-2 text-base font-semibold" style={{ color: diagnosticColor }}>
            {diagnostic}
          </div>
        </div>
      </div>
    </div>
  );
}