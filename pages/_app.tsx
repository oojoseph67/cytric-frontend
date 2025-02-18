import "@/styles/globals.css";
import { QueryProvider } from "@/modules/provider";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { config } from "@/utils/config/index.config";
import "@rainbow-me/rainbowkit/styles.css";
import { GeistSans } from "geist/font/sans";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryProvider>
        <RainbowKitProvider>
          <main className={`${GeistSans.className} min-h-screen bg-[#0A0B0F]`}>
            <Component {...pageProps} />
          </main>
        </RainbowKitProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
