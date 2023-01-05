import { Dropdown } from "primereact/dropdown";
import { useContext } from "react";
import styled from "styled-components";
import { regionsList } from "../../constants/regions";
import RegionContext from "../../context/region.context";

interface IRegionDropdown {}
export default function RegionDropdown(props: IRegionDropdown) {
  const { userRegion, setUserRegion } = useContext(RegionContext);

  const onRegionChange = (e: any) => {
    setUserRegion(e.value);
  };

  return (
    <Style>
      <Dropdown
        value={userRegion}
        options={regionsList}
        onChange={onRegionChange}
        optionLabel="name.fr"
        optionValue="id"
        placeholder="Selectionnez une région"
        className="dropdown-region"
        panelClassName="dropdown-region-panel"
        style={{ width: "100%" }}
      />
    </Style>
  );
}

// Style
const Style = styled.div`
  margin-bottom: 16px;
`;
