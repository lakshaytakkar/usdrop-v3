import { LLCPage } from "./shared"

/* /llc — Overview subpage. Other subpages (documents/banking/payments/benefits)
   render <LLCPage tab=…/> directly from App.tsx routes, surfaced via the green
   LLC sub-nav group in navigation.ts. */
export default function MyLLCPage() {
  return <LLCPage tab="overview" />
}
