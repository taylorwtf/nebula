import { prepareTransaction, sendTransaction } from "thirdweb";

export async function handleTransactionRequest(txData: {
  to: string;
  value: string;
  data: string;
  chainId: number;
}) {
  try {
    // Get wallet connection from your state management
    const wallet = getConnectedWallet(); 
    
    if (!wallet) {
      throw new Error('No connected wallet');
    }

    const transaction = prepareTransaction({
      to: txData.to,
      value: BigInt(txData.value),
      data: txData.data,
      chain: txData.chainId,
    });

    return await sendTransaction({
      transaction,
      account: wallet.account,
    });
  } catch (error) {
    console.error('Transaction error:', error);
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 