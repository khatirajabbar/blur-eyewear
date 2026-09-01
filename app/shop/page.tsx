import { ShopGrid } from "@/components/product/shop-grid";
import { products } from "@/data/products";
export const metadata = { title: "Shop — BLUR" };

export default function ShopPage() {
  return <main className="collection-page"><header className="collection-page-header"><p>collection 01 / 01</p><h1>All looks</h1><span>{products.length}</span></header><ShopGrid /></main>;
}
