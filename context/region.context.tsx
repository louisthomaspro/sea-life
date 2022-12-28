import { useRouter } from "next/router";
import React, { createContext, useState, useEffect, useContext } from "react";
import { regionsList, storageKey } from "../constants/regions";

interface IRegionContext {
  userRegion: string;
  urlRegion: string;
  setUserRegion(data: string): void;
}

const RegionContext = createContext({} as IRegionContext);
export function RegionContextProvider({ children }: any) {
  const [userRegion, _setUserRegion] = useState<string>("all");
  const setUserRegion = (regionCode: string) => {
    window.localStorage.setItem(storageKey, regionCode);
    _setUserRegion(regionCode);
  };

  const [urlRegion, setUrlRegion] = useState<string>("all");

  const { asPath, push, pathname, isReady } = useRouter();

  useEffect(() => {
    // Set user region
    const storedRegion = window.localStorage.getItem(storageKey);
    if (storedRegion) {
      if (regionsList.find((region) => region.code === storedRegion)) {
        setUserRegion(storedRegion);
      } else {
        setUserRegion(regionsList[0].code);
      }
    } else {
      setUserRegion(regionsList[0].code);
    }

    if (isReady) {
      // Set url region
      const splitUrl = asPath.split("/");
      if (splitUrl[2]) {
        setUrlRegion(splitUrl[2]);
      }
    }
  }, [asPath]);

  return (
    <RegionContext.Provider
      value={{
        userRegion,
        urlRegion,
        setUserRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export default RegionContext;
