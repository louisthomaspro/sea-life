import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";

const Scrollbar = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(
    null
  );
  const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  function handleResize(ref: HTMLDivElement, trackSize: number) {
    const { clientHeight, scrollHeight } = ref;
    setThumbHeight(Math.max((clientHeight / scrollHeight) * trackSize, 20));
  }

  function handleScrollButton(direction: "up" | "down") {
    const { current } = contentRef;
    if (current) {
      const scrollAmount = direction === "down" ? 200 : -200;
      current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  }

  const handleTrackClick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const { current: trackCurrent } = scrollTrackRef;
      const { current: contentCurrent } = contentRef;
      if (trackCurrent && contentCurrent) {
        const { clientY } = e;
        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const trackTop = rect.top;
        const thumbOffset = -(thumbHeight / 2);
        const clickRatio =
          (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
        const scrollAmount = Math.floor(
          clickRatio * contentCurrent.scrollHeight
        );
        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    },
    [thumbHeight]
  );

  const handleThumbPosition = useCallback(() => {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }
    const { scrollTop: contentTop, scrollHeight: contentHeight } =
      contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;
    let newTop = (+contentTop / +contentHeight) * trackHeight;
    newTop = Math.min(newTop, trackHeight - thumbHeight);
    const thumb = scrollThumbRef.current;
    thumb.style.top = `${newTop}px`;
  }, []);

  const handleThumbMousedown = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollStartPosition(e.clientY);
    if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop);
    setIsDragging(true);
  }, []);

  const handleThumbMouseup = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  const handleThumbMousemove = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        const {
          scrollHeight: contentScrollHeight,
          offsetHeight: contentOffsetHeight,
        } = contentRef.current;

        const deltaY =
          (e.clientY - scrollStartPosition) *
          (contentOffsetHeight / thumbHeight);
        const newScrollTop = Math.min(
          initialScrollTop + deltaY,
          contentScrollHeight - contentOffsetHeight
        );

        contentRef.current.scrollTop = newScrollTop;
      }
    },
    [isDragging, scrollStartPosition, thumbHeight]
  );

  // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current) {
      const ref = contentRef.current;
      const { clientHeight: trackSize } = scrollTrackRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize(ref, trackSize);
      });
      observer.current.observe(ref);
      ref.addEventListener("scroll", handleThumbPosition);
      return () => {
        observer.current?.unobserve(ref);
        ref.removeEventListener("scroll", handleThumbPosition);
      };
    }
  }, []);

  // Listen for mouse events to handle scrolling by dragging the thumb
  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove);
    document.addEventListener("mouseup", handleThumbMouseup);
    document.addEventListener("mouseleave", handleThumbMouseup);
    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove);
      document.removeEventListener("mouseup", handleThumbMouseup);
      document.removeEventListener("mouseleave", handleThumbMouseup);
    };
  }, [handleThumbMousemove, handleThumbMouseup]);

  return (
    <Style>
      <div className="custom-scrollbars__container">
        <div className="custom-scrollbars__content" ref={contentRef} {...props}>
          {children}
        </div>
        <div className="custom-scrollbars__scrollbar">
          <button
            className="custom-scrollbars__button"
            onClick={() => handleScrollButton("up")}
          >
            ⇑
          </button>
          <div className="custom-scrollbars__track-and-thumb">
            <div
              className="custom-scrollbars__track"
              ref={scrollTrackRef}
              onClick={handleTrackClick}
              style={{ cursor: isDragging && "grabbing" }}
            ></div>
            <div
              className="custom-scrollbars__thumb"
              ref={scrollThumbRef}
              onMouseDown={handleThumbMousedown}
              style={{
                height: `${thumbHeight}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
            ></div>
          </div>
          <button
            className="custom-scrollbars__button"
            onClick={() => handleScrollButton("down")}
          >
            ⇓
          </button>
        </div>
      </div>
    </Style>
  );
};

// Style
const Style = styled.button`
  .custom-scrollbars__container {
    background-color: white;
    border: 1px solid #333;
    border-radius: 12px;
    display: grid;
    height: 100%;
    grid-template: auto / 1fr 50px;
    overflow: hidden;
    position: relative;
  }

  .custom-scrollbars__content {
    height: 90vh;
    -ms-overflow-style: none;
    overflow: auto;
    padding: 0 1rem;
    scrollbar-width: none;
  }

  .custom-scrollbars__content::-webkit-scrollbar {
    display: none;
  }

  .custom-scrollbars__scrollbar {
    display: grid;
    gap: 1rem;
    grid-auto-flow: row;
    grid-template: auto 1fr auto / 1fr;
    padding: 1rem;
    place-items: center;
  }

  .custom-scrollbars__track-and-thumb {
    display: block;
    height: 100%;
    position: relative;
    width: 16px;
  }

  .custom-scrollbars__track {
    background-color: #ccc;
    border-radius: 12px;
    bottom: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    width: 16px;
  }

  .custom-scrollbars__thumb {
    border-radius: 12px;
    background-color: #333;
    position: absolute;
    width: 16px;
  }
`;

export default Scrollbar;
