import { NextResponse } from 'next/server';
import { coins } from '../../../constants/config';
import axios from 'axios';

export async function GET(req, res) {
  let prices;
  let coinsList = Object.keys(coins).join(',');
  try {
    console.log('fetching prices from coingecko api...', coinsList);
    let ret = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinsList}&vs_currencies=usd`, {timeout: 5000});
    prices = ret.data;
    console.log('prices', JSON.stringify(prices));
    return NextResponse.json(prices);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ });
  }
}

export async function POST(req, res) {
  return NextResponse.json({ name: 'POST John Doe' })
}
