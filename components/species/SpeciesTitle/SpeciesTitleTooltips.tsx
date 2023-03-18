import { useEffect } from "react";
import tippy from "tippy.js";
import { ISpecies } from "../../../types/Species";

export default function SpeciesTitleTooltips(props: { species: ISpecies }) {
  useEffect(() => {
    if (props.species.common_names.fr.length > 1) {
      tippy("#commonNamesFr", {
        allowHTML: true,
        trigger: "click",
        content: props.species.common_names.fr.join("<br/>"),
      });
    }
    if (props.species.common_names.en.length > 1) {
      tippy("#commonNamesEn", {
        allowHTML: true,
        trigger: "click",
        content: props.species.common_names.en.join("<br/>"),
      });
    }
  }, []);

  return <></>;
}
