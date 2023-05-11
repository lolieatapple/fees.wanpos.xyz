import { NextResponse } from "next/server";
import { evmLockAddress, chainType } from "../../../constants/config";
import iWanClient from "@wandevs/iwan-sdk";
const { ethers, BigNumber } = require("ethers");
const ABI = require("./abis.json");

let option = {
  url: "api.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3",
  timeout: 5000,
};

function get3dayBlocks(chain) {
  if (chain === 'arbitrum') {
    return 1036800;
  }

  if (chain === 'polygon') {
    return 129600;
  }

  if (chain === 'optimism') {
    return 129600;
  }

  if (chain === 'ethereum') {
    return 20000;
  }

  if (chain === 'fantom') {
    return 129600;
  }

  return 30000;
}

function getScanLimit(chain) {
  if (chain === 'arbitrum') {
    return 20000;
  }

  if (chain === 'bsc') {
    return 1000;
  }

  if (chain === 'polygon') {
    return 1000;
  }

  if (chain === 'avalanche') {
    return 2048;
  }

  if (chain === 'okexchain') {
    return 2000;
  }

  if (chain === 'optimism') {
    return 3000;
  }

  if (chain === 'ethereum') {
    return 2000;
  }

  if (chain === 'astar') {
    return 1000;
  }

  if (chain === 'fantom') {
    return 3000;
  }

  return 5000;
}


export async function GET(req) {
  console.log('req', req.url);
  let prices;
  try {
    const { searchParams } = new URL(req.url);
    const chain = searchParams.get('chain');
    let range = searchParams.get('range');

    range = range ? parseInt(range) : 1000;

    console.log('chain', chain);
    if (!chain) {
      return NextResponse.json({ error: "chain is required" });
    }

    let iWan = new iWanClient(
      process.env.IWAN_API_KEY,
      process.env.IWAN_SEC_KEY,
      option
    );

    console.log('connect iwan success');

    const _chainType = chainType[chain];
    const iface = new ethers.utils.Interface(ABI);
    const SmgReleaseLogger = iface.getEventTopic("SmgReleaseLogger");
    const SmgMintLogger = iface.getEventTopic("SmgMintLogger");

    const maxSearchBlock = get3dayBlocks(chain);
    const onceSearchBlock = getScanLimit(chain);
    const maxEventsCount = chain === 'bsc' ? 3 : 30;
    const currentBlockNumber = await iWan.getBlockNumber(_chainType);
    const fromBlock = Math.max(currentBlockNumber - maxSearchBlock, 1);

    console.log(chain, _chainType, 'current block:', currentBlockNumber);

    let events = [];
    let blockNumber = currentBlockNumber;

    let errorCnt = 0;

    while (events.length < maxEventsCount && blockNumber >= fromBlock ) {
      try {
        const toBlock = Math.max(blockNumber - onceSearchBlock, fromBlock);
        if (toBlock >= blockNumber) {
          break;
        }
        const batchEvents = await Promise.all([
          iWan.getScEvent(_chainType, evmLockAddress[chain], [SmgReleaseLogger], {
            fromBlock: toBlock + 1,
            toBlock: blockNumber,
          }),
          iWan.getScEvent(_chainType, evmLockAddress[chain], [SmgMintLogger], {
            fromBlock: toBlock + 1,
            toBlock: blockNumber,
          }),
        ]);
  
        const newEvents = batchEvents.reduce((acc, cur) => acc.concat(cur), []);
        console.log(chain, 'scanning block', toBlock + 1, 'to', blockNumber, 'event count:', newEvents.length);
        events = [...newEvents, ...events].slice(0, maxEventsCount);
        blockNumber = toBlock;
      } catch (error) {
        if (errorCnt++ > 5) {
          break;
        }
        console.log(chain, 'error', error);
        // sleep 2s
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(chain, 'scanning finished event count:', events.length);

    const gasFeeList = await Promise.all(
      events.map(async (event) => {
        const blockInfo = await iWan.getBlockByHash(
          _chainType,
          event.blockHash
        );
        if (!blockInfo.timestamp) {
          console.log('blockInfo', blockInfo);
        }
        const timestamp = blockInfo.timestamp;
        const txInfo = await iWan.getTxInfo(_chainType, event.transactionHash);
        const gasPrice = BigNumber.from(txInfo.gasPrice);
        const receipt = await iWan.getTransactionReceipt(
          _chainType,
          event.transactionHash
        );
        const gasUsed = receipt.gasUsed;
        const gasFee = ethers.utils.formatEther(gasPrice.mul(gasUsed));
        return { timestamp, gasFee };
      })
    );

    console.log("gasFeeList", gasFeeList);
    iWan.close();

    return NextResponse.json({success: true, data: gasFeeList});
  } catch (error) {
    console.log('error', error);
    console.log(error.message);
    return NextResponse.json({error: error.message});
  }
}
