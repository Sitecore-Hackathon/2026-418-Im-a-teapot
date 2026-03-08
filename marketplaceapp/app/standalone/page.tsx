"use client";

import { InitializationPage } from "@/components/initialization/InitializationPage";
import { MarketplaceProvider } from "@/components/providers/marketplace";
import StandaloneWidget from '@/components/standalone-app/standalone';

function Standalone() {

  return (
    <MarketplaceProvider>
      <InitializationPage />
      <StandaloneWidget />
    </MarketplaceProvider>
  );
}

export default Standalone;
