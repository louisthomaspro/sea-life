import { useEffect } from "react";
import { useSearchBox, UseSearchBoxProps } from "react-instantsearch-hooks-web";

interface ISearchBoxWorkaround extends UseSearchBoxProps {
  query: string;
}
export default function SearchBoxWorkaround(props: ISearchBoxWorkaround) {
  const { refine } = useSearchBox(props);

  useEffect(() => {
    refine(props.query);
  }, [props.query]);

  return <></>;
}
