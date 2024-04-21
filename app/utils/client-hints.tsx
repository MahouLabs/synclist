import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getHintUtils } from "@epic-web/client-hints";
import {
  clientHint as colorSchemeHint,
  subscribeToSchemeChange,
} from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";
import { useRevalidator } from "@remix-run/react";
import * as React from "react";

const hintsUtils = getHintUtils({
  theme: { ...colorSchemeHint, fallback: "dark" },
  timeZone: timeZoneHint,
  // add other hints here
});

export const { getHints } = hintsUtils;

export function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}

export function ClientHintCheck({ nonce }: { nonce: string }) {
  const { revalidate } = useRevalidator();
  React.useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);

  return (
    <script
      nonce={nonce}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trust
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}
