import { useAppContext, useMarketplaceClient } from "@/components/providers/marketplace";
import {
  Collapsible,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useWebhookState } from "./webhook-hook";
import { Button } from "../ui/button";
import { createWebhookItem, updateWebhookItem } from "./webhook-actions";
import { type WebhookItem } from "./webhook-queries";

export const InitializationPage = () => {
  const appContext = useAppContext();
  const client = useMarketplaceClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [webhookItem, setWebhookItem] = useWebhookState(appContext, client);

  const actionResult = (resultItem?: WebhookItem, error?: string) => {
    if (resultItem && setWebhookItem) {
      setIsUpdating(true);
      setWebhookItem(resultItem);
      setIsUpdating(false);
    }
    if (error) {
      console.error(error);
    }
  }

  const handleCreate = async () => {
    const [resultItem, error] = await createWebhookItem(appContext, client);
    actionResult(resultItem, error);
  };

  const handleUpdate = async () => {
    const [resultItem, error] = await updateWebhookItem(appContext, client, webhookItem!);
    actionResult(resultItem, error);
  };

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="border-[1px] rounded-lg"
    >
      <dl>
        <dt>Item id:</dt>
        <dd>{webhookItem?.itemId}</dd>
      </dl>

      {isUpdating && <span>Updating...</span>}

      {webhookItem && <Button onClick={() => handleUpdate()} title="Update webhook">Update</Button>}
      {!webhookItem && <Button onClick={() => handleCreate()} title="Create webhook">Create</Button>}

    </Collapsible>
  );
};
