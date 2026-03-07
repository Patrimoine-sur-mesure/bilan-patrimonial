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

  return (
    <div className="mt-10 border-2 border-black bg-[#f4f4f4] px-6 py-8">
      <div className="mb-8 text-center text-4xl font-bold text-[#c6923f]">
        Stocks / Flux actuels
      </div>

      <div className="grid grid-cols-[180px_1fr_220px] items-center gap-6">
        {/* Colonne gauche */}
        <div className="relative h-[560px]">
          <div className="absolute left-2 top-0 text-3xl font-black text-black">
            PERFORMANT
          </div>

          <div className="absolute left-6 top-10 h-[470px] w-[10px] bg-[#2b2840]" />
          <div className="absolute left-[-2px] top-0 h-0 w-0 border-l-[33px] border-r-[33px] border-b-[42px] border-l-transparent border-r-transparent border-b-[#2b2840]" />
          <div className="absolute left-[42px] top-[2px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-black text-[42px] font-bold text-white">
            +
          </div>

          <div className="absolute left-6 top-[125px]">
            <div className="mb-2 text-lg font-bold text-black">Long terme</div>
            <div className="inline-block rounded bg-[#eadfc8] px-3 py-1 text-base font-bold text-[#6c2bd9]">
              {fmt(fluxLT)}/mois
            </div>
          </div>

          <div className="absolute left-6 top-[265px]">
            <div className="mb-2 text-lg font-bold text-black">Moyen terme</div>
            <div className="inline-block rounded bg-[#eadfc8] px-3 py-1 text-base font-bold text-[#6c2bd9]">
              {fmt(fluxMT)}/mois
            </div>
          </div>

          <div className="absolute left-6 top-[420px]">
            <div className="mb-2 text-lg font-bold text-black">Court terme</div>
            <div className="inline-block rounded bg-[#eadfc8] px-3 py-1 text-base font-bold text-[#6c2bd9]">
              {fmt(fluxCT)}/mois
            </div>
          </div>
        </div>

        {/* Centre */}
        <div className="relative mx-auto h-[560px] w-[760px]">
          {/* Pyramide */}
          <div
            className="absolute bottom-0 left-1/2 h-[470px] w-[560px] -translate-x-1/2"
            style={{
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
              background: "#e6dcc8",
              border: "2px solid #c6923f",
            }}
          />

          {/* Séparations */}
          <div className="absolute left-1/2 top-[155px] w-[250px] -translate-x-1/2 border-t-2 border-dashed border-black" />
          <div className="absolute left-1/2 top-[300px] w-[380px] -translate-x-1/2 border-t-2 border-dashed border-black" />

          {/* LT */}
          <div className="absolute left-1/2 top-[68px] -translate-x-1/2 text-center">
            <div className="text-[18px] text-[#c6923f]">Immo locatif · SCPI · PER · AV</div>
            <div className="mt-2 text-[36px] font-bold text-[#6c2bd9]">{fmt(stockLT)}</div>
            <div className="mt-1 text-[28px] font-semibold text-black">Long terme</div>
          </div>

          {/* MT */}
          <div className="absolute left-1/2 top-[225px] -translate-x-1/2 text-center">
            <div className="text-[18px] text-[#c6923f]">Assurance vie · PEA · PEL</div>
            <div className="mt-2 text-[36px] font-bold text-[#6c2bd9]">{fmt(stockMT)}</div>
            <div className="mt-1 text-[28px] font-semibold text-black">Moyen terme</div>
          </div>

          {/* CT */}
          <div className="absolute bottom-[36px] left-1/2 w-[480px] -translate-x-1/2 text-center">
            <div className="text-[20px] text-[#c6923f]">
              Liquidités et livrets :
              <span className="ml-2 font-bold text-[#6c2bd9]">{fmt(stockCT)}</span>
            </div>
            <div className="mt-2 text-[30px] font-semibold text-black">Court terme</div>
          </div>

          {/* RP diagonale beaucoup plus fine */}
          <div
            className="absolute right-[145px] top-[130px] h-[300px] w-[24px] bg-[#f9f7f2]"
            style={{
              border: "2px solid #c6923f",
              transform: "rotate(38deg)",
              transformOrigin: "center",
            }}
          />
          <div
            className="absolute right-[105px] top-[205px] text-[18px] text-black"
            style={{ transform: "rotate(58deg)" }}
          >
            Résidence principale
          </div>
        </div>

        {/* Colonne droite */}
        <div className="relative h-[560px]">
          <div className="absolute right-2 top-0 text-right text-3xl font-black text-black">
            CONTRAIGNANT
          </div>

          <div className="absolute right-6 top-10 h-[470px] w-[10px] bg-[#2b2840]" />
          <div className="absolute right-[-2px] top-0 h-0 w-0 border-l-[33px] border-r-[33px] border-b-[42px] border-l-transparent border-r-transparent border-b-[#2b2840]" />
          <div className="absolute right-[42px] top-[2px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-black text-[42px] font-bold text-white">
            +
          </div>

          <div className="absolute right-0 top-[130px] text-right text-[22px] font-bold text-[#ff5a36]">
            Bloqué ; Fixé
          </div>
          <div className="absolute right-0 top-[195px] text-right text-[22px] font-bold text-[#ff5a36]">
            Bloqué ; Non fixé
          </div>
          <div className="absolute right-0 top-[335px] text-right text-[22px] font-bold text-[#ff5a36]">
            Non bloqué ; Non fixé
          </div>
          <div className="absolute right-0 top-[455px] text-right text-[22px] font-bold text-[#ff5a36]">
            Épargne de précaution
          </div>
        </div>
      </div>
    </div>
  );
}