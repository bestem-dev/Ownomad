// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
// import { api } from "@/utils/api";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkButton, { LinkButtonDark } from "@/components/LinkButton";
import Image from "next/image";
import developmentsData from "@/../data/developments.json";
import type { Development } from "@/types/developments";
import NoSSR from "@/components/NoSSR";
import { ownomadConfig, ownomadNftABI } from "@/generated";
import { useAccount, usePublicClient } from "wagmi";
import { getContract } from "viem";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Ownomad</title>
        <meta name="description" content="" />
      </Head>
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <h1 className="text-4xl font-bold text-primary">Welcome to Ownomad!</h1>
        <div className="w-full border-b border-neutral-200"></div>
        <Tabs defaultValue="explore" className="w-full px-10">
          <TabsList className="">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="investment">My Investments</TabsTrigger>
            {/* <TabsTrigger value="development">Mis desarrollos</TabsTrigger> */}
          </TabsList>
          <TabsContent value="explore">
            <div className="grid w-full grid-flow-row grid-cols-3 gap-4 xl:grid-cols-4 2xl:grid-cols-5">
              {developmentsData.map((d, i) => (
                <ProjectCard key={i} i={i} data={d} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="investment">
            <MyInvestments />
          </TabsContent>
          {/* <TabsContent value="development">
            Change your password here.
          </TabsContent> */}
        </Tabs>
      </div>
    </>
  );
}

interface ProjectCardProps {
  i: number;
  data: Development;
}
function ProjectCard({ i, data }: ProjectCardProps) {
  const copyData = data.copy.en;
  return (
    <div className="flex h-80 flex-col items-center gap-4 rounded-3xl  pb-4 shadow-sm shadow-neutral-200 transition-transform duration-500 hover:scale-[1.01]">
      <div className="relative h-44 w-full">
        <Image
          src={data.imageUrl}
          alt={"Picture 1"}
          fill
          className="h-40 w-auto rounded-t-3xl object-cover"
        />
      </div>
      <div className="w-full px-4">
        <h3 className="text-xl font-bold">{copyData.name}</h3>
        <p className="text-xs text-neutral-400">{copyData.location}</p>
        <h4 className="mt-2 text-sm">
          {copyData.rentability} estimated profitability. {copyData.term}
        </h4>
        <div className="flex items-center justify-around py-2">
          <LinkButtonDark
            to={"developments/" + i.toString()}
            className="bg-[#FFB196] text-red-800"
          >
            Mas Info
          </LinkButtonDark>
          <LinkButtonDark to={"developments/" + i.toString() + "#invest"}>
            Invertir Ahora
          </LinkButtonDark>
        </div>
      </div>
    </div>
  );
}

const MyInvestments = NoSSR(() => {
  const { data: nfts } = useUserNFTs();
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {nfts?.map((nft, i) => {
        if (!nft.length) return;
        const devData = developmentsData[i]!;
        return (
          <div
            className="flex w-full max-w-7xl items-center justify-center overflow-hidden rounded-3xl border border-neutral-100 shadow-md"
            key={i}
          >
            <div className="relative h-44 w-full">
              <Image
                src={devData.imageUrl}
                alt={"Picture 1"}
                fill
                className="h-40 w-auto bg-clip-border object-cover"
              />
            </div>
            <div className="w-full px-4">
              <h2 className="text-2xl font-bold">{devData.copy.en.name}</h2>
              <h3 className="text-lg font-bold">Owned NFTs:</h3>
              {nft.map((nft) => "#" + nft.toString()).join(", ")}
              <h3 className="text-lg font-bold">Total Investment:</h3>
              {nft.length * Number(devData.tokenPrice)} USD
            </div>
          </div>
        );
      })}
    </div>
  );
});

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }

function useUserNFTs() {
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();
  return useQuery({
    queryKey: ["nfts", userAddress],
    queryFn: async () => {
      const ownomad = getContract({ ...ownomadConfig, publicClient });
      const devCount = await ownomad.read.getDevelopmentsCount();
      const data = await Promise.all(
        [...Array(Number(devCount)).keys()].map(async (devId) => {
          const address = await ownomad.read.getDevelopment([BigInt(devId)]);
          const nftContract = getContract({
            abi: ownomadNftABI,
            address,
            publicClient,
          });
          const nftCount = await nftContract.read.totalSupply();
          const ownedNFTs = (
            await Promise.all(
              [...Array(Number(nftCount)).keys()].map(async (tokenId) => {
                const owner = await nftContract.read.ownerOf([BigInt(tokenId)]);
                console.log(
                  "devId: ",
                  devId,
                  "owner: ",
                  owner,
                  "userAddress: ",
                  userAddress,
                  "i: ",
                  tokenId
                );
                if (owner === userAddress) {
                  return tokenId;
                }
              })
            )
          ).filter((p) => p !== undefined) as number[];
          return ownedNFTs;
        })
      );
      return data;
    },
    enabled: !!userAddress,
  });
}
