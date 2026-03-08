import React from "react";

export default function PyramidePatrimoineActuel({
  euro,
  stockCT = 0,
  stockMT = 0,
  stockLT = 0,
  fluxCT = 0,
  fluxMT = 0,
  fluxLT = 0,
  scorePatrimonial = "0.0",
  analysePatrimoniale = {
    force: "",
    vigilance: "",
    orientation: "",
  },
}) {
  const fmt = (v) => {
    const n = Number(v || 0);

    if (euro) return euro(n);
    if (n >= 1000000) return `${(n / 1000000).toFixed(2).replace(".", ",")} M€`;
    if (n >= 1000) return `${Math.round(n / 1000)} k€`;

    return `${n.toLocaleString("fr-FR")} €`;
  };

  const totalStock =
    Number(stockCT || 0) + Number(stockMT || 0) + Number(stockLT || 0);

  const totalFlux =
    Number(fluxCT || 0) + Number(fluxMT || 0) + Number(fluxLT || 0);

  const pctCT = totalStock ? Math.round((Number(stockCT || 0) / totalStock) * 100) : 0;
  const pctMT = totalStock ? Math.round((Number(stockMT || 0) / totalStock) * 100) : 0;
  const pctLT = totalStock ? Math.round((Number(stockLT || 0) / totalStock) * 100) : 0;

  let diagnostic =
    "Structure patrimoniale cohérente au regard des horizons de détention.";
  let diagnosticColor = "#15803d";

  if (pctCT > 60) {
    diagnostic =
      "Concentration élevée sur les actifs liquides, suggérant un redéploiement progressif.";
    diagnosticColor = "#c2410c";
  } else if (pctLT > 70) {
    diagnostic =
      "Structure fortement orientée long terme, avec une flexibilité patrimoniale plus réduite.";
    diagnosticColor = "#c2410c";
  } else if (pctMT > 60) {
    diagnostic =
      "Poids significatif de la poche intermédiaire, traduisant une bonne flexibilité patrimoniale.";
    diagnosticColor = "#c2410c";
  }

  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]";

  return (
    <div className="mt-10 rounded-[28px] border border-[#ddd6ca] bg-[#f8f5ef] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b8175]">
            Analyse patrimoniale
          </div>

          <h3 className="mt-2 text-4xl font-semibold tracking-tight text-[#1f2937]">
            Pyramide patrimoniale actuelle
          </h3>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b7280]">
            Cette cartographie met en perspective la structuration actuelle du
            patrimoine entre liquidité immédiate, flexibilité intermédiaire et
            capitalisation long terme.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-[#ddd6ca] bg-white px-5 py-4 text-right shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
              Stock total
            </div>
            <div className="text-2xl font-semibold text-[#1f2937]">
              {fmt(totalStock)}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd6ca] bg-white px-5 py-4 text-right shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
              Flux mensuel total
            </div>
            <div className="text-2xl font-semibold text-[#1f2937]">
              {fmt(totalFlux)}/mois
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd6ca] bg-white px-5 py-4 text-right shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
              Score patrimonial
            </div>
            <div className="text-2xl font-semibold text-[#1f2937]">
              {scorePatrimonial} / 10
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-[24px] border border-[#ddd6ca] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Court terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Liquidité forte
              </div>
            </div>
            <div className="rounded-full border border-[#ddd6ca] bg-[#faf7f2] px-3 py-1 text-sm font-semibold text-[#223046]">
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
              <div className="text-3xl font-semibold tracking-tight text-[#223046]">
                {fmt(stockCT)}
              </div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">
                {fmt(fluxCT)}/mois
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#ddd6ca] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Moyen terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Équilibre / flexibilité
              </div>
            </div>
            <div className="rounded-full border border-[#ddd6ca] bg-[#faf7f2] px-3 py-1 text-sm font-semibold text-[#223046]">
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
              <div className="text-3xl font-semibold tracking-tight text-[#223046]">
                {fmt(stockMT)}
              </div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">
                {fmt(fluxMT)}/mois
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#ddd6ca] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Long terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Vision patrimoniale
              </div>
            </div>
            <div className="rounded-full border border-[#ddd6ca] bg-[#faf7f2] px-3 py-1 text-sm font-semibold text-[#223046]">
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
              <div className="text-3xl font-semibold tracking-tight text-[#223046]">
                {fmt(stockLT)}
              </div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">
                {fmt(fluxLT)}/mois
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#ddd6ca] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b8175]">
          Architecture patrimoniale
        </div>

        <p className="mb-4 text-sm leading-6 text-[#6b7280]">
          Lecture des stocks patrimoniaux et des flux mensuels par horizon
          d’investissement.
        </p>

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

          <polygon
            points="600,70 980,540 220,540"
            fill="url(#bgPyramid)"
            stroke="#c6923f"
            strokeWidth="2.5"
          />

          <line
            x1="455"
            y1="235"
            x2="745"
            y2="235"
            stroke="#cdbfaa"
            strokeWidth="2"
            strokeDasharray="7 7"
          />
          <line
            x1="365"
            y1="390"
            x2="835"
            y2="390"
            stroke="#cdbfaa"
            strokeWidth="2"
            strokeDasharray="7 7"
          />

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
            fill="#223046"
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
            fill="#223046"
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
            fill="#223046"
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

          <text x="70" y="170" fontSize="18" fontWeight="700" fill="#1f2937">
            Long terme
          </text>
          <rect
            x="70"
            y="180"
            rx="10"
            ry="10"
            width="145"
            height="38"
            fill="#f3ead8"
            stroke="#cdbfaa"
          />
          <text
            x="142"
            y="205"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#223046"
          >
            {fmt(fluxLT)}/mois
          </text>

          <text x="70" y="330" fontSize="18" fontWeight="700" fill="#1f2937">
            Moyen terme
          </text>
          <rect
            x="70"
            y="340"
            rx="10"
            ry="10"
            width="145"
            height="38"
            fill="#f3ead8"
            stroke="#cdbfaa"
          />
          <text
            x="142"
            y="365"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#223046"
          >
            {fmt(fluxMT)}/mois
          </text>

          <text x="70" y="500" fontSize="18" fontWeight="700" fill="#1f2937">
            Court terme
          </text>
          <rect
            x="70"
            y="510"
            rx="10"
            ry="10"
            width="145"
            height="38"
            fill="#f3ead8"
            stroke="#cdbfaa"
          />
          <text
            x="142"
            y="535"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#223046"
          >
            {fmt(fluxCT)}/mois
          </text>

          <text
            x="1130"
            y="190"
            textAnchor="end"
            fontSize="18"
            fontWeight="700"
            fill="#8b6b36"
          >
            Bloqué · Fixé
          </text>
          <text
            x="1130"
            y="240"
            textAnchor="end"
            fontSize="18"
            fontWeight="700"
            fill="#8b6b36"
          >
            Bloqué · Non fixé
          </text>
          <text
            x="1130"
            y="355"
            textAnchor="end"
            fontSize="18"
            fontWeight="700"
            fill="#8b6b36"
          >
            Non bloqué · Non fixé
          </text>
          <text
            x="1130"
            y="510"
            textAnchor="end"
            fontSize="18"
            fontWeight="700"
            fill="#8b6b36"
          >
            Épargne de précaution
          </text>
        </svg>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#ddd6ca] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
            Atout principal
          </div>
          <p className="mt-2 text-sm leading-6 text-[#1f2937]">
            {analysePatrimoniale.force}
          </p>
        </div>

        <div className="rounded-2xl border border-[#ddd6ca] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
            Point de vigilance
          </div>
          <p className="mt-2 text-sm leading-6 text-[#1f2937]">
            {analysePatrimoniale.vigilance}
          </p>
        </div>

        <div className="rounded-2xl border border-[#ddd6ca] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
            Orientation patrimoniale
          </div>
          <p className="mt-2 text-sm leading-6 text-[#1f2937]">
            {analysePatrimoniale.orientation}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#ddd6ca] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8175]">
          Analyse de répartition
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 text-sm font-semibold text-[#1f2937] md:grid-cols-3">
          <div>Court terme : {pctCT}%</div>
          <div>Moyen terme : {pctMT}%</div>
          <div>Long terme : {pctLT}%</div>
        </div>

        <div
          className="mt-3 text-sm font-semibold"
          style={{ color: diagnosticColor }}
        >
          {pctCT > 60 || pctMT > 60 || pctLT > 70 ? "⚠ " : "✓ "} {diagnostic}
        </div>
      </div>
    </div>
  );
}