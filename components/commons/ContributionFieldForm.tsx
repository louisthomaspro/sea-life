import styled from "styled-components";
import Header from "./Header";
export default function ContributionFieldForm(props: {
  fieldId?: string;
  onSave: (data: any) => void;
}) {
  const submit = () => {
    // emit onSave
    props.onSave({});
  };

  return (
    <Style {...props}>
      <Header title={"Edit"} showBackButton />
      <div onClick={() => submit()}>button</div>
    </Style>
  );
}

// Style
const Style = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: white;
`;
