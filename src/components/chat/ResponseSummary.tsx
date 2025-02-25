'use client';

import { motion } from 'framer-motion';
import { ResponseSummary as SummaryType } from '@/types/chat';

interface ResponseSummaryProps {
  summary: SummaryType;
}

export default function ResponseSummary({ summary }: ResponseSummaryProps) {
  return (
    <motion.div
      className="mb-4 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-slate-800/50 backdrop-blur-md border border-white/10">
        <div className="px-4 py-2 bg-slate-700/40 flex items-center">
          <div className="flex items-center space-x-2">
            {renderSummaryIcon(summary.type)}
            <h3 className="text-sm font-medium text-white">{renderSummaryTitle(summary)}</h3>
          </div>
        </div>
        <div className="p-4">
          {summary.type === 'transaction' && renderTransactionSummary(summary)}
          {summary.type === 'deployment' && renderDeploymentSummary(summary)}
          {summary.type === 'query' && renderQuerySummary(summary)}
        </div>
        {renderStatusBadge(summary)}
      </div>
    </motion.div>
  );
}

function renderSummaryIcon(type: string) {
  switch (type) {
    case 'transaction':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
          <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
        </svg>
      );
    case 'deployment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    case 'query':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
}

function renderSummaryTitle(summary: SummaryType) {
  switch (summary.type) {
    case 'transaction':
      return `Transfer ${summary.amount} ${summary.token}`;
    case 'deployment':
      return `${summary.contractName || summary.contractType} Contract`;
    case 'query':
      return `${summary.subject} Information`;
    default:
      return 'Information';
  }
}

function renderTransactionSummary(summary: SummaryType & { type: 'transaction' }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-white/60">Recipient</span>
        <span className="font-medium text-white">{summary.recipient}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/60">Amount</span>
        <span className="font-medium text-white">{summary.amount} {summary.token}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/60">Network</span>
        <span className="font-medium text-white">{summary.network}</span>
      </div>
      {summary.hash && (
        <div className="flex items-center justify-between">
          <span className="text-white/60">Transaction</span>
          <a 
            href={`https://etherscan.io/tx/${summary.hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-blue-400 hover:text-blue-300 truncate max-w-[160px]"
          >
            {`${summary.hash.slice(0, 6)}...${summary.hash.slice(-4)}`}
          </a>
        </div>
      )}
    </div>
  );
}

function renderDeploymentSummary(summary: SummaryType & { type: 'deployment' }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-white/60">Contract Type</span>
        <span className="font-medium text-white">{summary.contractType}</span>
      </div>
      {summary.contractName && (
        <div className="flex items-center justify-between">
          <span className="text-white/60">Contract Name</span>
          <span className="font-medium text-white">{summary.contractName}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-white/60">Network</span>
        <span className="font-medium text-white">{summary.network}</span>
      </div>
      {summary.address && (
        <div className="flex items-center justify-between">
          <span className="text-white/60">Address</span>
          <a 
            href={`https://etherscan.io/address/${summary.address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-blue-400 hover:text-blue-300 truncate max-w-[160px]"
          >
            {`${summary.address.slice(0, 6)}...${summary.address.slice(-4)}`}
          </a>
        </div>
      )}
    </div>
  );
}

function renderQuerySummary(summary: SummaryType & { type: 'query' }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-white/60">Subject</span>
        <span className="font-medium text-white">{summary.subject}</span>
      </div>
      {Object.entries(summary.data).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-white/60">{key}</span>
          <span className="font-medium text-white">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
        </div>
      ))}
    </div>
  );
}

function renderStatusBadge(summary: SummaryType) {
  if ('status' in summary) {
    const status = summary.status;
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'pending':
        bgColor = 'bg-yellow-500/20';
        textColor = 'text-yellow-300';
        break;
      case 'confirmed':
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-300';
        break;
      case 'failed':
        bgColor = 'bg-red-500/20';
        textColor = 'text-red-300';
        break;
    }
    
    return (
      <div className={`px-4 py-2 ${bgColor} flex items-center justify-end`}>
        <span className={`text-xs font-medium ${textColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  }
  
  return null;
} 