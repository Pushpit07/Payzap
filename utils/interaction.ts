import LIFI, { QuoteRequest, Route, TokensRequest } from "@lifi/sdk";
import { Signer } from "ethers";

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

export const transact = async (signer: Signer, route: Route) => {
  return await lifi.executeRoute(signer, route);
};

export const getChains = async () => {
  return await lifi.getChains();
};

export const getTokens = async (tokensRequest: TokensRequest) => {
  return await lifi.getTokens(tokensRequest);
};
