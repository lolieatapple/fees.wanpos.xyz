import { NextResponse } from 'next/server';
import axios from 'axios';
import { get, put } from '../kv';

const dogeUrl = 'https://api.blockcypher.com/v1/doge/main';
const btcUrl = 'https://api.blockcypher.com/v1/btc/main';
const ltcUrl = 'https://api.blockcypher.com/v1/ltc/main';

export async function GET(req, res) {
  try {
    console.log('fetching doge fee rate from blockcypher api...');
    let ret = await axios.get(dogeUrl, {timeout: 5000});
    let dogeFeeRate = ((ret.data.high_fee_per_kb + ret.data.medium_fee_per_kb) / 2 * 1.5).toFixed(0);

    console.log('fetching btc fee rate from blockcypher api...');
    ret = await axios.get(btcUrl, {timeout: 5000});
    let btcFeeRate = ((ret.data.high_fee_per_kb + ret.data.medium_fee_per_kb) / 2 * 1.5).toFixed(0);

    console.log('fetching ltc fee rate from blockcypher api...');
    ret = await axios.get(ltcUrl, {timeout: 5000});
    let ltcFeeRate = ((ret.data.high_fee_per_kb + ret.data.medium_fee_per_kb) / 2 * 1.5).toFixed(0);

    console.log('doge fee rate', dogeFeeRate, 'btc fee rate', btcFeeRate, 'ltc fee rate', ltcFeeRate);

    let save = {
      timestamp: Date.now(),
      dogeFeeRate,
      btcFeeRate,
      ltcFeeRate,
    }

    let history = await get('feeRate');
    console.log('history', history.length);

    if (history && history.length && history.length > 72) {
      history = history.slice(-71);
    }

    history.push(save);

    await put('feeRate', history);
    
    return NextResponse.json({success: true});
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({success: false});
  }
}

export async function POST(req, res) {
  return NextResponse.json({ name: 'POST John Doe' })
}

export const maxDuration = 300;