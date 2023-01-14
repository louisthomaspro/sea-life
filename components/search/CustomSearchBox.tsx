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

export default function CustomSearchBox() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

  function LoadingIndicator({ children }: any) {
    const { status } = useInstantSearch();
    if (status === "loading" || status === "stalled") {
      return (
        <div className="flex align-item-center">
          <Spinner />
        </div>
      );
    }
    return children;
  }

  const debouncedChangeHandler = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
      }, 300),
    []
  );

  return (
    <AnimatePresence>
      <Style>
        {openModal && (
          <motion.div
            className="search-modal"
            // animate={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            // transition={openModal ? searchBoxTransition : { duration: 0 }}
          >
            <div className="main-container">
              <div className="close flex justify-content-end">
                <XmarkSvg
                  onClick={() => setOpenModal(false)}
                  aria-label="search-icon"
                  style={{ width: "26px" }}
                  className="svg-icon relative"
                />
              </div>
              <motion.div
                // layoutId="search-input"
                className="input-container"
                transition={searchBoxTransition}
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
                  <XmarkSvg
                    onClick={() => clearInput()}
                    aria-label="search-icon"
                    style={{ width: "14px" }}
                    className="svg-icon icon-right"
                  />
                )}
              </motion.div>
              <InstantSearch
                // searchFunction={handleSearchFunction}
                indexName="species"
                searchClient={algolia}
              >
                <Configure hitsPerPage={10} />
                <SearchBoxWorkaround query={searchValue} />
                <hr />

                <LoadingIndicator>
                  <CustomInfiniteHits />
                </LoadingIndicator>
              </InstantSearch>
            </div>
          </motion.div>
        )}
        <motion.div
          // layoutId="search-input"
          className="input-container"
          transition={searchBoxTransition}
        >
          <SearchSvg
            aria-label="search-icon"
            style={{ width: "18px" }}
            className="svg-icon icon-left"
          />
          <input
            onClick={() => setOpenModal(true)}
            aria-label="Search"
            type="text"
            placeholder="Rechercher une espèce"
            readOnly
          />
        </motion.div>
      </Style>
    </AnimatePresence>
  );
}

// Style
const Style = styled.div`
  position: relative;

  .input-container {
    max-width: 300px;
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
