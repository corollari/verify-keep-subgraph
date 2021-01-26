import { ethers } from "ethers";

import StakingPortBackerJSON from "@keep-network/keep-core/artifacts/StakingPortBacker.json";

const provider = new ethers.providers.JsonRpcProvider(process.env["ETH_RPC"]);

const TokenStakingAbi = [
  "event StakeDelegated(address indexed owner,address indexed operator)",
  "event StakeOwnershipTransferred(address indexed operator,address indexed newOwner)",
  "function ownerOf(address _operator) public view returns (address)",
];
const TokenStaking = new ethers.Contract(
  "0x1293a54e160D1cd7075487898d65266081A15458",
  TokenStakingAbi,
  provider
);

const TokenGrantAbi = [
  "event TokenGrantStaked(uint256 indexed grantId, uint256 amount, address operator)",
  "function getGrant(uint256 _id) public view returns (uint256 amount,uint256 withdrawn,uint256 staked,uint256 revokedAmount,uint256 revokedAt,address grantee)",
];
const TokenGrant = new ethers.Contract(
  "0x175989c71Fd023D580C65F5dC214002687ff88B7",
  TokenGrantAbi,
  provider
);

const ManagedGrantAbi = [
  "event GranteeReassignmentConfirmed(address oldGrantee,address newGrantee)",
  "function grantee() public view returns (address)",
];

const StakingPortBacker = new ethers.Contract(
  "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
  StakingPortBackerJSON.abi,
  provider
);
const TokenStakingEscrowAddress = "0xDa534b567099Ca481384133bC121D5843F681365";

const TokenStakingEscrowAbi = [
  "event DepositRedelegated(address indexed previousOperator,address indexed newOperator,uint256 indexed grantId,uint256 amount)",
];
const TokenStakingEscrow = new ethers.Contract(
  TokenStakingEscrowAddress,
  TokenStakingEscrowAbi,
  provider
);

export {
  provider,
  TokenGrant,
  TokenStaking,
  StakingPortBacker,
  TokenStakingEscrowAddress,
  TokenStakingEscrow,
};
