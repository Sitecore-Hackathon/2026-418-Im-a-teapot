"use client";

import { useEffect, useState } from 'react';
import { type PagesContext } from '@sitecore-marketplace-sdk/client';
import { useMarketplaceClient } from "@/components/providers/marketplace";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineVersions, dummyVersionsData } from "@/components/timeline-versions/timeline-version";
import { FilterTable } from "@/components/filter-table";
import { fetchDataWithFilters } from "@/components/filter-table/test-data";

function PageContextWidget() {
    const client = useMarketplaceClient();
    const [page, setPage] = useState<PagesContext>();

    const getData = (filters: Record<string, unknown>) => {
        return fetchDataWithFilters(filters);
    };

    useEffect(() => {
        client.query("pages.context", {
            subscribe: true,
            onSuccess: data => {
                setPage(undefined);
                setTimeout(() => setPage(data?.pageInfo), 500)
            },
            onError: err => {
                setPage(undefined);
                console.warn(err);
            },
        });
    }, [client]);

    if (!page) {
        return <Spinner variant="primary" />;
    }

    return (
        <>
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
                data={getData}
                showFieldChanges={true}
                debounceTime={500}
                emptyStateMessage="No actions found matching your criteria"
                openFiltersByDefault={false}
            />
        </>
    );
}

export default PageContextWidget;
