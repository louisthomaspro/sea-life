import styled from "styled-components";
import { ISpecies, ISpeciesSizes } from "../../types/Species";

// svg
import RulerHorizontalSvg from "../../public/icons/fontawesome/light/ruler-horizontal.svg";
import WaterArrowDownSvg from "../../public/icons/fontawesome/light/water-arrow-down.svg";
import GemSvg from "../../public/icons/fontawesome/light/gem.svg";
import DiameterSvg from "../../public/icons/custom/diameter.svg";
import LeafSvg from "../../public/icons/fontawesome/light/leaf.svg";
import RulerHGridSvg from "../../public/icons/custom/ruler-h-grid.svg";

const dict_rarity: any = {
  rare: "Rare",
  uncommon: "Peu commune",
  common: "Commune",
  abundant: "Très commune",
};

const ruler_h_icon = (
  <RulerHorizontalSvg
    aria-label="size"
    className="svg-icon"
    style={{ width: "34px" }}
  />
);
const diameter_icon = (
  <DiameterSvg
    aria-label="diameter"
    className="svg-icon"
    style={{ width: "34px" }}
  />
);

const leaf_icon = (
  <LeafSvg
    aria-label="leaf size"
    className="svg-icon"
    style={{ width: "28px" }}
  />
);

const ruler_h_grid_svg = (
  <RulerHGridSvg
    aria-label="leaf size"
    className="svg-icon"
    style={{ width: "34px" }}
  />
);

const dict_sizes_icon: any = {
  // alga_height: {
  //   icon: ruler_h_icon,
  //   description: "Taille de l'algue",
  // },
  // alga_length: {
  //   icon: diameter_icon,
  //   description: "Longueur de l'algue",
  // },
  // leaf_length: {
  //   icon: leaf_icon,
  //   description: "Longueur de la feuille",
  // },
  colony_size: {
    icon: ruler_h_grid_svg,
    description: "Taille de la colonie",
  },
  plume_diameter: {
    icon: diameter_icon,
    description: "Diamètre de la plume",
  },
  polyp_diameter: {
    icon: diameter_icon,
    description: "Diamètre du polype",
  },
  diameter: {
    icon: diameter_icon,
    description: "Diamètre de ... ... ...",
  },
};

const getSizes = (sizes: any) => {
  let result: JSX.Element[] = [];

  // Handle simple sizes
  for (const type in dict_sizes_icon) {
    if (type in sizes) {
      result.push(
        <div className="col item">
          <div className="icon">{dict_sizes_icon[type].icon}</div>
          <div className="text">{sizes[type]} cm</div>
        </div>
      );
    }
  }

  // Handle complex sizes (min-max)
  let text = "";
  if ("length_max" in sizes || "length_average" in sizes) {
    if ("length_max" in sizes) {
      text = "< " + sizes.length_max;
    }
    if ("length_average" in sizes) {
      text = sizes.length_average;
    }
    if ("length_average" in sizes && "length_max" in sizes) {
      text = sizes.length_average + "-" + sizes.length_max;
    }

    result.push(
      <div className="col item">
        <div className="icon">{ruler_h_icon}</div>
        <div className="text">{text} cm</div>
      </div>
    );
  }

  return result;
};

export default function SpeciesHighlight(props: { species: ISpecies }) {
  return (
    <Style>
      <div className="grid grid-nogutter">
        {getSizes(props.species.sizes)}
        {props.species.depth_min !== null &&
          props.species.depth_max !== null && (
            <div className="col item">
              <div className="icon">
                <WaterArrowDownSvg
                  aria-label="depth"
                  className="svg-icon"
                  style={{ width: "28px" }}
                />
              </div>
              <div className="text">
                {props.species.depth_min}-{props.species.depth_max} m
              </div>
            </div>
          )}
        {props.species.rarity && (
          <div className="col item rarity-tooltip">
            <div className="icon">
              <GemSvg
                aria-label="rarity"
                className="svg-icon"
                style={{ width: "26px" }}
              />
            </div>
            <div className="text">{dict_rarity[props.species.rarity]}</div>
          </div>
        )}
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 0;
  margin: 10px 0;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;

    .text {
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      line-height: 16px;
      height: 30px;
      display: flex;
      align-items: center;
    }

    .icon {
      height: 40px;
      display: flex;
      align-items: center;

      .svg-icon {
        flex-grow: 1;
      }
    }
  }
`;
