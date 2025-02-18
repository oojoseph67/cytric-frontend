import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Play, Wallet } from "lucide-react";
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
            <div className="text-2xl font-bold">🎨</div>
            <ConnectButton />
          </nav>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
