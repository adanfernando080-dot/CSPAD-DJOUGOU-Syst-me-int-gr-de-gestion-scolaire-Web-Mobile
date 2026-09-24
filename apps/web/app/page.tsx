/**
 * Page d'accueil provisoire (Phase 1 — socle technique).
 * Les écrans métier (authentification, tableaux de bord, menus filtrés par permission)
 * arrivent à partir de la Phase 2. Aucune donnée métier n'est affichée ici.
 */
export default function HomePage() {
  return (
    <main>
      <h1>CSPAD DJOUGOU</h1>
      <p className="muted">
        Complexe Scolaire Privé des Assemblées de Dieu de Djougou — Système intégré de gestion
        scolaire
      </p>
      <section className="card" aria-labelledby="etat">
        <h2 id="etat">Socle technique</h2>
        <p>
          L’application est en cours de construction. L’accès aux fonctionnalités sera ouvert après
          la mise en place de l’authentification et des droits d’accès.
        </p>
      </section>
    </main>
  );
}
