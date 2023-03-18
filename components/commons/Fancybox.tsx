import React, { useEffect } from "react";

// @ts-ignore
import { Fancybox as NativeFancybox } from "@fancyapps/ui/dist/fancybox/fancybox.umd";

export default function Fancybox(props: any) {
  const delegate = props.delegate || "[data-fancybox]";

  useEffect(() => {
    const opts = props.options || {};

    NativeFancybox.bind(delegate, opts);

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  return <>{props.children}</>;
}
