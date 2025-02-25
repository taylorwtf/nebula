export type MessageCategory = 'transfer' | 'deploy' | 'query' | 'interaction' | 'error' | 'general';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
  category?: MessageCategory;
  timestamp?: number;
}

export interface TransactionSummary {
  type: 'transaction';
  recipient: string;
  amount: string;
  token: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
}

export interface DeploymentSummary {
  type: 'deployment';
  contractType: string;
  contractName?: string;
  network: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
}

export interface QuerySummary {
  type: 'query';
  subject: string;
  data: Record<string, any>;
}

export type ResponseSummary = TransactionSummary | DeploymentSummary | QuerySummary;

export interface ActionRecord {
  id: string;
  type: 'transaction' | 'deployment' | 'contract_interaction';
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  chatId: string;
  messageId?: string;
  details: {
    network: string;
    hash?: string;
    to?: string;
    value?: string;
    data?: string;
    contractAddress?: string;
    contractType?: string;
    function?: string;
    params?: any[];
  };
}

export interface Chat {
  id: string;
  name: string;
  timestamp: number;
  messages: Message[];
  isPinned?: boolean;
} 