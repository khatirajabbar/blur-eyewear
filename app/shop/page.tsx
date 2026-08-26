import { ShopGrid } from "@/components/product/shop-grid";
import { Grain } from "@/components/ui/grain";

export const metadata = { title: "Shop — BLUR" };

export default function ShopPage() {
  return <main className="shop-page page-shell"><Grain /><header className="route-header"><p className="eyebrow">THE COMPLETE STUDY</p><h1>ALL <i>OBJECTS</i></h1><p>Twenty ways to interrupt a familiar silhouette.</p></header><ShopGrid /></main>;
}
