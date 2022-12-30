import { useSearchBox, UseSearchBoxProps } from "react-instantsearch-hooks-web";
import styled from "styled-components";
import SearchSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";

export default function CustomSearchBox(props: UseSearchBoxProps) {
  const { refine, clear, query } = useSearchBox(props);

  return (
    <Style>
      <SearchSvg
        aria-label="right"
        style={{ width: "18px" }}
        className="svg-icon"
      />
      <input
        type="text"
        placeholder="Nom commun ou scientific"
        onChange={(e) => refine(e.currentTarget.value)}
      />
    </Style>
  );
}

// Style
const Style = styled.div`
  position: relative;

  input {
    width: 100%;
    height: 50px;
    padding: 12px 12px 12px 50px;
    background: var(--bg-grey);
    border-radius: var(--border-radius);

    &::placeholder {
      color: var(--text-color-2);
    }
  }

  svg {
    position: absolute;
    top: 30%;
    margin-left: 1rem;

    path {
      fill: var(--text-color-1);
    }
  }
`;
