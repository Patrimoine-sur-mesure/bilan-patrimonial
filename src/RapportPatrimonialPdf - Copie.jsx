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

  const toNumber = (v) => Number(v) || 0;

  const visibleChildren =
    childrenData?.filter((c) => c?.prenom || c?.naissance) || [];

  const epargneMensuelleCT =
    toNumber(epargne?.["Livrets"]) + toNumber(epargne?.["Autres épargne CT"]);

  const epargneMensuelleMT =
    toNumber(epargne?.["Assurance vie"]) +
    toNumber(epargne?.["Autres épargne MT"]);

  const epargneMensuelleLT =
    toNumber(epargne?.["Investissement locatif"]) +
    toNumber(epargne?.["Autres épargne LT"]);

  const styles = {
    page: {
      width: "1120px",
      margin: "0 auto",
      backgroundColor: "#f8f5ef",
      color: "#1f2937",
      fontFamily: "Arial, sans-serif",
      padding: "24px",
      boxSizing: "border-box",
    },
	
	  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
    padding: "14px 18px",
    border: "1px solid #ddd6ca",
    borderRadius: "16px",
    backgroundColor: "#fcfaf7",
  },

  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  headerEyebrow: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    color: "#8b8175",
  },

  headerTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: 1.2,
  },

  headerSubtitle: {
    fontSize: "11px",
    color: "#6b7280",
  },

  headerRight: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  headerClientLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    color: "#8b8175",
  },

  headerClientName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#223046",
  },

    pageBreakAvoid: {
      breakInside: "avoid",
      pageBreakInside: "avoid",
      marginBottom: "16px",
    },

    topCards: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "12px",
      marginBottom: "22px",
    },
    statCard: {
      border: "1px solid #d8d1c5",
      borderRadius: "18px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
    },
    statHead: {
      backgroundColor: "#1f3b57",
      color: "#ffffff",
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      padding: "10px 12px",
    },
    statValue: {
      backgroundColor: "#ffffff",
      color: "#223046",
      fontSize: "24px",
      fontWeight: "700",
      padding: "16px 12px",
    },
    statValueSoft: {
      backgroundColor: "#fcfaf7",
      color: "#223046",
      fontSize: "24px",
      fontWeight: "700",
      padding: "16px 12px",
    },

    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },

    card: {
      border: "1px solid #d8d1c5",
      borderRadius: "20px",
      backgroundColor: "#ffffff",
      overflow: "hidden",
    },
    sectionTitle: {
      background:
        "linear-gradient(90deg, #10273d 0%, #1f3b57 55%, #2c4d6f 100%)",
      color: "#ffffff",
      padding: "11px 14px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
    },
    sectionBody: {
      padding: "14px",
    },

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
    },
    fieldBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    label: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    },
    value: {
      minHeight: "30px",
      border: "1px solid #ddd6ca",
      backgroundColor: "#fcfaf7",
      padding: "7px 9px",
      fontSize: "13px",
      color: "#1f2937",
      boxSizing: "border-box",
      wordBreak: "break-word",
      borderRadius: "8px",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    },
    th: {
      border: "1px solid #ddd6ca",
      backgroundColor: "#f8f5ef",
      color: "#1f2937",
      padding: "8px 8px",
      fontSize: "11px",
      fontWeight: "700",
      textAlign: "left",
      verticalAlign: "top",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
    },
    td: {
      border: "1px solid #e7dfd4",
      padding: "8px 8px",
      fontSize: "12px",
      color: "#1f2937",
      verticalAlign: "top",
      wordBreak: "break-word",
    },

    summaryGrid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginTop: "12px",
    },
    summaryGrid4: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "12px",
      marginTop: "12px",
    },
    summaryBox: {
      border: "1px solid #ddd6ca",
      backgroundColor: "#fcfaf7",
      padding: "10px 12px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#223046",
      boxSizing: "border-box",
      borderRadius: "12px",
    },

    pyramidCard: {
      border: "1px solid #d8d1c5",
      borderRadius: "22px",
      backgroundColor: "#ffffff",
      padding: "18px",
      marginBottom: "16px",
    },
    pyramidEyebrow: {
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      color: "#8b8175",
      marginBottom: "6px",
    },
    pyramidTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "6px",
    },
    pyramidText: {
      fontSize: "13px",
      lineHeight: 1.5,
      color: "#6b7280",
      marginBottom: "18px",
    },
    pyramidKpis: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "18px",
    },
    pyramidKpi: {
      border: "1px solid #ddd6ca",
      backgroundColor: "#fcfaf7",
      borderRadius: "14px",
      padding: "10px 12px",
    },
    pyramidKpiLabel: {
      fontSize: "10px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#8b8175",
      marginBottom: "4px",
    },
    pyramidKpiValue: {
      fontSize: "21px",
      fontWeight: "700",
      color: "#223046",
    },
    pyramidInsights: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginTop: "16px",
    },
    insightBox: {
      border: "1px solid #ddd6ca",
      borderRadius: "14px",
      padding: "12px",
      backgroundColor: "#ffffff",
    },
    insightLabel: {
      fontSize: "10px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#8b8175",
      marginBottom: "6px",
    },
    insightText: {
      fontSize: "12px",
      lineHeight: 1.5,
      color: "#1f2937",
    },
  };

  const totalStock =
    toNumber(assetsByCat?.["Court terme"]) +
    toNumber(assetsByCat?.["Moyen terme"]) +
    toNumber(assetsByCat?.["Long terme"]);

  const totalFlux =
    toNumber(epargneMensuelleCT) +
    toNumber(epargneMensuelleMT) +
    toNumber(epargneMensuelleLT);

  const pctCT = totalStock
    ? Math.round((toNumber(assetsByCat?.["Court terme"]) / totalStock) * 100)
    : 0;
  const pctMT = totalStock
    ? Math.round((toNumber(assetsByCat?.["Moyen terme"]) / totalStock) * 100)
    : 0;
  const pctLT = totalStock
    ? Math.round((toNumber(assetsByCat?.["Long terme"]) / totalStock) * 100)
    : 0;

  const score =
    10 -
    Math.abs(pctCT - 30) / 10 -
    Math.abs(pctMT - 40) / 10 -
    Math.abs(pctLT - 30) / 10;

  const scorePatrimonial = Math.max(0, Math.min(10, score)).toFixed(1);

  let force = "Bonne base de capitalisation patrimoniale.";
  let vigilance = "Répartition globalement cohérente.";
  let orientation = "Maintenir une allocation disciplinée dans le temps.";

  if (pctLT >= 45) {
    force = "Capacité de projection long terme déjà bien installée.";
  } else if (pctCT >= 35) {
    force = "Bonne disponibilité immédiate pour la sécurité patrimoniale.";
  } else if (pctMT >= 30) {
    force = "Poche intermédiaire intéressante pour la flexibilité.";
  }

  if (pctCT > 50) {
    vigilance = "Concentration élevée sur les actifs liquides.";
    orientation =
      "Redéployer progressivement une partie du court terme vers le moyen ou long terme.";
  } else if (pctLT > 70) {
    vigilance =
      "Patrimoine très orienté long terme, avec moindre flexibilité.";
    orientation =
      "Renforcer la poche intermédiaire afin d'améliorer l'agilité patrimoniale.";
  } else if (pctMT < 15) {
    vigilance = "Poche moyen terme relativement faible.";
    orientation =
      "Consolider les supports intermédiaires pour mieux équilibrer la structure.";
  }

  const renderField = (label, value) => (
    <div style={styles.fieldBlock}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value || ""}</div>
    </div>
  );

  return (
    <div id="rapport-pdf" style={styles.page}>
<div id="pdf-page-1">
  <div style={styles.header}>
    <div style={styles.headerLeft}>
      <div style={styles.headerEyebrow}>Bilan patrimonial</div>
      <div style={styles.headerTitle}>Synthèse patrimoniale client</div>
      <div style={styles.headerSubtitle}>
        Vision consolidée des revenus, charges, capacités d’épargne, actifs financiers et patrimoine immobilier.
      </div>
    </div>

    <div style={styles.headerRight}>
      <div style={styles.headerClientLabel}>Client</div>
      <div style={styles.headerClientName}>
        {investorIdentity?.["Prénom"] || ""} {investorIdentity?.["Nom"] || ""}
      </div>
    </div>
  </div>
        <div style={styles.topCards}>
          <div style={styles.statCard}>
            <div style={styles.statHead}>Revenus mensuels</div>
            <div style={styles.statValue}>{euro(totalIncome)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHead}>Charges</div>
            <div style={styles.statValue}>{euro(totalCharges)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHead}>Budget disponible</div>
            <div style={styles.statValueSoft}>{euro(budgetDisponible)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHead}>Patrimoine brut</div>
            <div style={styles.statValue}>{euro(patrimoineBrut)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHead}>Taux de charges</div>
            <div style={styles.statValue}>{tauxCharges.toFixed(0)}%</div>
          </div>
        </div>

        <div style={styles.row2}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Informations investisseur</div>
            <div style={styles.sectionBody}>
              <div style={styles.fieldsGrid}>
                {renderField("Nom", investorIdentity?.["Nom"])}
                {renderField("Prénom", investorIdentity?.["Prénom"])}
                {renderField(
                  "Date de naissance",
                  investorIdentity?.["Date de naissance"]
                )}
                {renderField(
                  "Lieu de naissance",
                  investorIdentity?.["Lieu de naissance"]
                )}
                {renderField("Adresse", investorIdentity?.["Adresse"])}
                {renderField("Nationalité", investorIdentity?.["Nationalité"])}
                {renderField("Téléphone", investorIdentity?.["Téléphone"])}
                {renderField("Email", investorIdentity?.["Email"])}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              Situation familiale et professionnelle
            </div>
            <div style={styles.sectionBody}>
              <div style={styles.fieldsGrid}>
                {renderField(
                  "Situation matrimoniale",
                  investorFamily?.["Situation matrimoniale"]
                )}
                {renderField(
                  "Régime matrimonial",
                  investorFamily?.["Régime matrimonial"]
                )}
                {renderField(
                  "Date mariage / pacs / concubinage",
                  investorFamily?.["Date mariage / pacs / concubinage"]
                )}
                {renderField(
                  "Lieu mariage / pacs",
                  investorFamily?.["Lieu mariage / pacs"]
                )}
                {renderField("Profession", investorProfessional?.["Profession"])}
                {renderField(
                  "Depuis la date du",
                  investorProfessional?.["Depuis la date du"]
                )}
                {renderField(
                  "Nom de la dernière société",
                  investorProfessional?.["Nom de la dernière société"]
                )}
              </div>
            </div>
          </div>
        </div>

        {visibleChildren.length > 0 && (
          <div style={{ ...styles.card, ...styles.pageBreakAvoid }}>
            <div style={styles.sectionTitle}>Enfants</div>
            <div style={styles.sectionBody}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Prénom</th>
                    <th style={styles.th}>Date de naissance</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleChildren.map((child, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{child.prenom || ""}</td>
                      <td style={styles.td}>{child.naissance || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={styles.row2}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Revenus mensuels</div>
            <div style={styles.sectionBody}>
              <table style={styles.table}>
                <tbody>
                  {Object.entries(income || {}).map(([k, v]) => (
                    <tr key={k}>
                      <td style={styles.td}>{k}</td>
                      <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      {euro(totalIncome)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Charges incompressibles</div>
            <div style={styles.sectionBody}>
              <table style={styles.table}>
                <tbody>
                  {Object.entries(charges || {}).map(([k, v]) => (
                    <tr key={k}>
                      <td style={styles.td}>{k}</td>
                      <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      {euro(totalCharges)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={styles.row2}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Loisirs</div>
            <div style={styles.sectionBody}>
              <table style={styles.table}>
                <tbody>
                  {Object.entries(loisirs || {}).map(([k, v]) => (
                    <tr key={k}>
                      <td style={styles.td}>{k}</td>
                      <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      {euro(totalLoisirs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Épargne mensuelle actuelle</div>
            <div style={styles.sectionBody}>
              <table style={styles.table}>
                <tbody>
                  {Object.entries(epargne || {}).map(([k, v]) => (
                    <tr key={k}>
                      <td style={styles.td}>{k}</td>
                      <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        backgroundColor: "#fcfaf7",
                      }}
                    >
                      {euro(totalEpargneMensuelle)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.summaryGrid3}>
                <div style={styles.summaryBox}>
                  Budget disponible : {euro(budgetDisponible)}
                </div>
                <div style={styles.summaryBox}>
                  Budget projets : {euro(budgetProjet)}
                </div>
                <div style={styles.summaryBox}>
                  Précaution recommandée : {euro(epargnePrecautionReco)}
                </div>
              </div>

              <div style={{ ...styles.summaryBox, marginTop: "12px" }}>
                Épargne de précaution : {euro(precaution)}
              </div>
            </div>
          </div>
        </div>
      </div>

<div id="pdf-page-2">
  <div style={styles.header}>
    <div style={styles.headerLeft}>
      <div style={styles.headerEyebrow}>Bilan patrimonial</div>
      <div style={styles.headerTitle}>Structure patrimoniale</div>
      <div style={styles.headerSubtitle}>
        Lecture des placements financiers, répartition par horizon de détention et valorisation globale.
      </div>
    </div>

    <div style={styles.headerRight}>
      <div style={styles.headerClientLabel}>Client</div>
      <div style={styles.headerClientName}>
        {investorIdentity?.["Prénom"] || ""} {investorIdentity?.["Nom"] || ""}
      </div>
    </div>
  </div>
	  
        <div style={{ ...styles.card, ...styles.pageBreakAvoid }}>
          <div style={styles.sectionTitle}>Épargne / stock</div>
          <div style={styles.sectionBody}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "18%" }}>Catégorie</th>
                  <th style={{ ...styles.th, width: "40%" }}>
                    Type de compte / placement
                  </th>
                  <th style={{ ...styles.th, width: "18%" }}>Montant</th>
                  <th style={{ ...styles.th, width: "24%" }}>
                    Banque / organisme
                  </th>
                </tr>
              </thead>
              <tbody>
                {(assets || []).map((a, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{a.categorie}</td>
                    <td style={styles.td}>{a.type}</td>
                    <td style={styles.td}>{euro(a.montant)}</td>
                    <td style={styles.td}>{a.banque || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.summaryGrid4}>
              <div style={styles.summaryBox}>
                Court terme : {euro(assetsByCat?.["Court terme"])}
              </div>
              <div style={styles.summaryBox}>
                Moyen terme : {euro(assetsByCat?.["Moyen terme"])}
              </div>
              <div style={styles.summaryBox}>
                Long terme : {euro(assetsByCat?.["Long terme"])}
              </div>
              <div style={styles.summaryBox}>Total : {euro(totalAssets)}</div>
            </div>
          </div>
        </div>
      </div>

<div id="pdf-page-3">
  <div style={styles.header}>
    <div style={styles.headerLeft}>
      <div style={styles.headerEyebrow}>Bilan patrimonial</div>
      <div style={styles.headerTitle}>Analyse patrimoniale</div>
      <div style={styles.headerSubtitle}>
        Lecture des stocks, flux mensuels, pyramide patrimoniale et patrimoine immobilier.
      </div>
    </div>

    <div style={styles.headerRight}>
      <div style={styles.headerClientLabel}>Client</div>
      <div style={styles.headerClientName}>
        {investorIdentity?.["Prénom"] || ""} {investorIdentity?.["Nom"] || ""}
      </div>
    </div>
  </div>


        <div style={{ ...styles.card, ...styles.pageBreakAvoid }}>
          <div style={styles.pyramidCard}>
            <div style={styles.pyramidEyebrow}>Analyse patrimoniale</div>
            <div style={styles.pyramidTitle}>Pyramide patrimoniale actuelle</div>
            <div style={styles.pyramidText}>
              Lecture consolidée des stocks patrimoniaux et des flux mensuels par
              horizon de détention, dans une logique de disponibilité, de
              flexibilité et de capitalisation long terme.
            </div>

            <div style={styles.pyramidKpis}>
              <div style={styles.pyramidKpi}>
                <div style={styles.pyramidKpiLabel}>Stock total</div>
                <div style={styles.pyramidKpiValue}>{euro(totalStock)}</div>
              </div>
              <div style={styles.pyramidKpi}>
                <div style={styles.pyramidKpiLabel}>Flux mensuel total</div>
                <div style={styles.pyramidKpiValue}>{euro(totalFlux)}/mois</div>
              </div>
              <div style={styles.pyramidKpi}>
                <div style={styles.pyramidKpiLabel}>Score patrimonial</div>
                <div style={styles.pyramidKpiValue}>{scorePatrimonial} / 10</div>
              </div>
            </div>

            <svg
              viewBox="0 0 1200 640"
              width="100%"
              height="auto"
              role="img"
              aria-label="Pyramide patrimoniale"
            >
              <defs>
                <linearGradient id="pdfPyramidBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#efe4cf" />
                  <stop offset="100%" stopColor="#deceb0" />
                </linearGradient>
              </defs>

              <polygon
                points="600,70 980,560 220,560"
                fill="url(#pdfPyramidBg)"
                stroke="#c6923f"
                strokeWidth="2.5"
              />

              <line
                x1="455"
                y1="240"
                x2="745"
                y2="240"
                stroke="#cdbfaa"
                strokeWidth="2"
                strokeDasharray="7 7"
              />
              <line
                x1="365"
                y1="400"
                x2="835"
                y2="400"
                stroke="#cdbfaa"
                strokeWidth="2"
                strokeDasharray="7 7"
              />

              <text
                x="600"
                y="150"
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
                y="190"
                textAnchor="middle"
                fontSize="34"
                fontWeight="700"
                fill="#223046"
              >
                {euro(assetsByCat?.["Long terme"])}
              </text>
              <text
                x="600"
                y="220"
                textAnchor="middle"
                fontSize="16"
                fill="#8b6e3e"
              >
                Immobilier locatif · SCPI · PER · capitalisation longue
              </text>

              <text
                x="600"
                y="320"
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
                y="360"
                textAnchor="middle"
                fontSize="34"
                fontWeight="700"
                fill="#223046"
              >
                {euro(assetsByCat?.["Moyen terme"])}
              </text>
              <text
                x="600"
                y="390"
                textAnchor="middle"
                fontSize="16"
                fill="#8b6e3e"
              >
                Assurance vie · PEA · PEL · horizon intermédiaire
              </text>

              <text
                x="600"
                y="470"
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
                y="510"
                textAnchor="middle"
                fontSize="34"
                fontWeight="700"
                fill="#223046"
              >
                {euro(assetsByCat?.["Court terme"])}
              </text>
              <text
                x="600"
                y="540"
                textAnchor="middle"
                fontSize="16"
                fill="#8b6e3e"
              >
                Liquidités · livrets · épargne de précaution
              </text>

              <text x="70" y="180" fontSize="18" fontWeight="700" fill="#1f2937">
                Long terme
              </text>
              <rect
                x="70"
                y="190"
                rx="10"
                ry="10"
                width="150"
                height="40"
                fill="#f3ead8"
                stroke="#cdbfaa"
              />
              <text
                x="145"
                y="216"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#223046"
              >
                {euro(epargneMensuelleLT)}/mois
              </text>

              <text x="70" y="340" fontSize="18" fontWeight="700" fill="#1f2937">
                Moyen terme
              </text>
              <rect
                x="70"
                y="350"
                rx="10"
                ry="10"
                width="150"
                height="40"
                fill="#f3ead8"
                stroke="#cdbfaa"
              />
              <text
                x="145"
                y="376"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#223046"
              >
                {euro(epargneMensuelleMT)}/mois
              </text>

              <text x="70" y="510" fontSize="18" fontWeight="700" fill="#1f2937">
                Court terme
              </text>
              <rect
                x="70"
                y="520"
                rx="10"
                ry="10"
                width="150"
                height="40"
                fill="#f3ead8"
                stroke="#cdbfaa"
              />
              <text
                x="145"
                y="546"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="#223046"
              >
                {euro(epargneMensuelleCT)}/mois
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
                y="245"
                textAnchor="end"
                fontSize="18"
                fontWeight="700"
                fill="#8b6b36"
              >
                Bloqué · Non fixé
              </text>
              <text
                x="1130"
                y="365"
                textAnchor="end"
                fontSize="18"
                fontWeight="700"
                fill="#8b6b36"
              >
                Non bloqué · Non fixé
              </text>
              <text
                x="1130"
                y="525"
                textAnchor="end"
                fontSize="18"
                fontWeight="700"
                fill="#8b6b36"
              >
                Épargne de précaution
              </text>
            </svg>

            <div style={styles.pyramidInsights}>
              <div style={styles.insightBox}>
                <div style={styles.insightLabel}>Atout principal</div>
                <div style={styles.insightText}>{force}</div>
              </div>
              <div style={styles.insightBox}>
                <div style={styles.insightLabel}>Point de vigilance</div>
                <div style={styles.insightText}>{vigilance}</div>
              </div>
              <div style={styles.insightBox}>
                <div style={styles.insightLabel}>Orientation patrimoniale</div>
                <div style={styles.insightText}>{orientation}</div>
              </div>
            </div>
          </div>

          <div style={styles.sectionTitle}>Biens immobiliers</div>
          <div style={styles.sectionBody}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "16%" }}>Type</th>
                  <th style={{ ...styles.th, width: "12%" }}>Valeur</th>
                  <th style={{ ...styles.th, width: "8%" }}>Surface</th>
                  <th style={{ ...styles.th, width: "24%" }}>Adresse</th>
                  <th style={{ ...styles.th, width: "12%" }}>
                    Date acquisition
                  </th>
                  <th style={{ ...styles.th, width: "10%" }}>Date fin</th>
                  <th style={{ ...styles.th, width: "9%" }}>Mensualité</th>
                  <th style={{ ...styles.th, width: "9%" }}>Reste dû</th>
                </tr>
              </thead>
              <tbody>
                {(realEstate || []).map((r, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{r.type}</td>
                    <td style={styles.td}>{euro(r.valeur)}</td>
                    <td style={styles.td}>{r.surface || ""}</td>
                    <td style={styles.td}>{r.adresse || ""}</td>
                    <td style={styles.td}>{r.dateAcquisition || ""}</td>
                    <td style={styles.td}>{r.dateFin || ""}</td>
                    <td style={styles.td}>{euro(r.mensualite)}</td>
                    <td style={styles.td}>{euro(r.reste)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.summaryGrid3}>
              <div style={styles.summaryBox}>
                Total immobilier : {euro(totalImmo)}
              </div>
              <div style={styles.summaryBox}>
                Mensualités : {euro(totalMensualitesImmo)}
              </div>
              <div style={styles.summaryBox}>
                Capital restant : {euro(totalResteImmo)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}