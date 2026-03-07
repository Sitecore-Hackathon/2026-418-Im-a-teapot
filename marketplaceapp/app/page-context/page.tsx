"use client";

import { MarketplaceProvider } from "@/components/providers/marketplace";
import PageContextWidget from '@/components/context-widget/context-wiget';

function PageContext() {
    return (
        <MarketplaceProvider>
            <PageContextWidget />
        </MarketplaceProvider>
    );
}

export default PageContext;
