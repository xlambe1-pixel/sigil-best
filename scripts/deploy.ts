import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
dotenv.config();

const ritualTestnet = defineChain({
  id: 1979,
  name: "Ritual Testnet",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.ritualfoundation.org"] } },
});

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

  console.log("Deploying with:", account.address);

  const artifact = JSON.parse(readFileSync("artifacts/contracts/SigilNFT.sol/SigilNFT.json", "utf8"));

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [
      "Ethereal Voids",
      "EVOID",
      parseEther("0.05"),
      777n,
      5n,
      "ipfs://placeholder/",
    ],
  });

  console.log("Transaction hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("SigilNFT deployed to:", receipt.contractAddress);
}

main().catch(console.error);
