"use client";

import { useEffect, useState } from 'react';
import { useAppContext, useMarketplaceClient } from "@/components/providers/marketplace";
import { FilterTable } from "@/components/filter-table";
import { Spinner } from "@/components/ui/spinner";
import { getItems, type ChangeModel } from '@/lib/api';


function Standalone() {

    const client = useMarketplaceClient();
    const appContext = useAppContext();

    const [data, setData] = useState<ChangeModel[]>();

    useEffect(() => {
        if (!appContext?.installationId) {
            return;
        }

        getItems(appContext.installationId, []).then(x => setData(x));
    }, [client, appContext]);


    if (!data) {
        return <Spinner variant="primary" />;
    }

    return (

        <div className="">
            <FilterTable
                data={data}
                showFieldChanges={true}
                debounceTime={500}
                emptyStateMessage="No actions found matching your criteria"
                openFiltersByDefault={true}
            />
        </div>
    );
}

export default Standalone;
