import { prepareTransaction, sendTransaction } from "thirdweb";
import { useSDK } from "@thirdweb-dev/react";

// Cache for the connected wallet
let cachedWallet: any = null;

// Function to set the connected wallet (call this from a React component)
export function setConnectedWallet(wallet: any) {
  cachedWallet = wallet;
}

// Get the cached wallet
function getConnectedWallet() {
  return cachedWallet;
}

export async function handleTransactionRequest(txData: {
  to: string;
  value: string;
  data: string;
  chainId: number;
}) {
  try {
    // Get wallet connection from cache
    const wallet = getConnectedWallet(); 
    
    if (!wallet) {
      throw new Error('No connected wallet');
    }

    // Convert data to proper format if needed
    const hexData = txData.data.startsWith('0x') ? txData.data : `0x${txData.data}`;

    // In ThirdWeb v4, we can use the wallet's signer directly
    const signer = await wallet.getSigner();
    
    if (!signer) {
      throw new Error('Could not get signer from wallet');
    }

    // Create and send the transaction using the signer
    const tx = await signer.sendTransaction({
      to: txData.to,
      value: txData.value,
      data: hexData,
      chainId: txData.chainId
    });

    return tx;
  } catch (error) {
    console.error('Transaction error:', error);
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 