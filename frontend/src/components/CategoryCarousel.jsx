import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const category = [
  { label: "Planning" },
  { label: "Multi-Mess" },
  { label: "Feedback" },
  { label: "Confirm Meals" },
  { label: "Preferences" },
  { label: "Mess Control" },
];

export default function CategoryCarousel() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-10">
          Explore Features
        </h2>

        <Carousel className="w-full">
          <CarouselContent>
            {category.map((cat) => (
              <CarouselItem
                key={cat.label}
                className="md:basis-1/2 lg:basis-1/3 flex justify-center cursor-pointer"
              >
                <Link to={'/'}></Link>
                <Button
                  variant="outline"
                  className="rounded-md px-6 py-4 text-sm md:text-base font-semibold
                  bg-white/80 border border-black/40
                  hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md"
                >
                  {cat.label}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-white/10 hover:bg-white/20 text-white backdrop-blur rounded-full" />
          <CarouselNext className="bg-white/10 hover:bg-white/20 text-white backdrop-blur rounded-full" />
        </Carousel>
      </div>
    </div>
  );
}
