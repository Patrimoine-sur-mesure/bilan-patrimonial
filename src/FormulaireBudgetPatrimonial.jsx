import RapportPatrimonialPdf from "./RapportPatrimonialPdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import PyramidePatrimoineActuel from "./PyramidePatrimoineActuel";

export default function FormulaireBudgetPatrimonial() {
  const label = "text-white text-sm font-semibold";
  const input =
    "w-full border border-black bg-[#d9d9d9] px-2 py-1 text-sm text-black outline-none";
  const sectionTitle =
    "bg-[#e6c08f] text-black font-bold text-center px-2 py-1 border-b border-black";
  const totalBar =
    "bg-[#e6c08f] text-black font-bold px-2 py-1 border-t border-black";

  const investorIdentityFields = [
    "Nom",
    "Prénom",
    "Date de naissance",
    "Lieu de naissance",
    "Adresse",
    "Nationalité",
    "Téléphone",
    "Email",
  ];

  const investorFamilyFields = [
    "Situation matrimoniale",
    "Régime matrimonial",
    "Date mariage / pacs / concubinage",
    "Lieu mariage / pacs",
  ];

  const investorProfessionalFields = [
    "Profession",
    "Depuis la date du",
    "Nom de la dernière société",
  ];

  const investorChildrenCount = 4;

  const incomeFields = [
    "Salaire mensuel net avant prélèvement",
    "Revenus locatifs",
    "Revenus mobiliers",
    "Revenus BIC",
    "Revenus BNC",
    "Revenus BA",
    "Pensions",
    "Retraite",
    "Primes mensualisées",
  ];

  const chargesFields = [
    "Loyer charges comprises",
    "Impôt mensuel",
    "Impôt foncier",
    "Taxe foncière",
    "Taxe d'habitation",
    "Nourriture",
    "Pass Navigo",
    "Transport",
    "Parking",
    "Electricité / eau / chauffage",
    "Internet",
    "Téléphone",
    "Assurance",
    "Crédit résidence principale",
    "Autres crédits",
    "Pensions alimentaires",
    "Charges copropriété",
    "Autres charges",
  ];

  const loisirsFields = [
    "Restaurants",
    "Sorties",
    "Sports",
    "Vacances",
    "Vêtements / décoration",
    "Autres",
  ];

  const epargneMensuelle = [
    "Livrets",
	"Autres épargne CT",
    "Assurance vie",
	"Autres épargne MT",
    "Investissement locatif",
	"Autres épargne LT",
  ];

  const assetGroups = {
    "Court terme": [
      "Compte courant n°1",
      "Compte courant n°2",
      "Compte courant n°3",
      "Livret A",
      "LDD",
      "CEL",
      "Livret jeune",
      "Autres liquidités disponibles",
    ],
    "Moyen terme": [
      "PEL",
      "PEA",
      "PEP/PEG",
      "Assurance vie",
      "Autres placements moyen terme",
    ],
    "Long terme": [
      "PERCO",
      "PERP",
      "SCPI",
      "Autres placements long terme",
    ],
  };

  const realEstateTypes = [
    "Résidence principale",
    "Résidence secondaire",
    "Investissement locatif n°1",
    "Investissement locatif n°2",
  ];

  const mapInit = (arr) => Object.fromEntries(arr.map((i) => [i, ""]));
  const toNumber = (v) => Number(v) || 0;
  const euro = (v) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);

  const [investorIdentity, setInvestorIdentity] = useState(
    mapInit(investorIdentityFields)
  );
  const [investorFamily, setInvestorFamily] = useState(
    mapInit(investorFamilyFields)
  );
  const [investorProfessional, setInvestorProfessional] = useState(
    mapInit(investorProfessionalFields)
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [childrenData, setChildrenData] = useState(
    Array.from({ length: investorChildrenCount }, () => ({
      prenom: "",
      naissance: "",
    }))
  );

  const [income, setIncome] = useState(mapInit(incomeFields));
  const [charges, setCharges] = useState(mapInit(chargesFields));
  const [loisirs, setLoisirs] = useState(mapInit(loisirsFields));
  const [epargne, setEpargne] = useState(mapInit(epargneMensuelle));
  const [precaution, setPrecaution] = useState("");

  const [assets, setAssets] = useState(
    Object.entries(assetGroups).flatMap(([cat, items]) =>
      items.map((i) => ({ categorie: cat, type: i, montant: "", banque: "" }))
    )
  );

  const [realEstate, setRealEstate] = useState(
    realEstateTypes.map((t) => ({
      type: t,
      valeur: "",
      surface: "",
      adresse: "",
      dateAcquisition: "",
      dateFin: "",
      mensualite: "",
      reste: "",
    }))
  );

  const [saveStatus, setSaveStatus] = useState("");

  const totalIncome = useMemo(
    () => Object.values(income).reduce((a, b) => a + toNumber(b), 0),
    [income]
  );
  const totalCharges = useMemo(
    () => Object.values(charges).reduce((a, b) => a + toNumber(b), 0),
    [charges]
  );
  const totalLoisirs = useMemo(
    () => Object.values(loisirs).reduce((a, b) => a + toNumber(b), 0),
    [loisirs]
  );
  const totalEpargneMensuelle = useMemo(
    () => Object.values(epargne).reduce((a, b) => a + toNumber(b), 0),
    [epargne]
  );
  
  const epargneMensuelleCT = useMemo(
  () => toNumber(epargne["Livrets"]) + toNumber(epargne["Autres épargne CT"]),
  [epargne]
);

const epargneMensuelleMT = useMemo(
  () => toNumber(epargne["Assurance vie"]) + toNumber(epargne["Autres épargne MT"]),
  [epargne]
);

const epargneMensuelleLT = useMemo(
  () =>
    toNumber(epargne["Investissement locatif"]) +
    toNumber(epargne["Autres épargne LT"]),
  [epargne]
);

  const budgetDisponible = totalIncome - totalCharges- totalLoisirs;
  const budgetProjet = totalIncome - totalCharges - totalEpargneMensuelle - totalLoisirs;

  const totalAssets = useMemo(
    () => assets.reduce((s, a) => s + toNumber(a.montant), 0),
    [assets]
  );

  const assetsByCat = useMemo(() => {
    const r = { "Court terme": 0, "Moyen terme": 0, "Long terme": 0 };
    assets.forEach((a) => {
      r[a.categorie] += toNumber(a.montant);
    });
    return r;
  }, [assets]);

  const totalImmo = useMemo(
    () => realEstate.reduce((s, a) => s + toNumber(a.valeur), 0),
    [realEstate]
  );
  const totalMensualitesImmo = useMemo(
    () => realEstate.reduce((s, a) => s + toNumber(a.mensualite), 0),
    [realEstate]
  );
  const totalResteImmo = useMemo(
    () => realEstate.reduce((s, a) => s + toNumber(a.reste), 0),
    [realEstate]
  );
  const epargnePrecautionReco = useMemo(() => totalCharges * 6, [totalCharges]);
  const patrimoineBrut = useMemo(
    () => totalAssets + totalImmo,
    [totalAssets, totalImmo]
  );
  const tauxCharges = useMemo(
    () => (totalIncome > 0 ? (totalCharges / totalIncome) * 100 : 0),
    [totalIncome, totalCharges]
  );

  const getClientId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("client") || params.get("token") || "demo";
  };

  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const clientId = getClientId();
        const { data, error } = await supabase
          .from("formulaires_clients")
          .select("data_json, updated_at")
          .eq("client_id", clientId)
          .maybeSingle();

        if (error) {
          console.error("LOAD ERROR:", error);
          setSaveStatus("Erreur au chargement du brouillon.");
          return;
        }

        if (!data?.data_json) {
          setSaveStatus("Aucun brouillon enregistré pour ce lien.");
          return;
        }

        const saved = data.data_json;

        if (saved.investorIdentity) setInvestorIdentity(saved.investorIdentity);
        if (saved.investorFamily) setInvestorFamily(saved.investorFamily);
        if (saved.investorProfessional)
          setInvestorProfessional(saved.investorProfessional);
        if (saved.childrenData) setChildrenData(saved.childrenData);
        if (saved.income) setIncome(saved.income);
        if (saved.charges) setCharges(saved.charges);
        if (saved.loisirs) setLoisirs(saved.loisirs);
        if (saved.epargne) setEpargne(saved.epargne);
        if (typeof saved.precaution === "string") setPrecaution(saved.precaution);
        if (saved.assets) setAssets(saved.assets);
        if (saved.realEstate) setRealEstate(saved.realEstate);

        setSaveStatus("Brouillon rechargé depuis le serveur.");
      } catch (err) {
        console.error("LOAD EXCEPTION:", err);
        setSaveStatus("Impossible de recharger le brouillon.");
      }
    };

    loadFromSupabase();
  }, []);

  const updateAsset = (i, key, value) => {
    setAssets((prev) =>
      prev.map((row, index) =>
        index === i ? { ...row, [key]: value } : row
      )
    );
  };

  const updateImmo = (i, key, value) => {
    setRealEstate((prev) =>
      prev.map((row, index) =>
        index === i ? { ...row, [key]: value } : row
      )
    );
  };

  const updateChild = (i, key, value) => {
    setChildrenData((prev) =>
      prev.map((row, index) =>
        index === i ? { ...row, [key]: value } : row
      )
    );
  };

  const genererPDF = async () => {
  try {
    setIsGeneratingPdf(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const pageIds = ["pdf-page-1", "pdf-page-2", "pdf-page-3"];
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = 8;
    const marginY = 8;
    const usableWidth = pageWidth - marginX * 2;
    const usableHeight = pageHeight - marginY * 2;

    let isFirstRenderedPage = true;

    for (const pageId of pageIds) {
      const element = document.getElementById(pageId);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginY;

      if (!isFirstRenderedPage) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = marginY - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
      }

      isFirstRenderedPage = false;
    }

    const nom = investorIdentity["Nom"] || "client";
    const prenom = investorIdentity["Prénom"] || "";
    pdf.save(`bilan-patrimonial-${prenom}-${nom}.pdf`);
  } catch (err) {
    console.error("PDF ERROR:", err);
    alert("Erreur lors de la génération du PDF : " + err.message);
  } finally {
    setIsGeneratingPdf(false);
  }
};

  const handleSave = async () => {
    try {
      const clientId = getClientId();

      const payload = {
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
        updatedAt: new Date().toISOString(),
      };

      const nom = investorIdentity["Nom"] || "";
      const prenom = investorIdentity["Prénom"] || "";
      const email = investorIdentity["Email"] || "";

      const { error } = await supabase
        .from("formulaires_clients")
        .upsert(
          {
            client_id: clientId,
            client_nom: nom,
            client_prenom: prenom,
            client_email: email,
            data_json: payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "client_id" }
        );

      if (error) {
        console.error("SUPABASE ERROR:", error);
        alert("Erreur lors de la sauvegarde : " + error.message);
        return;
      }

      setSaveStatus("Brouillon enregistré sur le serveur.");
      alert("Formulaire sauvegardé.");
    } catch (err) {
      console.error("SAVE EXCEPTION:", err);
      alert("Erreur JS : " + err.message);
    }
  };

  const handleDownloadPdf = () => {
    genererPDF();
  };

  const handleSendToAdvisor = () => {
    window.open("https://ton-lien-netexplorer.fr", "_blank", "noopener,noreferrer");
  };
  
  const PyramidePatrimoineActuel = ({
  euro,
  stockCT,
  stockMT,
  stockLT,
  fluxCT,
  fluxMT,
  fluxLT,
}) => {
  return (
    <div className="mt-10 border-2 border-black bg-[#f3f3f3] px-6 py-8">
      <div className="mb-8 text-center text-4xl font-bold text-[#c6923f]">
        Stocks / Flux actuels
      </div>

      <div className="grid grid-cols-[170px_1fr_170px] items-center gap-4">
        {/* COLONNE GAUCHE */}
        <div className="relative h-[560px]">
          <div className="absolute left-0 top-0 text-[24px] font-black uppercase text-black">
            PERFORMANT
          </div>

          <div className="absolute left-[18px] top-[48px] h-[500px] w-[12px] bg-[#2b2840]" />
          <div
            className="absolute left-[0px] top-[12px] h-0 w-0 border-l-[24px] border-r-[24px] border-b-[36px] border-l-transparent border-r-transparent border-b-[#2b2840]"
          />
          <div className="absolute left-[46px] top-[6px] flex h-[54px] w-[54px] items-center justify-center rounded-full bg-black text-[42px] font-bold leading-none text-white">
            +
          </div>

          {/* LT */}
          <div className="absolute left-[22px] top-[128px] text-[18px] font-bold leading-tight text-black">
            Long terme :
          </div>
          <div className="absolute left-[86px] top-[142px] h-[16px] w-[48px] bg-[#c6923f]" />
          <div
            className="absolute left-[125px] top-[136px] h-0 w-0 border-l-[18px] border-t-[14px] border-b-[14px] border-l-[#c6923f] border-t-transparent border-b-transparent"
          />
          <div className="absolute left-[88px] top-[106px] text-[16px] font-bold text-[#6c2bd9]">
            {euro(fluxLT)}/mois
          </div>

          {/* MT */}
          <div className="absolute left-[22px] top-[280px] text-[18px] font-bold leading-tight text-black">
            Moyen terme :
          </div>
          <div className="absolute left-[86px] top-[294px] h-[16px] w-[48px] bg-[#c6923f]" />
          <div
            className="absolute left-[125px] top-[288px] h-0 w-0 border-l-[18px] border-t-[14px] border-b-[14px] border-l-[#c6923f] border-t-transparent border-b-transparent"
          />
          <div className="absolute left-[88px] top-[328px] text-[16px] font-bold text-[#6c2bd9]">
            {euro(fluxMT)}/mois
          </div>

          {/* CT */}
          <div className="absolute left-[22px] top-[448px] text-[18px] font-bold leading-tight text-black">
            Court terme :
          </div>
          <div className="absolute left-[86px] top-[462px] h-[16px] w-[48px] bg-[#c6923f]" />
          <div
            className="absolute left-[125px] top-[456px] h-0 w-0 border-l-[18px] border-t-[14px] border-b-[14px] border-l-[#c6923f] border-t-transparent border-b-transparent"
          />
          <div className="absolute left-[88px] top-[438px] text-[16px] font-bold text-[#6c2bd9]">
            {euro(fluxCT)}/mois
          </div>
        </div>

        {/* CENTRE */}
        <div className="relative mx-auto h-[560px] w-[780px]">
          {/* Pyramide */}
          <div
            className="absolute bottom-0 left-1/2 h-[470px] w-[620px] -translate-x-1/2 bg-[#e8ddc6]"
            style={{
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
              border: "2px solid #c6923f",
            }}
          />

          {/* Lignes pointillées */}
          <div className="absolute left-[120px] right-[120px] top-[180px] border-t-[3px] border-dashed border-black" />
          <div className="absolute left-[205px] right-[205px] top-[340px] border-t-[3px] border-dashed border-black" />

          {/* LT */}
          <div className="absolute left-1/2 top-[78px] w-[180px] -translate-x-1/2 text-center">
            <div className="text-[34px] font-bold text-[#6c2bd9]">{euro(stockLT)}</div>
            <div className="mt-2 text-[20px] text-[#c6923f]">Immo locatif, SCPI, PER, AV</div>
            <div className="mt-1 text-[34px] font-medium text-black">Long terme</div>
          </div>

          {/* MT */}
          <div className="absolute left-1/2 top-[240px] w-[280px] -translate-x-1/2 text-center">
            <div className="text-[34px] font-bold text-[#6c2bd9]">{euro(stockMT)}</div>
            <div className="mt-2 text-[20px] text-[#c6923f]">PEL, AV, PEA, ES</div>
            <div className="mt-1 text-[34px] font-medium text-black">Moyen terme</div>
          </div>

          {/* CT */}
          <div className="absolute bottom-[26px] left-1/2 w-[520px] -translate-x-1/2 text-center">
            <div className="text-[24px] text-[#c6923f]">
              Livrets bancaires (LA, LB, LDDS, CC Perso &amp; Pro) :
              <span className="ml-2 font-bold text-[#6c2bd9]">{euro(stockCT)}</span>
            </div>
            <div className="mt-2 text-[36px] font-medium text-black">Court terme</div>
          </div>

          {/* Barre résidence principale */}
          <div
            className="absolute right-[118px] top-[64px] h-[440px] w-[38px] bg-white"
            style={{
              border: "2px solid #c6923f",
              transform: "rotate(39deg)",
              transformOrigin: "center",
            }}
          />
          <div
            className="absolute right-[122px] top-[165px] text-[28px] text-black"
            style={{ transform: "rotate(58deg)" }}
          >
            Résidence Principale
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="relative h-[560px]">
          <div className="absolute right-0 top-0 text-[24px] font-black uppercase text-black">
            CONTRAIGNANT
          </div>

          <div className="absolute right-[18px] top-[48px] h-[500px] w-[12px] bg-[#2b2840]" />
          <div
            className="absolute right-[0px] top-[12px] h-0 w-0 border-l-[24px] border-r-[24px] border-b-[36px] border-l-transparent border-r-transparent border-b-[#2b2840]"
          />
          <div className="absolute right-[46px] top-[6px] flex h-[54px] w-[54px] items-center justify-center rounded-full bg-black text-[42px] font-bold leading-none text-white">
            +
          </div>

          <div className="absolute right-[0px] top-[128px] text-right text-[20px] font-bold text-[#ff5a36]">
            Bloqué ; Fixé
          </div>

          <div className="absolute right-[0px] top-[172px] text-right text-[20px] font-bold text-[#ff5a36]">
            Bloqué ; Non Fixé
          </div>

          <div className="absolute right-[0px] top-[316px] text-right text-[20px] font-bold text-[#ff5a36]">
            Non Bloqué ; Non Fixé
          </div>

          <div className="absolute right-[0px] top-[454px] text-right text-[20px] font-bold text-[#ff5a36]">
            Épargne de précaution
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div id="formulaire-pdf" className="min-h-screen bg-[#1b7b88] p-6 text-sm">
      <div className="mb-3 text-right text-xs font-semibold text-white">
        {saveStatus}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="overflow-hidden border-2 border-black">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Revenus mensuels
          </div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">
            {euro(totalIncome)}
          </div>
        </div>

        <div className="overflow-hidden border-2 border-black">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Charges incompressibles
          </div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">
            {euro(totalCharges)}
          </div>
        </div>

        <div className="overflow-hidden border-2 border-black">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Budget disponible
          </div>
          <div className="bg-[#f5ddd7] px-3 py-3 text-lg font-bold text-black">
            {euro(budgetDisponible)}
          </div>
        </div>

        <div className="overflow-hidden border-2 border-black">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Patrimoine brut
          </div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">
            {euro(patrimoineBrut)}
          </div>
        </div>

        <div className="overflow-hidden border-2 border-black">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Taux de charges
          </div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">
            {tauxCharges.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="border-2 border-black bg-[#1b7b88] p-0">
          <h2 className={sectionTitle}>INFORMATION INVESTISSEUR</h2>

          <div className="border-b-2 border-black p-3">
            {investorIdentityFields.map((f) => (
              <div
                key={f}
                className="mb-1 grid grid-cols-[1.1fr_1.3fr] items-center gap-2"
              >
                <label className={label}>{f} :</label>
                <input
                  className={input}
                  value={investorIdentity[f]}
                  onChange={(e) =>
                    setInvestorIdentity({
                      ...investorIdentity,
                      [f]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="border-b-2 border-black p-3">
            {investorFamilyFields.map((f) => (
              <div
                key={f}
                className="mb-1 grid grid-cols-[1.1fr_1.3fr] items-center gap-2"
              >
                <label className={label}>{f} :</label>
                <input
                  className={input}
                  value={investorFamily[f]}
                  onChange={(e) =>
                    setInvestorFamily({
                      ...investorFamily,
                      [f]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {Array.from({ length: investorChildrenCount }).map((_, i) => (
            <div key={i} className="border-b-2 border-black p-3">
              <div className="mb-1 grid grid-cols-[1.1fr_1.3fr] items-center gap-2">
                <label className={label}>Prénom enfant :</label>
                <input
                  className={input}
                  value={childrenData[i].prenom}
                  onChange={(e) => updateChild(i, "prenom", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-[1.1fr_1.3fr] items-center gap-2">
                <label className={label}>Naissance enfant :</label>
                <input
                  className={input}
                  type="date"
                  value={childrenData[i].naissance}
                  onChange={(e) => updateChild(i, "naissance", e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="p-3">
            {investorProfessionalFields.map((f) => (
              <div
                key={f}
                className="mb-1 grid grid-cols-[1.1fr_1.3fr] items-center gap-2"
              >
                <label className={label}>{f} :</label>
                <input
                  className={input}
                  value={investorProfessional[f]}
                  onChange={(e) =>
                    setInvestorProfessional({
                      ...investorProfessional,
                      [f]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Revenus (mensuel)</h3>
            <div className="p-3">
              {incomeFields.map((f) => (
                <div key={f} className="mb-1 grid grid-cols-2 items-center gap-2">
                  <label className={label}>{f}</label>
                  <input
                    className={input}
                    type="number"
                    value={income[f]}
                    onChange={(e) =>
                      setIncome({ ...income, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalIncome)}</div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Charges incompressibles (mensuel)</h3>
            <div className="p-3">
              {chargesFields.map((f) => (
                <div key={f} className="mb-1 grid grid-cols-2 items-center gap-2">
                  <label className={label}>{f}</label>
                  <input
                    className={input}
                    type="number"
                    value={charges[f]}
                    onChange={(e) =>
                      setCharges({ ...charges, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalCharges)}</div>
          </div>

          <div className="grid grid-cols-[1fr_auto] overflow-hidden border-2 border-black">
            <div className="bg-black p-2 text-center font-bold text-white">
              Budget = Revenus - Charges incompressibles
            </div>
            <div className="bg-[#f5ddd7] p-2 font-bold text-black">
              {euro(budgetDisponible)}
            </div>
          </div>


          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Loisirs (mensuel)</h3>
            <div className="p-3">
              {loisirsFields.map((f) => (
                <div key={f} className="mb-1 grid grid-cols-2 items-center gap-2">
                  <label className={label}>{f}</label>
                  <input
                    className={input}
                    type="number"
                    value={loisirs[f]}
                    onChange={(e) =>
                      setLoisirs({ ...loisirs, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalLoisirs)}</div>
          </div>
		  		  
		  
		  <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Epargne mensuelle actuelle</h3>
            <div className="p-3">
              {epargneMensuelle.map((f) => (
                <div key={f} className="mb-1 grid grid-cols-2 items-center gap-2">
                  <label className={label}>{f}</label>
                  <input
                    className={input}
                    type="number"
                    value={epargne[f]}
                    onChange={(e) =>
                      setEpargne({ ...epargne, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className={totalBar}>
              Total épargne mensuelle : {euro(totalEpargneMensuelle)}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] overflow-hidden border-2 border-black">
             <div className="bg-black p-2 text-center font-bold text-white">
              Budget Projets théorique
             </div>
             <div className="bg-[#f3c316] p-2 font-bold text-black">
              {euro(budgetProjet)}
             </div>
           </div>
			
        </div>

        <div className="space-y-4">
          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className="border-b border-black bg-[#0f7fb3] px-2 py-1 text-center font-bold text-white">
              Epargne / Stock
            </h3>
            <div className="overflow-x-auto p-3">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#e6c08f] text-black">
                    <th className="border border-black px-1 py-1 text-left"></th>
                    <th className="border border-black px-1 py-1 text-left">
                      Type de compte / placements
                    </th>
                    <th className="border border-black px-1 py-1 text-left">
                      Montant
                    </th>
                    <th className="border border-black px-1 py-1 text-left">
                      Banque / organisme
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a, i) => {
                    const showCategory =
                      i === 0 || assets[i - 1].categorie !== a.categorie;
                    const rowSpan = assets.filter(
                      (item) => item.categorie === a.categorie
                    ).length;

                    return (
                      <tr key={i}>
                        {showCategory && (
                          <td
                            rowSpan={rowSpan}
                            className="align-middle border border-black px-1 py-0.5 text-center font-semibold text-white [writing-mode:vertical-rl] rotate-180"
                          >
                            {a.categorie}
                          </td>
                        )}
                        <td className="border border-black px-1 py-0.5 text-white">
                          {a.type}
                        </td>
                        <td className="border border-black">
                          <input
                            className={input}
                            type="number"
                            value={a.montant}
                            onChange={(e) =>
                              updateAsset(i, "montant", e.target.value)
                            }
                          />
                        </td>
                        <td className="border border-black">
                          <input
                            className={input}
                            value={a.banque}
                            onChange={(e) =>
                              updateAsset(i, "banque", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-2 grid grid-cols-4 gap-px overflow-hidden border-2 border-black bg-black">
                <div className="bg-[#e6c08f] px-2 py-1 font-bold text-black">
                  Court terme : {euro(assetsByCat["Court terme"])}
                </div>
                <div className="bg-[#e6c08f] px-2 py-1 font-bold text-black">
                  Moyen terme : {euro(assetsByCat["Moyen terme"])}
                </div>
                <div className="bg-[#e6c08f] px-2 py-1 font-bold text-black">
                  Long terme : {euro(assetsByCat["Long terme"])}
                </div>
                <div className="bg-[#e6c08f] px-2 py-1 font-bold text-black">
                  Total : {euro(totalAssets)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Epargne de précaution</h3>
            <div className="grid gap-3 p-3 md:grid-cols-2">
              <div>
                <div className="mb-1 font-semibold text-white">
                  Montant souhaité
                </div>
                <input
                  className={input}
                  type="number"
                  value={precaution}
                  onChange={(e) => setPrecaution(e.target.value)}
                />
              </div>
              <div className="border border-black bg-[#d9d9d9] px-3 py-2 text-black">
                <div className="text-xs font-bold uppercase">
                  Recommandation CGP
                </div>
                <div className="mt-1 text-base font-bold">
                  {euro(epargnePrecautionReco)}
                </div>
                <div className="mt-1 text-xs">
                  Base : 3 à 6 mois de charges incompressibles
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className="border-b border-black bg-[#0f7fb3] px-2 py-1 text-center font-bold text-white">
              Biens immobiliers
            </h3>
            <div className="space-y-4 p-3">
              {realEstate.map((r, i) => (
                <div key={i} className="border-2 border-black bg-[#166e79]">
                  <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">
                    {r.type}
                  </div>
                  <div className="grid gap-3 p-3 md:grid-cols-2">
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Valeur estimée
                      </div>
                      <input
                        className={input}
                        type="number"
                        value={r.valeur}
                        onChange={(e) =>
                          updateImmo(i, "valeur", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Surface / m²
                      </div>
                      <input
                        className={input}
                        type="number"
                        value={r.surface}
                        onChange={(e) =>
                          updateImmo(i, "surface", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="mb-1 font-semibold text-white">Adresse</div>
                      <input
                        className={input}
                        value={r.adresse}
                        onChange={(e) =>
                          updateImmo(i, "adresse", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 border-t-2 border-black p-3 md:grid-cols-4">
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Date acquisition
                      </div>
                      <input
                        className={input}
                        type="date"
                        value={r.dateAcquisition}
                        onChange={(e) =>
                          updateImmo(i, "dateAcquisition", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Date fin
                      </div>
                      <input
                        className={input}
                        type="date"
                        value={r.dateFin}
                        onChange={(e) =>
                          updateImmo(i, "dateFin", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Mensualité
                      </div>
                      <input
                        className={input}
                        type="number"
                        value={r.mensualite}
                        onChange={(e) =>
                          updateImmo(i, "mensualite", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">
                        Reste à rembourser
                      </div>
                      <input
                        className={input}
                        type="number"
                        value={r.reste}
                        onChange={(e) =>
                          updateImmo(i, "reste", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid gap-px overflow-hidden border-2 border-black bg-black md:grid-cols-3">
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">
                  Total immobilier : {euro(totalImmo)}
                </div>
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">
                  Mensualités : {euro(totalMensualitesImmo)}
                </div>
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">
                  Capital restant : {euro(totalResteImmo)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PyramidePatrimoineActuel
		  euro={euro}
		  stockCT={assetsByCat["Court terme"]}
		  stockMT={assetsByCat["Moyen terme"]}
		  stockLT={assetsByCat["Long terme"]}
		  fluxCT={epargneMensuelleCT}
		  fluxMT={epargneMensuelleMT}
		  fluxLT={epargneMensuelleLT}
		/>
	  
	  {isGeneratingPdf && (
        <div
          style={{
            position: "fixed",
            left: "-100000px",
            top: "0",
            width: "1200px",
            background: "#ffffff",
            color: "#000000",
            zIndex: -1,
            opacity: 1,
            pointerEvents: "none",
          }}
        >
          <RapportPatrimonialPdf
            investorIdentity={investorIdentity}
            investorFamily={investorFamily}
            investorProfessional={investorProfessional}
            childrenData={childrenData}
            income={income}
            charges={charges}
            loisirs={loisirs}
            epargne={epargne}
            precaution={precaution}
            assets={assets}
            realEstate={realEstate}
            totalIncome={totalIncome}
            totalCharges={totalCharges}
            totalLoisirs={totalLoisirs}
            totalEpargneMensuelle={totalEpargneMensuelle}
            budgetDisponible={budgetDisponible}
            budgetProjet={budgetProjet}
            totalAssets={totalAssets}
            assetsByCat={assetsByCat}
            totalImmo={totalImmo}
            totalMensualitesImmo={totalMensualitesImmo}
            totalResteImmo={totalResteImmo}
            epargnePrecautionReco={epargnePrecautionReco}
            patrimoineBrut={patrimoineBrut}
            tauxCharges={tauxCharges}
          />
        </div>
      )}

      <div className="mt-10 flex w-full justify-center">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={handleSave}
            className="rounded border-2 border-black bg-[#e6c08f] px-8 py-3 font-semibold text-black"
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded border-2 border-black bg-[#d9d9d9] px-8 py-3 font-semibold text-black"
          >
            Télécharger le PDF
          </button>
        </div>
      </div>
    </div>
  );
}