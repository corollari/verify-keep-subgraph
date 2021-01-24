import {Operator} from './types'
import getVoterOperators from './getVoterOperators'
import assert from 'assert'
import ethersVoteCount from './ethersVoteCount'
import getProposalBock from './getProposalBock'

const proposalId = "QmPDw5uewBgmVkw55fnm82TdqRKMhqf6EsP4RMu5sHFLGY";

interface Votes {
    [address: string]: number
};

function consolidateVotes(ops: Operator[], property:"owner"|"address") {
    const score = {} as Votes
    ops.forEach((op) => {
        const userAddress = op[property];
        if (!score[userAddress]) score[userAddress] = 0;
        score[userAddress] = score[userAddress] + Number(op.stakedAmount);
    });
    return score
}

(async () => {
    const block = await getProposalBock(proposalId);
    const ops = await getVoterOperators(proposalId, block);
    const snapshotVotes = consolidateVotes(ops, "address");
    const ethersVotes = await ethersVoteCount(ops, block).then(votes=>consolidateVotes(votes,"address"))
    assert.deepStrictEqual(snapshotVotes, ethersVotes);
})();
