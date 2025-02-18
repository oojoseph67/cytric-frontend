import { motion } from "framer-motion";
const SAMPLE_NFTS = [
  {
    id: "001",
    name: "Cosmic Dreams #001",
    description: "A journey through digital dimensions",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "002",
    name: "Neo Genesis #002",
    description: "Digital evolution manifested",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "003",
    name: "Digital Horizon #003",
    description: "Where reality meets digital art",
    image: "https://picsum.photos/200",
  },
];

export default function NFTGallery() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Your NFT Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_NFTS.map((nft) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1B1F] rounded-xl overflow-hidden border border-[#2A2B2F] hover:border-purple-500/50 transition-colors"
          >
            <div className="aspect-square">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
              <p className="text-gray-400 text-sm">{nft.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
