export const NFT_CONTRACT_ADDRESS =
  "0x743F49311A82fe72eb474c44e78Da2A6e0AE951c";

export function getContractConfig<TAbi extends readonly unknown[]>(
  contractAddress: `0x${string}`, 
  abi: TAbi
) {
  return {
    address: contractAddress,
    abi: abi,
  } as const;
}
