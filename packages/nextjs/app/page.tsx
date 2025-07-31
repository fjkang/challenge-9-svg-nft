"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
            <span className="block text-xl font-bold">(SpeedRunEthereum Challenge: Svg NFT extension)</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <div className="flex items-center flex-col flex-grow pt-10">
            <div className="px-5">
              <h1 className="text-center mb-6">
                <span className="block text-2xl mb-2">SpeedRunEthereum</span>
                <span className="block text-4xl font-bold">Challenge: ⚖️ 🎁 SVG NFT</span>
              </h1>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/hero.png"
                  width="727"
                  height="231"
                  alt="challenge banner"
                  className="rounded-xl border-4 border-primary"
                />
                <div className="max-w-3xl">
                  <p className="mt-8">
                    🎨 Creating on-chain SVG NFTs is an exciting way to leverage the power of smart contracts for
                    generating unique digital art. This challenge will have you build a contract that generates dynamic
                    SVG images directly on the blockchain. Users will be able to mint their own unique NFTs with
                    customizable SVG graphics and metadata.
                  </p>
                  <p>
                    🌟 Use{" "}
                    <Link href="/loogies" className="underline">
                      Loogies
                    </Link>{" "}
                    as an example to guide your project. This will provide a solid foundation and inspiration for
                    creating your own dynamic SVG NFTs.
                  </p>
                  <p className="mt-8">
                    💬 Meet other builders working on this challenge and get help in the{" "}
                    <a href="https://t.me/+mUeITJ5u7Ig0ZWJh" target="_blank" rel="noreferrer" className="underline">
                      🎁 SVG NFT 🎫 Building Cohort
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
