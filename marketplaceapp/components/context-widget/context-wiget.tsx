"use client";

import { useEffect, useState } from 'react';
import { type PagesContext, type ApplicationContext } from '@sitecore-marketplace-sdk/client';
import { useAppContext, useMarketplaceClient } from "@/components/providers/marketplace";
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
import { getItems, type ChangeModel } from '@/lib/api';

async function fetchData(appContext?: ApplicationContext, pageContext?: PagesContext, filters?: Record<string, unknown>) {
    if (!appContext?.installationId || !pageContext?.pageInfo?.id) {
        return {};
    }
    const data = await getItems(appContext.installationId, [pageContext?.pageInfo?.id]);

    const versionsData = Object.groupBy(data, x => x.webHookData.item.version);
    const workflowData = Object.groupBy(data.filter(x => !!x.workflowStateId), x => x.workflowStateId!);
    return {data, versionsData, workflowData};
}

function PageContextWidget() {
    const client = useMarketplaceClient();
    const appContext = useAppContext();

    const [page, setPage] = useState<PagesContext>();
    const [data, setData] = useState<ChangeModel[]>();

    useEffect(() => {
        client.query("pages.context", {
            subscribe: true,
            onSuccess: data => {
                setData(undefined);
                setPage(undefined);

                setPage(data?.pageInfo);
                fetchData(appContext, data?.pageInfo, {}).then(x => {
                    setData(x.data);
                });
            },
            onError: err => {
                setPage(undefined);
                setData(undefined);
                console.warn(err);
            },
        });
    }, [client, appContext, page]);

    if (!page || !data) {
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
                data={data}
                showFieldChanges={true}
                debounceTime={500}
                emptyStateMessage="No actions found matching your criteria"
                openFiltersByDefault={false}
            />
        </>
    );
}

export default PageContextWidget;
