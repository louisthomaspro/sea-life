import { AnimatePresence, LazyMotion, motion, m } from "framer-motion";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Configure,
  InstantSearch,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import styled from "styled-components";
import { algolia } from "../../algolia/clientApp";
import SearchSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";
import XmarkRegularSvg from "../../public/icons/fontawesome/regular/xmark.svg";
import XmarkThinSvg from "../../public/icons/fontawesome/thin/xmark.svg";
import Spinner from "../commons/Spinner";
import CustomInfiniteHits from "./CustomInfiniteHits";
import SearchBoxWorkaround from "./SearchBoxWorkaround";

const searchBoxTransition = { duration: 0.3 };

interface ICustomSearchBox extends React.HTMLAttributes<HTMLDivElement> {
  screen?: "web" | "mobile";
}
export default function CustomSearchBox(props: ICustomSearchBox) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string>("id");
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    setId("id" + Math.random());

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

  useEffect(() => {
    if (!openModal) {
      setShowResults(false);
      setSearchValue("");
    }
  }, [openModal]);

  useEffect(() => {
    const handleRouteComplete = () => {
      setOpenModal(false);
    };
    router.events.on("routeChangeComplete", handleRouteComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteComplete);
    };
  }, []);

  useEffect(() => {}, []);

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
      {openModal && (
        <div
          className="search-modal"
          // animate={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
          // transition={searchBoxTransition}
        >
          <div className="global-padding max-width-800">
            <div className="search-header mt-3">
              <m.div
                layoutId={`${id}-layout`}
                key={`${id}-layout`}
                transition={searchBoxTransition}
                className="input-container sm:max-w-20rem"
                onLayoutAnimationComplete={() => {
                  setShowResults(true);
                  inputRef.current?.focus();
                }}
              >
                <SearchSvg
                  aria-label="search-icon"
                  style={{ width: "18px" }}
                  className="svg-icon icon-left"
                />
                <input
                  ref={inputRef}
                  aria-label="Search"
                  type="text"
                  placeholder="Rechercher une espèce"
                  onChange={debouncedChangeHandler}
                />
                {inputRef.current?.value && (
                  <div className="icon-right" onClick={() => clearInput()}>
                    <div className="icon-container">
                      <XmarkRegularSvg
                        aria-label="search-icon"
                        style={{ width: "8px" }}
                        className="svg-icon"
                      />
                    </div>
                  </div>
                )}
              </m.div>
              <div className="close mt-3 ml-2">
                <XmarkThinSvg
                  onClick={() => setOpenModal(false)}
                  aria-label="search-icon"
                  style={{ width: "20px" }}
                  className="svg-icon relative"
                />
              </div>
            </div>

            <InstantSearch indexName="species" searchClient={algolia}>
              {showResults && (
                <>
                  {/* <SearchBox /> */}
                  <Configure hitsPerPage={10} />
                  <SearchBoxWorkaround query={searchValue} />
                  <hr />
                  <LoadingIndicator />
                  <CustomInfiniteHits />
                </>
              )}
            </InstantSearch>
          </div>
        </div>
      )}

      <m.div
        layoutId={`${id}-layout`}
        key={`${id}-layout`}
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
      </m.div>
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
    border-radius: 100px;

    &[placeholder] {
      text-overflow: ellipsis;
    }

    &::placeholder {
      color: var(--text-color-2);
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
    align-items: center;
    cursor: pointer;

    .icon-container {
      height: 18px;
      display: flex;
      width: 18px;
      background-color: #dcdcdc;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
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

  .cancel-transform {
    transform-origin: unset !important;
    transform: none !important;
    opacity: 1 !important;
    pointer-events: initial !important;
  }
`;
