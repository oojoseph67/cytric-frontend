import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

// export const BACKEND_URL = "http://localhost:8888";
export const BACKEND_URL = "https://cytric-backend-ocff.onrender.com";

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
