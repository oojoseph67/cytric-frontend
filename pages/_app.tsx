import { QueryProvider } from "@/modules/provider";
import "@/styles/globals.css";
import { config } from "@/utils/config/index.config";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryProvider>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
