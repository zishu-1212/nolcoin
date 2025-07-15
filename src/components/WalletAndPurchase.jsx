import React, { useState } from "react";
import { FaStar, FaPlaneDeparture } from "react-icons/fa";
import dollor from "../assets/dollor.png";
import logo2 from "../assets/Group.png";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const purchaseDomain = async () => {
    if (!walletAddress) {
      toast.info("Connect your wallet first!");
      return;
    }

    try {
      const checkRes = await fetch(
        "https://domainminting-c0d9d783b1cb.herokuapp.com/api/getUserMintLimit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_address: walletAddress }),
        }
      );

      const checkData = await checkRes.json();

      if (!checkData.status) {
        toast.error(
          checkData.message || "You are not allowed to mint at this time."
        );
        return;
      }

      const connection = new Connection(
        "https://fittest-spring-mansion.solana-mainnet.quiknode.pro/2f5020403a62183bcc1f388b84239271a3f32931/"
      );
      const userPublicKey = new PublicKey(walletAddress);
      const treasuryPublicKey = new PublicKey(
        "4WUKn63m9btpv7sD2SF6PxZQNbFfgHbtvrZyVTFM3vvy"
      );
      const tokenMint = new PublicKey(
        "4quzzULPYtbRBqMU1sXWFQ7eQgvDqgxWeiu2Uxs2KnU2"
      );

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
        parseInt(displayData.Price * 10 ** 6),
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
      await fetch(
        "https://domainminting-c0d9d783b1cb.herokuapp.com/api/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
            iata_code: iataCode,
            payment_tx: sig,
          }),
        }
      );

      toast.success(
        "Your payment has been sent, your domain will be minted shortly"
      );

      // ✅ Show Modal
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ Purchase failed:", err);
      toast.error("❌ Purchase failed: " + err.message);
    }
  };

  return (
    <>
      <header className="flex flex-col-reverse md:flex-row justify-between md:items-center">
        <div className="flex flex-row-reverse md:flex-row items-center space-x-1">
          <img alt="Logo" className="w-40 h-40 object-contain" src={logo} />
          <h1
            className="text-white text-lg font-bold leading-tight"
            style={{ fontSize: "22px" }}
          >
            Purchase Airport Domain Ownership
          </h1>
        </div>

        <div className="px-5 connectwallet1">
          <div className="px-5 connectwallet">
            {walletAddress ? (
              <button
                onClick={() => setWalletAddress(null)}
                className="flex space-x-4 items-center bg-white text-[#0B1437] text-sm font-semibold rounded py-2 px-3"
              >
                <span className="text-[16px] font-bold">
                  {shortenAddress(walletAddress)}
                </span>
                <span className="text-[13px] font-bold">Disconnect</span>
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
      </header>
      {displayData && (
        <>
          <div className="bg-[#222B55] rounded-lg  space-y-1 ">
            <div className="flex justify-between items-start px-4 pt-3">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-xs text-yellow-400 font-semibold">
                  {displayData?.isSearch ? "Selected Airport" : "Recommended"}
                </span>
              </div>
              <div className="bg-[#2E3670] text-white text-md font-semibold rounded px-2 ">
                {displayData.iata}
              </div>
            </div>

            <h1 className="text-white text-lg font-semibold  px-4 m-0">
              {displayData.name}
            </h1>

            <div className="flex justify-between px-4 pb-3">
              <div className="items-center space-x-2 text-[#A3B0D1] text-xs font-medium">
                <span className="flex items-center">
                  <FaPlaneDeparture className="me-2" /> {displayData.country}
                </span>
              </div>
              <div className="text-[#A3B0D1] text-xs font-semibold">
                Tier {displayData.tier}
              </div>
            </div>
            <div
              className=""
              style={{ borderBottom: "1px solid rgba(78, 87, 131, 1)   " }}
            ></div>
            <div className="  p-5 flex items-center space-x-3 ">
              <div>
                <div
                  className="text-[#A3B0D1] lowercase font-semibold"
                  style={{ fontSize: "14px" }}
                >
                  {displayData.iata}.nordo.sol
                </div>
                <div
                  className="text-[#00C853]  font-semibold flex items-center space-x-1"
                  style={{ fontSize: "14px" }}
                >
                  <img
                    alt="Dollar icon"
                    className="w-3 h-3 object-contain"
                    src={dollor}
                  />
                  <span>Available</span>
                </div>
                {/* <a
          target="blank"
          href="https://www.world-airport-codes.com/"
          className="text-red "
          style={{ fontSize: "13px", color: "red" }}
        >Check Your Domain Here!</a> */}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between max-w-full  py-4 pt-5 ">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              </div>
              <span className="text-white text-[16px] font-normal font-['Roboto'] select-none">
                NOL
              </span>
            </div>
            <div
              className="mt-2 hidden md:block"
              style={{
                borderBottom: "1px solid rgba(87, 95, 135, 1)",
                width: "80%",
              }}
            ></div>

            <span className="text-white text-[16px] font-normal font-['Roboto'] select-none">
              {Number(displayData.Price).toLocaleString()} NOL
            </span>
          </div>

          <button
            onClick={purchaseDomain}
            className="w-full bg-white text-[#222B55] font-semibold rounded-md py-2 flex items-center justify-center mt-4"
          >
            <i className="fas fa-lock mr-2"></i> Purchase Domain
          </button>
          {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-white rounded-xl shadow-lg p-6 relative w-[90%] max-w-md text-center ">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-3 right-3 text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-6">
                Check Your Domain Here!
              </h2>
            <a
  href={`https://www.sns.id/domain/${displayData.iata.toLowerCase()}.nordo/`}
  target="_blank"
  rel="noopener noreferrer"
  className="block w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
>
  https://www.sns.id/domain/{displayData.iata.toLowerCase()}.nordo
</a>
                <p className="text-red " style={{ fontSize: "13px", color: "green" }}>
             Please check the link in about 3 to 5 minutes to confirm the domain purchase.
            </p>
            </div>
          
          </div>
         )}
        </>
      )}
    </>
  );
};

export default WalletAndPurchase;
