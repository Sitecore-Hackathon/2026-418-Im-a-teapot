# Marketplace app

This is the Sitecore Marketplace App for SitecoreAI

It is built-on on 

* [Sitecore Marketplace SDK](https://doc.sitecore.com/mp/en/developers/sdk/latest/)
* [Sitecore Blok Designsystem](https://blok.sitecore.com/) which is based on [shadcn](https://www.shadcn.io/) and [tailwindcss](https://tailwindcss.com/)
* [Next.js](https://nextjs.org/) to build a client-side SSG site (without any serverside rendering)


## Using Blok

### Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add https://blok.sitecore.com/r/button.json
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
