import { useRef, useState } from "react";
import { useSearchBox, UseSearchBoxProps } from "react-instantsearch-hooks-web";
import styled from "styled-components";
import SearchSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";
import XmarkSvg from "../../public/icons/fontawesome/light/xmark.svg";

export default function CustomSearchBox(props: UseSearchBoxProps) {
  const { refine, clear, query } = useSearchBox(props);
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refine(e.target.value);
    setSearchValue(e.target.value);
  };

  const clearInput = () => {
    setSearchValue("");
    clear();
  };

  return (
    <Style>
      <SearchSvg
        aria-label="search-icon"
        style={{ width: "18px" }}
        className="svg-icon icon-left"
      />
      <input
        ref={searchInput}
        aria-label="Search"
        type="text"
        placeholder="Nom commun ou scientifique"
        onChange={onChange}
        value={searchValue}
      />
      {searchValue && (
        <XmarkSvg
          onClick={() => clearInput()}
          aria-label="search-icon"
          style={{ width: "14px" }}
          className="svg-icon icon-right"
        />
      )}
    </Style>
  );
}

// Style
const Style = styled.div`
  position: relative;

  input {
    width: 100%;
    height: 50px;
    padding: 12px 50px;
    background: var(--bg-grey);
    border-radius: var(--border-radius);

    &::placeholder {
      color: var(--text-color-2);
    }
  }

  .icon-left {
    top: 0;
    bottom: 0;
    margin: auto 1rem;
    left: 0;
  }

  .icon-right {
    top: 0;
    bottom: 0;
    margin: auto 1rem;
    right: 0;
  }

  .svg-icon {
    position: absolute;

    path {
      fill: var(--text-color-1);
    }
  }
`;
