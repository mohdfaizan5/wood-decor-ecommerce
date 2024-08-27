import ProductCard from "../product-card";
import prisma from "@/lib/db";

export default async function Featured() {
  const products = await prisma.product.findMany({
    take: 4,
    // where: {
    //   isFeatured: true,
    // },
  });

  return (
    <section
      id="collection"
      className="flex flex-col items-center justify-center mt-10 md:mt-20 border-b-2"
    >
      <div className="text-center capitalize">
        <h1>Featured products</h1>
        <p className="text-sm ">Impressive collection for your dream home</p>
      </div>

      <div className="flex flex-wrap max-w-[1280px] gap-4 mt-10 md:mt-16 mb-10 md:mb-20 ">
        {products.map((item, i) => (
          <ProductCard key={i} data={item} />
        ))}
      </div>
    </section>
  );
}