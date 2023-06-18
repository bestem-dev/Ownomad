import { ethers } from "hardhat";
import { Ownomad__factory } from "../typechain-types";
import ownomadDeployment from "../deployments/localhost/Ownomad.json";
import developmentsData from "../data/developments.json";

export async function main() {
  const owner = await ethers.getSigner(ownomadDeployment.receipt.from);
  // We get the contract to deploy
  const ownomad = Ownomad__factory.connect(ownomadDeployment.address, owner);
  for (const d of developmentsData) {
    await ownomad.createDevelopment(
      d.metadataURI,
      d.tokens[0]!.address,
      d.tokenPrice,
      d.maxSupply
    );
  }
  console.log("Developments created");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
