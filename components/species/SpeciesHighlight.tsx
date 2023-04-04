import styled from "styled-components";
import { ISpecies, ISpeciesSizes } from "../../types/Species";

// svg
import RulerHorizontalSvg from "../../public/icons/fontawesome/light/ruler-horizontal.svg";
import WaterArrowDownSvg from "../../public/icons/fontawesome/light/water-arrow-down.svg";
import GemSvg from "../../public/icons/fontawesome/light/gem.svg";
import DiameterSvg from "../../public/icons/custom/diameter.svg";
import LeafSvg from "../../public/icons/fontawesome/light/leaf.svg";
import RulerHGridSvg from "../../public/icons/custom/ruler-h-grid.svg";
import { rarityDict } from "../../constants/rarity";

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
  max_colony_size: {
    icon: ruler_h_grid_svg,
    description: "Taille de la colonie",
  },
  common_colony_size: {
    icon: ruler_h_grid_svg,
    description: "Taille de la colonie",
  },
  common_plume_diameter: {
    icon: diameter_icon,
    description: "Diamètre de la plume",
  },
  max_polyp_diameter: {
    icon: diameter_icon,
    description: "Diamètre du polype",
  },
  common_diameter: {
    icon: diameter_icon,
    description: "Diamètre de ... ... ...",
  },
};

const getSizes = (sizes: ISpeciesSizes | any) => {
  let result: JSX.Element[] = [];

  // Handle simple sizes
  for (const type in dict_sizes_icon) {
    if (type in sizes) {
      result.push(
        <>
          <div className="icon">{dict_sizes_icon[type].icon}</div>
          <div className="text">{sizes[type]} cm</div>
        </>
      );
    }
  }

  // Handle complex sizes (min-max)
  let text = "";
  if ("max_length" in sizes || "common_length" in sizes) {
    if ("max_length" in sizes) {
      text = "< " + sizes.max_length;
    }
    if ("common_length" in sizes) {
      text = "~ " + sizes.common_length;
    }
    if ("common_length" in sizes && "max_length" in sizes) {
      text = sizes.common_length + "-" + sizes.max_length;
    }

    result.push(
      <>
        <div className="icon">{ruler_h_icon}</div>
        <div className="text">{text} cm</div>
      </>
    );
  }

  return result;
};

export default function SpeciesHighlight(props: { species: ISpecies }) {
  if (
    (!props.species.sizes || Object.keys(props.species.sizes).length === 0) &&
    (props.species.depth_max !== null || !props.species.depth_min !== null) &&
    !props.species.rarity
  ) {
    return null;
  }

  return (
    <Style className="sm:border-none">
      <div className="grid grid-nogutter highlight-item-grid">
        {getSizes(props.species.sizes || {}).map((el, index) => (
          <div className="col item" key={index}>
            {el}
          </div>
        ))}
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
          <div className="col item">
            <div className="icon">
              <GemSvg
                aria-label="rarity"
                className="svg-icon"
                style={{ width: "26px" }}
              />
            </div>
            <div className="text">
              {rarityDict[props.species.rarity].name.fr}
            </div>
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

  .highlight-item-grid {
    @media (min-width: 576px) {
      margin-left: 0.5rem;

      > div {
        flex: 1 1 auto;
        max-width: 100px;
        width: 100%;
      }
    }
  }

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
