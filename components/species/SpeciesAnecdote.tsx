import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import CircleInfoSvg from "../../public/icons/fontawesome/solid/circle-info.svg";
import ChevronUpSvg from "../../public/icons/fontawesome/light/chevron-up.svg";

export default function SpeciesAnecdote(props: { species: ISpecies }) {
  return (
    <Style>
      <ul className="accordion">
        <li>
          <input type="checkbox" name="accordion" id="item1" />
          <label htmlFor="item1" className="header">
            <div className="flex">
              <CircleInfoSvg
                aria-label="favorite"
                className="svg-icon"
                style={{ width: "22px", marginLeft: "1px" }}
              />
            </div>
            <div className="flex-grow-1 px-3">Le poissons chirurgiens est un poisson qui mange beaucoup...</div>
            <div className="chevron">
              <ChevronUpSvg
                aria-label="favorite"
                className="svg-icon"
                style={{ width: "16px" }}
              />
            </div>
          </label>
          <div className="body">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex
            consequuntur architecto maxime, saepe repudiandae quidem quisquam
            aliquam cumque possimus inventore, deserunt nostrum, explicabo modi
            voluptatibus sed, labore quaerat. Accusamus, officiis.{" "}
          </div>
        </li>
      </ul>
    </Style>
  );
}

// Style
const Style = styled.div`
  margin-top: 10px;

  .accordion {
    margin: 0 auto;
    list-style: none outside;

    background: #f7fbff;
    border: 2px solid #427396;
    border-radius: 30px;
  }

  .accordion > * + * {
    border-top: 1px solid white;
  }

  .header {
    padding: 16px;
    position: relative;
    cursor: pointer;

    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 15px;

    display: flex;
    align-items: center;

    color: #2c5776;
  }

  input:checked ~ .body {
    max-height: 1000px;
    margin-bottom: 15px;
    -webkit-transition: max-height 1s ease-in, margin 0.3s ease-in,
      padding 0.3s ease-in;
    transition: max-height 1s ease-in, margin 0.3s ease-in, padding 0.3s ease-in;
  }

  input:checked ~ .header > .chevron {
    -webkit-transform: rotate(0);
    -ms-transform: rotate(0);
    transform: rotate(0);
  }

  .chevron {
    display: flex;
    pointer-events: none;
    -webkit-transition: -webkit-transform 0.3s ease;
    transition: transform 0.3s ease;
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }

  .body {
    padding: 0 16px;
    max-height: 0;
    overflow: hidden;
    -webkit-transition: max-height 0.15s ease-out, margin-bottom 0.3s ease-out,
      padding 0.3s ease-out;
    transition: max-height 0.15s ease-out, margin-bottom 0.3s ease-out,
      padding 0.3s ease-out;
  }

  input {
    clip: rect(0 0 0 0);
    width: 1px;
    height: 1px;
    margin: -1;
    overflow: hidden;
    position: absolute;
    left: -9999px;
  }

  svg.svg-icon {
    path {
      fill: var(--blue);
    }
  }
`;
