// src/TestSolana.jsx

import { useEffect } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

export default function TestSolana() {
  useEffect(() => {
    const doSomething = async () => {
      // Example: Connect to devnet and log balance
      const connection = new Connection(clusterApiUrl("devnet"));
      const pubkey = new PublicKey("8ZFn9jtSRVZrXdxHq8eZqCSyxhAvr8gR6EDfERguXYkY"); // Replace with any public key

      console.log("✅ Connection object:", connection);
      console.log("✅ PublicKey:", pubkey.toBase58());

      const balance = await connection.getBalance(pubkey);
      console.log(`✅ Balance for ${pubkey.toBase58()}: ${balance} lamports`);
    };

    doSomething();
  }, []);

  return <div style={{ color: "white" }}>TestSolana component loaded — check console!</div>;
}
