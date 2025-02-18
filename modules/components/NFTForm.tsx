import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/config/index.config";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  getContractConfig,
  NFT_CONTRACT_ADDRESS,
} from "../blockchain/index.blockchain";
import NFT_ABI from "@/utils/abi/NFT_ABI.json";

interface NFTFormProps {
  onSuccess: (nft: {
    name: string;
    description: string;
    imageUrl: string;
  }) => void;
}

export default function NFTForm({ onSuccess }: NFTFormProps) {
  const account = useAccount();
  const walletAddress = account.address;

  /**
   * STATES
   */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [mintedNFT, setMintedNFT] = useState<{
    name: string;
    description: string;
    imageUrl: string;
  } | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGenerateId] = useState<number>(
    Math.floor(Math.random() * 100000) + 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * BLOCKCHAIN DECLARATIONS
   */
  const nftMintingContract = getContractConfig(NFT_CONTRACT_ADDRESS, NFT_ABI);

  const {
    data: hash,
    isPending,
    writeContract,
    error: mintError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const {
    data: checkId,
    error: checkIdError,
    refetch,
  } = useReadContract({
    address: nftMintingContract.address,
    abi: nftMintingContract.abi,
    functionName: "checkId",
    args: [generatedId],
  });

  /**
   * USE EFFECTS
   */

  useEffect(() => {
    refetch();
  }, [generatedId]);

  useEffect(() => {
    if (isConfirmed) {
      setMintedNFT(formData);
      setIsSuccess(true);
      onSuccess(formData);
    }
  }, [isConfirmed]);

  /**
   * ON CLICKS
   */

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // step 1: validate
    if (checkId) {
      setGenerateId(Math.floor(Math.random() * 100000) + 1);
    }

    if (!formData.name || !formData.description || !formData.imageUrl) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // step 2: save to backend
      await axios.post(
        `${BACKEND_URL}/nfts`,
        {
          nftName: formData.name,
          nftDescription: formData.description,
          nftLogoUrl: formData.imageUrl,
          nftId: generatedId,
          userWallet: walletAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const metadataUrl = `${BACKEND_URL}/nfts/${generatedId}`;

      // step 3: initiate blockchain transaction
      await writeContract({
        address: nftMintingContract.address,
        abi: nftMintingContract.abi,
        functionName: "mint",
        args: [BigInt(generatedId), metadataUrl],
      });

      // Wait for transaction confirmation
      // if (isConfirmed) {
      //   // step 4: update UI only after confirmation
      //   setMintedNFT(formData);
      //   setIsSuccess(true);
      //   onSuccess(formData);
      // }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to mint NFT. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintAnother = () => {
    setIsSuccess(false);
    setMintedNFT(null);
    setFormData({ name: "", description: "", imageUrl: "" });
    setGenerateId(Math.floor(Math.random() * 100000) + 1);
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent(
      `I just minted an NFT!\n\n` +
        `Name: ${mintedNFT?.name}\n` +
        `Description: ${mintedNFT?.description}\n` +
        `NFT ID: #${generatedId}\n\n` +
        `#NFT #Blockchain #Cytric`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isCompleteLoading = isLoading || isConfirming || isPending;

  // Show different loading states based on the stage
  const getMintButtonText = () => {
    if (isPending) return "Confirm in Wallet...";
    if (isConfirming) return "Confirming Transaction...";
    if (isLoading) return "Preparing...";
    return "Mint NFT";
  };

  if (isSuccess && mintedNFT) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#13151A] rounded-2xl p-8 max-w-xl mx-auto border border-[#4ADE80]"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-[#1E3A2F] rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-[#4ADE80]" />
          </div>
        </div>
        <h3 className="text-[#4ADE80] text-2xl font-bold text-center mb-2">
          NFT Minted Successfully!
        </h3>
        <p className="text-gray-400 text-center text-sm mb-6">
          Your NFT has been created and added to your collection
        </p>

        <div className="bg-[#1A1B1F] rounded-xl overflow-hidden mb-6">
          {/* <div className="aspect-[1.91/1] bg-gradient-to-r from-purple-500/30 to-pink-500/30" /> */}
          <div className="aspect-square relative">
            <img
              src={mintedNFT.imageUrl}
              alt={mintedNFT.name}
              className="w-full h-full object-cover"
              id={`nft-image-${generatedId}`}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = "https://picsum.photos/400";
                img.dataset.isFallback = "true";
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-black/75 text-xs text-white py-1 px-2 text-center opacity-0 transition-opacity"
              style={{
                opacity: document.querySelector(
                  `#nft-image-${generatedId}[data-is-fallback="true"]`
                )
                  ? 1
                  : 0,
              }}
            >
              Default Image (Original Not Found)
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">NFT Name</div>
              <div className="text-white text-lg font-semibold">
                {mintedNFT.name}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Description</div>
              <div className="text-gray-300">{mintedNFT.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">NFT ID</div>
              <div className="font-mono text-[#8B5CF6]">#{generatedId}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleShare}
            className="flex-1 bg-[#1A1B1F] hover:bg-[#2A2B2F] py-3 rounded-xl flex items-center justify-center gap-2 text-white"
          >
            <Share2 className="w-5 h-5" />
            Share on Twitter
          </button>
          <button
            onClick={handleMintAnother}
            className="flex-1 bg-gradient-to-r from-[#E559E5] to-[#7C3AED] hover:opacity-90 py-3 rounded-xl text-white font-medium"
          >
            Mint Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#13151A] rounded-2xl p-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Mint Your NFT</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleMintNFT} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">NFT Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter NFT name"
            className="w-full bg-[#1A1B1F] border border-[#2A2B2F] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your NFT"
            className="w-full bg-[#1A1B1F] border border-[#2A2B2F] rounded-xl p-4 text-white h-32 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => {
              const url = e.target.value;
              setFormData({ ...formData, imageUrl: url });
            }}
            onBlur={(e) => {
              const url = e.target.value;
              if (url && !isValidUrl(url)) {
                e.target.setCustomValidity("Please enter a valid URL");
                e.target.reportValidity();
              } else {
                e.target.setCustomValidity("");
              }
            }}
            placeholder="Enter image URL"
            pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
            title="Please enter a valid URL starting with http:// or https://"
            className="w-full bg-[#1A1B1F] border border-[#2A2B2F] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
        <button
          type="submit"
          disabled={isCompleteLoading}
          className={`w-full bg-gradient-to-r from-[#E559E5] to-[#7C3AED] py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${
            isCompleteLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isCompleteLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {getMintButtonText()}
            </>
          ) : (
            "Mint NFT"
          )}
        </button>
      </form>
    </motion.div>
  );
}
