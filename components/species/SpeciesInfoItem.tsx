import styled from "styled-components";

interface ISpeciesListItem {
  icon: JSX.Element;
  title?: JSX.Element | string;
  subtitle?: JSX.Element | string;
  blinkRed?: boolean;
  className?: string;
}
export default function SpeciesInfoItem(props: ISpeciesListItem) {
  return (
    <Style
      className={`${props.className} ${props.blinkRed ? "blink-red" : ""}`}
    >
      <Icon>{props.icon}</Icon>
      <Text>
        {props.title && <div>{props.title}</div>}
        {props.subtitle && <div>{props.subtitle}</div>}
      </Text>
    </Style>
  );
}

// Style
const Style = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;

  &.blink-red,
  &.blink-red .svg-icon path {
    animation: blinkingText 2s infinite ease-in-out;
  }

  @keyframes blinkingText {
    50% {
      color: var(--red);
      fill: var(--red);
    }
  }
`;

const Icon = styled.div`
  width: 40px;
  flex: none;

  > svg {
    display: flex;
  }
`;

const Text = styled.div`
  font-size: 14px;
  padding-right: 8px;

  // Title
  > div:nth-child(1) {
    font-weight: 600;
  }

  // Subtitle
  > div:nth-child(2) {
    font-weight: 400;
  }
`;
