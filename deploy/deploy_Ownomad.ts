import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Ownomad", {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    from: deployer!,
    args: [],
    log: true,
  });
};
export default func;
func.tags = ["Ownomad"];
