import React from "react";
import { FaStar, FaPlaneDeparture } from "react-icons/fa";
import dollor from "../assets/dollor.png";
import logo2 from "../assets/Group.png";
import { toast } from "react-toastify";
import {
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const WalletAndPurchase = ({
  walletAddress,
  connectWallet,
  shortenAddress,
  airport,
  result,
  setWalletAddress,
}) => {
  const displayData = result
    ? {
        name: result.AirportName,
        country: result.Country,
        iata: result.IATA,
        tier: result.Tier,
        Price: result.Price,
        isSearch: true,
      }
    : airport
    ? {
        name: airport.name,
        country: airport.country,
        iata: airport.iata_code,
        tier: airport.tire,
        Price: airport.price,
        isSearch: false,
      }
    : null;

  const purchaseDomain = async () => {
    if (!walletAddress) {
      toast.info("Connect your wallet first!");
      return;
    }

    try {
      const connection = new Connection("https://fittest-spring-mansion.solana-mainnet.quiknode.pro/2f5020403a62183bcc1f388b84239271a3f32931/");
      const userPublicKey = new PublicKey(walletAddress);
      const treasuryPublicKey = new PublicKey("538DXvph6hTpuG7ks2qfBjmE3JS2q4Usqt8twbnvHJPQ");
      const tokenMint = new PublicKey("4quzzULPYtbRBqMU1sXWFQ7eQgvDqgxWeiu2Uxs2KnU2");

      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        userPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const treasuryTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        treasuryPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const transferIx = createTransferCheckedInstruction(
        userTokenAccount,
        tokenMint,
        treasuryTokenAccount,
        userPublicKey,
//   parseInt(displayData.Price * 10 ** 6), // 💡 converted from float to integer

        1000000,
        6,
        [],
        TOKEN_2022_PROGRAM_ID
      );

      const tx = new Transaction().add(transferIx);
      tx.feePayer = userPublicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await window.solana.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      const iataCode = displayData?.iata || "XXX";
      await fetch("https://avaxbot1122-8ee0ed24283e.herokuapp.com/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          iata_code: iataCode,
          payment_tx: sig,
        }),
      });

      toast.success("Your payment has sent, your domain will be minted shortly");
    } catch (err) {
      console.error("❌ Purchase failed:", err);
      toast.error("❌ Purchase failed: " + err.message);
    }
  };

  return (
    <>
      <div className="px-5 connectwallet1">
        <div className="px-5 connectwallet">
          {walletAddress ? (
            <button
              onClick={connectWallet}
              className="flex space-x-4 items-center bg-white text-[#0B1437] text-sm font-semibold rounded py-2 px-3"
            >
              <span className="text-[16px] font-bold">
                {shortenAddress(walletAddress)}
              </span>
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="flex space-x-4 items-center bg-white text-[#0B1437] text-sm font-semibold rounded py-2 px-3"
            >
              <span className="text-[16px] font-bold">Connect</span>
              <span className="flex items-center text-black text-[13px] font-bold">
                <img
                  alt="Phantom"
                  className="w-5 h-5 object-contain mr-1"
                  src={logo2}
                />
                Phantom
              </span>
            </button>
          )}
        </div>
      </div>

      {displayData && (
        <>
          <div className="bg-[#222B55] rounded-lg p-4 space-y-3 mt-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-xs text-yellow-400 font-semibold">
                  Recommend
                </span>
              </div>
              <div className="bg-[#2E3670] text-white text-md font-semibold rounded px-2 py-1">
                {displayData.iata}
              </div>
            </div>

            <h1 className="text-white text-lg font-semibold leading-tight">
              {displayData.name}
            </h1>

            <div className="flex justify-between">
              <div className="items-center space-x-2 text-[#A3B0D1] text-xs font-medium">
                <span className="flex items-center">
                  <FaPlaneDeparture className="me-2" /> {displayData.country}
                </span>
              </div>
              <div className="text-[#A3B0D1] text-xs font-semibold">
                Tier {displayData.tier}
              </div>
            </div>
          </div>

          <div className="bg-[#222B55] rounded-lg p-4 flex items-center space-x-3 mt-2">
            <div>
              <div className="text-[#00C853] text-xs font-semibold flex items-center space-x-1">
                <img
                  alt="Dollar icon"
                  className="w-3 h-3 object-contain"
                  src={dollor}
                />
                <span>Available</span>
              </div>
              <div className="text-[#A3B0D1] text-xs font-semibold">
                jfk.norda.sol
              </div>
            </div>
          </div>

          <div className="bg-[#222B55] rounded-lg p-4 flex justify-between items-center text-[#A3B0D1] font-semibold text-sm mt-2">
            <span>NOL</span>
            <span>{displayData.Price} nol</span>
          </div>

          <button
            onClick={purchaseDomain}
            className="w-full bg-white text-[#222B55] font-semibold rounded-md py-2 flex items-center justify-center mt-4"
          >
            <i className="fas fa-lock mr-2"></i> Purchase Domain
          </button>
        </>
      )}
    </>
  );
};

export default WalletAndPurchase;
