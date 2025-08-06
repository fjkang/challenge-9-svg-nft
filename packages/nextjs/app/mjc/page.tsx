"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const MahJongCoin: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [allMahJongCoin, setAllMahJongCoin] = useState<any[]>();
  const [page, setPage] = useState(1n);
  const [loadingMahJongCoin, setLoadingMahJongCoin] = useState(true);
  const perPage = 12n;

  const { data: price } = useScaffoldReadContract({
    contractName: "MahJongNFT",
    functionName: "price",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "MahJongNFT",
    functionName: "totalSupply",
  });

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "MahJongNFT" });

  const { data: contract } = useScaffoldContract({
    contractName: "MahJongNFT",
  });

  useEffect(() => {
    const updateAllMahJongCoin = async () => {
      setLoadingMahJongCoin(true);
      if (contract && totalSupply) {
        const collectibleUpdate = [];
        const startIndex = totalSupply - 1n - perPage * (page - 1n);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            const tokenId = await contract.read.tokenByIndex([tokenIndex]);
            const tokenURI = await contract.read.tokenURI([tokenId]);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              collectibleUpdate.push({ id: tokenId, uri: tokenURI, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
        console.log("Collectible Update: ", collectibleUpdate);
        setAllMahJongCoin(collectibleUpdate);
      }
      setLoadingMahJongCoin(false);
    };
    updateAllMahJongCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSupply, page, perPage, Boolean(contract)]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="relative w-48 h-48 -m-12">
          <Image alt="Mahjong" className="cursor-pointer" fill src="/baida.svg" />
        </div>
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">MahJongCoin</span>
          </h1>
          <div className="text-center">
            <div>Only 3728 MahJongCoin available on a price curve increasing 0.2% with each new mint.</div>
          </div>
          <div className="flex flex-col justify-center items-center mt-6 space-x-2">
            <button
              onClick={async () => {
                try {
                  await writeContractAsync({
                    functionName: "mintItem",
                    value: price,
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
              className="btn btn-primary"
              disabled={!connectedAddress || !price}
            >
              Mint Now for {price ? (+formatEther(price)).toFixed(6) : "-"} ETH
            </button>
            <p>{Number(3728n - (totalSupply || 0n))} MahJongCoin left</p>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-4 p-8">
          <div className="flex justify-center items-center space-x-2">
            {loadingMahJongCoin ? (
              <p className="my-2 font-medium">Loading...</p>
            ) : !allMahJongCoin?.length ? (
              <p className="my-2 font-medium">No MahJongCoin minted</p>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
                  {allMahJongCoin.map(mahjong => {
                    return (
                      <div
                        key={mahjong.id}
                        className="flex flex-col bg-base-100 p-5 text-center items-center max-w-xs rounded-3xl"
                      >
                        <h2 className="text-xl font-bold">{mahjong.name}</h2>
                        <Image src={mahjong.image} alt={mahjong.name} width="300" height="300" />
                        <p>{mahjong.description}</p>
                        <Address address={mahjong.owner} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-8">
                  <div className="join">
                    {page > 1n && (
                      <button className="join-item btn" onClick={() => setPage(page - 1n)}>
                        «
                      </button>
                    )}
                    <button className="join-item btn btn-disabled">Page {page.toString()}</button>
                    {totalSupply !== undefined && totalSupply > page * perPage && (
                      <button className="join-item btn" onClick={() => setPage(page + 1n)}>
                        »
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MahJongCoin;
