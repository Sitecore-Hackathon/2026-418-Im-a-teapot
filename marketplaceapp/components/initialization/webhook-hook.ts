import { useEffect, useState } from "react";
import {
    type ApplicationResourceContext,
} from "@sitecore-marketplace-sdk/core";
import {
    type ApplicationContext,
    ClientSDK,
} from "@sitecore-marketplace-sdk/client";
import { XMC } from "@sitecore-marketplace-sdk/xmc";
import { readWebhookQuery, type WebhookItem } from "./webhook-queries";

async function fetchItem(client: ClientSDK, xmCloudResourceAccess: ApplicationResourceContext) {
    const sitecoreContextId = xmCloudResourceAccess.context.preview;
    console.log(readWebhookQuery);

    const response: any = await client.query("xmc.authoring.graphql", {
        params: {
            query: { sitecoreContextId },
            body: {
                query: readWebhookQuery
            }
        }
    });
    const resultItem: WebhookItem = response?.data?.data?.data?.item;
    return resultItem;
}

export const useWebhookState = (appContext: ApplicationContext, client: ClientSDK) => {

    const [item, setItem] = useState<WebhookItem | null>(null);

    useEffect(() => {
        const xmCloudResourceAccess = appContext?.resourceAccess?.[0];
        if (!client || !xmCloudResourceAccess) {
            return;
        }

        fetchItem(client, xmCloudResourceAccess).then(result => setItem(result));

    }, [client, appContext]);

    return [item]
};