import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Configure,
  InstantSearch,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import styled from "styled-components";
import { algolia } from "../../algolia/clientApp";
import SearchSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";
import XmarkSvg from "../../public/icons/fontawesome/light/xmark.svg";
import Spinner from "../commons/Spinner";
import CustomInfiniteHits from "./CustomInfiniteHits";
import SearchBoxWorkaround from "./SearchBoxWorkaround";

const searchBoxTransition = { duration: 0.3 };

interface ICustomSearchBox extends React.HTMLAttributes<HTMLDivElement> {}
export default function CustomSearchBox(props: ICustomSearchBox) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Escape key to close modal
    const handleEsc = (event: any) => {
      if (event.keyCode === 27) {
        setOpenModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const clearInput = () => {
    setSearchValue("");
    inputRef.current.value = "";
  };

  const LoadingIndicator = () => {
    const { status, results } = useInstantSearch();
    if (status === "loading" || status === "stalled") {
      return (
        <div className="flex align-item-center">
          <Spinner />
        </div>
      );
    }
    if (!results.__isArtificial && results.nbHits === 0) {
      return <>Aucune espèce trouvée :(</>;
    }
    return null;
  };

  const debouncedChangeHandler = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
      }, 300),
    []
  );

  return (
    <Style {...props}>
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="search-modal"
            // animate={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            // transition={openModal ? searchBoxTransition : { duration: 0 }}
          >
            <div className="global-padding max-width-800">
              <div className="search-header">
                <div className="close pt-2">
                  <XmarkSvg
                    onClick={() => setOpenModal(false)}
                    aria-label="search-icon"
                    style={{ width: "26px" }}
                    className="svg-icon relative"
                  />
                </div>
              </div>
              <motion.div
                // layoutId="search-input"
                transition={searchBoxTransition}
                className="input-container sm:max-w-20rem"
              >
                <SearchSvg
                  aria-label="search-icon"
                  style={{ width: "18px" }}
                  className="svg-icon icon-left"
                />
                <input
                  ref={inputRef}
                  autoFocus
                  aria-label="Search"
                  type="text"
                  placeholder="Rechercher une espèce"
                  onChange={debouncedChangeHandler}
                />
                {inputRef.current?.value && (
                  <div className="icon-right" onClick={() => clearInput()}>
                    <XmarkSvg
                      aria-label="search-icon"
                      style={{ width: "14px" }}
                      className="svg-icon"
                    />
                  </div>
                )}
              </motion.div>
              <InstantSearch
                // searchFunction={handleSearchFunction}
                indexName="species"
                searchClient={algolia}
              >
                {/* <SearchBox /> */}
                <Configure hitsPerPage={10} />
                <SearchBoxWorkaround query={searchValue} />
                <hr />
                <LoadingIndicator />
                <CustomInfiniteHits />
              </InstantSearch>
            </div>
          </motion.div>
        )}
        <motion.div
          // layoutId="search-input"
          className="input-container fake-input"
          transition={searchBoxTransition}
          onClick={() => setOpenModal(true)}
        >
          <SearchSvg
            aria-label="search-icon"
            style={{ width: "18px" }}
            className="svg-icon icon-left"
          />
          <input
            aria-label="Search"
            type="text"
            placeholder="Rechercher une espèce"
            readOnly
          />
        </motion.div>
      </AnimatePresence>
    </Style>
  );
}

// Style
const Style = styled.div`
  position: relative;

  .input-container {
    margin: auto;
    position: relative;
  }

  .search-modal {
    top: 0;
    left: 0;
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(255, 255, 255, 1);
    z-index: 200;
    overflow-y: scroll;
  }

  input {
    width: 100%;
    padding: 12px 50px;
    background: var(--bg-grey);
    border-radius: var(--border-radius);

    &[placeholder] {
      text-overflow: ellipsis;
    }

    &::placeholder {
      color: var(--text-color-2);
    }

    &:focus::placeholder {
      color: transparent;
    }
  }

  .fake-input {
    cursor: text;
  }

  .icon-left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto 1rem;
  }

  .icon-right {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 0 1rem;
    display: flex;
    cursor: pointer;
  }

  .svg-icon {
    path {
      fill: var(--text-color-1);
    }
  }

  .search-header {
    display: flex;
    justify-content: end;

    .close {
      padding: 0 0.5rem;
      cursor: pointer;
      display: flex;
      margin-bottom: 1rem;
    }
  }
`;
