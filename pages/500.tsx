import Link from "next/link";

const Custom500 = () => (
  <div className="global-padding flex mt-8 text-center flex-column">
    <h1 className="text-3xl mb-2">500</h1>
    <h2 className="text-xl mb-5">Oops, le problème vient de notre côté 🐟</h2>
    <Link href="/" className="link">Revenir à la page d'accueil</Link>
  </div>
);

export default Custom500;
