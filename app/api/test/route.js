import { NextResponse } from 'next/server';

// export async function GET(req, res) {
//   console.log('GET John Doe');
//   return NextResponse.json({ name: 'GET John Doe' })
// }

export async function POST(req, res) {
  console.log('POST John Doe');
  return NextResponse.json({ name: 'POST John Doe' })
}
