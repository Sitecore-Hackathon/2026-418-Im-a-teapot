"use client";

import { InitializationPage } from "@/components/initialization/InitializationPage";
import { FilterTable } from "@/components/filter-table"
import { fetchDataWithFilters } from "@/components/filter-table/test-data"

function Standalone() {
  return (<>

    <InitializationPage />
    <div className="container mx-auto p-6 space-y-8 max-w-3xl">
        <FilterTable
          data={fetchDataWithFilters}
          showFieldChanges={true}
          serverSideFiltering={true}
          debounceTime={500}
          emptyStateMessage="No actions found matching your criteria"
        />
    </div>
  </>);
}

export default Standalone;
