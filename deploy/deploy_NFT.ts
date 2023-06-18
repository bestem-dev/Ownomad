import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("OwnomadNFT", {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    from: deployer!,
    args: [
      "localhost:3000/api/nft/testProject/",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      ethers.parseEther("250"),
      "100",
    ],
    log: true,
  });
};
export default func;
func.tags = ["OwnomadNFT"];
