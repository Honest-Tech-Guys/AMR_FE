"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
export default function CarouselWithPagination() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className=" max-w-lg">
      <Carousel setApi={setApi} className="w-full py-5  max-w-lf">
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="bg-transparent  border-0 py-0">
                <CardContent className=" text-white ">
                  <p className="text-xl  font-semibold">
                    Malaysia’s Leading Rental
                  </p>
                  <p className="text-xl  font-semibold">Management Platform</p>
                  <p>
                    Simplify your rental operations with our all-in-one system —
                    trusted, efficient, and built for your success.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className=" flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn("h-2 w-10 rounded-full  transition-colors", {
              "bg-muted": current === index + 1, // selected
              "bg-white/50 ": current !== index + 1, // unselected
            })}
          />
        ))}
      </div>
    </div>
  );
}
