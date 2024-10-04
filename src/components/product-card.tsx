import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Product } from "@prisma/client";
import AddToCartBtn from "./add-to-cart-btn";
import BuyNowBtn from "./buy-now-btn";
import StarRating from "./star-rating";

export default function ProductCard({ data }: { data: Product }) {
  const {
    category,
    colors,
    description,
    discountedPrice,
    id,
    image,
    label,
    price,
    slug,
    title,
    rating,
  } = data;

  console.log(`/products/${slug}`);

  return (
    <Card className="w-40 rounded-xl md:w-72 h-[300px]  md:h-[460px] mx-1  bg-white/30 ">
      <CardHeader className="h-[50%] md:h-[60%] overflow-hidden p-0">
        <Link
          href={`/products/${slug}`}
          className="rounded-xl md:mb-2 w-full h-[150px] md:h-[260px] hover:scale-105 transition-all duration-300"
        >
          <Image
            className="h-full w-full object-cover rounded-t-xl"
            width={270}
            height={260}
            src={image}
            alt="Sofa set"
          />
        </Link>
        {/* <CardTitle></CardTitle> */}
        {/* 
        <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="m-0 ">
        <div className="mt-1 items-center px-4 md:px-8">
          <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
          <h2 className=" opacity-80 text-lg md:text-3xl">
            <span className="text-base md:text-xl font-semibold">₹</span>
            {price}
          </h2>
          
          <StarRating rating={rating > 3 ? rating : 4} />

          {/* <p className="text-xs">More options</p> */}
        </div>
      </CardContent>
      <CardFooter className="md:space-x-4 px-1 md:px-8 mt-4 md:mt-6">
        <BuyNowBtn product={{ id, image, price, title }} />
        <AddToCartBtn product={{ id, image, price, title }} />
      </CardFooter>
    </Card>
  );
}
