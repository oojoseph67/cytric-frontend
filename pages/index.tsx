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
import { BACKEND_URL } from "@/utils/config/index.config";

interface NFTGallery {
  _id: string;
  nftDescription: string;
  nftId: number;
  nftLogoUrl: string;
  nftName: string;
  userWallet: string;
}

export default function Home() {
  const [name, setName] = useState("Cool NFT Image");
  const [description, setDescription] = useState("Cool NFT Image for Cytric");
  const [imageUrl, setImageUrl] = useState(
    "https://images.app.goo.gl/98dgUoyEywAhPk7X7"
  );

  const [userNFTs, setUserNFTs] = useState<NFTGallery[]>();
  const [tryCatchError, setTryCatchError] = useState("");

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
      const nftsResponse = await axios.get(
        `${BACKEND_URL}/nfts/findByWallet?userWallet=${walletAddress}`
      );

      const data = nftsResponse.data as NFTGallery[];

      setUserNFTs(data);
    };

    fetchUserNFTs();
  }, [isConfirmed, isConfirming]);

  const mintNFT = async () => {
    // step 1
    if (checkId) {
      setGenerateId(Math.floor(Math.random() * 100000) + 1);
    }

    // step 2
    try {
      await axios
        .post(
          `${BACKEND_URL}/nfts`,
          {
            nftName: name,
            nftDescription: description,
            nftLogoUrl: imageUrl,
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
    <div>
      <p> Hello Wrld</p>
      <ConnectButton />
      <button onClick={mintNFT}>Click me</button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {mintError && (
        <div>
          Error: {(mintError as BaseError).shortMessage || mintError.message}
        </div>
      )}
    </div>
  );
}
