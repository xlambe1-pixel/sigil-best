import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

export async function GET() {
  const artifact = JSON.parse(
    readFileSync(
      path.join(process.cwd(), 'artifacts/contracts/SigilNFT.sol/SigilNFT.json'),
      'utf8'
    )
  )
  return NextResponse.json({ bytecode: artifact.bytecode })
}
