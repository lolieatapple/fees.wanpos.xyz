"use client";

import "./globals.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { coins, chainType, evmLockAddress } from "../constants/config";
import Head from "next/head";

const DataCard = ({ coinPrices, chain, forceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  const coinPrice = useMemo(() => {
    let coinPrice = {
      symbol: "N/A",
      usd: "N/A",
    };

    if (coinPrices && coinPrices.length > 0) {
      let _price = coinPrices.find((coinPrice) => coinPrice.chain === chain);
      if (_price) {
        coinPrice.symbol = _price.symbol;
        coinPrice.usd = _price.usd;
      }

      if (["arbitrum", "optimism"].includes(chain)) {
        let _price = coinPrices.find(
          (coinPrice) => coinPrice.chain === "ethereum"
        );
        if (_price) {
          coinPrice.symbol = _price.symbol;
          coinPrice.usd = _price.usd;
        }
      }
    }
    return coinPrice;
  }, [coinPrices, chain, forceUpdate]);

  useEffect(() => {
    if (!evmLockAddress[chain]) {
      if (!["btc", "doge", "ltc"].includes(chain)) {
        console.log(chain, "not supported");
        return;
      }
      const func = async () => {
        let feeRate = await fetch("/api/feeRate");
        feeRate = await feeRate.json();
        if (chain === "btc") {
          feeRate = feeRate.map((v) => {
            return {
              time:
                new Date(v.timestamp).toLocaleDateString() +
                " " +
                new Date(v.timestamp).getHours() +
                ":" +
                new Date(v.timestamp).getMinutes(),
              cost:
                coinPrice.usd !== "N/A"
                  ? (
                      ((Number(v.btcFeeRate) * 0.304) / 1e8) *
                      Number(coinPrice.usd)
                    ).toFixed(4)
                  : v.btcFeeRate / 1e8,
            };
          });
        } else if (chain === "doge") {
          feeRate = feeRate.map((v) => {
            return {
              time:
                new Date(v.timestamp).toLocaleDateString() +
                " " +
                new Date(v.timestamp).getHours() +
                ":" +
                new Date(v.timestamp).getMinutes(),
              cost:
                coinPrice.usd !== "N/A"
                  ? (
                      ((Number(v.dogeFeeRate) * 0.304) / 1e8) *
                      Number(coinPrice.usd)
                    ).toFixed(4)
                  : v.dogeFeeRate / 1e8,
            };
          });
        } else if (chain === "ltc") {
          feeRate = feeRate.map((v) => {
            return {
              time:
                new Date(v.timestamp).toLocaleDateString() +
                " " +
                new Date(v.timestamp).getHours() +
                ":" +
                new Date(v.timestamp).getMinutes(),
              cost:
                coinPrice.usd !== "N/A"
                  ? (
                      ((Number(v.ltcFeeRate) * 0.304) / 1e8) *
                      Number(coinPrice.usd)
                    ).toFixed(4)
                  : v.ltcFeeRate / 1e8,
            };
          });
        }
        setData(feeRate);
        const costs = feeRate.map((item) => parseFloat(item.cost) || 0);
        const averageCost =
          costs.reduce((acc, curr) => acc + curr, 0) / costs.length;
        setAverage(averageCost.toFixed(4));
      };

      func().then().catch(console.error);
      return;
    }

    if (coinPrices.length === 0) {
      console.log("price not ready");
      return;
    }

    const func = async () => {
      console.log(chain, "searching for history...");
      try {
        setLoading(true);
        let historyCache = window.localStorage.getItem("historyCache_" + chain);
        if (historyCache) {
          historyCache = JSON.parse(historyCache);
          const now = new Date();
          const cacheTime = new Date(historyCache.time);
          const diff = now - cacheTime;
          if (diff < 1000 * 30) {
            console.log(chain, "using cached history");
            setData(historyCache.data);
            return;
          }
        }

        let res = await fetch("/api/smgMint?chain=" + chain);
        let history = await res.json();

        console.log(chain, "history", history);
        if (history && history.success) {
          history.data = history.data.map((v) => {
            return {
              time:
                new Date(v.timestamp * 1000).toLocaleDateString() +
                " " +
                new Date(v.timestamp * 1000).getHours() +
                ":" +
                new Date(v.timestamp * 1000).getMinutes(),
              cost:
                coinPrice.usd !== "N/A"
                  ? (Number(v.gasFee) * Number(coinPrice.usd)).toFixed(4)
                  : v.gasFee,
            };
          });
          window.localStorage.setItem(
            "historyCache_" + chain,
            JSON.stringify({
              time: new Date(),
              data: history.data,
            })
          );

          setData(history.data);
          const costs = history.data.map((item) => parseFloat(item.cost) || 0);
          const averageCost =
            costs.reduce((acc, curr) => acc + curr, 0) / costs.length;
          setAverage(averageCost.toFixed(4));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    func()
      .then(() => {
        console.log(chain, "done");
      })
      .catch(console.error);
  }, [chain, coinPrice, forceUpdate]);

  return (
    <div key={coinPrice.symbol} className="card card-wide">
      {loading && <div className="loading-overlay">Loading...</div>}
      <div className="card-content">
        <div className="card-title">{chain}</div>
        <div className="card-text">Avg Cost: ${average}</div>
        <div className="card-text">Current Fee: $20</div>
        <div className="card-text">
          {coinPrice.symbol} Price: ${coinPrice.usd}
        </div>
      </div>
      <div className="card-chart">
        <LineChart width={500} height={130} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default function Home() {
  const [coinPrices, setCoinPrices] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const func = async () => {
      let pricesCache = window.localStorage.getItem("pricesCache");
      if (pricesCache) {
        pricesCache = JSON.parse(pricesCache);
        const now = new Date();
        const cacheTime = new Date(pricesCache.time);
        const diff = now - cacheTime;
        if (diff < 1000 * 60) {
          console.log("using cached prices");
          setCoinPrices(pricesCache.prices);
          return;
        }
      }

      let res = await fetch("/api/price");
      let prices = await res.json();

      const symbolUsdArray = Object.keys(prices).map((key) => {
        const coinData = coins[key];
        const chain = Object.keys(coinData)[0];
        const symbol = coinData[chain].symbol;
        const usd = prices[key].usd;

        return { chain, symbol, usd };
      });

      console.log(symbolUsdArray);

      setCoinPrices(symbolUsdArray);
      window.localStorage.setItem(
        "pricesCache",
        JSON.stringify({
          time: new Date(),
          prices: symbolUsdArray,
        })
      );
    };

    func()
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }, [forceUpdate]);

  return (
    <div className="container">
      <Head>
        <title>Cross Chain Fees Manager</title>
      </Head>
      <h1>Cross Chain Fees Manager</h1>
      <br />
      <div className="subtitle-container">
        <div className="subtitle subtitle-2">
          Last 72 hours average costs & current fees
        </div>
        <button
          className="refresh-button"
          onClick={() => {
            setForceUpdate(Date.now());
          }}
        >
          Refresh
        </button>
      </div>

      <div className="section">
        {Object.keys(chainType).map((chain) => {
          return (
            <DataCard
              key={chain}
              chain={chain}
              coinPrices={coinPrices}
              forceUpdate={forceUpdate}
            />
          );
        })}
      </div>

      <br />
      <div className="subtitle subtitle-3">
        Adjust cross to ETH chain fees (amount & price & value)
      </div>
      <div>
        Target Fee: <input /> USD
      </div>
      <i>
        * You can request to add custom rules, such as setting all transaction
        fees below 0.1$ to 0 and keeping the decimal part to two significant
        digits.
      </i>
      <table>
        <thead>
          <tr>
            <th>Chain</th>
            <th>Amount</th>
            <th>Decimals</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {coinPrices.map((coinPrice) => {
            return (
              <tr key={coinPrice.symbol}>
                <td>{coinPrice.symbol}</td>
                <td>0.1</td>
                <td>18</td>
                <td>${coinPrice.usd}</td>
                <td>$1</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <div className="subtitle subtitle-4">Operations</div>
      <button>Generate CSV</button>
      <button>Generate JSON</button>
    </div>
  );
}
