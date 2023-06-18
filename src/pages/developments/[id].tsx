// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
// import { api } from "@/utils/api";
import Header from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useOwnomadNftMintWithErcToken,
  useOwnomadNftRead,
  useOwnomadGetDevelopment,
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
  usePrepareOwnomadNftMintWithErcToken,
  useErc20ApprovalEvent,
} from "@/generated";

import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import NoSSR from "@/components/NoSSR";
import { useRouter } from "next/router";
import developmentsData from "@/../data/developments.json";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();
  const { id } = router.query;

  const developmentData = developmentsData[Number(id)]?.copy?.en;

  return (
    <>
      <Head>
        <title>Ownomad</title>
        <meta name="description" content="" />
      </Head>
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 p-16">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-4 p-16">
          <div className="flex w-full flex-col items-center gap-4 rounded-3xl shadow-sm shadow-neutral-200 ">
            <div className="relative h-44 w-full">
              <Image
                src={"/images/picture1.png"}
                alt={"Picture 1"}
                fill
                className="h-40 w-auto rounded-t-3xl object-cover"
              />
            </div>
            <div className="w-full px-8 py-4">
              <h1 className="text-3xl font-bold">{developmentData?.name}</h1>
              <p className="text-lg text-neutral-400">
                {developmentData?.location}
              </p>
              <p className="">
                Expected profit: {developmentData?.rentability}
              </p>
              <p className="">Investment period: {developmentData?.term}</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 rounded-3xl  pb-4 shadow-sm shadow-neutral-200 ">
            <NFTCheckout developmentId={id as string} />
          </div>
        </div>
      </div>
    </>
  );
}

const NFTCheckout = NoSSR(({ developmentId }: { developmentId: string }) => {
  const { data: contractAddress } = useOwnomadGetDevelopment({
    args: [parseUnits((developmentId || "0") as `${number}`, 0)],
    enabled: !!developmentId,
  });

  const { data: tokenValue } = useOwnomadNftRead({
    address: contractAddress,
    functionName: "getTokenPrice",
  });

  const { data: maxAmount } = useOwnomadNftRead({
    address: contractAddress,
    functionName: "maxSupply",
  });

  const { data: tokenContractAddress } = useOwnomadNftRead({
    address: contractAddress,
    functionName: "getPaymentToken",
  });

  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState<string | undefined>("usdt");

  const contractReady = !!(
    contractAddress &&
    tokenContractAddress &&
    tokenValue &&
    maxAmount
  );

  return (
    <div className="w-full px-8" id="invest">
      <h1 className="text-3xl font-bold">Buy NFT</h1>
      <div className="w-full border-b border-neutral-200"></div>
      <div className="flex flex-col gap-4 py-8">
        <div className="flex flex-col">
          <div className="flex w-full items-center gap-4">
            <Input
              type="number"
              max={Number(maxAmount) || 0}
              min={0}
              value={amount || ""}
              onChange={(e) =>
                setAmount(Math.min(15, parseInt(e.target.value)))
              }
              className="h-12 w-full rounded-3xl border border-neutral-200 px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="NFTs to buy"
            ></Input>
            <div className="w-full border-b border-neutral-200"></div>
            <p className="w-64 text-center text-lg">
              {amount * Number(tokenValue) || 0} USD
            </p>
          </div>
          <p className="ml-4 mt-1 text-sm  text-muted-foreground">Max. 15</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={token} onValueChange={(t) => setToken(t)}>
            <SelectTrigger className="h-12 w-full rounded-3xl border border-neutral-200 px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Seleccionar token.." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usdt">USDT</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full border-b border-neutral-200"></div>
          <p className="w-64 text-center text-lg">
            {amount * Number(tokenValue) || 0} {token?.toUpperCase()}
          </p>
        </div>
      </div>
      {contractReady && (
        <NFTCheckoutButton
          tokenValue={Number(tokenValue)}
          maxAmount={Number(maxAmount)}
          tokenContractAddress={tokenContractAddress}
          contractAddress={contractAddress}
          amount={amount}
        />
      )}
    </div>
  );
});

interface INFTChekoutCallerProps {
  tokenValue: number;
  maxAmount: number;
  tokenContractAddress: `0x${string}`;
  contractAddress: `0x${string}`;
  amount: number;
}
function NFTCheckoutButton({
  tokenValue,
  maxAmount,
  tokenContractAddress,
  contractAddress,
  amount,
}: INFTChekoutCallerProps) {
  const maxUsdValue = tokenValue * maxAmount;

  const { address, isConnected } = useAccount();

  const {
    data: tokenAllowance,
    isSuccess: allowanceReady,
    refetch,
  } = useErc20Allowance({
    address: tokenContractAddress,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    args: [address!, contractAddress],
    enabled: isConnected,
  });
  useErc20ApprovalEvent({
    address: tokenContractAddress,
    listener: (e) => {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { owner, spender } = e[0]!.args;
      if (owner === address && spender === contractAddress) {
        void refetch();
      }
    },
  });

  const usdValue = amount * tokenValue || 0;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const needsApproval =
    allowanceReady &&
    (tokenAllowance || 0) < parseUnits(`${usdValue || 1}`, 18);

  console.log((tokenAllowance || 0) < parseUnits(`${usdValue || 1}`, 18));
  return needsApproval ? (
    <ApproveTokenButton
      tokenContractAddress={tokenContractAddress}
      contractAddress={contractAddress}
      enabled={isConnected}
      maxUsdValue={maxUsdValue}
    />
  ) : (
    <MintButton
      contractAddress={contractAddress}
      amount={amount}
      enabled={isConnected}
    />
  );
}

interface IApproveTokenButtonProps {
  tokenContractAddress: `0x${string}`;
  contractAddress: `0x${string}`;
  enabled: boolean;
  maxUsdValue: number;
}
function ApproveTokenButton({
  tokenContractAddress,
  contractAddress,
  enabled,
  maxUsdValue,
}: IApproveTokenButtonProps) {
  console.log({
    tokenContractAddress,
    contractAddress,
    enabled,
    maxUsdValue,
  });
  const preparedApproval = usePrepareErc20Approve({
    address: tokenContractAddress,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    args: [contractAddress, parseUnits(`${maxUsdValue}`, 18)], // Use contract decimals
    enabled,
  });

  const approveToken = useErc20Approve({ ...preparedApproval.config });

  return (
    <button
      disabled={!preparedApproval.isSuccess}
      onClick={approveToken.writeAsync}
      className=" w-full rounded-full bg-primary px-5 py-2 text-sm text-primary text-white outline-primary transition-all hover:font-medium hover:opacity-90 enabled:hover:scale-[1.01] disabled:opacity-50 sm:text-lg"
    >
      Approve Tokens
    </button>
  );
}

interface IMintNFTButtonProps {
  contractAddress: `0x${string}`;
  enabled: boolean;
  amount: number;
}
function MintButton({ contractAddress, enabled, amount }: IMintNFTButtonProps) {
  const prepareMint = usePrepareOwnomadNftMintWithErcToken({
    address: contractAddress,
    args: [parseUnits(`${amount || 0}`, 0)],
    enabled,
  });

  const mint = useOwnomadNftMintWithErcToken(prepareMint.config);

  return (
    <button
      disabled={!prepareMint.isSuccess}
      onClick={mint.writeAsync}
      className=" w-full rounded-full bg-primary px-5 py-2 text-sm text-primary text-white outline-primary transition-all hover:font-medium hover:opacity-90 enabled:hover:scale-[1.01] disabled:opacity-50 sm:text-lg"
    >
      Invest
    </button>
  );
}
