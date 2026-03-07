"use client";

import { InitializationPage } from "@/components/initialization/InitializationPage";
import { FilterTable } from "@/components/filter-table";
import { fetchDataWithFilters } from "@/components/filter-table/test-data";
import { MarketplaceProvider } from "@/components/providers/marketplace";

function Standalone() {
  return (
    <MarketplaceProvider>
      <InitializationPage />
      <div className="">
        <FilterTable
          data={fetchDataWithFilters}
          showFieldChanges={true}
          debounceTime={500}
          emptyStateMessage="No actions found matching your criteria"
        />
      </div>
    </MarketplaceProvider>
  );
}

export default Standalone;
