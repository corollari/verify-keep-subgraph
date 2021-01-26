import ethers from "ethers";
import {getOwners} from './tbtcJsOperators.js'

export async function getAllOperators(block: number) {
  const provider = new ethers.providers.JsonRpcProvider(process.env["ETH_RPC"]);

  const TokenStakingAbi = [
    "event StakeDelegated(address indexed owner,address indexed operator)",
  ];
  const TokenStaking = new ethers.Contract(
    "0x1293a54e160D1cd7075487898d65266081A15458",
    TokenStakingAbi,
    provider
  );
  const StakeDelegated = TokenStaking.filters.StakeDelegated();
  const operators = await TokenStaking.queryFilter(StakeDelegated, 0, block).then(events=>events.map(op=>op.args!.operator as string));
  const ownersAndOperators = await getOwners(operators)
  return ownersAndOperators
}