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

    let promises = tokenPair.map(async (pair) => {
      let from;
      let to;
      let symbol;
      try {
        from = chainIds.find(v => Number(v[0]) === Number(pair.fromChainID))[1];
        to = chainIds.find(v => Number(v[0]) === Number(pair.toChainID))[1];
        symbol = pair.ancestorSymbol;
    
        const [ret, ret2] = await Promise.all([
          iWan.estimateCrossChainNetworkFee(from, to, { tokenPairID: pair.id }),
          iWan.estimateCrossChainOperationFee(from, to, { tokenPairID: pair.id })
        ]);
    
        console.log(from, to, ret, ret2);
    
        return {
          tokenPairId: pair.id,
          from,
          to,
          symbol: pair.ancestorSymbol,
          decimals: pair.decimals,
          networkFee: ret.value,
          networkFeeIsPercent: ret.isPercent,
          operationFee: ret2.value,
          operationFeeIsPercent: ret2.isPercent,
        };
      } catch (error) {
        console.log(from, to, symbol, error);
        return {
          tokenPairId: pair.id,
          from,
          to,
          symbol: pair.ancestorSymbol,
          decimals: pair.decimals,
          networkFee: 'failed',
          networkFeeIsPercent: 'failed',
          operationFee: 'failed',
          operationFeeIsPercent: 'failed',
        };
      }
    });
    
    allFees = await Promise.all(promises);    

    return NextResponse.json(allFees);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json([]);
  }
}
