const CLAIM_CONTRACT_ADDRESS = "0xD234F1a4F11458A16979B863600F8959f0124508";

let web3;
let userAddress;

window.onload = async () => {
  document.getElementById('connectWallet').onclick = connectWallet;
  document.getElementById('claimTokens').onclick = claimTokens;
};

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      document.getElementById('status').innerHTML = `Wallet connected: ${userAddress}`;
      document.getElementById('claimTokens').disabled = false;
    } catch (error) {
      document.getElementById('status').innerHTML = `Error: ${error.message}`;
    }
  } else {
    document.getElementById('status').innerHTML = 'MetaMask is not installed!';
  }
}

async function claimTokens() {
  if (!web3 || !userAddress) {
    document.getElementById('status').innerHTML = 'Please connect your wallet first!';
    return;
  }

  const claimContract = new web3.eth.Contract([
    {
      "constant": false,
      "inputs": [],
      "name": "claimTokens",
      "outputs": [],
      "type": "function"
    }
  ], CLAIM_CONTRACT_ADDRESS);

  try {
    const transaction = await claimContract.methods
      .claimTokens()
      .send({ from: userAddress });

    document.getElementById('status').innerHTML = '100 OWIF tokens claimed successfully!';
  } catch (error) {
    document.getElementById('status').innerHTML = `Error: ${error.message}`;
  }
}
