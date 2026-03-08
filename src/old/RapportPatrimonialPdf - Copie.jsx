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

  const visibleChildren =
    childrenData?.filter((c) => c?.prenom || c?.naissance) || [];

  const styles = {
    page: {
      width: "1120px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      color: "#000000",
      fontFamily: "Arial, sans-serif",
      padding: "24px",
      boxSizing: "border-box",
    },
    topCards: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "10px",
      marginBottom: "20px",
    },
    statCard: {
      border: "2px solid #000000",
      overflow: "hidden",
    },
    statHead: {
      backgroundColor: "#000000",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      padding: "10px 12px",
    },
    statValue: {
      backgroundColor: "#e6c08f",
      color: "#000000",
      fontSize: "26px",
      fontWeight: "700",
      padding: "14px 12px",
    },
    statValuePink: {
      backgroundColor: "#f5ddd7",
      color: "#000000",
      fontSize: "26px",
      fontWeight: "700",
      padding: "14px 12px",
    },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },
    card: {
      border: "2px solid #000000",
      backgroundColor: "#ffffff",
      overflow: "hidden",
    },
    sectionTitle: {
      backgroundColor: "#000000",
      color: "#ffffff",
      padding: "10px 14px",
      fontSize: "13px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
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
      fontSize: "12px",
      fontWeight: "700",
      color: "#333333",
    },
    value: {
      minHeight: "28px",
      border: "1px solid #000000",
      backgroundColor: "#f3f3f3",
      padding: "6px 8px",
      fontSize: "13px",
      color: "#000000",
      boxSizing: "border-box",
      wordBreak: "break-word",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    },
    th: {
      border: "1px solid #000000",
      backgroundColor: "#e6c08f",
      color: "#000000",
      padding: "7px 8px",
      fontSize: "12px",
      fontWeight: "700",
      textAlign: "left",
      verticalAlign: "top",
    },
    td: {
      border: "1px solid #000000",
      padding: "7px 8px",
      fontSize: "12px",
      color: "#000000",
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
      border: "1px solid #000000",
      backgroundColor: "#f7f1e8",
      padding: "10px 12px",
      fontSize: "13px",
      fontWeight: "700",
      color: "#000000",
      boxSizing: "border-box",
    },
    pageBreakAvoid: {
      breakInside: "avoid",
      pageBreakInside: "avoid",
      marginBottom: "16px",
    },
  };

  const renderField = (label, value) => (
    <div style={styles.fieldBlock}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value || ""}</div>
    </div>
  );

  return (
    <div id="rapport-pdf" style={styles.page}>
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
          <div style={styles.statValuePink}>{euro(budgetDisponible)}</div>
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
              {renderField("Nom", investorIdentity["Nom"])}
              {renderField("Prénom", investorIdentity["Prénom"])}
              {renderField("Date de naissance", investorIdentity["Date de naissance"])}
              {renderField("Lieu de naissance", investorIdentity["Lieu de naissance"])}
              {renderField("Adresse", investorIdentity["Adresse"])}
              {renderField("Nationalité", investorIdentity["Nationalité"])}
              {renderField("Téléphone", investorIdentity["Téléphone"])}
              {renderField("Email", investorIdentity["Email"])}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Situation familiale et professionnelle</div>
          <div style={styles.sectionBody}>
            <div style={styles.fieldsGrid}>
              {renderField("Situation matrimoniale", investorFamily["Situation matrimoniale"])}
              {renderField("Régime matrimonial", investorFamily["Régime matrimonial"])}
              {renderField(
                "Date mariage / pacs / concubinage",
                investorFamily["Date mariage / pacs / concubinage"]
              )}
              {renderField("Lieu mariage / pacs", investorFamily["Lieu mariage / pacs"])}
              {renderField("Profession", investorProfessional["Profession"])}
              {renderField("Depuis la date du", investorProfessional["Depuis la date du"])}
              {renderField(
                "Nom de la dernière société",
                investorProfessional["Nom de la dernière société"]
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
                {Object.entries(income).map(([k, v]) => (
                  <tr key={k}>
                    <td style={styles.td}>{k}</td>
                    <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>Total</td>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>
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
                {Object.entries(charges).map(([k, v]) => (
                  <tr key={k}>
                    <td style={styles.td}>{k}</td>
                    <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>Total</td>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>
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
                {Object.entries(loisirs).map(([k, v]) => (
                  <tr key={k}>
                    <td style={styles.td}>{k}</td>
                    <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>Total</td>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>
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
                {Object.entries(epargne).map(([k, v]) => (
                  <tr key={k}>
                    <td style={styles.td}>{k}</td>
                    <td style={{ ...styles.td, width: "170px" }}>{euro(v)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>Total</td>
                  <td style={{ ...styles.td, fontWeight: "700", backgroundColor: "#f7f1e8" }}>
                    {euro(totalEpargneMensuelle)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={styles.summaryGrid3}>
              <div style={styles.summaryBox}>Budget disponible : {euro(budgetDisponible)}</div>
              <div style={styles.summaryBox}>Budget projets : {euro(budgetProjet)}</div>
              <div style={styles.summaryBox}>
                Précaution recommandée : {euro(epargnePrecautionReco)}
              </div>
            </div>

            <div style={{ ...styles.summaryBox, marginTop: "12px" }}>
              Épargne de précaution disponible : {euro(precaution)}
            </div>
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
                <th style={{ ...styles.th, width: "40%" }}>Type de compte / placement</th>
                <th style={{ ...styles.th, width: "18%" }}>Montant</th>
                <th style={{ ...styles.th, width: "24%" }}>Banque / organisme</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
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
              Court terme : {euro(assetsByCat["Court terme"])}
            </div>
            <div style={styles.summaryBox}>
              Moyen terme : {euro(assetsByCat["Moyen terme"])}
            </div>
            <div style={styles.summaryBox}>
              Long terme : {euro(assetsByCat["Long terme"])}
            </div>
            <div style={styles.summaryBox}>Total : {euro(totalAssets)}</div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, ...styles.pageBreakAvoid }}>
        <div style={styles.sectionTitle}>Biens immobiliers</div>
        <div style={styles.sectionBody}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "16%" }}>Type</th>
                <th style={{ ...styles.th, width: "12%" }}>Valeur</th>
                <th style={{ ...styles.th, width: "8%" }}>Surface</th>
                <th style={{ ...styles.th, width: "24%" }}>Adresse</th>
                <th style={{ ...styles.th, width: "12%" }}>Date acquisition</th>
                <th style={{ ...styles.th, width: "10%" }}>Date fin</th>
                <th style={{ ...styles.th, width: "9%" }}>Mensualité</th>
                <th style={{ ...styles.th, width: "9%" }}>Reste dû</th>
              </tr>
            </thead>
            <tbody>
              {realEstate.map((r, i) => (
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
            <div style={styles.summaryBox}>Total immobilier : {euro(totalImmo)}</div>
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
  );
}