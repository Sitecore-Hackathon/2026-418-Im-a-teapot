import { useAppContext, useMarketplaceClient } from "@/components/providers/marketplace";
import {
  Collapsible,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useWebhookState } from "./webhook-hook";

export const InitializationPage = () => {
  const appContext = useAppContext();
  const client = useMarketplaceClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [webhookItem] = useWebhookState(appContext, client);
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

    </Collapsible>
  );
};
