import { createAuthClient } from "better-auth/react";
import { twoFactorClient, adminClient } from "better-auth/client/plugins";

import { ac, roles } from "@/features/auth/lib/permissions";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),

    adminClient({
      ac,
      roles,
    }),
  ],
});
