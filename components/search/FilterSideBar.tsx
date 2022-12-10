import { Sidebar, SidebarProps } from "primereact/sidebar";
import styled from "styled-components";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import Button from "../commons/Button";

const statuses = [
  { name: "(LC) Least concern)", code: "LC" },
  { name: "(EN) Endangered", code: "EN" },
  { name: "(NT) Near threatened", code: "NT" },
  { name: "(VU) Vulnerable", code: "VU" },
  { name: "(CR) Critically endangered", code: "CR" },
  { name: "(NE) Not evaluated", code: "NE" },
  { name: "(CD) Conservation Dependent", code: "CD" },
];

export default function FilterSideBar(props: SidebarProps) {
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  return (
    <Sidebar {...props} style={{ height: "70%" }}>
      <Style>
        <h1>Filter page</h1>
        <div className="filter">
          <div className="filter-title">Statut de conservation</div>
          <div className="filter-input">
            <MultiSelect
              value={selectedStatuses}
              options={statuses}
              onChange={(e) => setSelectedStatuses(e.value)}
              optionLabel="name"
              placeholder="Statut de conservation"
              display="chip"
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="filter-action">
          <Button secondary aria-label="Effacer">
            Effacer
          </Button>
          <Button className="ml-2" aria-label="Afficher">
            Afficher
          </Button>
        </div>
      </Style>
    </Sidebar>
  );
}

// Style
const Style = styled.div`
  display: flex;
  flex-direction: column;

  .filter {
    .filter-title {
    }
    .filter-input {
    }
  }

  .filter-action {
    margin-top: 1rem;
    display: flex;
  }

  h1 {
    font-size: 20px;
    font-weight: bold;
  }
`;
