import { NextResponse } from 'next/server';
import iWanClient from "@wandevs/iwan-sdk";
import { tokenPair } from '@/constants/tokenPair';
import { chainIds } from '@/constants/chainConstant';

let option = {
  url: "api.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3",
  timeout: 5000,
};

export async function GET(req, res) {
  try {
    let allFees = [];
    let iWan = new iWanClient(
      process.env.IWAN_API_KEY_2,
      process.env.IWAN_SEC_KEY_2,
      option
    );

    let from;
    let to;
    let symbol;

    for (let i = 0; i < tokenPair.length; i++) {
      try {
        from = chainIds.find(v=>Number(v[0]) === Number(tokenPair[i].fromChainID))[1];
        to = chainIds.find(v=>Number(v[0]) === Number(tokenPair[i].toChainID))[1];
        symbol = tokenPair[i].ancestorSymbol;
        let ret = await iWan.estimateCrossChainNetworkFee(from, to, {tokenPairID: tokenPair[i].id});
        let ret2 = await iWan.estimateCrossChainOperationFee(from, to, {tokenPairID: tokenPair[i].id});
        console.log(from, to, ret, ret2);
        allFees.push({
          tokenPairId: tokenPair[i].id,
          from,
          to,
          symbol: tokenPair[i].ancestorSymbol,
          decimals: tokenPair[i].decimals,
          networkFee: ret.value,
          networkFeeIsPercent: ret.isPercent,
          operationFee: ret2.value,
          operationFeeIsPercent: ret2.isPercent,
        })
      } catch (error) {
        console.log(from, to, symbol, error);
      }
    }

    return NextResponse.json(allFees);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json([]);
  }
}
