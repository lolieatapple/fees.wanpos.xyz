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
import { useEffect, useState } from "react";
import { coins } from "../constants/config";

const data = [
  { time: "00:00", cost: 20 },
  { time: "02:00", cost: 25 },
  { time: "04:00", cost: 30 },
  { time: "06:00", cost: 35 },
  { time: "08:00", cost: 40 },
  { time: "10:00", cost: 45 },
  { time: "12:00", cost: 50 },
  { time: "14:00", cost: 55 },
  { time: "16:00", cost: 60 },
  { time: "18:00", cost: 35 },
  { time: "20:00", cost: 20 },
  { time: "22:00", cost: 35 },
];

const DataCard = ({ coinPrice, loading }) => {
  return (
    <div key={coinPrice.symbol} className="card card-wide">
      {loading && (
        <div className="loading-overlay">
          Loading...
        </div>
      )}
      <div className="card-content">
        <div className="card-title">{coinPrice.symbol}</div>
        <div className="card-text">Avg Cost: $30</div>
        <div className="card-text">Current Fee: $20</div>
        <div className="card-text">Price: ${coinPrice.usd}</div>
      </div>
      <div className="card-chart">
        <LineChart width={550} height={130} data={data}>
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
  const [showChart, setShowChart] = useState(false);
  const [coinPrices, setCoinPrices] = useState([]);

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

        return { symbol, usd };
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
      .then(() => {
        setShowChart(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      <h1>Cross Chain Fees Manager</h1>
      <br />
      <div className="subtitle-container">
        <div className="subtitle subtitle-2">
          Last 72 hours average costs & current fees
        </div>
        <button className="refresh-button" onClick={() => {}}>
          Refresh
        </button>
      </div>

      <div className="section">
        {coinPrices.map((coinPrice, i) => {
          return (
            <DataCard
              key={coinPrice.symbol}
              coinPrice={coinPrice}
              loading={i % 3 === 0}
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
