import { ShopPageContent } from "@/components/product/shop-page-content";
import { products } from "@/data/products";

export const metadata = { title: "Shop — BLUR" };

export default function ShopPage() {
  return <ShopPageContent productCount={products.length} />;
}
