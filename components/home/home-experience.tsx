import Link from "next/link";
import type { CSSProperties } from "react";
import { products } from "@/data/products";
import { ProductVisual } from "@/components/product/product-visual";

export function HomeExperience() {
  return (
    <main className="collection-home" id="collection">
      <section className="collection-index" aria-labelledby="collection-title">
        <div className="collection-heading">
          <p>collection 01 / 01</p>
          <h1 id="collection-title">Frames</h1>
          <span>10</span>
        </div>

        <div className="index-rail" aria-label="The BLUR collection">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="index-object"
              style={{ "--index": index } as CSSProperties}
              aria-label={`Open ${product.name}`}
            >
              <ProductVisual product={product} priority={index < 3} />
            </Link>
          ))}
        </div>

        <Link href="/shop" className="collection-cta">10 frames <span>enter collection</span></Link>
      </section>
    </main>
  );
}
