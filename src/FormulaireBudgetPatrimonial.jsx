import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

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
    "Assurance vie",
    "Investissement locatif",
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
    }).format(v);

  const [investorIdentity, setInvestorIdentity] = useState(mapInit(investorIdentityFields));
  const [investorFamily, setInvestorFamily] = useState(mapInit(investorFamilyFields));
  const [investorProfessional, setInvestorProfessional] = useState(mapInit(investorProfessionalFields));
  const [childrenData, setChildrenData] = useState(
    Array.from({ length: investorChildrenCount }, () => ({ prenom: "", naissance: "" }))
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

  const budgetDisponible = totalIncome - totalCharges;
  const budgetProjet = budgetDisponible - totalEpargneMensuelle - totalLoisirs;

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
  const patrimoineBrut = useMemo(() => totalAssets + totalImmo, [totalAssets, totalImmo]);
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
      } catch (err) {
        console.error("LOAD EXCEPTION:", err);
        setSaveStatus("Impossible de recharger le brouillon.");
      }
    };

    loadFromSupabase();
  }, []);

  const updateAsset = (i, key, value) => {
    setAssets((prev) => prev.map((row, index) => (index === i ? { ...row, [key]: value } : row)));
  };

  const updateImmo = (i, key, value) => {
    setRealEstate((prev) => prev.map((row, index) => (index === i ? { ...row, [key]: value } : row)));
  };

  const updateChild = (i, key, value) => {
    setChildrenData((prev) => prev.map((row, index) => (index === i ? { ...row, [key]: value } : row)));
  };

  const genererPDF = async () => {
    const element = document.getElementById("formulaire-pdf");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#1b7b88",
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("bilan-patrimonial.pdf");
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
		
	  const { error } = await supabase
		.from("formulaires_clients")
		.upsert({
		  client_id: clientId,
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

  return (
    <div id="formulaire-pdf" className="min-h-screen bg-[#1b7b88] p-6 text-sm">
      <div className="mb-3 text-right text-xs font-semibold text-white">{saveStatus}</div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="border-2 border-black overflow-hidden">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">Revenus mensuels</div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">{euro(totalIncome)}</div>
        </div>
        <div className="border-2 border-black overflow-hidden">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">Charges incompressibles</div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">{euro(totalCharges)}</div>
        </div>
        <div className="border-2 border-black overflow-hidden">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">Budget disponible</div>
          <div className="bg-[#f5ddd7] px-3 py-3 text-lg font-bold text-black">{euro(budgetDisponible)}</div>
        </div>
        <div className="border-2 border-black overflow-hidden">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">Patrimoine brut</div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">{euro(patrimoineBrut)}</div>
        </div>
        <div className="border-2 border-black overflow-hidden">
          <div className="bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">Taux de charges</div>
          <div className="bg-[#e6c08f] px-3 py-3 text-lg font-bold text-black">{tauxCharges.toFixed(0)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="bg-[#1b7b88] border-2 border-black p-0">
          <h2 className={sectionTitle}>INFORMATION INVESTISSEUR</h2>

          <div className="border-b-2 border-black p-3">
            {investorIdentityFields.map((f) => (
              <div key={f} className="grid grid-cols-[1.1fr_1.3fr] gap-2 mb-1 items-center">
                <label className={label}>{f} :</label>
                <input className={input} value={investorIdentity[f]} onChange={(e) => setInvestorIdentity({ ...investorIdentity, [f]: e.target.value })} />
              </div>
            ))}
          </div>

          <div className="border-b-2 border-black p-3">
            {investorFamilyFields.map((f) => (
              <div key={f} className="grid grid-cols-[1.1fr_1.3fr] gap-2 mb-1 items-center">
                <label className={label}>{f} :</label>
                <input className={input} value={investorFamily[f]} onChange={(e) => setInvestorFamily({ ...investorFamily, [f]: e.target.value })} />
              </div>
            ))}
          </div>

          {Array.from({ length: investorChildrenCount }).map((_, i) => (
            <div key={i} className="border-b-2 border-black p-3">
              <div className="grid grid-cols-[1.1fr_1.3fr] gap-2 mb-1 items-center">
                <label className={label}>Prénom enfant :</label>
                <input className={input} value={childrenData[i].prenom} onChange={(e) => updateChild(i, "prenom", e.target.value)} />
              </div>
              <div className="grid grid-cols-[1.1fr_1.3fr] gap-2 items-center">
                <label className={label}>Naissance enfant :</label>
                <input className={input} type="date" value={childrenData[i].naissance} onChange={(e) => updateChild(i, "naissance", e.target.value)} />
              </div>
            </div>
          ))}

          <div className="p-3">
            {investorProfessionalFields.map((f) => (
              <div key={f} className="grid grid-cols-[1.1fr_1.3fr] gap-2 mb-1 items-center">
                <label className={label}>{f} :</label>
                <input className={input} value={investorProfessional[f]} onChange={(e) => setInvestorProfessional({ ...investorProfessional, [f]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Revenus (mensuel)</h3>
            <div className="p-3">
              {incomeFields.map((f) => (
                <div key={f} className="grid grid-cols-2 gap-2 items-center mb-1">
                  <label className={label}>{f}</label>
                  <input className={input} type="number" value={income[f]} onChange={(e) => setIncome({ ...income, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalIncome)}</div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Charges incompressibles (mensuel)</h3>
            <div className="p-3">
              {chargesFields.map((f) => (
                <div key={f} className="grid grid-cols-2 gap-2 items-center mb-1">
                  <label className={label}>{f}</label>
                  <input className={input} type="number" value={charges[f]} onChange={(e) => setCharges({ ...charges, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalCharges)}</div>
          </div>

          <div className="grid grid-cols-[1fr_auto] border-2 border-black overflow-hidden">
            <div className="bg-black text-white p-2 text-center font-bold">Budget = Revenus - Charges incompressibles</div>
            <div className="bg-[#f5ddd7] text-black p-2 font-bold">{euro(budgetDisponible)}</div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Epargne mensuelle actuelle</h3>
            <div className="p-3">
              {epargneMensuelle.map((f) => (
                <div key={f} className="grid grid-cols-2 gap-2 items-center mb-1">
                  <label className={label}>{f}</label>
                  <input className={input} type="number" value={epargne[f]} onChange={(e) => setEpargne({ ...epargne, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total pour les projets : {euro(totalEpargneMensuelle)}</div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Loisirs (mensuel)</h3>
            <div className="p-3">
              {loisirsFields.map((f) => (
                <div key={f} className="grid grid-cols-2 gap-2 items-center mb-1">
                  <label className={label}>{f}</label>
                  <input className={input} type="number" value={loisirs[f]} onChange={(e) => setLoisirs({ ...loisirs, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className={totalBar}>Total : {euro(totalLoisirs)}</div>
          </div>

          <div className="grid grid-cols-[1fr_auto] border-2 border-black overflow-hidden">
            <div className="bg-black text-white p-2 text-center font-bold">Budget Projets théorique</div>
            <div className="bg-[#f3c316] text-black p-2 font-bold">{euro(budgetProjet)}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className="bg-[#0f7fb3] text-white font-bold text-center px-2 py-1 border-b border-black">Epargne / Stock</h3>
            <div className="p-3 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#e6c08f] text-black">
                    <th className="border border-black px-1 py-1 text-left"></th>
                    <th className="border border-black px-1 py-1 text-left">Type de compte / placements</th>
                    <th className="border border-black px-1 py-1 text-left">Montant</th>
                    <th className="border border-black px-1 py-1 text-left">Banque / organisme</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a, i) => {
                    const showCategory = i === 0 || assets[i - 1].categorie !== a.categorie;
                    const rowSpan = assets.filter((item) => item.categorie === a.categorie).length;

                    return (
                      <tr key={i}>
                        {showCategory && (
                          <td rowSpan={rowSpan} className="text-white border border-black px-1 py-0.5 text-center align-middle [writing-mode:vertical-rl] rotate-180 font-semibold">
                            {a.categorie}
                          </td>
                        )}
                        <td className="text-white border border-black px-1 py-0.5">{a.type}</td>
                        <td className="border border-black">
                          <input className={input} type="number" value={a.montant} onChange={(e) => updateAsset(i, "montant", e.target.value)} />
                        </td>
                        <td className="border border-black">
                          <input className={input} value={a.banque} onChange={(e) => updateAsset(i, "banque", e.target.value)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="grid grid-cols-4 gap-px mt-2 border-2 border-black overflow-hidden bg-black">
                <div className="bg-[#e6c08f] text-black font-bold px-2 py-1">Court terme : {euro(assetsByCat["Court terme"])}</div>
                <div className="bg-[#e6c08f] text-black font-bold px-2 py-1">Moyen terme : {euro(assetsByCat["Moyen terme"])}</div>
                <div className="bg-[#e6c08f] text-black font-bold px-2 py-1">Long terme : {euro(assetsByCat["Long terme"])}</div>
                <div className="bg-[#e6c08f] text-black font-bold px-2 py-1">Total : {euro(totalAssets)}</div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className={sectionTitle}>Epargne de précaution</h3>
            <div className="grid gap-3 p-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-white font-semibold">Montant disponible</div>
                <input className={input} type="number" value={precaution} onChange={(e) => setPrecaution(e.target.value)} />
              </div>
              <div className="border border-black bg-[#d9d9d9] px-3 py-2 text-black">
                <div className="text-xs font-bold uppercase">Recommandation CGP</div>
                <div className="mt-1 text-base font-bold">{euro(epargnePrecautionReco)}</div>
                <div className="mt-1 text-xs">Base : 6 mois de charges incompressibles</div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black bg-[#1b7b88] p-0">
            <h3 className="bg-[#0f7fb3] text-white font-bold text-center px-2 py-1 border-b border-black">Biens immobiliers</h3>
            <div className="p-3 space-y-4">
              {realEstate.map((r, i) => (
                <div key={i} className="border-2 border-black bg-[#166e79]">
                  <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">{r.type}</div>
                  <div className="grid gap-3 p-3 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-white font-semibold">Valeur estimée</div>
                      <input className={input} type="number" value={r.valeur} onChange={(e) => updateImmo(i, "valeur", e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-1 text-white font-semibold">Surface / m²</div>
                      <input className={input} type="number" value={r.surface} onChange={(e) => updateImmo(i, "surface", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <div className="mb-1 text-white font-semibold">Adresse</div>
                      <input className={input} value={r.adresse} onChange={(e) => updateImmo(i, "adresse", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid gap-3 border-t-2 border-black p-3 md:grid-cols-4">
                    <div>
                      <div className="mb-1 text-white font-semibold">Date acquisition</div>
                      <input className={input} type="date" value={r.dateAcquisition} onChange={(e) => updateImmo(i, "dateAcquisition", e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-1 text-white font-semibold">Date fin</div>
                      <input className={input} type="date" value={r.dateFin} onChange={(e) => updateImmo(i, "dateFin", e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-1 text-white font-semibold">Mensualité</div>
                      <input className={input} type="number" value={r.mensualite} onChange={(e) => updateImmo(i, "mensualite", e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-1 text-white font-semibold">Reste à rembourser</div>
                      <input className={input} type="number" value={r.reste} onChange={(e) => updateImmo(i, "reste", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid gap-px border-2 border-black bg-black md:grid-cols-3 overflow-hidden">
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">Total immobilier : {euro(totalImmo)}</div>
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">Mensualités : {euro(totalMensualitesImmo)}</div>
                <div className="bg-[#e6c08f] px-3 py-2 font-bold text-black">Capital restant : {euro(totalResteImmo)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <button type="button" onClick={handleSave} className="border-2 border-black bg-[#e6c08f] px-4 py-3 font-semibold text-black">
          Enregistrer
        </button>

        <button type="button" onClick={handleDownloadPdf} className="border-2 border-black bg-[#d9d9d9] px-4 py-3 font-semibold text-black">
          Télécharger le PDF
        </button>

        <button type="button" onClick={handleSendToAdvisor} className="border-2 border-black bg-black px-4 py-3 font-semibold text-white">
          Envoyer au conseiller
        </button>
      </div>
    </div>
  );
}
