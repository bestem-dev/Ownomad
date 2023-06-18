/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
// import Link from "next/link";

const Footer: NextPage = () => {
  return (
    <footer className="flex h-28 flex-col items-center justify-center bg-neutral-900">
      <p className="font-gradient primary-gradient">
        Bestem LLC © 2023 all rights reserved
      </p>
    </footer>
  );
};

export default Footer;
