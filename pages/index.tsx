import {
  getContractConfig,
  NFT_CONTRACT_ADDRESS,
} from "@/modules/blockchain/index.blockchain";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  type BaseError,
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import NFT_ABI from "@/utils/abi/NFT_ABI.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { Play, Wallet } from "lucide-react";
import { BACKEND_URL } from "@/utils/config/index.config";
import Head from "next/head";
import { motion } from "framer-motion";
import NFTForm from "@/modules/components/NFTForm";
import NFTGallery from "@/modules/components/NFTGallery";

interface NFTGallery {
  _id: string;
  nftDescription: string;
  nftId: number;
  nftLogoUrl: string;
  nftName: string;
  userWallet: string;
}

export default function Home() {
  // const [name, setName] = useState("Cool NFT Image");
  // const [description, setDescription] = useState("Cool NFT Image for Cytric");
  // const [imageUrl, setImageUrl] = useState(
  //   "https://images.app.goo.gl/98dgUoyEywAhPk7X7"
  // );

  const [mintedNFT, setMintedNFT] = useState<{
    name: string;
    description: string;
    imageUrl: string;
  } | null>(null);

  const [userNFTs, setUserNFTs] = useState<NFTGallery[]>();
  const [tryCatchError, setTryCatchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string>("");

  console.log({ userNFTs });

  const [generatedId, setGenerateId] = useState<number>(
    Math.floor(Math.random() * 100000) + 1
  );

  const account = useAccount();
  const walletAddress = account.address;

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
    error,
    refetch,
  } = useReadContract({
    address: nftMintingContract.address,
    abi: nftMintingContract.abi,
    functionName: "checkId",
    args: [generatedId],
  });

  useEffect(() => {
    refetch();
  }, [generatedId]);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!walletAddress) return;

      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();
  }, [walletAddress, isConfirmed]);

  const mintNFT = async () => {
    // step 1
    if (checkId) {
      setGenerateId(Math.floor(Math.random() * 100000) + 1);
    }

    if (!mintedNFT?.name || !mintedNFT.description || !mintedNFT.imageUrl)
      return;

    // step 2
    try {
      await axios
        .post(
          `${BACKEND_URL}/nfts`,
          {
            nftName: mintedNFT.name,
            nftDescription: mintedNFT.description,
            nftLogoUrl: mintedNFT.imageUrl,
            nftId: generatedId,
            userWallet: walletAddress,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // console.log({ response });
        })
        .catch((error) => {
          // show error toast
          // console.log({ error });
        });

      const metadataUrl = `${BACKEND_URL}/nfts/${generatedId}`;

      // step 3
      writeContract({
        address: nftMintingContract.address,
        abi: nftMintingContract.abi,
        functionName: "mint",
        args: [BigInt(generatedId), metadataUrl],
      });
    } catch (error: any) {
      setTryCatchError(error);
    }
  };

  return (
    <>
      <Head>
        <title>NFT Minting Platform</title>
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
                Enter the world of digital art and collectibles. Explore unique NFTs created by artists worldwide.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => {
                    const formElement = document.getElementById('mint-form');
                    formElement?.scrollIntoView({ behavior: 'smooth' });
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

            <div id="mint-form">
              <NFTForm onSuccess={(nft) => setMintedNFT(nft)} />
            </div>

            <NFTGallery />
          </div>
        </div>
      </main>
    </>
  );
}
