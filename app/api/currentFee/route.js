import { NextResponse } from "next/server";
import iWanClient from "@wandevs/iwan-sdk";
import { tokenPair } from "@/constants/tokenPair";
import { chainIds } from "@/constants/chainConstant";

let option = {
  url: "api.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3",
  timeout: 5000,
};

export async function POST(req, res) {
  try {
    let allFees = [];
    let iWan = new iWanClient(
      process.env.IWAN_API_KEY_2,
      process.env.IWAN_SEC_KEY_2,
      option
    );

    const MAX_CONCURRENT = 10;

    let taskQueue = [];

    tokenPair.forEach((pair) => {
      taskQueue.push(async () => {
        let from, to, symbol;
        try {
          from = chainIds.find(
            (v) => Number(v[0]) === Number(pair.fromChainID)
          )[1];
          to = chainIds.find((v) => Number(v[0]) === Number(pair.toChainID))[1];
          symbol = pair.ancestorSymbol;

          if (['ETH', 'BNB', 'AVAX', 'MATIC', 'ARETH', 'OETH', 'OKT', 'XDC'].includes(from) && to === 'WAN') {
            return {
              tokenPairId: pair.id,
              from,
              to,
              symbol: pair.ancestorSymbol,
              decimals: pair.decimals ? pair.decimals : 0,
              networkFee: "0",
              networkFeeIsPercent: false,
              operationFee: "0",
              operationFeeIsPercent: false,
            };
          }

          const [ret, ret2] = await Promise.all([
            iWan.estimateCrossChainNetworkFee(from, to, {
              tokenPairID: pair.id,
            }),
            iWan.estimateCrossChainOperationFee(from, to, {
              tokenPairID: pair.id,
            }),
          ]);

          console.log(from, to, ret, ret2);

          return {
            tokenPairId: pair.id,
            from,
            to,
            symbol: pair.ancestorSymbol,
            decimals: pair.decimals ? pair.decimals : 0,
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
            decimals: pair.decimals ? pair.decimals : 0,
            networkFee: "failed",
            networkFeeIsPercent: "failed",
            operationFee: "failed",
            operationFeeIsPercent: "failed",
          };
        }
      });
    });

    // 定义一个函数，该函数将处理队列中的任务，直到队列为空
    const processQueue = async () => {
      let results = [];
      while (taskQueue.length > 0) {
        // 获取下一组待处理的任务
        let tasks = taskQueue.splice(0, MAX_CONCURRENT);
        // 并行处理这些任务，并将结果添加到结果数组中
        results.push(...(await Promise.all(tasks.map((task) => task()))));
      }
      return results;
    };

    // 处理队列中的任务
    allFees = await processQueue();

    return NextResponse.json({success: true, timestamp: Date.now(), data: allFees});
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({success: false, data: []});
  }
}

export const maxDuration = 300;
