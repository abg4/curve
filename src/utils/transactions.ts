import curve from "@curvefi/api";
import { type Address, type Chain } from "viem";
import { encodeFunctionData, parseAbiItem, parseUnits } from "viem/utils";
import { CURVE_ROUTER } from "./constants.js";
import { CURVE_ROUTER_ABI } from "./abi.js";
import { logger } from "./logger.js";

// Function to generate the calldata for the approve function
export function generateApproveCallData(spender: Address, amount: bigint) {
  // Generate the calldata for the approve function
  const approveCallData = encodeFunctionData({
    abi: [parseAbiItem("function approve(address spender, uint256 value)")],
    args: [spender, amount],
  });

  return approveCallData;
}

// Generates the swap call data for Curve swap
export async function generateSwapCallData(
  amount: string,
  tokenIn: { address: Address, decimals: number },
  tokenOut: { address: Address, decimals: number },
  recipient: Address,
  chain: Chain,
  initialQuote: boolean,
  privateKey: string
) {
  try {

    await curve.init('JsonRpc', {url: chain.rpcUrls.default.http[0], privateKey}, { chainId: chain.id });
    await curve.stableNgFactory.fetchPools();
  
    const { route } = await curve.router.getBestRouteAndOutput(tokenIn.address, tokenOut.address, amount);  
    const expected = await curve.router.expected(tokenIn.address, tokenOut.address, amount);
    await curve.router.required(tokenIn.address, tokenOut.address, expected);
  
    const args = curve.router.getArgs(route);
    
    // Convert amount to bigint (already scaled, just handle decimal precision)
    const amountBigInt = BigInt(Math.floor(parseFloat(amount)));
    
    // Convert expected output to bigint (already scaled, just handle decimal precision)
    const expectedBigInt = BigInt(Math.floor(parseFloat(expected.toString())));
    // Use 99% of expected as minimum output (1% slippage tolerance)
    const minDy = expectedBigInt * BigInt(99) / BigInt(100);

    // Encode the exchange function call with proper parameter mapping
    const swapCallData = encodeFunctionData({
      abi: CURVE_ROUTER_ABI,
      functionName: 'exchange',
      args: [
        args._route,           // _route parameter
        args._swapParams,      // _swap_params parameter  
        amountBigInt,          // _amount parameter
        minDy,                 // _min_dy parameter
        args._pools,           // _pools parameter (5th overload)
        recipient              // _receiver parameter (6th overload)
      ],
    });

    logger.json(initialQuote ? "Initial swap data: " : "Updated swap data: ", {
      inputToken: tokenIn,
      amount: amount,
      outputToken: tokenOut,
      to: CURVE_ROUTER,
      callData: swapCallData,
    });

    return { calldata: swapCallData, to: CURVE_ROUTER };
  } catch (error) {
    console.error("Error generating swap call data:", error);
    throw error;
  }
}
