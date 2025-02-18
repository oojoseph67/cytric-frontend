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

export default function Home() {
  const [name, setName] = useState("Cool NFT Image");
  const [description, setDescription] = useState("Cool NFT Image for Cytric");
  const [imageUrl, setImageUrl] = useState(
    "https://images.app.goo.gl/98dgUoyEywAhPk7X7"
  );

  const [generatedId, setGenerateId] = useState<number>(
    Math.floor(Math.random() * 100000) + 1
  );

  console.log({ name, description, imageUrl, generatedId });

  const account = useAccount();
  const walletAddress = account.address;
  console.log({ account });

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

  console.log({ hash, isPending });

  const { data: balance, error: balanceError } = useReadContract({
    address: nftMintingContract.address,
    abi: nftMintingContract.abi,
    functionName: "balanceOf",
    args: ["0x8e0474682D32EfC6304C5DF2d94DbEd82e011973"],
  });

  console.log({ balance, balanceError });

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

  console.log({ checkId, error });

  const mintNFT = async () => {
    // step 1
    // generate and check id

    if (checkId) {
      setGenerateId(Math.floor(Math.random() * 100000) + 1);
    }

    // step 2
    // call backend api
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
        console.log({ response });
      })
      .catch((error) => {
        // show error toast
        console.log({ error });
      });

    const metadataUrl = `${BACKEND_URL}/nfts/${generatedId}`;

    // step 3
    // mint the nft
    // submit uid, and url (get url by id from task 1)

    writeContract({
      address: nftMintingContract.address,
      abi: nftMintingContract.abi,
      functionName: "mint",
      args: [BigInt(generatedId), metadataUrl],
    });
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
