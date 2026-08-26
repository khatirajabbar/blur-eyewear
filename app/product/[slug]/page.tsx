import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { ProductDetail } from "@/components/product/product-detail";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
