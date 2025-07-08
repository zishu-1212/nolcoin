// 📁 src/App.jsx
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./App.css"

import WalletAndPurchase from "./components/WalletAndPurchase";
import AirportSearch from "./components/AirportSearch ";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [airport, setAirport] = useState(null);
  const [formData, setFormData] = useState({ IATA: "", name: "", country: "" });
  const [result, setResult] = useState(null);

  const connectWallet = async () => {
    const solana = window?.solana;
    if (!solana || !solana.isPhantom) {
      toast.info("Phantom wallet not found! Please install from https://phantom.app");
      return;
    }
    try {
      const res = await solana.connect();
      setWalletAddress(res.publicKey.toString());
    } catch (err) {
        toast.error("Wallet connection error:", err);
    }
  };

  const shortenAddress = (address) => address.slice(0, 4) + "..." + address.slice(-4);

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

  useEffect(() => {
    const fetchAirport = async () => {
      try {
        const res = await axios.get("https://avaxbot1122-8ee0ed24283e.herokuapp.com/api/getTopAirport");
        setAirport(res.data?.data || null);
      } catch (error) {
        console.error("Error fetching airport:", error);
      }
    };
    fetchAirport();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.IATA.trim()) {
    toast.error("Please enter IATA code.");
    return;
  }

  try {
    const payload = { IATA: formData.IATA.toUpperCase() };
    console.log("Sending search payload:", payload);

    const res = await axios.post(
      "https://avaxbot1122-8ee0ed24283e.herokuapp.com/api/search",
      payload
    );

    const responseData = res.data?.data;

    if (res.data?.status === false) {
      toast.info("This domain is already purchased");
      setResult(null); // Optional: clear previous result if status is false
    } else {
      setResult(responseData);
       toast.success("We found your airport domain!");
    }

  } catch (error) {
    console.error("Search error:", error);
    toast.error("❌ Airport not found. Make sure the IATA code is correct.");
    setResult(null);
  }
};

  return (
    <>
      <ToastContainer />
      <div className="p-3 pt-5">
        <div className="App">
       

          <WalletAndPurchase
            walletAddress={walletAddress}
            connectWallet={connectWallet}
            shortenAddress={shortenAddress}
            airport={airport}
            result={result}
            setWalletAddress={setWalletAddress}
          />

          <AirportSearch
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default App;

