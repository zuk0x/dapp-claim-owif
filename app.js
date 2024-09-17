let web3;
let userAddress;
const CLAIM_CONTRACT_ADDRESS = "0xD234F1a4F11458A16979B863600F8959f0124508"; // Replace with your deployed ClaimContract address

// Function to detect MetaMask and set up event listeners
window.onload = async () => {
  console.log("Page loaded, checking for MetaMask...");

  // Check if MetaMask's Ethereum object is available
  if (typeof window.ethereum !== 'undefined') {
    // Initialize web3 with the MetaMask provider
    web3 = new Web3(window.ethereum);
    console.log("MetaMask detected, setting up event listeners...");

    // Set up the button handlers
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('claimTokens').addEventListener('click', claimTokens);
    
    // Detect account changes (MetaMask event)
    ethereum.on('accountsChanged', function (accounts) {
      console.log('Account changed:', accounts[0]);
      if (accounts.length > 0) {
        userAddress = accounts[0];
        document.getElementById('status').innerHTML = `Wallet connected: ${userAddress}`;
        document.getElementById('claimTokens').disabled = false;
      } else {
        document.getElementById('status').innerHTML = 'Please connect your wallet!';
        document.getElementById('claimTokens').disabled = true;
      }
    });
    
    // Detect network changes (MetaMask event)
    ethereum.on('chainChanged', (_chainId) => window.location.reload());

  } else {
    console.error("MetaMask is not installed!");
    document.getElementById('status').innerHTML = 'MetaMask is not installed!';
  }
};

async function connectWallet() {
  try {
    // Request MetaMask connection
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    console.log("Wallet connected:", userAddress);

    // Update the status and enable the claim button
    document.getElementById('status').innerHTML = `Wallet connected: ${userAddress}`;
    document.getElementById('claimTokens').disabled = false;
  } catch (error) {
    // Log any errors and display them
    console.error("Error connecting wallet:", error);
    document.getElementById('status').innerHTML = `Error: ${error.message}`;
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
