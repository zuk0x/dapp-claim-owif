let web3;
let userAddress;
const CLAIM_CONTRACT_ADDRESS = "0xD234F1a4F11458A16979B863600F8959f0124508"; // Replace with your deployed ClaimContract address

window.onload = async () => {
  console.log("Page loaded, setting up event listeners...");
  // Set up the button handlers
  document.getElementById('connectWallet').onclick = connectWallet;
  document.getElementById('claimTokens').onclick = claimTokens;
};

async function connectWallet() {
  // Check if MetaMask is available
  if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask detected, setting up Web3...");
    
    // Create a new instance of web3 with MetaMask provider
    web3 = new Web3(window.ethereum);

    try {
      // Request wallet connection
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      
      // Log the connected wallet address
      console.log("Wallet connected:", userAddress);
      
      // Update the status and enable the claim button
      document.getElementById('status').innerHTML = `Wallet connected: ${userAddress}`;
      document.getElementById('claimTokens').disabled = false;
    } catch (error) {
      // Log any errors and display them
      console.error("Error connecting wallet:", error);
      document.getElementById('status').innerHTML = `Error: ${error.message}`;
    }
  } else {
    // If MetaMask is not detected, show a message to the user
    console.warn("MetaMask is not installed!");
    document.getElementById('status').innerHTML = 'MetaMask is not installed!';
  }
}

async function claimTokens() {
  // Ensure the wallet is connected
  if (!web3 || !userAddress) {
    console.error("Wallet is not connected yet!");
    document.getElementById('status').innerHTML = 'Please connect your wallet first!';
    return;
  }

  console.log("Attempting to claim tokens for address:", userAddress);

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

    console.log("Tokens claimed successfully!", transaction);

    // Display success message if the transaction goes through
    document.getElementById('status').innerHTML = '100 OWIF tokens claimed successfully!';
  } catch (error) {
    // Log any errors and display them
    console.error("Error claiming tokens:", error);
    document.getElementById('status').innerHTML = `Error: ${error.message}`;
  }
}
