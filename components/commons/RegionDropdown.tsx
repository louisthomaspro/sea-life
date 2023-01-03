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
      <div className="field">
        <label>Région</label>
        <Dropdown
          value={userRegion}
          options={regionsList}
          onChange={onRegionChange}
          optionLabel="name.fr"
          optionValue="id"
          placeholder="Selectionnez une région"
        />
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  .field {
    display: flex;
    flex-direction: column;
    /* max-width: 250px; */
  }
`;
