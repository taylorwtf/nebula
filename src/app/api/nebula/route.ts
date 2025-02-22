import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEBULA_API_KEY || !process.env.NEXT_PUBLIC_NEBULA_CLIENT_ID) {
  throw new Error('Missing required environment variables. Please check your .env file.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, walletAddress, userId = "default-user", stream = true } = body;

    if (!message || !walletAddress) {
      console.error('Missing required fields:', { message, walletAddress });
      return NextResponse.json(
        { error: 'message and walletAddress are required' },
        { status: 400 }
      );
    }

    // Ensure API key is available
    const apiKey = process.env.NEBULA_API_KEY;
    if (!apiKey) {
      console.error('API key is missing');
      throw new Error('API key is required');
    }

    console.log('Sending request to Nebula API:', {
      message,
      userId,
      stream,
      walletAddress: walletAddress.slice(0, 6) + '...' // Log partial address for privacy
    });

    const response = await fetch("https://nebula-api.thirdweb.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": apiKey,
      } as HeadersInit,
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

    // Log response status and headers for debugging
    console.log('Nebula API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nebula API error:', errorText);
      throw new Error(`Nebula API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // If streaming is enabled, pipe the response directly
    if (stream) {
      const headers = new Headers();
      headers.set('Content-Type', 'text/event-stream');
      headers.set('Cache-Control', 'no-cache');
      headers.set('Connection', 'keep-alive');

      // Ensure we have a readable body before creating the stream response
      if (!response.body) {
        throw new Error('No response body from Nebula API');
      }

      const streamResponse = new NextResponse(response.body, {
        status: 200,
        headers,
      });

      return streamResponse;
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Nebula API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 