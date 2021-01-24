import { BigNumber, ethers } from "ethers";
import {Operator} from './types'

interface DelegationInfo {
    amount: BigNumber,
  createdAt: BigNumber,
  undelegatedAt: BigNumber
}

const e18 = BigNumber.from(10).pow(18)

// Improvement: Obtain the operators from blockchain events
export default async function etherStrategy(ops: Operator[], block:number) {
    const provider = new ethers.providers.JsonRpcProvider(process.env["ETH_RPC"]);

    const abi = [
        "function getDelegationInfo(address _operator) public view returns (uint256 amount, uint256 createdAt, uint256 undelegatedAt)",
    ];
    const contract = new ethers.Contract("0x1293a54e160D1cd7075487898d65266081A15458", abi, provider);

    const opStakes = await Promise.all(ops.map(async op=>{
        const address = op.address
        const stakedAmount = await contract.getDelegationInfo(address, {
            blockTag: block
        }).then((res:DelegationInfo)=>res.amount.div(e18).toNumber());
        return {
            owner:op.owner,
            stakedAmount,
            address: op.address
        }
    }))
    return opStakes
    /*
    const filter = contract.filters.CourtesyCalled();
    contract.queryFilter(filter, -10000000000).then(a => console.log(a.length))
    */
}