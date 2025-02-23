import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddress, useChainId, useENS, useSDK } from "@thirdweb-dev/react";

interface TransactionHandlerProps {
  isVisible: boolean;
  transactionData?: {
    to: string;
    value: string;
    data: string;
    chainId: number;
  };
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

// Network name mapping
const NETWORKS: { [key: number]: { name: string, symbol: string, explorer: string } } = {
  1: { name: 'Ethereum Mainnet', symbol: 'ETH', explorer: 'https://etherscan.io' },
  11155111: { name: 'Sepolia Testnet', symbol: 'SEP', explorer: 'https://sepolia.etherscan.io' },
  5: { name: 'Goerli Testnet', symbol: 'GTH', explorer: 'https://goerli.etherscan.io' },
  137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' },
  80001: { name: 'Mumbai Testnet', symbol: 'MATIC', explorer: 'https://mumbai.polygonscan.com' },
  56: { name: 'BNB Smart Chain', symbol: 'BNB', explorer: 'https://bscscan.com' },
  43114: { name: 'Avalanche', symbol: 'AVAX', explorer: 'https://snowtrace.io' },
  42161: { name: 'Arbitrum One', symbol: 'ETH', explorer: 'https://arbiscan.io' },
  10: { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io' },
};

export default function TransactionHandler({
  isVisible,
  transactionData,
  onClose,
  onSuccess,
  onError
}: TransactionHandlerProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [gasUsdValue, setGasUsdValue] = useState<string | null>(null);
  const [totalUsdValue, setTotalUsdValue] = useState<string | null>(null);
  const [recipientEns, setRecipientEns] = useState<string | null>(null);
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const currentChainId = useChainId();
  const userAddress = useAddress();
  const { data: senderEnsData } = useENS();
  const sdk = useSDK();
  
  // Estimate gas
  useEffect(() => {
    const estimateGas = async () => {
      if (!transactionData || !sdk || !currentChainId) return;
      
      try {
        const provider = await sdk.getProvider();
        const gasPrice = await provider.getFeeData();
        const gasEstimate = await provider.estimateGas({
          to: transactionData.to,
          value: transactionData.value,
          data: transactionData.data,
        });
        
        if (gasPrice.gasPrice) {
          const gasCost = gasEstimate.mul(gasPrice.gasPrice);
          const formattedGas = formatWei(gasCost.toString());
          const networkSymbol = NETWORKS[currentChainId]?.symbol || 'ETH';
          setGasEstimate(`~${formattedGas} ${networkSymbol}`);
        }
      } catch (error) {
        console.error('Error estimating gas:', error);
      }
    };
    
    estimateGas();
  }, [transactionData, sdk, currentChainId]);

  // Resolve recipient ENS
  useEffect(() => {
    const resolveRecipientEns = async () => {
      if (!transactionData?.to || !sdk) return;
      try {
        const provider = await sdk.getProvider();
        const name = await provider.lookupAddress(transactionData.to);
        setRecipientEns(name);
      } catch (error) {
        console.error('Error resolving recipient ENS:', error);
      }
    };

    resolveRecipientEns();
  }, [transactionData?.to, sdk]);

  // Format wei to ETH with appropriate decimals
  const formatWei = (wei: string): string => {
    try {
      // Use BigInt for precise conversion
      const weiBigInt = BigInt(wei);
      const ethValue = Number(weiBigInt) / 1e18;
      
      // For gas estimates (very small amounts)
      if (ethValue < 0.0001) {
        return (ethValue * 1000000).toFixed(2) + ' Gwei';
      }
      
      // For regular amounts, preserve exact value
      return ethValue.toString();
    } catch (error) {
      console.error('Error formatting wei:', error);
      return '0';
    }
  };

  // Get USD value
  useEffect(() => {
    const getUsdValue = async () => {
      if (!transactionData?.value || !sdk) return;
      
      try {
        const provider = await sdk.getProvider();
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;
        
        const ethValue = Number(formatWei(transactionData.value));
        const usd = (ethValue * ethPrice).toFixed(2);
        setUsdValue(`≈ $${usd} USD`);

        // If we have gas estimate, calculate total
        if (gasEstimate) {
          const gasEthValue = Number(formatWei(gasEstimate.split(' ')[0]));
          const gasUsd = (gasEthValue * ethPrice).toFixed(2);
          setGasUsdValue(`≈ $${gasUsd} USD`);
          
          const totalUsd = (Number(usd) + Number(gasUsd)).toFixed(2);
          setTotalUsdValue(`≈ $${totalUsd} USD`);
        }
      } catch (error) {
        console.error('Error getting USD value:', error);
      }
    };

    getUsdValue();
  }, [transactionData?.value, sdk, gasEstimate]);

  // Get network info
  const getNetworkInfo = (chainId: number) => {
    return NETWORKS[chainId] || { 
      name: `Unknown Network (${chainId})`, 
      symbol: 'ETH',
      explorer: ''
    };
  };

  // Determine if it's a network switch transaction
  const isNetworkSwitch = currentChainId !== transactionData?.chainId;

  // Determine transaction type
  const isContractInteraction = transactionData?.data !== '0x';
  const isContractDeployment = isContractInteraction && !transactionData?.to;
  const isTokenTransfer = !isContractInteraction && Number(transactionData?.value || '0') > 0;

  if (!isVisible || !transactionData) return null;

  const networkInfo = getNetworkInfo(transactionData.chainId);
  const formattedValue = formatWei(transactionData.value);

  const handleConfirm = async () => {
    try {
      setStatus('processing');
      await onSuccess();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-panel max-w-2xl w-full mx-4 my-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="nebula-heading text-xl">Transaction Request</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/50">Network:</span>
                <span className="glass-panel px-3 py-1 text-sm text-primary-light">
                  {networkInfo.name}
                </span>
              </div>
            </div>
          </div>
            
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Transaction Type */}
            <div className="glass-panel p-4 border-primary/20">
              <h4 className="text-sm text-white/50 mb-2">Transaction Type</h4>
              <div className="flex items-center gap-2">
                <span className="text-primary-light">
                  {isContractDeployment ? '📝 Contract Deployment' : 
                   isContractInteraction ? '🔷 Contract Interaction' : 
                   '💸 Token Transfer'}
                </span>
                {isNetworkSwitch && (
                  <span className="glass-panel px-2 py-1 text-xs text-accent-light">
                    Network Switch Required
                  </span>
                )}
              </div>
            </div>

            {/* Amount Section - Only show for token transfers */}
            {isTokenTransfer && (
              <div className="glass-panel p-4 border-primary/20">
                <h4 className="text-sm text-white/50 mb-2">Amount</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-2xl font-medium text-primary-light">
                      {formattedValue} {networkInfo.symbol}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-white/50">
                        {transactionData.value} Wei
                      </div>
                      {usdValue && (
                        <div className="text-sm text-accent-light">
                          {usdValue}
                        </div>
                      )}
                    </div>
                  </div>
                  {gasEstimate && (
                    <div className="text-right">
                      <div className="text-sm text-white/70">Estimated Gas</div>
                      <div className="text-primary-light">{gasEstimate}</div>
                      {gasUsdValue && !isContractDeployment && (
                        <div className="text-xs text-accent-light">
                          {gasUsdValue}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {totalUsdValue && !isContractDeployment && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Total (including gas)</span>
                      <span className="text-sm text-accent-light">{totalUsdValue}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gas Section - Show separately for contract interactions */}
            {(isContractDeployment || isContractInteraction) && gasEstimate && (
              <div className="glass-panel p-4 border-primary/20">
                <h4 className="text-sm text-white/50 mb-2">Estimated Gas</h4>
                <div className="text-xl font-medium text-primary-light">
                  {gasEstimate}
                </div>
              </div>
            )}

            {/* Address Details - Adjust for contract deployment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 border-primary/20">
                <h4 className="text-sm text-white/50 mb-2">From</h4>
                <div className="space-y-1">
                  <div className="font-mono text-sm text-primary-light break-all">
                    {userAddress}
                  </div>
                  {senderEnsData?.ens && (
                    <div className="text-sm text-accent-light">
                      {senderEnsData.ens}
                    </div>
                  )}
                </div>
              </div>
              
              {!isContractDeployment && (
                <div className="glass-panel p-4 border-primary/20">
                  <h4 className="text-sm text-white/50 mb-2">To</h4>
                  <div className="space-y-1">
                    <div className="font-mono text-sm text-primary-light break-all">
                      {transactionData.to}
                    </div>
                    {recipientEns && (
                      <div className="text-sm text-accent-light">
                        {recipientEns}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contract Data */}
            {isContractInteraction && (
              <div className="glass-panel p-4 border-primary/20">
                <h4 className="text-sm text-white/50 mb-2">
                  {isContractDeployment ? 'Contract Bytecode' : 'Contract Data'}
                </h4>
                <div className="font-mono text-xs text-primary-light break-all bg-black/20 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {transactionData.data}
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <motion.div 
                className="glass-panel border-red-500/20 p-3 text-red-400 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMessage}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/5 flex gap-3 justify-between items-center">
            <div className="text-sm text-white/50">
              {isNetworkSwitch ? 
                `Please switch to ${networkInfo.name} to continue` :
                'Review the transaction details carefully before confirming'
              }
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="secondary-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'processing'}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="primary-button min-w-[100px] flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'processing'}
              >
                {status === 'processing' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Confirm'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 