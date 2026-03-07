import {
    type ApplicationContext,
    ClientSDK,
} from "@sitecore-marketplace-sdk/client";
import { createWebhookQuery, updateWebhookQuery, WebhookItem } from "./webhook-queries";

export async function createWebhookItem(appContext: ApplicationContext, client: ClientSDK) : Promise<[WebhookItem?, string?]> {
    const xmCloudResourceAccess = appContext?.resourceAccess?.[0];
    const sitecoreContextId = xmCloudResourceAccess?.context.preview;
    if(!sitecoreContextId) {
        return [undefined, "Missing context id or item"];
    }

    const response: any = await client.mutate("xmc.authoring.graphql", {
        params: {
            query: { sitecoreContextId },
            body: {
                query: createWebhookQuery,
            }
        }
    });
    const error = response?.error ?? response?.data?.errors;
    const resultItem: WebhookItem = response?.data?.data?.data?.item;
    return [
        resultItem, error
    ];
}

export async function updateWebhookItem(appContext: ApplicationContext, client: ClientSDK, existingItem: WebhookItem): Promise<[WebhookItem?, string?]> {
    const xmCloudResourceAccess = appContext?.resourceAccess?.[0];
    const sitecoreContextId = xmCloudResourceAccess?.context.preview;
    if(!sitecoreContextId || !existingItem?.itemId) {
        return [undefined, "Missing context id or item"];
    }

    console.log(updateWebhookQuery);

    const response: any = await client.mutate("xmc.authoring.graphql", {
        params: {
            query: { sitecoreContextId },
            body: {
                query: updateWebhookQuery,
                variables: {
                    itemId: existingItem.itemId
                }
            }
        }
    });
    const error = response?.error ?? response?.data?.errors;
    const resultItem: WebhookItem = response?.data?.data?.data?.item;
    return [
        resultItem, error
    ];
}

