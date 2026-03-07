"use client"

import { InitializationPage } from "@/components/initialization/InitializationPage"
import { FilterTable } from "@/components/filter-table"
import { fetchDataWithFilters } from "@/components/filter-table/test-data"

function Standalone() {
  return (
    <>
      <InitializationPage />
      <div className="container mx-auto max-w-3xl space-y-8 p-6">
        <FilterTable
          data={fetchDataWithFilters}
          showFieldChanges={true}
          debounceTime={500}
          emptyStateMessage="No actions found matching your criteria"
        />
      </div>
    </>
  )
}

export default Standalone
