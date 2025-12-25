import GuestLoginForm from "@/feature/auth/guest.login.form";
import { Suspense } from "react";

export default function TableNumberPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableContent />
    </Suspense>
  );
}

function TableContent() {
  return <GuestLoginForm />;
}
