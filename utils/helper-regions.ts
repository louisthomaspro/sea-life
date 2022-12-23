export const regionsList = [
  { name: "Toutes les régions", code: "all" },
  { name: "Mer Méditerranée", code: "mediterranean-sea" },
];

export const getSelectedRegion = () => {
  const storedRegion = window.localStorage.getItem("selectedRegion");
  if (storedRegion) {
    if (regionsList.find((region) => region.code === storedRegion)) {
      return storedRegion;
    } else {
      window.localStorage.setItem("selectedRegion", regionsList[0].code);
      return regionsList[0].code;
    }
  } else {
    window.localStorage.setItem("selectedRegion", regionsList[0].code);
    return regionsList[0].code;
  }
}