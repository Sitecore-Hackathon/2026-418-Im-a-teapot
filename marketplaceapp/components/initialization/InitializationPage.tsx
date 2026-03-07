import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/lib/icon";
import { mdiAlertOutline, mdiCheckCircleOutline } from "@mdi/js";
import { useAppContext, useMarketplaceClient } from "@/components/providers/marketplace";
import { useWebhookState } from "./webhook-hook";
import { createWebhookItem, updateWebhookItem } from "./webhook-actions";
import { type WebhookItem } from "./webhook-queries";

export const InitializationPage = () => {
  const appContext = useAppContext();
  const client = useMarketplaceClient();
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
  };

  const handleCreate = async () => {
    const [resultItem, error] = await createWebhookItem(appContext, client);
    actionResult(resultItem, error);
  };

  const handleUpdate = async () => {
    const [resultItem, error] = await updateWebhookItem(appContext, client, webhookItem!);
    actionResult(resultItem, error);
  };

  const stateOk = webhookItem?.enabled;
  const stateText = stateOk ? 'Configured' : 'Not configured';

  return (<Dialog>
    <DialogTrigger asChild>
      <Button colorScheme={stateOk ? "success" : "danger"}>
        <Icon path={stateOk ? mdiCheckCircleOutline : mdiAlertOutline} className="mr-2" />
        {stateText}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Webhook installation status</DialogTitle>
        <DialogDescription>Install or update webhook integration</DialogDescription>
      </DialogHeader>

      <dl>
        <dt>Item id:</dt>
        <dd>{webhookItem?.itemId}</dd>
        <dt>Enabled:</dt>
        <dd>{webhookItem?.enabled?.value ? 'true' : 'false'}</dd>

      </dl>

      {isUpdating && <span>Updating...</span>}

      {webhookItem && <Button onClick={() => handleUpdate()} title="Update webhook">Update</Button>}
      {!webhookItem && <Button onClick={() => handleCreate()} title="Create webhook">Create</Button>}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" colorScheme="neutral">
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};
