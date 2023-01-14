import { Dropdown } from "primereact/dropdown";
import { useContext } from "react";
import styled from "styled-components";
import { regionsList } from "../../constants/regions";
import RegionContext from "../../context/region.context";

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
    height: 50px;
    align-items: center;
    border-radius: 100px;
    padding: 0 12px;
  }

  /* .dropdown-region-panel is style in global.css */
`;
