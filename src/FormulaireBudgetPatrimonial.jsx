import RapportPatrimonialPdf from "./RapportPatrimonialPdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import PyramidePatrimoineActuel from "./PyramidePatrimoineActuel";


export default function FormulaireBudgetPatrimonial() {
  const label = "text-[13px] font-medium text-[#4b5563]";
const input =
  "w-full rounded-xl border border-[#d8d1c5] bg-white px-3 py-2.5 text-sm text-[#111827] shadow-sm outline-none transition focus:border-[#b08a4a] focus:ring-2 focus:ring-[#b08a4a]/20";
const sectionTitle =
  "border-b border-[#ece6dc] bg-gradient-to-r from-[#1f3b57] to-[#2c4d6f] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white";
const totalBar =
  "border-t border-[#ece6dc] bg-[#faf7f2] px-4 py-3 text-sm font-semibold text-[#1f2937]";

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
  "Revenus professionnels nets",
  "Revenus locatifs",
  "Revenus financiers (dividendes, intérêts)",
  "Autres revenus récurrents",
];

  const chargesFields = [
  "Habitation (loyer / crédit / charges)",
  "Fiscalité mensuelle",
  "Crédits en cours",
  "Assurances et protections",
  "Dépenses de vie courante",
  "Autres engagements récurrents",
];

  const loisirsFields = [
  "Train de vie (loisirs, restaurants, sorties)",
  "Voyages et déplacements",
  "Autres dépenses discrétionnaires",
];

  const epargneMensuelle = [
  "Épargne de sécurité (court terme)",
  "Épargne financière (assurance vie, PEA)",
  "Investissements immobiliers",
  "Autres investissements long terme",
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

  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
const [isAuthorized, setIsAuthorized] = useState(false);

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
  
const [step, setStep] = useState(1);
const totalSteps = 5;

const stepTitles = {
  1: "Profil client",
  2: "Flux mensuels",
  3: "Patrimoine financier",
  4: "Patrimoine immobilier",
  5: "Synthèse patrimoniale",
};

const goNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

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
  const epargnePrecautionReco = useMemo(() => totalCharges * 3, [totalCharges]);
  const patrimoineBrut = useMemo(
    () => totalAssets + totalImmo,
    [totalAssets, totalImmo]
  );
  const tauxCharges = useMemo(
    () => (totalIncome > 0 ? (totalCharges / totalIncome) * 100 : 0),
    [totalIncome, totalCharges]
  );
  
  const scorePatrimonial = useMemo(() => {
  const ct = totalAssets > 0 ? (assetsByCat["Court terme"] / totalAssets) * 100 : 0;
  const mt = totalAssets > 0 ? (assetsByCat["Moyen terme"] / totalAssets) * 100 : 0;
  const lt = totalAssets > 0 ? (assetsByCat["Long terme"] / totalAssets) * 100 : 0;

  const score =
    10 -
    Math.abs(ct - 30) / 10 -
    Math.abs(mt - 40) / 10 -
    Math.abs(lt - 30) / 10;

  return Math.max(0, Math.min(10, score)).toFixed(1);
}, [assetsByCat, totalAssets]);

	const analysePatrimoniale = useMemo(() => {
  const ct = totalAssets > 0 ? (assetsByCat["Court terme"] / totalAssets) * 100 : 0;
  const mt = totalAssets > 0 ? (assetsByCat["Moyen terme"] / totalAssets) * 100 : 0;
  const lt = totalAssets > 0 ? (assetsByCat["Long terme"] / totalAssets) * 100 : 0;

  let force = "Bonne base de capitalisation patrimoniale.";
  let vigilance = "Répartition globalement cohérente.";
  let orientation = "Maintenir une allocation disciplinée dans le temps.";

  if (lt >= 45) {
    force = "Capacité de projection long terme déjà bien installée.";
  } else if (ct >= 35) {
    force = "Bonne disponibilité immédiate pour la sécurité patrimoniale.";
  } else if (mt >= 30) {
    force = "Poche intermédiaire intéressante pour la flexibilité.";
  }

  if (ct > 50) {
    vigilance = "Concentration élevée sur les actifs liquides.";
    orientation = "Redéployer progressivement une partie du court terme vers le moyen ou long terme.";
  } else if (lt > 70) {
    vigilance = "Patrimoine très orienté long terme, avec moindre flexibilité.";
    orientation = "Renforcer la poche intermédiaire afin d'améliorer l'agilité patrimoniale.";
  } else if (mt < 15) {
    vigilance = "Poche moyen terme relativement faible.";
    orientation = "Consolider les supports intermédiaires pour mieux équilibrer la structure.";
  }

  return { force, vigilance, orientation };
}, [assetsByCat, totalAssets]);


  const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token")?.trim() || null;
};

  useEffect(() => {
  const loadFromSupabase = async () => {
    try {
      const token = getTokenFromUrl();

      if (!token) {
        setSaveStatus("Accès refusé.");
        setIsAuthorized(false);
        setIsCheckingAccess(false);
        return;
      }

      const { data: accessRow, error: accessError } = await supabase
        .from("access_tokens")
        .select("client_id, expires_at")
        .eq("token", token)
        .maybeSingle();

      if (accessError || !accessRow) {
        console.error("ACCESS TOKEN ERROR:", accessError);
        setSaveStatus("Accès refusé.");
        setIsAuthorized(false);
        setIsCheckingAccess(false);
        return;
      }

      if (new Date(accessRow.expires_at) < new Date()) {
        setSaveStatus("Lien expiré.");
        setIsAuthorized(false);
        setIsCheckingAccess(false);
        return;
      }

      const { data, error } = await supabase
        .from("formulaires_clients")
        .select("id, data_json, updated_at, client_nom, client_prenom, client_email")
        .eq("client_id", accessRow.client_id)
        .maybeSingle();

      if (error) {
        console.error("LOAD FORM ERROR:", error);
        setSaveStatus("Erreur de chargement.");
        setIsAuthorized(false);
        setIsCheckingAccess(false);
        return;
      }

      if (data) {
        const saved = data.data_json || {};

        if (saved.investorIdentity) setInvestorIdentity(saved.investorIdentity);
        if (saved.investorFamily) setInvestorFamily(saved.investorFamily);
        if (saved.investorProfessional) setInvestorProfessional(saved.investorProfessional);
        if (saved.childrenData) setChildrenData(saved.childrenData);
        if (saved.income) setIncome(saved.income);
        if (saved.charges) setCharges(saved.charges);
        if (saved.loisirs) setLoisirs(saved.loisirs);
        if (saved.epargne) setEpargne(saved.epargne);
        if (typeof saved.precaution === "string") setPrecaution(saved.precaution);
        if (saved.assets) setAssets(saved.assets);
        if (saved.realEstate) setRealEstate(saved.realEstate);

        setSaveStatus("Brouillon rechargé depuis le serveur.");
      } else {
        setSaveStatus("Nouveau formulaire prêt à être complété.");
      }

      setIsAuthorized(true);
      setIsCheckingAccess(false);
    } catch (err) {
      console.error("LOAD EXCEPTION:", err);
      setSaveStatus("Accès refusé.");
      setIsAuthorized(false);
      setIsCheckingAccess(false);
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

    const pageIds = ["pdf-page-1", "pdf-page-2", "pdf-page-3", "pdf-page-4"];
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

      const widthRatio = usableWidth / canvas.width;
      const heightRatio = usableHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;

      const x = marginX + (usableWidth - renderWidth) / 2;
      const y = marginY;

      if (!isFirstRenderedPage) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
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
    const token = getTokenFromUrl();

    if (!token) {
      alert("Lien invalide.");
      return;
    }

    const { data: accessRow, error: accessError } = await supabase
      .from("access_tokens")
      .select("client_id, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (accessError || !accessRow) {
      console.error("SAVE ACCESS ERROR:", accessError);
      alert("Lien invalide.");
      return;
    }

    if (new Date(accessRow.expires_at) < new Date()) {
      alert("Lien expiré.");
      return;
    }

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

    const { data: existing, error: checkError } = await supabase
      .from("formulaires_clients")
      .select("id")
      .eq("client_id", accessRow.client_id)
      .maybeSingle();

    if (checkError) {
      console.error("CHECK ERROR:", checkError);
      alert("Erreur lors de la vérification du formulaire.");
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from("formulaires_clients")
        .update({
          client_nom: nom,
          client_prenom: prenom,
          client_email: email,
          data_json: payload,
          updated_at: new Date().toISOString(),
        })
        .eq("client_id", accessRow.client_id);

      if (error) {
        console.error("UPDATE ERROR:", error);
        alert("Erreur lors de la sauvegarde : " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("formulaires_clients")
        .insert([
          {
            client_id: accessRow.client_id,
            client_nom: nom,
            client_prenom: prenom,
            client_email: email,
            data_json: payload,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("INSERT ERROR:", error);
        alert("Erreur lors de la création : " + error.message);
        return;
      }
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


  if (isCheckingAccess) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee]">
      <div className="rounded-2xl border border-[#e6ded2] bg-white px-6 py-5 text-sm text-[#1f2937] shadow">
        Vérification de l'accès...
      </div>
    </div>
  );
}

if (!isAuthorized) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e6ded2] bg-white p-8 text-center shadow-[0_10px_30px_rgba(17,24,39,0.06)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b6b36]">
          Accès sécurisé
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-[#1f2937]">
          Accès refusé
        </h1>
        <p className="mt-3 text-sm text-[#6b7280]">
          Ce lien est invalide, expiré ou non autorisé.
        </p>
      </div>
    </div>
  );
}

return (
    <div id="formulaire-pdf" className="min-h-screen bg-[#f6f3ee] px-4 py-8 text-sm text-[#111827] md:px-8">
	
	<div className="mb-8 overflow-hidden rounded-[28px] border border-[#e6ded2] bg-gradient-to-r from-[#10273d] via-[#1f3b57] to-[#2c4d6f] px-6 py-7 text-white shadow-[0_18px_50px_rgba(16,39,61,0.18)]">
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
        Bilan patrimonial
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Synthèse patrimoniale client
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-white/80">
        Vision consolidée des revenus, charges, capacités d’épargne,
        actifs financiers et patrimoine immobilier.
      </p>
	  <div className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/90 backdrop-blur">
  🔒 Accès sécurisé — Ce formulaire est accessible uniquement via le lien personnel transmis par votre conseiller.

		Les informations saisies restent confidentielles.

		Vous pouvez télécharger votre synthèse en PDF sans enregistrer le formulaire.
		Dans ce cas, aucune donnée ne sera sauvegardée sur le serveur.
</div>
    </div>
	
	<div className="mb-8 rounded-2xl border border-[#e6ded2] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
  <div className="flex items-center justify-between gap-4">
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
        Progression du bilan
      </div>
      <div className="mt-1 text-sm font-medium text-[#1f2937]">
        Étape {step} sur {totalSteps} — {stepTitles[step]}
      </div>
    </div>

    <div className="text-sm font-semibold text-[#8b6b36]">
      {Math.round((step / totalSteps) * 100)}%
    </div>
  </div>

  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ece7de]">
    <div
      className="h-full rounded-full bg-[#b08a4a] transition-all duration-500"
      style={{ width: `${(step / totalSteps) * 100}%` }}
    />
  </div>
</div>



    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <div className="text-[11px] uppercase tracking-[0.14em] text-white/70">
        Client
      </div>
      <div className="mt-1 text-base font-medium">
        {investorIdentity["Prénom"] || "Prénom"} {investorIdentity["Nom"] || "Nom"}
      </div>
	  
	  <div className="mt-2 inline-flex items-center rounded-full bg-[#efe8da] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8b6b36]">
  Conseil patrimonial indépendant
</div>

    </div>
  </div>
</div>

      <div className="space-y-6">
  {[
    {
      title: "Revenus mensuels",
      value: euro(totalIncome),
      tone: "gold",
    },
    {
      title: "Charges incompressibles",
      value: euro(totalCharges),
      tone: "navy",
    },
    {
  title: "Budget disponible",
  value: euro(budgetDisponible),
  tone: budgetDisponible < 0 ? "danger" : "rose",
},
    {
      title: "Patrimoine brut",
      value: euro(patrimoineBrut),
      tone: "gold",
    },
    {
      title: "Taux de charges",
      value: `${tauxCharges.toFixed(0)}%`,
      tone: "navy",
    },
  ].map((item) => (
    <div
      key={item.title}
      className="rounded-2xl border border-[#e6ded2] bg-[#f7f4ee] p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
          {item.title}
        </div>
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            item.tone === "gold"
  ? "bg-[#b08a4a]"
  : item.tone === "rose"
  ? "bg-[#d8a48f]"
  : item.tone === "danger"
  ? "bg-[#c94c4c]"
  : "bg-[#1f3b57]"
          }`}
        />
      </div>
      <div
  className={`text-2xl font-semibold tracking-tight ${
    item.title === "Budget disponible" && budgetDisponible < 0
      ? "text-[#c94c4c]"
      : "text-[#111827]"
  }`}
>
  {item.value}
  
</div>

{item.title === "Budget disponible" && (
  <div className="mt-3">

    <div className="h-2 overflow-hidden rounded-full bg-[#ece7de]">
      <div
        className={`h-full rounded-full ${
          budgetDisponible < 0
            ? "bg-[#c94c4c]"
            : budgetDisponible < 500
            ? "bg-[#d8a48f]"
            : budgetDisponible < 1500
            ? "bg-[#b08a4a]"
            : "bg-[#6c8f6b]"
        }`}
        style={{
          width: `${Math.max(5, Math.min(100, (budgetDisponible / 2000) * 100))}%`,
        }}
      />
    </div>

    <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">
      {budgetDisponible < 0
        ? "Déficit budgétaire"
        : budgetDisponible < 500
        ? "Zone fragile"
        : budgetDisponible < 1500
        ? "Zone de confort"
        : "Situation solide"}
    </div>

  </div>
)}

{item.title === "Budget disponible" && budgetDisponible < 0 && (
  <div className="text-[10px] text-[#c94c4c] mt-1 uppercase tracking-[0.1em]">
    Déficit mensuel
  </div>
)}

<div className="mt-1 text-[10px] text-[#8b6b36]/70 uppercase tracking-[0.12em]">
  calcul automatique
</div>
    </div>
  ))}
</div>


        
{step === 1 && (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
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
              <div className="mb-3 grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-3">
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
		</div>
		
)}

{step === 2 && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
            <h3 className={sectionTitle}>Flux de revenus mensuels</h3>
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

          <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
            <h3 className={sectionTitle}>Engagements financiers mensuels</h3>
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

          <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
			  <div className="flex items-center justify-between gap-4 px-5 py-4">
				<div>
				  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
					Budget disponible
				  </div>
				  <div className="mt-1 text-sm text-[#4b5563]">
					Revenus - charges incompressibles
				  </div>
				</div>
				<div className="rounded-xl bg-[#f8efe2] px-4 py-2 text-lg font-semibold text-[#8b6b36]">
				  {euro(budgetDisponible)}
				</div>
			  </div>
		  </div>
		


          <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
            <h3 className={sectionTitle}>Train de vie discrétionnaire</h3>
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
		  </div>
		  		  
)}
		  
{step === 3 && (
  <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
      <h3 className={sectionTitle}>Épargne mensuelle actuelle</h3>
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

    <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
      <h3 className="border-b border-black bg-[#0f7fb3] px-2 py-1 text-center font-bold text-white">
        Épargne / Stock
      </h3>
      <div className="overflow-x-auto p-3">
        <table className="w-full border-separate border-spacing-0 overflow-hidden text-sm">
          <thead>
            <tr className="bg-[#f8f5ef] text-[#374151]">
              <th className="border-b border-[#e7dfd4] px-3 py-3 text-left font-semibold"></th>
              <th className="border-b border-[#e7dfd4] px-3 py-3 text-left font-semibold">
                Type de compte / placements
              </th>
              <th className="border-b border-[#e7dfd4] px-3 py-3 text-left font-semibold">
                Montant
              </th>
              <th className="border-b border-[#e7dfd4] px-3 py-3 text-left font-semibold">
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
                      className="border-b border-[#f1ece4] bg-[#faf7f2] px-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b6b36] [writing-mode:vertical-rl] rotate-180"
                    >
                      {a.categorie}
                    </td>
                  )}
                  <td className="border-b border-[#f1ece4] px-3 py-2.5 text-[#1f2937]">
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

    <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
      <h3 className={sectionTitle}>Épargne de précaution</h3>
      <div className="grid gap-3 p-3 md:grid-cols-2">
        <div>
          <div className="mb-1 font-semibold text-[#1f2937]">
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
  </div>
)}

{step === 4 && (



          <div className="overflow-hidden rounded-2xl border border-[#e6ded2] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
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
	  
)}
<div className="mt-8 flex items-center justify-between">
  <button
    type="button"
    onClick={goBack}
    disabled={step === 1}
    className="rounded-2xl border border-[#d7c8ae] bg-white px-6 py-3 text-sm font-semibold text-[#8b6b36] shadow-[0_10px_25px_rgba(176,138,74,0.08)] transition disabled:cursor-not-allowed disabled:opacity-40"
  >
    Précédent
  </button>

  <button
    type="button"
    onClick={goNext}
    disabled={step === totalSteps}
    className="rounded-2xl border border-[#1f3b57] bg-[#1f3b57] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(31,59,87,0.18)] transition hover:-translate-y-0.5 hover:bg-[#284868] disabled:cursor-not-allowed disabled:opacity-40"
  >
    Suivant
  </button>
</div>

{step === 5 && (
  <>
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

    <PyramidePatrimoineActuel
      euro={euro}
      stockCT={assetsByCat["Court terme"]}
      stockMT={assetsByCat["Moyen terme"]}
      stockLT={assetsByCat["Long terme"]}
      fluxCT={epargneMensuelleCT}
      fluxMT={epargneMensuelleMT}
      fluxLT={epargneMensuelleLT}
      scorePatrimonial={scorePatrimonial}
      analysePatrimoniale={analysePatrimoniale}
    />

    <div className="mt-12 flex w-full justify-center">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl border border-[#1f3b57] bg-[#1f3b57] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(31,59,87,0.18)] transition hover:-translate-y-0.5 hover:bg-[#284868]"
          >
            Enregistrer
          </button>

          <div className="mt-2 text-[11px] text-[#6b7280]">
            Vous pouvez enregistrer votre formulaire et le compléter ultérieurement avec ce même lien sécurisé.
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded-2xl border border-[#d7c8ae] bg-white px-8 py-3 text-sm font-semibold text-[#8b6b36] shadow-[0_10px_25px_rgba(176,138,74,0.10)] transition hover:-translate-y-0.5 hover:bg-[#fcfaf7]"
          >
            Télécharger le PDF
          </button>

          <div className="mt-2 text-[11px] text-[#6b7280]">
            Télécharger une synthèse sans enregistrer les informations.
          </div>
        </div>
      </div>
    </div>
  </>
)}
 </div>
  );
}