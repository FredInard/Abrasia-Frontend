import NavBar from "../components/NavBar/NavBar"
import "./Cgu.scss"

export default function Cgu() {
  return (
    <>
      <header className="App-header">
        <NavBar className="NavBarHome" />

        <div className="cgu-content">
          <h1>
            Conditions Générales d'Utilisation (CGU) du site de l'association
            "Les Arpenteurs d'Abrasia"
          </h1>
          <p>Dernière mise à jour : [Date]</p>

          <h2>1. Présentation du site et de l'association</h2>
          <p>
            Le site [adresse du site] (ci-après dénommé "le Site") est édité par
            l'association Les Arpenteurs d'Abrasia, association à but non
            lucratif régie par la loi du 1er juillet 1901. L'association a pour
            objet de promouvoir les jeux de rôle, d'organiser des événements,
            des ateliers et des sessions de jeu, favorisant ainsi les loisirs et
            le lien social.
          </p>
          <p>Adresse : [À compléter dès que disponible], France.</p>
          <p>Email : [Adresse email de contact].</p>

          <h2>2. Acceptation des Conditions Générales d'Utilisation</h2>
          <p>
            L'utilisation du Site implique l'acceptation pleine et entière des
            présentes Conditions Générales d'Utilisation (CGU). Si vous
            n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
          </p>

          <h2>3. Accès au Site</h2>
          <p>
            Le Site est accessible gratuitement à tout utilisateur disposant
            d'un accès internet. Certains services, tels que l'inscription à des
            événements ou la création de parties, sont réservés aux utilisateurs
            enregistrés.
          </p>

          <h2>4. Inscription et gestion des comptes</h2>

          <h3>4.1. Conditions d'inscription</h3>
          <p>
            L'inscription est ouverte à toute personne souhaitant participer aux
            activités de l'association. Aucune vérification d'âge ou critère
            d'éligibilité spécifique n'est requis.
          </p>

          <h3>4.2. Informations collectées</h3>
          <p>
            Lors de l'inscription, les informations suivantes sont collectées :
          </p>
          <ul>
            <li>Nom</li>
            <li>Prénom</li>
            <li>Adresse email</li>
            <li>Pseudonyme</li>
          </ul>
          <p>
            Ces informations sont obligatoires pour créer un compte. D'autres
            informations peuvent être fournies de manière facultative.
          </p>

          <h3>4.3. Gestion du compte</h3>
          <p>
            L'utilisateur est responsable de la confidentialité de ses
            identifiants de connexion. Il s'engage à fournir des informations
            exactes et à les maintenir à jour.
          </p>

          <h2>5. Services offerts</h2>
          <p>Le Site permet aux utilisateurs de :</p>
          <ul>
            <li>S'inscrire à des événements organisés par l'association.</li>
            <li>
              Créer et proposer des événements ou des parties de jeux de rôle,
              avec description et illustration.
            </li>
            <li>
              Consulter des informations sur l'association et ses actualités.
            </li>
          </ul>

          <h2>6. Obligations de l'utilisateur</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul>
            <li>
              Utiliser le Site conformément aux lois et règlements en vigueur.
            </li>
            <li>Ne pas usurper l'identité d'une autre personne.</li>
            <li>Ne pas perturber le bon fonctionnement du Site.</li>
          </ul>

          <h2>7. Règles de conduite</h2>
          <p>
            Pour garantir un usage convivial et sécurisé pour tous, les
            utilisateurs doivent :
          </p>
          <ul>
            <li>
              Respecter les autres membres et s'abstenir de tout propos
              injurieux, diffamatoire ou discriminatoire.
            </li>
            <li>
              Ne pas publier de contenus illégaux, offensants ou contraires aux
              bonnes mœurs.
            </li>
            <li>
              Ne pas diffuser de contenus protégés par des droits d'auteur sans
              autorisation.
            </li>
          </ul>

          <h2>8. Modération des contenus</h2>
          <p>
            Les administrateurs se réservent le droit de modérer, modifier ou
            supprimer tout contenu jugé inapproprié, sans préavis. Les
            utilisateurs peuvent signaler tout contenu problématique aux
            administrateurs.
          </p>

          {/* Continuez à structurer le reste des sections de la même manière */}

          <h2>9. Propriété intellectuelle</h2>

          <h3>9.1. Contenus du Site</h3>
          <p>
            Les contenus présents sur le Site (textes, images, logos, etc.) sont
            la propriété de l'association ou de leurs auteurs respectifs. Les
            images générées par intelligence artificielle et les SVG libres de
            droits utilisés sur le Site sont protégés par les lois en vigueur.
          </p>

          <h3>9.2. Utilisation des contenus</h3>
          <p>
            Toute reproduction ou diffusion des contenus du Site est interdite
            sans l'autorisation préalable du président de l'association, à
            l'exception du créateur du Site qui bénéficie d'une autorisation
            spécifique.
          </p>

          {/* Poursuivez avec les sections 10 à 17 de la même manière */}
        </div>
      </header>
    </>
  )
}
