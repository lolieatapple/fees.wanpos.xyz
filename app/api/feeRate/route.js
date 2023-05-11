import { NextResponse } from 'next/server';
import { get } from '../kv';

export async function GET(req, res) {
  try {
    let feeRate = await get('feeRate');
    console.log('feeRate', feeRate);
    return NextResponse.json(feeRate);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json([]);
  }
}
