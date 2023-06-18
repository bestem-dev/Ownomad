import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const initialSupply = ethers.parseEther("10000000");

  await deploy("USDToken", {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    from: deployer!,
    args: [initialSupply],
    log: true,
  });
};
export default func;
func.tags = ["USDT"];
