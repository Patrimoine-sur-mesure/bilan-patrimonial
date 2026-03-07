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

  const totalStock = Number(stockCT || 0) + Number(stockMT || 0) + Number(stockLT || 0);

  const pct = (value) => {
    if (!totalStock) return 0;
    return Math.round((Number(value || 0) / totalStock) * 100);
  };

  const cardBase =
    "rounded-2xl border-2 border-black bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.08)]";
  const valueClass = "text-3xl font-bold text-[#5b2be0]";
  const labelClass = "text-sm font-semibold uppercase tracking-wide text-neutral-500";

  return (
    <div className="mt-10 rounded-2xl border-2 border-black bg-[#f6f3ee] p-6 shadow-[0_8px_0_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Analyse patrimoniale
          </div>
          <h3 className="mt-1 text-4xl font-bold text-[#c6923f]">
            Allocation patrimoniale actuelle
          </h3>
        </div>

        <div className="rounded-xl border border-black bg-white px-4 py-3 text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Stock total
          </div>
          <div className="text-2xl font-bold text-black">{fmt(totalStock)}</div>
        </div>
      </div>

      {/* Barre de répartition */}
      <div className="mb-8 overflow-hidden rounded-full border-2 border-black bg-white">
        <div className="flex h-5 w-full">
          <div
            className="h-full bg-[#dcc79b]"
            style={{ width: `${pct(stockCT)}%` }}
            title={`Court terme ${pct(stockCT)}%`}
          />
          <div
            className="h-full bg-[#c9b07a]"
            style={{ width: `${pct(stockMT)}%` }}
            title={`Moyen terme ${pct(stockMT)}%`}
          />
          <div
            className="h-full bg-[#b98d4a]"
            style={{ width: `${pct(stockLT)}%` }}
            title={`Long terme ${pct(stockLT)}%`}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={cardBase}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Court terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Liquidité forte
              </div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pct(stockCT)}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className={valueClass}>{fmt(stockCT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxCT)}/mois</div>
            </div>

            <div className="rounded-xl border border-black bg-[#faf7f1] p-3 text-sm text-neutral-700">
              Livrets, disponibilités, épargne de précaution, trésorerie mobilisable.
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Moyen terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Équilibre / flexibilité
              </div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pct(stockMT)}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className={valueClass}>{fmt(stockMT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxMT)}/mois</div>
            </div>

            <div className="rounded-xl border border-black bg-[#faf7f1] p-3 text-sm text-neutral-700">
              Assurance vie, PEA, PEL et placements de capitalisation à horizon intermédiaire.
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className={labelClass}>Long terme</div>
              <div className="mt-1 text-lg font-bold text-black">
                Vision patrimoniale
              </div>
            </div>
            <div className="rounded-full border border-black bg-[#f3ead8] px-3 py-1 text-sm font-bold text-black">
              {pct(stockLT)}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className={labelClass}>Stock actuel</div>
              <div className={valueClass}>{fmt(stockLT)}</div>
            </div>

            <div>
              <div className={labelClass}>Flux mensuel</div>
              <div className="text-xl font-bold text-black">{fmt(fluxLT)}/mois</div>
            </div>

            <div className="rounded-xl border border-black bg-[#faf7f1] p-3 text-sm text-neutral-700">
              Immobilier locatif, SCPI, PER, placements de préparation retraite et de transmission.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-black bg-white p-4">
          <div className={labelClass}>Lecture court terme</div>
          <div className="mt-2 text-sm text-neutral-700">
            Capital disponible rapidement, utile pour sécurité et projets proches.
          </div>
        </div>

        <div className="rounded-xl border border-black bg-white p-4">
          <div className={labelClass}>Lecture moyen terme</div>
          <div className="mt-2 text-sm text-neutral-700">
            Zone charnière entre flexibilité, rendement potentiel et horizon d’attente.
          </div>
        </div>

        <div className="rounded-xl border border-black bg-white p-4">
          <div className={labelClass}>Lecture long terme</div>
          <div className="mt-2 text-sm text-neutral-700">
            Poche de construction patrimoniale, moins liquide mais plus stratégique.
          </div>
        </div>

        <div className="rounded-xl border border-black bg-[#fff8ea] p-4">
          <div className={labelClass}>Objectif du visuel</div>
          <div className="mt-2 text-sm text-neutral-700">
            Visualiser immédiatement la répartition entre sécurité, équilibre et projection long terme.
          </div>
        </div>
      </div>
    </div>
  );
}