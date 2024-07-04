import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/FavouriteDrink.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [mess, setMess] = useState("");
  const [message, setMessage] = useState("");
  const [newDrink, setnewDrink] = useState("");

  const contractAddress = "0x0e8a2565895775A9142ca2eE3D493d28a59b5A6a";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const sendMessage = async () => {
    if (atm) {
      try {
        await atm.setFavouriteDrink(newDrink);
        setnewDrink("");
        console.log("Message sent successfully!");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const getFavouritedrink = async () => {
    if (atm) {
      try {
        const lastMessage = await atm.getFavouritedrink();
        setMessage(lastMessage);
      } catch (error) {
        console.error("Error getting last message:", error);
      }
    }
  };

  const getLastSender = async () => {
    if (atm) {
      try {
        const lastSender = await atm.getLastSender();
        setMess(lastSender);
      } catch (error) {
        console.error("Error getting last sender:", error);
      }
    }
  };
  const resert = function () {
    setMessage("");
    setMess("");
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      <div className="user-interface">
        {!ethWallet && (
          <p className="connect-message">
            Please install MetaMask in order to use this ATM.
          </p>
        )}
        {ethWallet && !account && (
          <button className="connect-button" onClick={connectAccount}>
            Connect Metamask Wallet
          </button>
        )}
        {account && (
          <>
            <div className="message-section">
              <h3 className="heading">Set Favourite Drink</h3>
              <input
                className="input-field"
                type="text"
                placeholder="Enter Message"
                value={newDrink}
                onChange={(e) => setnewDrink(e.target.value)}
              />
              <button className="action-button" onClick={sendMessage}>
                Set Drink
              </button>
            </div>
            <div className="message-section">
              <button className="action-button" onClick={getFavouritedrink}>
                Get Favourite Drink
              </button>
              <p className="message">{message}</p>
            </div>
            <div className="message-section">
              <button className="action-button" onClick={getLastSender}>
                Get Last Sender
              </button>
              <p className="message">{mess}</p>
            </div>
            <div className="message-section">
              <button className="action-button" onClick={resert}>
                resert
              </button>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        header {
          margin-bottom: 20px;
        }
        .connect-message {
          font-size: 18px;
          color: red;
          margin-bottom: 20px;
        }
        .connect-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .user-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .message-section {
          margin-top: 20px;
        }
        .heading {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .input-field {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 300px;
          font-size: 16px;
        }
        .action-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        }
        .message {
          font-size: 18px;
          margin-top: 10px;
        }
      `}</style>
    </main>
  );
}
