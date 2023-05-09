import { NextResponse } from 'next/server';

export async function GET(req, res) {
  return NextResponse.json({ name: 'GET John Doe' })
}

export async function POST(req, res) {
  return NextResponse.json({ name: 'POST John Doe' })
}
