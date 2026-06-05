import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import * as dotenv from "dotenv";
dotenv.config();

const ritualTestnet = defineChain({
  id: 1979,
  name: "Ritual Testnet",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.ritualfoundation.org"] } },
});

const ABI = [
  {
    name: 'setMintOpen',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_open', type: 'bool' }],
    outputs: [],
  },
] as const

async function main() {
  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: ritualTestnet,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: ritualTestnet,
    transport: http(),
  });

  const hash = await walletClient.writeContract({
    address: '0x6cf1e216d3aee8c1762ffaff16cec51da505ae1a',
    abi: ABI,
    functionName: 'setMintOpen',
    args: [true],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Mint is now OPEN! 🔮");
}

main().catch(console.error);
