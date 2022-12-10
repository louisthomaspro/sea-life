import { useSearchBox, UseSearchBoxProps } from "react-instantsearch-hooks-web";
import styled from "styled-components";
import SearchSvg from "../../public/icons/primeicons/search.svg";

export default function CustomSearchBox(props: UseSearchBoxProps) {
  const { refine, clear, query } = useSearchBox(props);

  return (
    <Style>
      <SearchSvg className="svg-icon" />
      <input
        type="text"
        placeholder="Common name or scientific name"
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
    top: 25%;
    margin-left: 0.75rem;
    width: 22px;

    path {
      fill: var(--text-color-1);
    }
  }
`;
