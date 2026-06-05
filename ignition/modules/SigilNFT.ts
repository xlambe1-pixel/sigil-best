import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

export default buildModule("SigilNFT", (m) => {
  const sigil = m.contract("SigilNFT", [
    "Ethereal Voids",
    "EVOID",
    parseEther("0.05"),
    777n,
    5n,
    "ipfs://placeholder/",
  ]);

  return { sigil };
});
