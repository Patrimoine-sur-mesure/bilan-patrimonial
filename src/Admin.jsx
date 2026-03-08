import { supabase } from "./lib/supabase";

export default function Admin() {
  async function createClientLink() {
    const token = crypto.randomUUID();

    const expiration = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    const formulaireId = 51;

    const { data, error } = await supabase
      .from("access_tokens")
      .insert([
        {
          token,
          formulaire_id: formulaireId,
          expires_at: expiration.toISOString(),
        },
      ])
      .select();

    console.log("INSERT DATA =", data);
    console.log("INSERT ERROR =", error);

    if (error) {
      alert("Erreur création lien : " + error.message);
      return;
    }

    const link = "http://localhost:5174/?token=" + token;

    await navigator.clipboard.writeText(link);

    alert("Lien copié : " + link);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin</h1>

      <button
        onClick={createClientLink}
        style={{
          padding: 12,
          background: "#1f3b57",
          color: "white",
          borderRadius: 8,
        }}
      >
        Générer lien client
      </button>
    </div>
  );
}