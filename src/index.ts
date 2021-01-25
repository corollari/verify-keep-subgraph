import { Operator } from "./types";
import {
  getVoterOperators,
  getAllOperators as getAllSubgraphOperators,
} from "./getSubgraphOperators";
import assert from "assert";
import ethersVoteCount from "./ethersVoteCount";
import getProposalBock from "./getProposalBlock";
import { getAllOperators } from "./getEthersOperators";
import snapshotVotesTest from "./snapshotVotesTest";
import { getAddress } from "@ethersproject/address";

const proposalId = "QmPDw5uewBgmVkw55fnm82TdqRKMhqf6EsP4RMu5sHFLGY";

interface Votes {
  [address: string]: number;
}

function consolidateVotes(ops: Operator[], property: "owner" | "address") {
  const score = {} as Votes;
  ops.forEach((op) => {
    const userAddress = getAddress(op[property]);
    if (!score[userAddress]) score[userAddress] = 0;
    score[userAddress] = score[userAddress] + Number(op.stakedAmount);
  });
  return score;
}

function sortOperators(op1: Operator, op2: Operator) {
  if (op1.address < op2.address) {
    return -1;
  } else if (op1.owner > op2.owner) {
    return 1;
  } else {
    if(op1.address<op2.address){
        return -1;
    } else if(op1.address>op2.address){
        return 1;
    } else {
        return 0
    }
  }
}

function processOpsForFullComparison(ops: Operator[]) {
  return ops.sort(sortOperators).map(({owner, address})=>({owner, address}));
}

function processOpsForOperatorComparison(ops: Operator[]) {
  return ops.map((op) => op.address.toLowerCase()).sort();
}

(async () => {
  const block = await getProposalBock(proposalId);
  console.log(block);
  const etherOps = await getAllOperators(block);
  //const subgraphOps = await getVoterOperators(proposalId, block);
  const subgraphOps = await getAllSubgraphOperators(block);
  //console.log(etherOps, etherOps.sort(sortOperators))
  assert.deepStrictEqual(
    processOpsForFullComparison(subgraphOps),
    processOpsForFullComparison(etherOps)
  );
  const subgraphVotes = consolidateVotes(subgraphOps, "owner");
  const ethersVotes = await ethersVoteCount(subgraphOps, block).then((votes) =>
    consolidateVotes(votes, "owner")
  );
  assert.deepStrictEqual(snapshotVotesTest, ethersVotes);
})();
