import Home from "@/feature/homepage";
import dishRequest from "@/lib/api/dish.request";

export default async function HomePage() {
  const res = await dishRequest.list({ page: 1, take: 500 });
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Home dishList={res?.payload?.data ?? []} />
    </div>
  );
}
