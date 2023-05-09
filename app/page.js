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
  { time: "18:00", cost: 65 },
  { time: "20:00", cost: 70 },
  { time: "22:00", cost: 75 },
];

export default function Home() {
  const [showChart, setShowChart] = useState(false);
  const [coinPrices, setCoinPrices] = useState({});

  useEffect(() => {
    const func = async () => {
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
    }

    func().then(()=>{
      setShowChart(true);
    }).catch((err)=>{
      console.error(err);
    })
  }, []);

  return (
    <div className="container">
      <h1>Cross Chain Fees Manager</h1>
      <div className="subtitle subtitle-1">Support Chains & Current Price</div>
      <div className="section">
        {
          coinPrices.map((coinPrice) => {
            return (
              <div className="card card-1">
                <div className="card-title">{coinPrice.symbol}</div>
                <div className="card-text">${coinPrice.usd}</div>
              </div>
            );
          })
        }
      </div>

      <br />
      <div className="subtitle subtitle-2">
        Last 72 hours average costs & current fees
      </div>
      <div className="section">
        <div className="card">
          <div className="card-title">ETH</div>
          <div className="card-text">Avg: $30</div>
          <div className="card-text">Current: $20</div>
          <div className="tooltip-container">
            {showChart && (
              <LineChart width={300} height={200} data={data}>
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
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-title">WAN</div>
          <div className="card-text">Avg: $0.1</div>
          <div className="card-text">Current: $0</div>
        </div>
        <div className="card">
          <div className="card-title">BSC</div>
          <div className="card-text">Avg: $0.01</div>
          <div className="card-text">Current: $0</div>
        </div>
        <div className="card">
          <div className="card-title">AVAX</div>
          <div className="card-text">Avg: $0.5</div>
          <div className="card-text">Current: $0.5</div>
        </div>
      </div>

      <br />
      <div className="subtitle subtitle-3">
        Adjust cross to ETH chain fees (amount & price & value)
      </div>
      <div>
        Target Fee: <input /> USD
      </div>
      <i>* You can request to add custom rules, such as setting all transaction fees below 0.1$ to 0 and keeping the decimal part to two significant digits.</i>
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
          <tr>
            <td>WAN</td>
            <td>10</td>
            <td>18</td>
            <td>$0.5</td>
            <td>$5</td>
          </tr>
          <tr>
            <td>BSC</td>
            <td>0.01</td>
            <td>18</td>
            <td>$100</td>
            <td>$1</td>
          </tr>
          <tr>
            <td>AVAX</td>
            <td>0.1</td>
            <td>18</td>
            <td>$30</td>
            <td>$3</td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="subtitle subtitle-4">Operations</div>
      <button>Generate CSV</button>
      <button>Generate JSON</button>
    </div>
  );
}
