import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import QRCode from "react-qr-code";
import {
  erc20ABI,
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { generateSteps, getChains, getTokens, transact } from "../utils/interaction";
import { useEnsName } from "wagmi";
import { useEnsAvatar } from "wagmi";
import { ExtendedChain, Token } from "@lifi/sdk";
import { Contract } from "ethers";

const Home: NextPage = () => {
  const [txData, setTxData] = useState<{
    chainId: number;
    tokenAddress: string;
    amount: string;
    userAddress: string;
  }>();
  const [chains, setChains] = useState<ExtendedChain[]>();
  const [chainID, setChainID] = useState(1);
  const [tokens, setTokens] = useState<Token[]>();
  const [tokenAddress, setTokenAddress] = useState<string>();
  const [pay, setPay] = useState(true);
  const [amount, setAmount] = useState<number>();
  const [txRequest, setTxRequest] = useState<TransactionRequest>();
  const [qrdata, setQRData] = useState<{
    amount: number;
    chainId: number;
    tokenAddress: string;
    userAddress: string;
  }>();

  const account = useAccount();
  const { data: reciverENSName } = useEnsName({
    address: (txData?.userAddress || "") as `0x${string}`,
    chainId: 1,
  });
  const { data: reciverENSAvatar, isLoading: isENSAvatarLoading } = useEnsAvatar({
    address: (txData?.userAddress || "") as `0x${string}`,
    chainId: 1,
  });
  const { config } = usePrepareSendTransaction({
    request: {
      ...txRequest,
      to: txRequest?.to || "",
    },
  });
  const { isLoading, isSuccess, sendTransaction } = useSendTransaction(config);
  const { data: signer } = useSigner({ chainId: chainID });
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    (async () => {
      const chains = await getChains();
      setChains(chains);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (chainID) {
        switchNetwork?.(chainID);
        const tokens = await getTokens({ chains: [chainID] });
        setTokens(tokens.tokens[chainID].filter((token) => token.priceUSD === "1"));
        setTokenAddress(tokens.tokens[chainID][0].address);
      }
    })();
  }, [chainID]);

  useEffect(() => {
    (async () => {
      if (!txData) return;
      await swapAndPay(txData);
    })();
  }, [chainID, tokenAddress]);

  const swapAndPay = async (txData: {
    chainId: number;
    tokenAddress: string;
    amount: string;
    userAddress: string;
  }) => {
    if (!account.address || !tokenAddress) return;
    console.log("fetching routes");
    const steps = await generateSteps({
      fromChain: chainID,
      fromToken: tokenAddress,
      fromAddress: account.address,
      fromAmount: txData.amount.toString(),
      toChain: txData.chainId,
      toToken: txData.tokenAddress,
      toAddress: txData.userAddress,
      order: "RECOMMENDED",
    });
    console.log("routes =>", steps);
    if (!steps) return;
    setTxRequest(steps.transactionRequest);
  };

  const Active =
    "flex flex-row justify-center items-center bg-purple text-white rounded-full px-4 py-1 text-lg cursor-pointer";
  const InActive =
    "flex flex-row justify-center items-center bg-white text-purple rounded-full px-4 py-1 text-lg cursor-pointer";

  const generateQR = async () => {
    if (!amount || amount <= 0) {
      console.log("Not a valid amount");
      return;
    }
    if (!account.address) {
      console.log("Not a valid account address");
      return;
    }
    if (!tokenAddress || !signer) return;
    const erc20 = new Contract(tokenAddress, erc20ABI, signer);
    const balanceBefore = await erc20.balanceOf(account.address);
    setQRData({
      amount: amount,
      chainId: chainID,
      tokenAddress: tokenAddress || "",
      userAddress: account.address,
    });
    let balanceAfter = await erc20.balanceOf(account.address);
    while (balanceBefore == balanceAfter) {
      balanceAfter = await erc20.balanceOf(account.address);
    }
    //SUCCESS
  };
  return (
    <div>
      <Head>
        <title>Payzzy App</title>
        <meta name="description" content="Payzzy your cross chain payment solution" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded-md w-96 px-8 py-4">
          <div className="flex flex-row justify-evenly">
            <div className={pay ? Active : InActive} onClick={() => setPay(!pay)}>
              Pay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 ml-1"
              >
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={!pay ? Active : InActive} onClick={() => setPay(!pay)}>
              Recieve
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 7.5v-.75zm9.75 0A.75.75 0 0116.5 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm9.75 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm-3 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {pay ? (
            <div className="flex flex-col justify-center items-center my-10">
              {!txData ? (
                <QrReader
                  onResult={async (result) => {
                    if (!!result) {
                      const txData = JSON.parse(result?.getText());
                      setTxData(txData);
                      await swapAndPay(txData);
                    }
                  }}
                  className="w-full aspect-square"
                  videoStyle={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "1px",
                  }}
                  constraints={{ aspectRatio: 1 / 1, facingMode: "environment" }}
                />
              ) : (
                <div className="flex flex-col justify-center items-center text-center w-full">
                  <h1 className="text-sm uppercase">Paying</h1>
                  <h1 className="font-black text-black text-7xl">{txData?.amount}</h1>
                  <h1 className="text-sm uppercase">to</h1>
                  <h1>{!isENSAvatarLoading && reciverENSAvatar}</h1>
                  <div className="flex flex-row justify-center items-center py-1.5">
                    <Image
                      alt="Reciever Name"
                      src={
                        reciverENSAvatar
                          ? reciverENSAvatar
                          : "https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png"
                      }
                      width={35}
                      height={35}
                    />
                    <h1
                      className={`text-gray-600 text-lg ml-2 ${!reciverENSName && "truncate w-52"}`}
                    >
                      {!reciverENSName ? txData?.userAddress : reciverENSName}
                    </h1>
                  </div>
                  {isLoading ? (
                    <div>Loading</div>
                  ) : (
                    <>
                      <div className="w-full">
                        <label className="w-full text-sm" htmlFor="chains">
                          Select a chain
                        </label>
                        <select
                          className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mb-2 text-base"
                          name="chains"
                          id="chains"
                          onChange={(e) => setChainID(Number(e.target.value))}
                        >
                          {chains?.map((chain, index) => {
                            return (
                              <option key={index} value={chain.id}>
                                <div>
                                  <img
                                    src={chain.logoURI}
                                    alt={chain.name}
                                    height={24}
                                    width={24}
                                  />
                                  {chain.name}
                                </div>
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="text-sm" htmlFor="chains">
                          Select a token
                        </label>
                        <select
                          className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mb-2 text-base"
                          name="chains"
                          id="chains"
                          onChange={(e) => setTokenAddress(e.target.value)}
                        >
                          {tokens?.map((token, index) => {
                            return (
                              <option key={index} value={token.address}>
                                <div>
                                  <img
                                    src={token.logoURI}
                                    alt={token.name}
                                    height={24}
                                    width={24}
                                  />
                                  {token.symbol}
                                </div>
                              </option>
                            );
                          })}
                        </select>
                        <div className="w-full rounded-md bg-purple py-3 mt-4">
                          <button
                            disabled={!sendTransaction}
                            className="w-full text-white text-lg"
                            onClick={async () => {
                              if (!tokenAddress || !signer) return;
                              const erc20 = new Contract(tokenAddress, erc20ABI, signer);
                              const allowance = await erc20.approve(txRequest?.to, txData.amount);
                              await allowance.wait();
                              sendTransaction?.();
                            }}
                          >
                            {isLoading ? "Check Wallet" : "PAY"}
                          </button>
                        </div>
                        {isSuccess && (
                          <>
                            <div className="flex flex-row justify-center items-center w-full bg-green-600 py-2 rounded-sm mt-2 text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Payment is successfully completed
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center my-10">
              <div style={{ height: "auto", margin: "0 auto", width: "100%" }}>
                {qrdata ? (
                  <QRCode
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                      borderRadius: "15px",
                    }}
                    value={JSON.stringify(qrdata)}
                    viewBox={`0 0 256 256`}
                  />
                ) : (
                  <>
                    <div className="w-full">
                      <label className="w-full text-sm" htmlFor="chains">
                        Select a chain
                      </label>
                      <select
                        className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mb-2 text-base"
                        name="chains"
                        id="chains"
                        onChange={(e) => setChainID(Number(e.target.value))}
                      >
                        {chains?.map((chain, index) => {
                          return (
                            <option key={index} value={chain.id}>
                              <div>
                                <img src={chain.logoURI} alt={chain.name} height={24} width={24} />
                                {chain.name}
                              </div>
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="text-sm" htmlFor="chains">
                        Select a token
                      </label>
                      <select
                        className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mb-2 text-base"
                        name="chains"
                        id="chains"
                        onChange={(e) => setTokenAddress(e.target.value)}
                      >
                        {tokens?.map((token, index) => {
                          return (
                            <option key={index} value={token.address}>
                              <div>
                                <img src={token.logoURI} alt={token.name} height={24} width={24} />
                                {token.symbol}
                              </div>
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="w-full text-sm" htmlFor="chains">
                        Enter the amount
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-base"
                        placeholder="Enter the amount"
                        onChange={(e) => setAmount(e.currentTarget.valueAsNumber)}
                      />
                    </div>
                    <div className="w-full rounded-md bg-purple py-3 mt-4">
                      <button className="w-full text-white text-lg" onClick={() => generateQR()}>
                        Generate QR
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
