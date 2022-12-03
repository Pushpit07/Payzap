import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import chains from "../constants/chains.json";
import tokens from "../constants/tokens";
import Image from "next/image";
import QRCode from "react-qr-code";
import { useAccount, usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { TransactionRequest } from "@ethersproject/providers";
import { generateSteps } from "../utils/interaction";

const Home: NextPage = () => {
  const [txData, setTxData] = useState<{
    chainId: number;
    tokenAddress: string;
    amount: string;
    userAddress: string;
  }>();
  const [chainID, setChainID] = useState(137);
  const [tokenAddress, setTokenAddress] = useState(tokens[chainID][0].address);
  const [pay, setPay] = useState(true);
  const [amount, setAmount] = useState<number>();
  const [txRequest, setTxRequest] = useState<TransactionRequest>();
  const [qrdata, setQRData] = useState<{
    amount: number;
    chainID: number;
    tokenAddress: string;
    userAddress: string;
  }>();

  const account = useAccount();

  const { config, error } = usePrepareSendTransaction({
    request: {
      ...txRequest,
      to: txRequest?.to || "",
    },
  });

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config);

  useEffect(() => {
    if (txData && pay && account.address) {
      (async () => {
        if (!account.address) return;
        const steps = await generateSteps({
          fromChain: 137,
          fromToken: "",
          fromAddress: account.address,
          fromAmount: "1000",
          toChain: txData.chainId,
          toToken: txData.tokenAddress,
          toAddress: txData.userAddress,
          order: "RECOMMENDED",
        });
        setTxRequest(steps?.transactionRequest);
      })();
    }
  }, [txData, pay, account]);

  const Active =
    "flex flex-row justify-center items-center bg-purple text-white rounded-full px-4 py-1 text-lg";
  const InActive =
    "flex flex-row justify-center items-center bg-white text-purple rounded-full px-4 py-1 text-lg";

  function handleToggle() {
    setPay(!pay);
  }
  function generateQR() {
    if (!amount) {
      console.log("Not a valid amount");
      return;
    }
    if (amount <= 0) {
      console.log("Amount less than equal to zero");
      return;
    }
    setQRData({
      amount: amount,
      chainID: chainID,
      tokenAddress: tokenAddress,
      userAddress: "string",
    });
  }
  return (
    <div>
      <Head>
        <title>Payzap App</title>
        <meta name="description" content="Payzap your cross chain payment solution" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded-md w-96 px-8 py-4">
          <div className="flex flex-row justify-evenly">
            <div className={pay ? Active : InActive} onClick={() => handleToggle()}>
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
            <div className={!pay ? Active : InActive} onClick={() => handleToggle()}>
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
          {pay === true ? (
            <div className="flex flex-col justify-center items-center my-10">
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    setTxData(JSON.parse(result?.getText()));
                  }

                  if (!!error) {
                    // console.info(error);
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
              <div>
                <div>{txData?.tokenAddress}</div>
                <div>{txData?.amount}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center my-10">
              <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
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
                        {chains.chains.map((chain, index) => {
                          return (
                            <option key={index} value={chain.id}>
                              <div>
                                <Image
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
                        {tokens[chainID].map((token, index) => {
                          return (
                            <option key={index} value={token.address}>
                              <div>
                                <Image
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
