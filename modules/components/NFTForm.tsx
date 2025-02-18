import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";

interface NFTFormProps {
  onSuccess: (nft: {
    name: string;
    description: string;
    imageUrl: string;
  }) => void;
}

export default function NFTForm({ onSuccess }: NFTFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{
    name: string;
    description: string;
    imageUrl: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMintedNFT(formData);
    setIsSuccess(true);
    onSuccess(formData);
  };

  const handleMintAnother = () => {
    setIsSuccess(false);
    setMintedNFT(null);
    setFormData({ name: "", description: "", imageUrl: "" });
  };

  if (isSuccess && mintedNFT) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#1A1B1F] rounded-2xl p-8 mb-16 border border-[#4ADE80]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#1E3A2F] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </div>
        <h3 className="text-white text-2xl font-bold text-center mb-2">
          NFT Minted Successfully!
        </h3>
        <p className="text-gray-400 text-center text-sm mb-8">
          Your NFT has been created and added to your collection
        </p>

        <div className="bg-[#13151A] rounded-2xl overflow-hidden mb-8">
          <img
            src={mintedNFT.imageUrl}
            alt={mintedNFT.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">NFT Name</div>
              <div className="text-lg font-semibold">{mintedNFT.name}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Description</div>
              <div className="text-gray-300">{mintedNFT.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">NFT ID</div>
              <div className="font-mono text-[#8B5CF6]">#8F3E2A1</div>
              <div className="font-mono text-[#8B5CF6]">D9C</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {}}
            className="flex-1 bg-[#13151A] hover:bg-[#1A1D23] py-3 rounded-2xl flex items-center justify-center gap-2 border border-[#2A2B2F] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={handleMintAnother}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-2xl font-medium transition-all"
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
      className="bg-[#1A1B1F] rounded-2xl p-8 mb-16 border border-[#2A2B2F]"
    >
      <h2 className="text-2xl font-bold mb-6">Mint Your NFT</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">NFT Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter NFT name"
            className="w-full bg-[#13151A] border border-[#2A2B2F] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your NFT"
            className="w-full bg-[#13151A] border border-[#2A2B2F] rounded-xl p-4 text-white h-24 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Enter image URL"
            className="w-full bg-[#13151A] border border-[#2A2B2F] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          Mint NFT
        </button>
      </form>
    </motion.div>
  );
}
