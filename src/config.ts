import { base, arbitrum } from "viem/chains";
import { parseUnits, type Address } from "viem";

/**
 * CURVE CONFIGURATION
 *
 * This section contains information that Curve already has in its UI.
 */

// Swap amount in USDC to be used for bridge transaction.
// Scaled below via the bridgeAmount
const swapAmount = 2;

// Destination chain where funds are received and the Curve swap is made.
const destinationChain = arbitrum;

// Token used as input for the Curve swap on the destination chain.
const curveTokenIn = {
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as Address,
  decimals: 6,
};

// Token used as output for the Curve swap on the destination chain.
const curveTokenOut = {
  address: "0x12275DCB9048680c4Be40942eA4D92c74C63b844" as Address,
  decimals: 18,
};

/**
 * ACROSS CONFIGURATION
 *
 * This section contains new parameters to use for Across.
 */

// Origin chain where the Across deposit is made by the user.
const originChain = base;

// Origin deposit token used for the Across deposit.
// This should be the same asset (USDC, WETH, WBTC, etc.) as the Curve origin token.
const originDepositToken = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address,
  decimals: 6,
};

// scale the input amount to the input token decimals
const bridgeAmount = parseUnits(swapAmount.toString(), curveTokenIn.decimals);

export {
  originChain,
  destinationChain,
  originDepositToken,
  curveTokenIn,
  curveTokenOut,
  bridgeAmount,
};
