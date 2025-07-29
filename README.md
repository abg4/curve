# curve-swap-example

> **Disclaimer**: This code is provided for reference purposes only. It is not intended for production use and comes with no warranties or guarantees. Please ensure proper testing and security audits before using any code in a production environment.

A proof-of-concept implementation for bridging and swapping tokens using Across Protocol and Curve.

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env` file in the root directory:

The ORIGIN_RPC_URL and DESTINATION_RPC_URL are optional. If not selected,
default rpcs will be used.

```env
PRIVATE_KEY=your_private_key_here
ORIGIN_RPC_URL=your_rpc_url_here
DESTINATION_RPC_URL=your_rpc_url_here
```

## Usage

3. To execute a transaction, run:

```bash
yarn start
```

This will:
1. Bridge USDC from Base to Arbitrum using Across Protocol
2. Approve the Curve router contract to spend the received tokens
3. Swap the bridged USDC tokens to USDe via Curve
