import { Suspense } from "react";
import OauthContent from "./oauth-content";

export default function OauthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OauthContent />
    </Suspense>
  );
}
