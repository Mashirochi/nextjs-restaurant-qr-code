"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DishSchema } from "@/type/schema/dish.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getVietnameseDishStatus } from "@/lib/utils";
import envConfig from "@/lib/validateEnv";
import { z } from "zod";
import { DishTypeValues } from "@/type/schema/dish.schema";
import { useState } from "react";

interface HomeProps {
  dishList: z.infer<typeof DishSchema>[]; // Array of dish objects directly
}

export default function Home(props: HomeProps) {
  const { dishList } = props;
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Filter dishes by selected type
  const filteredDishList = selectedType
    ? dishList.filter((dish) => dish.type === selectedType)
    : dishList;

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Delicious Dishes</h1>
        <p className="text-lg text-muted-foreground">
          Discover our amazing selection of culinary delights
        </p>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => setSelectedType(null)}
          className="rounded-full"
        >
          All Types
        </Button>
        {DishTypeValues.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            className="rounded-full"
          >
            {type}
          </Button>
        ))}
      </div>

      {filteredDishList && filteredDishList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishList.map((dish) => {
            return (
              <Card key={dish.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Avatar className="w-full h-48 rounded-t-lg rounded-b-none">
                      <AvatarImage
                        src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${dish.image}`}
                        alt={dish.name}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback className="rounded-t-lg rounded-b-none bg-muted">
                        {dish.name}
                      </AvatarFallback>
                    </Avatar>
                    <Badge
                      className="absolute top-2 right-2"
                      variant={
                        dish.status === "Available" ? "default" : "secondary"
                      }
                    >
                      {getVietnameseDishStatus(dish.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <CardTitle className="mb-2">{dish.name}</CardTitle>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold">
                        {formatCurrency(
                          Number(dish.basePrice ?? dish.virtualPrice)
                        )}
                      </p>
                    </div>
                    {dish.basePrice &&
                      Number(dish.basePrice) !== Number(dish.virtualPrice) && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Original
                          </p>
                          <p className="font-semibold text-muted-foreground line-through">
                            {formatCurrency(Number(dish.virtualPrice))}
                          </p>
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Order Now</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No dishes available</h2>
          <p className="text-muted-foreground">
            Please check back later for our delicious offerings
          </p>
        </div>
      )}
    </div>
  );
}
