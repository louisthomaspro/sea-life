import React, { useContext, useEffect, useState } from "react";
import {
  addFavorite,
  removeFavorite,
} from "../../utils/firestore/users.firestore";
import { toast } from "react-toastify";

import HeartSvg from "../../public/icons/primeicons/heart.svg";
import HeartFillSvg from "../../public/icons/primeicons/heart-fill.svg";
import { GoogleSignIn } from "../commons/GoogleAuth";
import RoundButton from "../commons/RoundButton";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function FavoriteButton(props: { lifeId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const SignInToast = ({ closeToast, toastProps }: any) => (
    <div className="flex align-items-center">
      <div>Connecte toi pour ajouter des espèces en favoris</div>
      <GoogleSignIn />
    </div>
  );

  const handleFavoriteButton = () => {
    if (!user) {
      toast(<SignInToast />, {
        toastId: "signIn",
      });
      return;
    }

    if (isFavorite) {
      removeFavorite(props.lifeId, user.email).then(() => {
        // const newFavorites = user.favorites.filter(
        //   (id) => id !== props.lifeId
        // );
        // const newUserData = { ...userData, favorites: newFavorites };
        // setUserData(newUserData);
        // setIsFavorite(false);
        // toast("Espèce retirée des favoris", { autoClose: 1000 });
      });
    } else {
      // addFavorite(props.lifeId, userSession.email).then(() => {
      //   userData.favorites.push(props.lifeId);
      //   const newUserData = userData;
      //   setUserData(newUserData);
      //   setIsFavorite(true);
      //   toast("Espèce ajoutée aux favoris", { autoClose: 1000 });
      // });
    }
  };

  // useEffect(() => {
  //   if (userData) {
  //     if (userData.favorites.some((el) => el === props.lifeId)) {
  //       setIsFavorite(true);
  //     }
  //   }
  // }, [userData, userSession, loading, props.lifeId]);

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
