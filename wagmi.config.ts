import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";
import ownomad from "./deployments/localhost/Ownomad.json";
import ownomadNFT from "./deployments/localhost/OwnomadNFT.json";
import usdt from "./deployments/localhost/USDToken.json";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20ABI,
    },
    {
      name: "ownomad",
      address: ownomad.address as `0x${string}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      abi: ownomad.abi as any,
    },
    {
      name: "ownomadNFT",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      abi: ownomadNFT.abi as any,
    },
    {
      name: "usdt",
      address: usdt.address as `0x${string}`,
      abi: usdt.abi,
    },
  ],
  plugins: [react()],
});
