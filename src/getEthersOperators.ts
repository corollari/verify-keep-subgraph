import { BigNumber, ethers } from "ethers";

export async function getAllOperators(block: number) {
  const provider = new ethers.providers.JsonRpcProvider(process.env["ETH_RPC"]);

  const abi = [
    "event StakeDelegated(address indexed owner,address indexed operator)",
    "event StakeOwnershipTransferred(address indexed operator,address indexed newOwner)",
  ];
  const contract = new ethers.Contract(
    "0x1293a54e160D1cd7075487898d65266081A15458",
    abi,
    provider
  );

  const StakeDelegated = contract.filters.StakeDelegated();
  const ops = await contract.queryFilter(StakeDelegated, 0, block);
  const StakeOwnershipTransferred = contract.filters.StakeOwnershipTransferred();
  const ownerTransferredEvents = await contract.queryFilter(
    StakeOwnershipTransferred,
    0,
    block
  );
  console.log(ownerTransferredEvents);

  return ops.map((op) => {
    let owner = op.args!.owner as string;
    const address = op.args!.operator as string;
    const relevantEvents = ownerTransferredEvents.filter(
      (ev) => ev.args!.operator === address
    );
    return {
      owner,
      address,
      stakedAmount: "0",
    };
  });
}
