import { Button } from "@/components/ui/button";
import dishRequest from "@/lib/api/dish.request";

export default async function Home() {
  const res = await dishRequest.list();
  const dishList = res.payload.data;
  console.log(dishList);
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      quality over quantity
    </div>
  );
}
