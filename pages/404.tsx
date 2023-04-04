import Link from "next/link";

const Custom404 = () => (
  <div className="global-padding flex mt-8 text-center flex-column">
    <h1 className="text-3xl mb-2">404</h1>
    <h2 className="text-xl mb-5">Tu t'es perdu au milieu de l'océan 🐟</h2>
    <Link href="/" className="link">Revenir à la page d'accueil</Link>
  </div>
);

export default Custom404;
