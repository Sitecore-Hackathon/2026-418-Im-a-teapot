const webhookItemPath = '/sitecore/system/Webhooks/Marketplace Auditor';

export const readWebhookQuery = `
query ReadAuditorWebhook {
    item(where: {
        path: "${webhookItemPath}"
    }) {
        itemId
        name
        description:field(name:"Description") { value }
        events:field(name:"Events") { value }
        rule:field(name:"Rule") { value }
        enabled:field(name:"Enabled") { value }
        url:field(name:"Url") { value }
        type:field(name:"Serialization Type") { value }
    }
}`;

export type ItemId = string;

export type FieldValue = {
    value: string;
};

export type WebhookItem = {
    itemId: ItemId;
    name: string;
    description: FieldValue;
    events: FieldValue;
    rule: FieldValue;
    enabled: FieldValue;
    url: FieldValue;
    type: FieldValue;
};
