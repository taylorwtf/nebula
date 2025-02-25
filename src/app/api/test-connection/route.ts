import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, clientId } = body;

    if (!apiKey || !clientId) {
      return NextResponse.json(
        { error: 'API Key and Client ID are required' },
        { status: 400 }
      );
    }

    // Simple validation of key format - not checking actual validity yet
    if (!apiKey.startsWith('sk') || apiKey.length < 20) {
      return NextResponse.json(
        { error: 'Invalid API Key format' },
        { status: 400 }
      );
    }

    // Make a test request to Nebula API using the chat endpoint with a minimal payload
    try {
      console.log('Testing Nebula API connection with provided credentials...');
      
      const response = await fetch("https://nebula-api.thirdweb.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": apiKey,
          ...(clientId && { "x-client-id": clientId }),
        } as HeadersInit,
        body: JSON.stringify({
          message: "Hello", // Simple test message
          user_id: "test-user",
          stream: false,
          execute_config: {
            mode: "client",
            signer_wallet_address: "0x0000000000000000000000000000000000000000", // Dummy address for testing
          },
        }),
      });

      // Log response details for debugging
      console.log('API test response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Nebula API test failed:', errorText);
        
        return NextResponse.json(
          { error: 'API key validation failed. Please check your credentials.' },
          { status: 401 }
        );
      }

      // Just need to verify we get a 200 response
      console.log('API test succeeded');
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Nebula API test error:', error);
      return NextResponse.json(
        { error: 'Could not connect to Nebula API. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in test-connection API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 