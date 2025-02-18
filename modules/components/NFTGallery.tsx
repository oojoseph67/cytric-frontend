import { BACKEND_URL } from "@/utils/config/index.config";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export interface NFTGallery {
  _id: string;
  nftDescription: string;
  nftId: number;
  nftLogoUrl: string;
  nftName: string;
  userWallet: string;
}

export default function NFTGallery() {
  const account = useAccount();
  const walletAddress = account.address;

  const [userNFTs, setUserNFTs] = useState<NFTGallery[]>([]);
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!walletAddress) return;

      setFetchError("");

      try {
        const nftsResponse = await axios.get(
          `${BACKEND_URL}/nfts/findByWallet?userWallet=${walletAddress.toLowerCase()}`
        );
        setUserNFTs(nftsResponse.data as NFTGallery[]);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to fetch NFTs"
        );
        setUserNFTs([]);
      } 
    };

    fetchUserNFTs();
    
    const interval = setInterval(fetchUserNFTs, 5000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  console.log({ userNFTs });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Your NFT Gallery</h2>
      {fetchError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          Error: {fetchError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userNFTs.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No NFTs found, please mint your first one using the widget above
          </div>
        ) : (
          userNFTs.map((nft) => (
            <motion.div
              key={nft.nftId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1B1F] rounded-xl overflow-hidden border border-[#2A2B2F] hover:border-purple-500/50 transition-colors"
            >
              <div className="aspect-square relative">
                <img
                  src={nft.nftLogoUrl}
                  alt={nft.nftName}
                  className="w-full h-full object-cover"
                  id={`nft-image-${nft.nftId}`}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://picsum.photos/400";
                    img.dataset.isFallback = "true";
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-black/75 text-xs text-white py-1 px-2 text-center opacity-0 transition-opacity"
                  style={{ 
                    opacity: document.querySelector(`#nft-image-${nft.nftId}[data-is-fallback="true"]`) ? 1 : 0
                  }}
                >
                  Default Image (Original Not Found)
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{nft.nftName}</h3>
                <p className="text-gray-400 text-sm">{nft.nftDescription}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
