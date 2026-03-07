import {
    type ApplicationContext,
    ClientSDK,
} from "@sitecore-marketplace-sdk/client";
import { makeCreateWebhookQuery, makeUpdateWebhookQuery, WebhookItem } from "./webhook-queries";

export async function createWebhookItem(appContext: ApplicationContext, client: ClientSDK): Promise<[WebhookItem?, string?]> {
    const xmCloudResourceAccess = appContext?.resourceAccess?.[0];
    const sitecoreContextId = xmCloudResourceAccess?.context.preview;
    const instanceId = appContext?.installationId;

    if (!sitecoreContextId || !instanceId) {
        return [undefined, "Missing context id or item"];
    }

    const request = makeCreateWebhookQuery(sitecoreContextId, instanceId);

    const response: any = await client.mutate("xmc.authoring.graphql", {
        params: request,
    });
    const error = response?.error ?? response?.data?.errors;
    const resultItem: WebhookItem = response?.data?.data?.data?.item;

    console.debug('Creating webhook for Marketplace', {
        resultItem,
        error,
        response,
        request,
    });
    return [
        resultItem, error
    ];
}

export async function updateWebhookItem(appContext: ApplicationContext, client: ClientSDK, existingItem: WebhookItem): Promise<[WebhookItem?, string?]> {
    const xmCloudResourceAccess = appContext?.resourceAccess?.[0];
    const sitecoreContextId = xmCloudResourceAccess?.context.preview;
    const instanceId = appContext?.installationId;

    if (!sitecoreContextId || !instanceId || !existingItem?.itemId) {
        return [undefined, "Missing context id or item"];
    }

    const request = makeUpdateWebhookQuery(sitecoreContextId, instanceId, existingItem.itemId)
    const response: any = await client.mutate("xmc.authoring.graphql", {
        params: request,
    });
    const error = response?.error ?? response?.data?.errors;
    const resultItem: WebhookItem = response?.data?.data?.data?.item;

    console.debug('Updating webhook for Marketplace', {
        resultItem,
        error,
        response,
        request,
    });
    return [
        resultItem, error
    ];
}

