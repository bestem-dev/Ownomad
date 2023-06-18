/* eslint-disable @next/next/no-img-element */
import { Menu, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import LinkButton, { LinkButtonDark, buttonStyle } from "./LinkButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
// import Link from "next/link";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import NoSSR from "./NoSSR";

const Header: NextPage = () => {
  return (
    <>
      <header className="t-0 l-0 margin-b-20 primary-gradient fixed z-50 flex h-20 w-screen flex-row items-center">
        <div className="mx-auto flex items-center justify-between gap-4 px-4 sm:w-2/3 sm:px-0">
          <div className="flex w-1/3 flex-shrink-0 items-center justify-start sm:w-1/4">
            <Link href="/#home">
              <Image
                src="/images/logoownomad.svg"
                alt="Bestem"
                width={100}
                height={30}
                className=" max-h-10 md:w-2/3"
              />
            </Link>
          </div>

          <ul className="flex gap-2">
            <li key="web3button" className="align-center flex justify-center">
              <Profile />
            </li>
            {/* <li
              key="profilebutton"
              className="align-center flex justify-center"
            >
              <LinkButton
                to="/#web3"
                icon={
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8.5043C17 13.1984 13.1812 17.0086 8.49571 17C3.80162 17 0 13.1898 0 8.49571C0 3.80162 3.81878 0 8.5043 0C13.1984 0 17.0086 3.81878 17 8.5043ZM8.63302 9.53408C7.97224 9.53408 7.4316 9.53408 6.89955 9.53408C5.4836 9.54266 4.33367 10.478 4.06765 11.8339C3.98183 12.2544 3.97325 12.6749 4.23069 13.0439C4.41091 13.3014 4.65977 13.473 4.91722 13.6446C6.25594 14.5629 7.74054 14.9233 9.35387 14.7087C10.5639 14.5457 11.628 14.0565 12.5634 13.2756C12.8551 13.0353 12.9924 12.7007 12.9839 12.3231C12.9753 10.9157 11.8854 9.70571 10.4866 9.55124C9.82585 9.49117 9.16507 9.55124 8.63302 9.53408ZM8.51288 2.54871C6.9682 2.53155 5.69814 3.79304 5.68097 5.34629C5.67239 6.87381 6.91671 8.13529 8.46139 8.16962C10.0061 8.19536 11.2933 6.92529 11.3105 5.36346C11.3276 3.82736 10.0747 2.56588 8.51288 2.54871Z"
                      fill="#C45C37"
                    />
                  </svg>
                }
              >
                Mi cuenta
              </LinkButton>
            </li> */}
          </ul>
        </div>
      </header>
      <div className="h-20" />
    </>
  );
};

const Profile = NoSSR(function () {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="text-bold flex items-center gap-2 text-lg text-white">
        {shortenAddress(address || "0x00000")}
        <button onClick={() => disconnect()} className={buttonStyle}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonStyle}>
        {
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.42283e-06 6.04802C-0.000388169 5.92424 0.0464829 5.83671 0.115032 5.76712C0.456995 5.41995 0.801497 5.07493 1.14854 4.73282C1.35165 4.53263 1.55632 4.53302 1.76235 4.73789C2.22345 5.19617 2.67907 5.66011 3.13919 6.11956C3.53486 6.51448 3.93444 6.90571 4.33089 7.29986C4.58653 7.55424 4.83963 7.81116 5.09371 8.0671C5.20445 8.17841 5.24585 8.1788 5.35951 8.06515C6.43618 6.98992 7.51285 5.91468 8.58932 4.83945C8.61685 4.81196 8.64459 4.78428 8.67232 4.75699C8.90765 4.52464 9.09142 4.52386 9.32519 4.75719C10.4274 5.85737 11.5293 6.95795 12.6314 8.05833C12.7565 8.18328 12.7837 8.18367 12.9085 8.05911C14.0105 6.95873 15.1126 5.85835 16.2145 4.75797C16.2721 4.70046 16.3322 4.64842 16.4098 4.61625C16.5613 4.55349 16.6945 4.58916 16.8039 4.69676C17.17 5.0568 17.5335 5.41995 17.8934 5.78642C18.0457 5.94158 18.0327 6.14938 17.8678 6.31488C17.4895 6.69518 17.1093 7.07374 16.7296 7.45268C15.5171 8.6632 14.3043 9.87313 13.0925 11.0844C12.9764 11.2004 12.8524 11.2838 12.6788 11.2373C12.5878 11.2129 12.5187 11.1546 12.4534 11.0895C11.3561 9.9936 10.2583 8.89809 9.16075 7.80239C9.13771 7.77939 9.11466 7.75658 9.09142 7.73377C9.02873 7.67217 8.96721 7.67276 8.90472 7.73533C8.75063 7.88933 8.59537 8.04215 8.44128 8.19595C7.47496 9.16086 6.50883 10.1258 5.54309 11.0911C5.4181 11.216 5.27944 11.2887 5.09762 11.2254C5.01423 11.1963 4.95622 11.1349 4.89666 11.0755C4.02935 10.2094 3.16263 9.34273 2.29532 8.47685C1.58034 7.76223 0.864383 7.0482 0.148232 6.33456C0.0624972 6.24918 -0.000192873 6.15445 2.42283e-06 6.04802Z"
              fill="#C45C37"
            />
            <path
              d="M9.05554 0C9.91133 0.00955158 10.7939 0.163546 11.6469 0.48791C12.4094 0.777966 13.1081 1.17582 13.7421 1.68673C14.0791 1.95846 14.3811 2.2684 14.6812 2.57932C14.8154 2.71811 14.8158 2.9261 14.6801 3.06372C14.276 3.47327 13.8676 3.87891 13.4591 4.28417C13.3716 4.37092 13.2774 4.36682 13.1837 4.27735C12.9863 4.08885 12.7964 3.89275 12.5982 3.70484C12.0795 3.21303 11.4858 2.84637 10.8144 2.60037C10.3261 2.42142 9.82364 2.32337 9.30552 2.28751C8.88778 2.25846 8.47668 2.29394 8.06558 2.3645C7.18226 2.51616 6.39678 2.88048 5.69996 3.43837C5.38456 3.69081 5.10978 3.98671 4.82367 4.27033C4.67193 4.42102 4.60123 4.42121 4.44948 4.26975C4.07666 3.89763 3.70384 3.5257 3.33141 3.15319C3.13944 2.96118 3.12616 2.7799 3.31149 2.58224C3.90734 1.94657 4.56139 1.38244 5.33085 0.959836C5.92026 0.636252 6.53778 0.384402 7.18988 0.223C7.65292 0.108381 8.123 0.0315787 8.60206 0.0148147C8.73506 0.0103313 8.86806 0.0019493 9.05554 0Z"
              fill="#C45C37"
            />
          </svg>
        }
        Connect Wallet
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar Wallet</DialogTitle>
          <DialogDescription>
            Elige uno de los siguientes métodos para conectar tu wallet:
          </DialogDescription>
          <div className="flex flex-col items-center">
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                className={buttonStyle}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </button>
            ))}

            {error && <div>{error.message}</div>}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});

function shortenAddress(address: `0x${string}`) {
  return `${address.slice(0, 8)}...${address.slice(-2)}`;
}

export default Header;
