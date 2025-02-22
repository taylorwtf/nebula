# Nebula Chat

By [TAYLOR.WTF](https://taylor.wtf)

A modern, real-time chat interface for interacting with blockchain data using ThirdWeb's Nebula API. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Nebula Chat](public/screenshot.png)

## Features

- 🌐 Real-time blockchain data interaction
- 💬 Streaming chat responses with markdown support
- 🎨 Beautiful, responsive UI with dark mode
- 🔒 Secure wallet connection via ThirdWeb
- ⚡ Real-time response streaming with typing indicators
- 📝 Multi-line message input support
- ⏱️ Response time tracking
- 🎯 Support for blockchain transactions and actions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ThirdWeb SDK
- **Markdown**: React-Markdown with GFM support
- **State Management**: React Hooks
- **API Integration**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn
- A ThirdWeb account and API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/taylorwtf/nebula.git
cd nebula
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEBULA_API_KEY=your_nebula_api_key
NEXT_PUBLIC_NEBULA_CLIENT_ID=your_nebula_client_id (thirdweb client id)
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:
- `NEBULA_API_KEY`: Your ThirdWeb Nebula API key for chat functionality
- `NEXT_PUBLIC_NEBULA_CLIENT_ID`: Your ThirdWeb Nebula Client ID

You can obtain these from the [ThirdWeb Dashboard](https://thirdweb.com/dashboard/settings/api-keys)

## Project Structure

```
src/
├── app/                # Next.js app router files
├── components/         # React components
│   ├── chat/          # Chat-related components
│   └── navbar/        # Navigation components
├── lib/               # Utility functions and API clients
└── types/             # TypeScript type definitions
```

## Key Components

- `ChatContainer`: Main chat interface container
- `MessageList`: Handles message display and thinking indicators
- `MessageInput`: Multi-line input with Shift+Enter support
- `MessageBubble`: Renders messages with markdown support
- `WalletButton`: ThirdWeb wallet connection

## Features in Detail

### Real-time Response Streaming
- Server-Sent Events (SSE) for real-time updates
- Live typing indicators with timing
- Response time tracking

### Markdown Support
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Links with custom styling
- Headers and formatting

### Wallet Integration
- Secure wallet connection via ThirdWeb
- Support for multiple wallet providers
- Transaction signing capabilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ThirdWeb](https://thirdweb.com/) for the Nebula API
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Next.js](https://nextjs.org/) for the React framework
