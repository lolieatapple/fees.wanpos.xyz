import "./globals.css";

export default function Home() {
  return (
    <div className="container">
      <h1>Cross Chain Fees Manager</h1>
      <div className="subtitle subtitle-1">Support Chains & Current Price</div>
      <div>
        <span className="chain">
          <span>ETH</span>
          <span className="price">$1843</span>
        </span>
        <span className="chain">
          <span>WAN</span>
          <span className="price">$0.215</span>
        </span>
        <span className="chain">
          <span>BSC</span>
          <span className="price">$200</span>
        </span>
        <span className="chain">
          <span>AVAX</span>
          <span className="price">$30</span>
        </span>
      </div>
      <br />
      <div className="subtitle subtitle-2">
        Last 72 hours average costs & current fees
      </div>
      <div>
        <span className="chain">
          <span>ETH</span>
          <span className="cost">$30</span>
          <span className="current">$20</span>
        </span>
        <span className="chain">
          <span>WAN</span>
          <span className="cost">$0.1</span>
          <span className="current">$0</span>
        </span>
        <span className="chain">
          <span>BSC</span>
          <span className="cost">$0.01</span>
          <span className="current">$0</span>
        </span>
        <span className="chain">
          <span>AVAX</span>
          <span className="cost">$0.5</span>
          <span className="current">$0.5</span>
        </span>
      </div>
      <br />
      <div className="subtitle subtitle-3">
        Adjust cross to ETH chain fees (amount & price & value)
      </div>
      <div>
        Target Fee: <input /> USD
      </div>
      <table>
        <thead>
          <tr>
            <th>Chain</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WAN</td>
            <td>10</td>
            <td>$0.5</td>
            <td>$5</td>
          </tr>
          <tr>
            <td>BSC</td>
            <td>0.01</td>
            <td>$100</td>
            <td>$1</td>
          </tr>
          <tr>
            <td>AVAX</td>
            <td>0.1</td>
            <td>$30</td>
            <td>$3</td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="subtitle subtitle-1">Operations</div>
      <button>Generate CSV</button>
      <button>Generate JSON</button>
    </div>
  );
}
