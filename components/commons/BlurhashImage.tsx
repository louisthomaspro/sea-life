import { BlurhashCanvas } from "react-blurhash";

export default function BlurhashImage(props: { blurhash: any }) {
  return (
    <>
      {props.blurhash && (
        <BlurhashCanvas
          {...props.blurhash}
          punch={1}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </>
  );
}
