import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Play, Rocket } from "lucide-react";
import Head from "next/head";
import { motion } from "framer-motion";
import NFTForm from "@/modules/components/NFTForm";
import NFTGallery from "@/modules/components/NFTGallery";

export default function Home() {
  const [mintedNFT, setMintedNFT] = useState<{
    name: string;
    description: string;
    imageUrl: string;
  } | null>(null);

  return (
    <>
      <Head>
        <title>Joseph Cytric NFT Minting Platform</title>
        <meta name="description" content="Mint your unique NFTs" />
      </Head>
      <main className="min-h-screen bg-[#0A0B0F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center justify-center w-6 h-6">
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-[#E559E5] to-[#7C3AED] px-6 py-3 rounded-full flex items-center gap-2 text-white font-medium hover:opacity-90 transition-opacity"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 4H2V20H22V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 8H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Connect Wallet
                          </button>
                        );
                      }

                      return (
                        <div className="flex gap-3">
                          <button
                            onClick={openChainModal}
                            className="bg-[#1A1B1F] px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-[#2A2B2F]"
                          >
                            {chain.hasIcon && (
                              <div style={{ width: 16, height: 16 }}>
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 16, height: 16 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            className="bg-[#1A1B1F] px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-[#2A2B2F]"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </nav>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-bold mb-4 text-white">
                Discover & Collect
                <br />
                Extraordinary NFTs
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Enter the world of digital art and collectibles. Explore unique
                NFTs created by artists worldwide.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    const formElement = document.getElementById("mint-form");
                    formElement?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-gradient-to-r from-[#E559E5] to-[#7C3AED] px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Rocket className="w-5 h-5" />
                  Start Creating
                </button>
                <button className="bg-[#1A1B1F] hover:bg-[#2A2B2F] px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <div id="mint-form" className="p-6">
              <NFTForm onSuccess={(nft) => setMintedNFT(nft)} />
            </div>

            <NFTGallery />
          </div>
        </div>
      </main>
    </>
  );
}
