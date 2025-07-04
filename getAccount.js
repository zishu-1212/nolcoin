import {
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID, // ✅ Use the right program!
} from "@solana/spl-token-2022";

import {Connection, PublicKey, Transaction} from "@solana/web3.js";

const mint = new PublicKey("4quzzULPYtbRBqMU1sXWFQ7eQgvDqgxWeiu2Uxs2KnU2");
const treasuryOwner = new PublicKey(
  "538DXvph6hTpuG7ks2qfBjmE3JS2q4Usqt8twbnvHJPQ"
);

// ✅ Treasury's token account (ATA) for SPL2022:
const treasuryTokenAccount = await getAssociatedTokenAddress(
  mint,
  treasuryOwner,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

console.log("Treasury Token Account (ATA):", treasuryTokenAccount.toBase58());
