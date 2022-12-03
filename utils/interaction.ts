import LIFI, { QuoteRequest, TokensRequest } from "@lifi/sdk";

const lifi = new LIFI({
  defaultRouteOptions: {
    order: "RECOMMENDED",
    infiniteApproval: true,
    allowSwitchChain: true,
  },
});

export const generateSteps = async (payRequest: QuoteRequest) => {
  try {
    return await lifi.getQuote(payRequest);
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getChains = async () => {
  return await lifi.getChains();
};

export const getTokens = async (tokensRequest: TokensRequest) => {
  return await lifi.getTokens(tokensRequest);
};
