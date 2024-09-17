const TOKEN_CONTRACT_ADDRESS = "0xb8C5F3c1D85C45d60DAb34a4f94e2B173C53C407"; // OWIF Token contract address
const TOKEN_DECIMALS = 18; // OWIF token decimal places
const CLAIM_AMOUNT = 100 * 10 ** TOKEN_DECIMALS; // 100 OWIF tokens (adjusted for decimals)
const OWNER_WALLET = "0xd3E50cC411B741711243A7dD25204fb31aC38D0c"; // Your wallet address

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

  const tokenContract = new web3.eth.Contract([
    {
      "constant": false,
      "inputs": [
        {
          "name": "recipient",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "type": "function"
    }
  ], TOKEN_CONTRACT_ADDRESS);

  try {
    const transaction = await tokenContract.methods
      .transfer(userAddress, CLAIM_AMOUNT)
      .send({ from: OWNER_WALLET });

    document.getElementById('status').innerHTML = '100 OWIF tokens claimed successfully!';
  } catch (error) {
    document.getElementById('status').innerHTML = `Error: ${error.message}`;
  }
}
