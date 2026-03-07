"use client";

import { MarketplaceProvider } from "@/components/providers/marketplace";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineVersions, dummyVersionsData } from "@/components/timeline-versions/timeline-version";
import { FilterTable } from "@/components/filter-table";
import { fetchDataWithFilters } from "@/components/filter-table/test-data";

function PageContext() {

    return (
        <MarketplaceProvider>
            <Tabs defaultValue="versions" className="">
                <TabsList>
                    <TabsTrigger value="versions">Versions</TabsTrigger>
                    <TabsTrigger value="workflow">Workflows</TabsTrigger>
                </TabsList>
                <TabsContent value="versions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Versions</CardTitle>
                            <CardDescription>
                                <TimelineVersions versions={dummyVersionsData} />
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </TabsContent>
                <TabsContent value="workflow">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflows</CardTitle>
                            <CardDescription>
                                Similar with workflows....
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
            <FilterTable
                data={fetchDataWithFilters}
                showFieldChanges={true}
                debounceTime={500}
                emptyStateMessage="No actions found matching your criteria"
            />
        </MarketplaceProvider>
    );
}

export default PageContext;
