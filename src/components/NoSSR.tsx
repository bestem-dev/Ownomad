import dynamic from "next/dynamic";
import type React from "react";

const NoSSR = <T,>(Component: React.FunctionComponent<T>) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });

export default NoSSR;
