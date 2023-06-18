import { ethers } from "hardhat";
import { USDToken__factory } from "../typechain-types";
import usdtDeployment from "../deployments/localhost/USDToken.json";

export async function main() {
  const owner = await ethers.getSigner(usdtDeployment.receipt.from);
  // We get the contract to deploy
  const usdt = USDToken__factory.connect(usdtDeployment.address, owner);

  const recivers = ["0x4E8461e02e58FB719bfd2634418E71b2896a3bE6"];
  for (const r of recivers) {
    const usdtResult = await usdt.transfer(r, ethers.parseEther("1000"));
    const ethResult = await owner.sendTransaction({
      to: r,
      value: ethers.parseEther("1"),
    });
  }
  console.log("Tokens distributed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
