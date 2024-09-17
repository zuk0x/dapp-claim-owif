let web3;
let userAddress;
const CLAIM_CONTRACT_ADDRESS = "YOUR_CLAIM_CONTRACT_ADDRESS"; // Replace with your deployed ClaimContract address

window.onload = async () => {
  // When the page loads, set up the button handlers
  document.getElementById('connectWallet').onclick = connectWallet;
  document.getElementById('claimTokens').onclick = claimTokens;
};

async function connectWallet() {
  // Check if MetaMask is available
  if (typeof window.ethereum !== 'undefined') {
    // Create a new instance of web3 with MetaMask provider
    web3 = new Web3(window.ethereum);
    try {
      // Request wallet connection
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];

      // Update the status and enable the claim button
      document.getElementById('status').innerHTML = `Wallet connected: ${userAddress}`;
      document.getElementById('claimTokens').disabled = false;
    } catch (error) {
      // Catch any errors and display them
      document.getElementById('status').innerHTML = `Error: ${error.message}`;
    }
  } else {
    // If MetaMask is not detected, show a message to the user
    document.getElementById('status').innerHTML = 'MetaMask is not installed!';
  }
}

async function claimTokens() {
  // Ensure the wallet is connected
  if (!web3 || !userAddress) {
    document.getElementById('status').innerHTML = 'Please connect your wallet first!';
    return;
  }

  // ABI for the claimTokens function from your contract
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
    // Call the claimTokens function from the smart contract
    const transaction = await claimContract.methods
      .claimTokens()
      .send({ from: userAddress });

    // Display success message if the transaction goes through
    document.getElementById('status').innerHTML = '100 OWIF tokens claimed successfully!';
  } catch (error) {
    // Catch any errors and display them
    document.getElementById('status').innerHTML = `Error: ${error.message}`;
  }
}
