import { Suspense } from "react";
import OauthContentClient from "./oauth-content";

export default async function OauthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OauthContentClient />
    </Suspense>
  );
}
