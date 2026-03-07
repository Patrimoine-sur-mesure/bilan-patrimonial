import React from "react";

export default function RapportPatrimonialPdf({
  investorIdentity,
  investorFamily,
  investorProfessional,
  childrenData,
  income,
  charges,
  loisirs,
  epargne,
  precaution,
  assets,
  realEstate,
  totalIncome,
  totalCharges,
  totalLoisirs,
  totalEpargneMensuelle,
  budgetDisponible,
  budgetProjet,
  totalAssets,
  assetsByCat,
  totalImmo,
  totalMensualitesImmo,
  totalResteImmo,
  epargnePrecautionReco,
  patrimoineBrut,
  tauxCharges,
}) {
  const euro = (v) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);

  const sectionTitle =
    "bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wide";
  const card = "border-2 border-black bg-white overflow-hidden";
  const label = "text-xs font-semibold text-gray-700";
  const value =
    "min-h-[28px] border border-black bg-[#f3f3f3] px-2 py-1 text-sm text-black break-words";
  const tableCell = "border border-black px-2 py-1 text-xs align-top";
  const tableHead = "border border-black px-2 py-1 text-xs font-bold bg-[#e6c08f] text-black";

  const visibleChildren = childrenData?.filter(
    (c) => c.prenom || c.naissance
  ) || [];

  return (
    <div
      id="rapport-pdf"
      className="mx-auto w-[1120px] bg-white p-6 text-black"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="mb-6 border-2 border-black">
        <div className="bg-[#1b7b88] px-6 py-4 text-white">
          <div className="text-2xl font-bold">Bilan patrimonial</div>
          <div className="mt-1 text-sm">
            {investorIdentity["Prénom"] || ""} {investorIdentity["Nom"] || ""}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-0">
          <div className="border-r border-black bg-[#f7f1e8] p-3">
            <div className="text-[11px] font-bold uppercase">Revenus mensuels</div>
            <div className="mt-2 text-xl font-bold">{euro(totalIncome)}</div>
          </div>
          <div className="border-r border-black bg-[#f7f1e8] p-3">
            <div className="text-[11px] font-bold uppercase">Charges</div>
            <div className="mt-2 text-xl font-bold">{euro(totalCharges)}</div>
          </div>
          <div className="border-r border-black bg-[#f5ddd7] p-3">
            <div className="text-[11px] font-bold uppercase">Budget disponible</div>
            <div className="mt-2 text-xl font-bold">{euro(budgetDisponible)}</div>
          </div>
          <div className="border-r border-black bg-[#f7f1e8] p-3">
            <div className="text-[11px] font-bold uppercase">Patrimoine brut</div>
            <div className="mt-2 text-xl font-bold">{euro(patrimoineBrut)}</div>
          </div>
          <div className="bg-[#f7f1e8] p-3">
            <div className="text-[11px] font-bold uppercase">Taux de charges</div>
            <div className="mt-2 text-xl font-bold">{tauxCharges.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className={card}>
          <div className={sectionTitle}>Informations investisseur</div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {[
              "Nom",
              "Prénom",
              "Date de naissance",
              "Lieu de naissance",
              "Adresse",
              "Nationalité",
              "Téléphone",
              "Email",
            ].map((f) => (
              <div key={f}>
                <div className={label}>{f}</div>
                <div className={value}>{investorIdentity[f] || ""}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <div className={sectionTitle}>Situation familiale et professionnelle</div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {[
              "Situation matrimoniale",
              "Régime matrimonial",
              "Date mariage / pacs / concubinage",
              "Lieu mariage / pacs",
            ].map((f) => (
              <div key={f}>
                <div className={label}>{f}</div>
                <div className={value}>{investorFamily[f] || ""}</div>
              </div>
            ))}

            {["Profession", "Depuis la date du", "Nom de la dernière société"].map((f) => (
              <div key={f}>
                <div className={label}>{f}</div>
                <div className={value}>{investorProfessional[f] || ""}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {visibleChildren.length > 0 && (
        <div className={`${card} mt-6`}>
          <div className={sectionTitle}>Enfants</div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={tableHead}>Prénom</th>
                  <th className={tableHead}>Date de naissance</th>
                </tr>
              </thead>
              <tbody>
                {visibleChildren.map((child, i) => (
                  <tr key={i}>
                    <td className={tableCell}>{child.prenom || ""}</td>
                    <td className={tableCell}>{child.naissance || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className={card}>
          <div className={sectionTitle}>Revenus mensuels</div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(income).map(([k, v]) => (
                  <tr key={k}>
                    <td className={tableCell}>{k}</td>
                    <td className={tableCell}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>Total</td>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>{euro(totalIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <div className={sectionTitle}>Charges incompressibles</div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(charges).map(([k, v]) => (
                  <tr key={k}>
                    <td className={tableCell}>{k}</td>
                    <td className={tableCell}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>Total</td>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>{euro(totalCharges)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className={card}>
          <div className={sectionTitle}>Loisirs</div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(loisirs).map(([k, v]) => (
                  <tr key={k}>
                    <td className={tableCell}>{k}</td>
                    <td className={tableCell}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>Total</td>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>{euro(totalLoisirs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <div className={sectionTitle}>Épargne mensuelle actuelle</div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(epargne).map(([k, v]) => (
                  <tr key={k}>
                    <td className={tableCell}>{k}</td>
                    <td className={tableCell}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>Total</td>
                  <td className={`${tableCell} font-bold bg-[#f7f1e8]`}>
                    {euro(totalEpargneMensuelle)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <div className={sectionTitle}>Synthèse budget</div>
          <div className="space-y-3 p-4">
            <div>
              <div className={label}>Budget disponible</div>
              <div className={value}>{euro(budgetDisponible)}</div>
            </div>
            <div>
              <div className={label}>Budget projets théorique</div>
              <div className={value}>{euro(budgetProjet)}</div>
            </div>
            <div>
              <div className={label}>Épargne de précaution disponible</div>
              <div className={value}>{euro(precaution)}</div>
            </div>
            <div>
              <div className={label}>Épargne de précaution recommandée</div>
              <div className={value}>{euro(epargnePrecautionReco)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} mt-6`}>
        <div className={sectionTitle}>Épargne / stock</div>
        <div className="p-4">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className={`${tableHead} w-[18%]`}>Catégorie</th>
                <th className={`${tableHead} w-[42%]`}>Type de compte / placement</th>
                <th className={`${tableHead} w-[18%]`}>Montant</th>
                <th className={`${tableHead} w-[22%]`}>Banque / organisme</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
                <tr key={i}>
                  <td className={`${tableCell} break-words`}>{a.categorie}</td>
                  <td className={`${tableCell} break-words`}>{a.type}</td>
                  <td className={tableCell}>{euro(a.montant)}</td>
                  <td className={`${tableCell} break-words`}>{a.banque || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Court terme : {euro(assetsByCat["Court terme"])}
            </div>
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Moyen terme : {euro(assetsByCat["Moyen terme"])}
            </div>
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Long terme : {euro(assetsByCat["Long terme"])}
            </div>
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Total : {euro(totalAssets)}
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} mt-6`}>
        <div className={sectionTitle}>Biens immobiliers</div>
        <div className="p-4">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className={`${tableHead} w-[16%]`}>Type</th>
                <th className={`${tableHead} w-[14%]`}>Valeur</th>
                <th className={`${tableHead} w-[9%]`}>Surface</th>
                <th className={`${tableHead} w-[23%]`}>Adresse</th>
                <th className={`${tableHead} w-[11%]`}>Date acquisition</th>
                <th className={`${tableHead} w-[9%]`}>Date fin</th>
                <th className={`${tableHead} w-[9%]`}>Mensualité</th>
                <th className={`${tableHead} w-[9%]`}>Reste dû</th>
              </tr>
            </thead>
            <tbody>
              {realEstate.map((r, i) => (
                <tr key={i}>
                  <td className={`${tableCell} break-words`}>{r.type}</td>
                  <td className={tableCell}>{euro(r.valeur)}</td>
                  <td className={tableCell}>{r.surface || ""}</td>
                  <td className={`${tableCell} break-words`}>{r.adresse || ""}</td>
                  <td className={tableCell}>{r.dateAcquisition || ""}</td>
                  <td className={tableCell}>{r.dateFin || ""}</td>
                  <td className={tableCell}>{euro(r.mensualite)}</td>
                  <td className={tableCell}>{euro(r.reste)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Total immobilier : {euro(totalImmo)}
            </div>
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Mensualités : {euro(totalMensualitesImmo)}
            </div>
            <div className="border border-black bg-[#f7f1e8] px-3 py-2 text-sm font-bold">
              Capital restant : {euro(totalResteImmo)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}