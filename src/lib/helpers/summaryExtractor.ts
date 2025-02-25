import { ResponseSummary, TransactionSummary, DeploymentSummary, QuerySummary } from '@/types/chat';

/**
 * Attempts to extract a transaction, deployment, or query summary from an assistant message
 */
export function extractSummaryFromMessage(content: string): ResponseSummary | null {
  // Try to extract transaction information
  const transactionSummary = extractTransactionSummary(content);
  if (transactionSummary) return transactionSummary;

  // Try to extract deployment information
  const deploymentSummary = extractDeploymentSummary(content);
  if (deploymentSummary) return deploymentSummary;

  // Try to extract query information
  const querySummary = extractQuerySummary(content);
  if (querySummary) return querySummary;

  return null;
}

/**
 * Extracts transaction details from a message
 */
function extractTransactionSummary(content: string): TransactionSummary | null {
  // Check if this is a transaction message
  if (!content.match(/transfer|send|transaction|sent/i)) {
    return null;
  }

  // Extract recipient
  const recipientMatch = content.match(/to (?:the address(?:\s+resolved\s+from\s+the\s+ENS\s+name)?\s+`?([^`]+)`?|`?([^`]+)`?)/i) ||
                         content.match(/recipient(?:\s+is|:)?\s+`?([^`\n,.]+)`?/i);
  
  // Extract amount and token
  const amountMatch = content.match(/([0-9.]+)\s*([A-Z]{2,})/i) ||
                     content.match(/amount(?:\s+of)?\s+([0-9.]+)\s*([A-Z]{2,})/i);
  
  // Extract network
  const networkMatch = content.match(/on\s+(?:the\s+)?([A-Za-z]+)(?:\s+network|\s+chain|\s+blockchain)/i) ||
                       content.match(/network(?:\s+is|:)?\s+([A-Za-z]+)/i);
  
  // Extract status
  const statusMatch = content.match(/status(?:\s+is|:)?\s+([A-Za-z]+)/i) ||
                     (content.includes('successful') || content.includes('confirmed') ? ['', 'confirmed'] :
                      content.includes('failed') || content.includes('error') ? ['', 'failed'] :
                      content.includes('pending') || content.includes('processing') ? ['', 'pending'] : null);

  // Extract transaction hash
  const hashMatch = content.match(/transaction\s+(?:hash|id)(?:\s+is|:)?\s+`?(?:0x)?([a-fA-F0-9]+)`?/i) ||
                   content.match(/(?:0x)([a-fA-F0-9]{64})/);

  if (recipientMatch && amountMatch) {
    const recipient = recipientMatch[1] || recipientMatch[2] || 'Unknown';
    const amount = amountMatch[1] || '0';
    const token = amountMatch[2] || 'ETH';
    const network = (networkMatch && networkMatch[1]) || 'Ethereum';
    const status = (statusMatch && statusMatch[1].toLowerCase()) as 'pending' | 'confirmed' | 'failed' || 'pending';
    const hash = hashMatch && hashMatch[1];

    return {
      type: 'transaction',
      recipient,
      amount,
      token,
      network,
      status,
      hash: hash ? `0x${hash.toLowerCase()}` : undefined
    };
  }

  return null;
}

/**
 * Extracts deployment details from a message
 */
function extractDeploymentSummary(content: string): DeploymentSummary | null {
  // Check if this is a deployment message
  if (!content.match(/deploy|contract|deployed/i)) {
    return null;
  }

  // Extract contract type
  const contractTypeMatch = content.match(/deploy(?:ed|ing)?(?:\s+a|:)?\s+([A-Za-z0-9]+)(?:\s+contract|\s+token)/i) ||
                           content.match(/contract\s+type(?:\s+is|:)?\s+([A-Za-z0-9]+)/i);
  
  // Extract contract name
  const contractNameMatch = content.match(/(?:contract|token)\s+(?:name|called|named)(?:\s+is|:)?\s+['"]?([^'".,\n]+)['"]?/i) ||
                           content.match(/named\s+['"]?([^'".,\n]+)['"]?/i);
  
  // Extract network
  const networkMatch = content.match(/on\s+(?:the\s+)?([A-Za-z]+)(?:\s+network|\s+chain|\s+blockchain)/i) ||
                      content.match(/network(?:\s+is|:)?\s+([A-Za-z]+)/i);
  
  // Extract contract address
  const addressMatch = content.match(/(?:contract|token)\s+address(?:\s+is|:)?\s+`?(?:0x)?([a-fA-F0-9]+)`?/i) ||
                      content.match(/address(?:\s+is|:)?\s+`?(?:0x)?([a-fA-F0-9]+)`?/i);
  
  // Extract status
  const statusMatch = content.match(/status(?:\s+is|:)?\s+([A-Za-z]+)/i) ||
                     (content.includes('successful') || content.includes('deployed') ? ['', 'confirmed'] :
                      content.includes('failed') ? ['', 'failed'] :
                      content.includes('pending') || content.includes('processing') ? ['', 'pending'] : null);

  if (contractTypeMatch) {
    const contractType = contractTypeMatch[1] || 'Contract';
    const contractName = (contractNameMatch && contractNameMatch[1]) || undefined;
    const network = (networkMatch && networkMatch[1]) || 'Ethereum';
    const address = addressMatch && addressMatch[1] ? `0x${addressMatch[1].toLowerCase()}` : undefined;
    const status = (statusMatch && statusMatch[1].toLowerCase()) as 'pending' | 'confirmed' | 'failed' || 'pending';

    return {
      type: 'deployment',
      contractType,
      contractName,
      network,
      address,
      status
    };
  }

  return null;
}

/**
 * Extracts query details from a message
 */
function extractQuerySummary(content: string): QuerySummary | null {
  // Look for common query responses
  if (content.match(/balance|holdings|supply|price|market cap|volume/i)) {
    // Try to understand what entity is being queried
    const subjectMatch = content.match(/(?:the|your)\s+([A-Za-z0-9]+)(?:\s+balance|\s+holdings|\s+supply|\s+price)/i) ||
                       content.match(/information\s+(?:about|for)\s+([A-Za-z0-9.]+)/i);
    
    if (subjectMatch) {
      const subject = subjectMatch[1];
      const data: Record<string, any> = {};
      
      // Look for balance information
      const balanceMatch = content.match(/balance(?:\s+is|:)?\s+([0-9.,]+)(?:\s+([A-Z]{2,}))?/i);
      if (balanceMatch) {
        data.balance = balanceMatch[1];
        if (balanceMatch[2]) data.currency = balanceMatch[2];
      }
      
      // Look for price information
      const priceMatch = content.match(/price(?:\s+is|:)?\s+\$?([0-9.,]+)/i);
      if (priceMatch) {
        data.price = priceMatch[1];
      }
      
      // Look for supply information
      const supplyMatch = content.match(/supply(?:\s+is|:)?\s+([0-9.,]+)/i);
      if (supplyMatch) {
        data.supply = supplyMatch[1];
      }
      
      // Look for address information
      const addressMatch = content.match(/address(?:\s+is|:)?\s+(?:0x)?([a-fA-F0-9]+)/i);
      if (addressMatch) {
        data.address = `0x${addressMatch[1].toLowerCase()}`;
      }
      
      return {
        type: 'query',
        subject,
        data
      };
    }
  }
  
  return null;
} 