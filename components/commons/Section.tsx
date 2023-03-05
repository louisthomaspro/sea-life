import styled from "styled-components";

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
}
export default function Section(props: ISectionProps) {
  return (
    <Style>
      <div className="section">
        <div className="divider-header">
          <h3 className="section-title divider-text">{props.title}</h3>
          <div className="divider-line sm:hidden"></div>
        </div>
        <div>{props.children}</div>
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  .section {
    margin-top: 10px;

    .divider-header {
      display: flex;
      align-items: center;
      margin: 24px 0 10px 0;
      color: var(--text-color-2);
      font-weight: 700;
      font-size: 16px;

      .divider-text {
        margin-right: 10px;
      }

      .divider-line {
        flex-grow: 1;
        height: 1px;
        background-color: var(--border-color-light);
      }
    }
  }
`;
