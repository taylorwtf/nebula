// Client-side interface for Nebula API
interface NebulaAction {
  data: string;
  type: string;
}

interface NebulaResponse {
  message?: string;
  actions?: NebulaAction[];
  session_id?: string;
  request_id?: string;
  result?: {
    message: string;
    session_id: string;
    message_id: string;
  };
}

interface NebulaRequestOptions {
  message: string;
  walletAddress: string;
  userId?: string;
  stream?: boolean;
  onStream?: (chunk: string) => void;
  onAction?: (action: any) => void;
  apiKey?: string;
  clientId?: string;
}

async function handleStreamingResponse(response: Response, onStream?: (chunk: string) => void, onAction?: (action: any) => void) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        
        try {
          // Log raw line for debugging
          console.log('Raw SSE line:', line);
          
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
            continue;
          }

          if (!line.startsWith('data: ')) {
            console.warn('Unexpected line format:', line);
            continue;
          }

          const data = JSON.parse(line.slice(6));
          console.log('Parsed SSE data:', data, 'Event:', currentEvent);

          // Early type check before switch
          if (data.type === 'sign_transaction') {
            if (onAction) {
              const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
              onAction({ ...data, data: parsedData });
            }
            // Don't return here - continue processing stream
            continue;
          }

          switch (currentEvent) {
            case 'delta':
              if (onStream && data.v) {
                onStream(data.v);
              }
              break;
            case 'init':
              console.log('Stream initialized:', data);
              break;
            case 'presence':
              console.log('Backend status:', data);
              break;
            case 'error':
              console.error('Stream error:', data);
              throw new Error(data.error || 'Unknown stream error');
            default:
              console.log(`Unhandled event type: ${currentEvent}`, data);
          }
        } catch (parseError) {
          console.error('Error parsing SSE line:', parseError, 'Line:', line);
        }
      }
    }
  } catch (streamError) {
    console.error('Error in stream processing:', streamError);
    throw streamError;
  } finally {
    reader.releaseLock();
  }
}

async function handleNebulaResponse(response: NebulaResponse) {
  if (response.actions && response.actions.length > 0) {
    const action = response.actions[0];
    try {
      console.log("Action received:", action);
      return action;
    } catch (error) {
      console.error("Error processing action:", error);
      throw error;
    }
  }
  
  if (response.result) {
    console.log("Response message:", response.result.message);
    return response.result;
  }

  if (response.message) {
    return {
      message: response.message,
      session_id: response.session_id || '',
      message_id: response.request_id || ''
    };
  }
  
  return response;
}

export async function sendNebulaRequest({
  message,
  walletAddress,
  userId = "default-user",
  stream = true,
  onStream,
  onAction,
  apiKey,
  clientId
}: NebulaRequestOptions) {
  // Client-side direct API call if API key is provided
  if (apiKey) {
    return sendDirectNebulaRequest({
      message,
      walletAddress,
      userId,
      stream,
      onStream,
      onAction,
      apiKey,
      clientId
    });
  }
  
  // Fall back to server-side API call if no API key is provided
  const response = await fetch("/api/nebula", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      walletAddress,
      userId,
      stream,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.statusText}\n${errorText}`);
  }

  if (stream) {
    return handleStreamingResponse(response, onStream, onAction);
  }

  const data = await response.json();
  return handleNebulaResponse(data);
}

// Direct API call function that bypasses our backend
async function sendDirectNebulaRequest({
  message,
  walletAddress,
  userId = "default-user",
  stream = true,
  onStream,
  onAction,
  apiKey,
  clientId
}: NebulaRequestOptions) {
  if (!apiKey) {
    throw new Error('API key is required for direct API calls');
  }

  console.log('Making direct Nebula API call with client-provided credentials');
  
  const response = await fetch("https://nebula-api.thirdweb.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": apiKey,
      // Add client ID if provided
      ...(clientId && { "x-client-id": clientId }),
    },
    body: JSON.stringify({
      message,
      user_id: userId,
      stream,
      execute_config: {
        mode: "client",
        signer_wallet_address: walletAddress,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nebula API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // Handle streaming response if streaming is enabled
  if (stream) {
    return handleStreamingResponse(response, onStream, onAction);
  }

  const data = await response.json();
  return handleNebulaResponse(data);
}

// Run test if this file is being executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log("Sending request to Nebula API...");
      const result = await sendNebulaRequest({
        message: "What is the current ETH price?",
        walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        userId: "test-user",
        stream: false
      });
      console.log("Test result:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Test failed:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  })();
}

// Example usage:
// await sendNebulaRequest("send 0.001 ETH on Sepolia to vitalik.eth", "0xYourWalletAddress"); 