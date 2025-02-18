import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

export const BACKEND_URL = "http://localhost:8888";

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
