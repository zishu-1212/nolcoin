import { useState, useEffect } from "react";
import { FaStar, FaPlaneDeparture } from "react-icons/fa";
import logo from "./assets/logo.png";
import logo2 from "./assets/Group.png";
import dollor from "./assets/dollor.png";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  // ✅ Connect to Phantom Wallet
 const connectWallet = async () => {
    const solana = window?.solana;
    if (!solana || !solana.isPhantom) {
        alert("Phantom wallet not found! Please install from https://phantom.app");
        return;
    }

    try {
        const res = await solana.connect();
        setWalletAddress(res.publicKey.toString());
        console.log("Connected wallet:", res.publicKey.toString());
    } catch (err) {
        console.error("Wallet connection error:", err);
    }
};

// ✅ Disconnect Wallet
const disconnectWallet = async () => {
    const solana = window?.solana;
    if (solana?.disconnect) {
        await solana.disconnect();
        setWalletAddress(null);
    }
};

// ✅ Auto-connect if already authorized
useEffect(() => {
    const checkIfWalletIsConnected = async () => {
        const solana = window?.solana;
        if (solana?.isPhantom) {
            try {
                const res = await solana.connect({ onlyIfTrusted: true });
                setWalletAddress(res.publicKey.toString());
            } catch (err) {
                console.log("Auto-connect skipped:", err);
            }
        }
    };
    checkIfWalletIsConnected();
}, []);

const shortenAddress = (address) => {
    return address.slice(0, 4) + "..." + address.slice(-4);
};

// Detect mobile device and redirect to Phantom wallet app if not connected
useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);

    if (isMobile && !window?.solana?.isPhantom) {
        alert("Please open the Phantom wallet app to connect.");
        // You can add logic here to open a link to the Phantom wallet app.
        // Example: window.location.href = 'https://phantom.app';
    }
}, []);

  return (
    <div className="App p-3">
      <header className="flex flex-col-reverse md:flex-row justify-between md:items-center ">
        <div className="flex flex-row-reverse md:flex-row items-center space-x-1">
          <img
            alt="Logo"
            className="w-28 h-28 object-contain"
            height="60"
            loading="lazy"
            src={logo}
            width="60"
          />
          <h1 className="text-white text-lg font-semibold leading-tight max-w-xs">
            Purchase Airport Domain Ownership
          </h1>
        </div>

        {/* ✅ Phantom Connect Button */}
        {walletAddress ? (
          <div className="flex flex-col items-start text-white text-sm font-semibold">
            <button
            onClick={connectWallet}
            className="flex space-x-4 items-center bg-white text-[#0B1437] text-sm font-semibold rounded py-2 px-3"
            type="button"
          >
          <span className="text-[16px] font-bold">{shortenAddress(walletAddress)}</span></button>
            {/* <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Disconnect
            </button> */}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="flex space-x-4 items-center bg-white text-[#0B1437] text-sm font-semibold rounded py-2 px-3"
            type="button"
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
      </header>

      <div className="w-full space-y-4">
        {/* Airport Card */}
        <div className="bg-[#293050] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">
                Recommend
              </span>
            </div>
            <div className="bg-[#2E3670] text-xs font-semibold rounded px-2 py-1">
              JFK
            </div>
          </div>
          <h1 className="text-white text-lg font-semibold leading-tight">
            John F. Kennedy International Airport
          </h1>
          <div className="flex justify-between">
            <div className="items-center space-x-2 text-[#A3B0D1] text-xs font-medium">
              <span className="flex items-center">
                <FaPlaneDeparture className="me-2" /> United States
              </span>
              <br />
              <span className="text-[#A3B0D1] font-normal">
                7.5M Monthly Passengers
              </span>
            </div>
            <div className="text-[#A3B0D1] text-xs font-semibold">Tier 1</div>
          </div>
        </div>

        {/* Domain info */}
        <div className="bg-[#222B55] rounded-lg p-4 flex items-center space-x-3">
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

        {/* Price and purchase */}
        <div className="bg-[#222B55] rounded-lg p-4 flex justify-between items-center text-[#A3B0D1] font-semibold text-sm">
          <span>NOL</span>
          <span>150 $</span>
        </div>
        <button className="w-full bg-white text-[#222B55] font-semibold rounded-md py-2">
          <i className="fas fa-lock mr-2"></i> Purchase Domain
        </button>

        {/* Search Form */}
        <div className="text-[#A3B0D1] text-center text-sm font-semibold">
          Can't find your airport?
        </div>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Enter Full airport name"
            className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
          />
          <input
            type="text"
            placeholder="City,Country"
            className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
          />
          <input
            type="text"
            placeholder="3 Letter IATA Code"
            className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-[#4B5FD3] rounded-md py-2 text-white font-semibold text-sm"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
