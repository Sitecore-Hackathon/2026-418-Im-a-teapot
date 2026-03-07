"use client";

import { MarketplaceProvider } from "@/components/providers/marketplace";

function WidgetDefault() {
    return (
        <MarketplaceProvider>
            <div>
                Default
            </div>
        </MarketplaceProvider>
    );
}

export default WidgetDefault;
