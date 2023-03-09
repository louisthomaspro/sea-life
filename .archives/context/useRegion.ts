import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { storageKey, regionsList } from "../../constants/regions";

const defaultRegion = "mediterranean-sea";

export default function useRegion() {
  const [userRegion, _setUserRegion] = useState(defaultRegion);
  const { asPath, push, pathname, isReady } = useRouter();

  const setUserRegion = (regionCode: string) => {
    if (regionsList.find((region) => region.id === regionCode)) {
      window.localStorage.setItem(storageKey, regionCode);
      _setUserRegion(regionCode);
    } else {
      console.error("Invalid region code. Set to default region.");
      _setUserRegion(defaultRegion);
    }
  };

  useEffect(() => {
    // Trigger re-render when userRegion changes
    // This will update all components that depend on userRegion
    // You can replace the console.log statement with any side-effect you want
    console.log(`User region changed to ${userRegion}`);
  }, [userRegion]);

  return { userRegion, setUserRegion };
}
