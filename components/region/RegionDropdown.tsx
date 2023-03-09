import { Dropdown } from "primereact/dropdown";
import { useContext } from "react";
import styled from "styled-components";
import { regionsList } from "../../constants/regions";
import RegionContext from "./region.context";

interface IRegionDropdown extends React.HTMLAttributes<HTMLDivElement> {}
export default function RegionDropdown(props: IRegionDropdown) {
  const { userRegion, setUserRegion } = useContext(RegionContext);

  const onRegionChange = (e: any) => {
    setUserRegion(e.value);
  };

  return (
    <Style {...props}>
      <Dropdown
        aria-label="region-dropdown"
        value={userRegion}
        options={regionsList}
        onChange={onRegionChange}
        optionLabel="name.fr"
        optionValue="id"
        placeholder="Selectionnez une région"
        className="dropdown-region w-full"
        panelClassName="dropdown-region-panel"
      />
    </Style>
  );
}

// Style
const Style = styled.div`
  .dropdown-region {
    width: 100%;
    height: 42px;
    align-items: center;
    padding: 0 12px;
    justify-content: center;
    border: none;
    background-color: #ebf1f7;

    .p-dropdown-label, .p-dropdown-trigger {
      font-weight: 600;
      color: var(--primary-color);
      font-family: var(--font-family);
    }

    .p-dropdown-label {
      flex: none;
      width: auto;
    }

    box-shadow: none !important;
  }

  /* .dropdown-region-panel is style in global.css */
`;
