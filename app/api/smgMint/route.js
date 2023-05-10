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


export async function GET(req) {
  console.log('req', req.url);
  let prices;
  try {
    const { searchParams } = new URL(req.url);
    const chain = searchParams.get('chain');
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

    let blockNumber = await iWan.getBlockNumber(_chainType);
    const maxSearchBlock = 50000;
    const onceSearchBlock = 1000;
    const maxEventsCount = 500;
    let events = [];
    const fromBlock = Math.max(blockNumber - maxSearchBlock, 1);

    console.log(chain, _chainType, "current block:", blockNumber);

    while (events.length < maxEventsCount && blockNumber > fromBlock) {
      const toBlock = Math.max(blockNumber - onceSearchBlock, fromBlock);
      console.log(chain, 'scanning block', toBlock, 'to', blockNumber, '...');
      const batchEvents = await Promise.all([
        iWan.getScEvent(_chainType, evmLockAddress[chain], [SmgReleaseLogger], {
          fromBlock,
          toBlock,
        }),
        iWan.getScEvent(_chainType, evmLockAddress[chain], [SmgMintLogger], {
          fromBlock,
          toBlock,
        }),
      ]);
      const newEvents = batchEvents.reduce((acc, cur) => acc.concat(cur), []);
      events = [...newEvents, ...events].slice(0, maxEventsCount);
      blockNumber = toBlock;
    }

    console.log('scanning finished event count:', events.length);

    const gasFeeList = await Promise.all(
      events.map(async (event) => {
        const blockInfo = await iWan.getBlockByHash(
          _chainType,
          event.blockHash
        );
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

    return NextResponse.json({success: true, data: gasFeeList});
  } catch (error) {
    console.log('error', error);
    console.log(error.message);
    return NextResponse.json({error: error.message});
  }
}
