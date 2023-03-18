import { Fancybox } from "@fancyapps/ui";

export default function SpeciesSliderFancybox(props: any) {
  Fancybox.bind("[data-fancybox]", {
    Toolbar: {
      display: {
        left: ["infobar"],
        right: ["close"],
      },
    },
    Thumbs: {
      autoStart: false,
    },
    Hash: false,
    Images: {
      zoom: false,
      click: null,
      doubleClick: "toggleZoom",
    },
  });

  return <></>;
}
