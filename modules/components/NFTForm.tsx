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
          <div className="aspect-[1.91/1] bg-gradient-to-r from-purple-500/30 to-pink-500/30" />
          <div className="p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">NFT Name</div>
              <div className="text-white text-lg font-semibold">Celestial Harmony #004</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Description</div>
              <div className="text-gray-300">A mesmerizing blend of cosmic elements and digital artistry</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">NFT ID</div>
              <div className="font-mono text-[#8B5CF6]">#8F3E2A1</div>
              <div className="font-mono text-[#8B5CF6]">D9C</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-[#1A1B1F] hover:bg-[#2A2B2F] py-3 rounded-xl flex items-center justify-center gap-2 text-white">
            <Share2 className="w-5 h-5" />
            Share
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your NFT"
            className="w-full bg-[#1A1B1F] border border-[#2A2B2F] rounded-xl p-4 text-white h-32 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Enter image URL"
            className="w-full bg-[#1A1B1F] border border-[#2A2B2F] rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#E559E5] to-[#7C3AED] py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Mint NFT
        </button>
      </form>
    </motion.div>
  );
}
