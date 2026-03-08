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

  const totalFlux =
    Number(fluxCT || 0) + Number(fluxMT || 0) + Number(fluxLT || 0);

  const pctCT = totalStock ? Math.round((Number(stockCT) / totalStock) * 100) : 0;
  const pctMT = totalStock ? Math.round((Number(stockMT) / totalStock) * 100) : 0;
  const pctLT = totalStock ? Math.round((Number(stockLT) / totalStock) * 100) : 0;

  let diagnostic = "Répartition patrimoniale globalement équilibrée.";
  let diagnosticColor = "#15803d";

  if (pctCT > 60) {
    diagnostic =
      "Surpondération court terme : patrimoine très concentré en liquidités.";
    diagnosticColor = "#c2410c";
  } else if (pctLT > 70) {
    diagnostic =
      "Surpondération long terme : patrimoine fortement immobilisé.";
    diagnosticColor = "#c2410c";
  } else if (pctMT > 60) {
    diagnostic = "Surpondération moyen terme.";
    diagnosticColor = "#c2410c";
  }

  const labelClass =
    "text-sm font-semibold uppercase tracking-wide text-neutral-500";

  return (
    <div className="mt-10 rounded-2xl border-2 border-black bg-[#f6f3ee] p-6 shadow-[0_8px_0_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Analyse patrimoniale
          </div>
          <h3 className="mt-1 text-4xl font-bold text-[#c6923f]">
            Pyramide patrimoniale actuelle
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-black bg-white px-4 py-3 text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Stock total
            </div>
            <div className="text-2xl font-bold text-black">{fmt(totalStock)}</div>
          </div>

          <div className="rounded-xl border border-black bg-white px-4 py-3 text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Flux mensuel total
            </div>
            <div className="text-2xl font-bold text-black">{fmt(totalFlux)}/mois</div>
          </div>
        </div>
      </div>



      <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Court terme</div>
              <div className="mt-1 text-lg font-bold text-black">Liquidité forte</div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pctCT}%
            </div>
          </div>

          <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#efe8da]">
            <div
              className="h-full rounded-full bg-[#dcc79b] transition-all duration-700"
              style={{ width: `${pctCT}%` }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className="text-3xl font-bold text-[#5b2be0]">{fmt(stockCT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxCT)}/mois</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Moyen terme</div>
              <div className="mt-1 text-lg font-bold text-black">Équilibre / flexibilité</div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pctMT}%
            </div>
          </div>

          <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#efe8da]">
            <div
              className="h-full rounded-full bg-[#c9b07a] transition-all duration-700"
              style={{ width: `${pctMT}%` }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className="text-3xl font-bold text-[#5b2be0]">{fmt(stockMT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxMT)}/mois</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Long terme</div>
              <div className="mt-1 text-lg font-bold text-black">Vision patrimoniale</div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pctLT}%
            </div>
          </div>

          <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#efe8da]">
            <div
              className="h-full rounded-full bg-[#b98d4a] transition-all duration-700"
              style={{ width: `${pctLT}%` }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className="text-3xl font-bold text-[#5b2be0]">{fmt(stockLT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxLT)}/mois</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-black bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Analyse de répartition
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 text-sm font-semibold md:grid-cols-3">
          <div>Court terme : {pctCT}%</div>
          <div>Moyen terme : {pctMT}%</div>
          <div>Long terme : {pctLT}%</div>
        </div>

        <div className="mt-3 text-sm font-semibold" style={{ color: diagnosticColor }}>
          {pctCT > 60 || pctMT > 60 || pctLT > 70 ? "⚠ " : "✓ "} {diagnostic}
        </div>
      </div>
    </div>
	
	      <div className="mb-8 rounded-2xl border border-black bg-white p-4">
        <svg
          viewBox="0 0 1200 620"
          className="h-auto w-full"
          role="img"
          aria-label="Pyramide patrimoniale"
        >
          <defs>
            <linearGradient id="bgPyramid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#efe4cf" />
              <stop offset="100%" stopColor="#deceb0" />
            </linearGradient>
          </defs>

          {/* Fond principal pyramide */}
          <polygon
            points="600,70 980,540 220,540"
            fill="url(#bgPyramid)"
            stroke="#c6923f"
            strokeWidth="2.5"
          />

          {/* Séparations */}
          <line
            x1="455"
            y1="235"
            x2="745"
            y2="235"
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="7 7"
          />
          <line
            x1="365"
            y1="390"
            x2="835"
            y2="390"
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="7 7"
          />

          {/* Long terme */}
          <text
            x="600"
            y="145"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#9b7b3f"
            letterSpacing="2"
          >
            LONG TERME
          </text>
          <text
            x="600"
            y="185"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#5b2be0"
          >
            {fmt(stockLT)}
          </text>
          <text
            x="600"
            y="215"
            textAnchor="middle"
            fontSize="16"
            fill="#8b6e3e"
          >
            Immobilier locatif · SCPI · PER · capitalisation longue
          </text>

          {/* Moyen terme */}
          <text
            x="600"
            y="305"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#9b7b3f"
            letterSpacing="2"
          >
            MOYEN TERME
          </text>
          <text
            x="600"
            y="345"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#5b2be0"
          >
            {fmt(stockMT)}
          </text>
          <text
            x="600"
            y="375"
            textAnchor="middle"
            fontSize="16"
            fill="#8b6e3e"
          >
            Assurance vie · PEA · PEL · horizon intermédiaire
          </text>

          {/* Court terme */}
          <text
            x="600"
            y="455"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#9b7b3f"
            letterSpacing="2"
          >
            COURT TERME
          </text>
          <text
            x="600"
            y="495"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#5b2be0"
          >
            {fmt(stockCT)}
          </text>
          <text
            x="600"
            y="525"
            textAnchor="middle"
            fontSize="16"
            fill="#8b6e3e"
          >
            Liquidités · livrets · épargne de précaution
          </text>

          {/* Flux gauche */}
          <text x="70" y="170" fontSize="18" fontWeight="700" fill="#111">
            Long terme
          </text>
          <rect x="70" y="180" rx="10" ry="10" width="145" height="38" fill="#f3ead8" stroke="#000" />
          <text x="142" y="205" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5b2be0">
            {fmt(fluxLT)}/mois
          </text>

          <text x="70" y="330" fontSize="18" fontWeight="700" fill="#111">
            Moyen terme
          </text>
          <rect x="70" y="340" rx="10" ry="10" width="145" height="38" fill="#f3ead8" stroke="#000" />
          <text x="142" y="365" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5b2be0">
            {fmt(fluxMT)}/mois
          </text>

          <text x="70" y="500" fontSize="18" fontWeight="700" fill="#111">
            Court terme
          </text>
          <rect x="70" y="510" rx="10" ry="10" width="145" height="38" fill="#f3ead8" stroke="#000" />
          <text x="142" y="535" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5b2be0">
            {fmt(fluxCT)}/mois
          </text>
		  
          {/* Contraintes droite */}
          <text x="1130" y="190" textAnchor="end" fontSize="18" fontWeight="700" fill="#d4552d">
            Bloqué · Fixé
          </text>
          <text x="1130" y="240" textAnchor="end" fontSize="18" fontWeight="700" fill="#d4552d">
            Bloqué · Non fixé
          </text>
          <text x="1130" y="355" textAnchor="end" fontSize="18" fontWeight="700" fill="#d4552d">
            Non bloqué · Non fixé
          </text>
          <text x="1130" y="510" textAnchor="end" fontSize="18" fontWeight="700" fill="#d4552d">
            Épargne de précaution
          </text>
        </svg>
      </div>
  );
}