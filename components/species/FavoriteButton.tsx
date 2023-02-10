import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth.context";
import {
  addFavorite,
  removeFavorite,
} from "../../utils/firestore/users.firestore";
import { toast } from "react-toastify";

import HeartSvg from "../../public/icons/primeicons/heart.svg";
import HeartFillSvg from "../../public/icons/primeicons/heart-fill.svg";
import { GoogleSignIn } from "../commons/GoogleAuth";
import RoundButton from "../commons/RoundButton";

export default function FavoriteButton(props: { lifeId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { userSession, userData, loading, setUserData } =
    useContext(AuthContext);

  const SignInToast = ({ closeToast, toastProps }: any) => (
    <div className="flex align-items-center">
      <div>Connecte toi pour ajouter des espèces en favoris</div>
      <GoogleSignIn />
    </div>
  );

  const handleFavoriteButton = () => {
    if (!userSession) {
      toast(<SignInToast />, {
        toastId: "signIn",
      });
      return;
    }

    if (isFavorite) {
      removeFavorite(props.lifeId, userSession.email).then(() => {
        const newFavorites = userData.favorites.filter(
          (id) => id !== props.lifeId
        );
        const newUserData = { ...userData, favorites: newFavorites };
        setUserData(newUserData);
        setIsFavorite(false);
        toast("Espèce retirée des favoris", { autoClose: 1000 });
      });
    } else {
      addFavorite(props.lifeId, userSession.email).then(() => {
        userData.favorites.push(props.lifeId);
        const newUserData = userData;
        setUserData(newUserData);
        setIsFavorite(true);
        toast("Espèce ajoutée aux favoris", { autoClose: 1000 });
      });
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData.favorites.some((el) => el === props.lifeId)) {
        setIsFavorite(true);
      }
    }
  }, [userData, userSession, loading, props.lifeId]);

  return (
    <RoundButton ariaLabel="Favorite" onClick={handleFavoriteButton}>
      {isFavorite ? (
        <HeartFillSvg
          aria-label="favorite"
          className="svg-icon"
          style={{ width: "28px" }}
        />
      ) : (
        <HeartSvg
          aria-label="favorite"
          className="svg-icon"
          style={{ width: "28px", marginLeft: "1px" }}
        />
      )}
    </RoundButton>
  );
}
