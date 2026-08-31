export type Product = {
  id: string;
  slug: string;
  code: string;
  name: string;
  priceUSD: number;
  description: string;
  frameColor: string;
  lensColor: string;
  dimensions: string;
  material: string;
  fit: string;
  inventory: number;
  primaryImage: string;
  galleryImages: string[];
};

type ProductSeed = Omit<Product, "id" | "slug" | "primaryImage" | "galleryImages"> & {
  asset: string;
  sideAsset?: string;
};

const productSeeds: ProductSeed[] = [
  { asset: "NIGHTSHIFT", code: "BLR-01", name: "Nightshift", priceUSD: 168, description: "Low black acetate, cut close to the face.", frameColor: "Gloss black acetate", lensColor: "Black smoke", dimensions: "146mm / 35mm / 128mm", material: "Bio-acetate / UV400 lens", fit: "Narrow / medium", inventory: 8 },
  { asset: "CIRRUS", code: "BLR-02", name: "Cirrus", priceUSD: 176, description: "Transparent sky-blue volume with an icy lens.", frameColor: "Crystal sky acetate", lensColor: "Pale blue", dimensions: "148mm / 39mm / 130mm", material: "Crystal acetate / UV400 lens", fit: "Medium", inventory: 7 },
  { asset: "HALO", sideAsset: "Halo", code: "BLR-03", name: "Halo", priceUSD: 192, description: "A narrow silver orbit with a violet cast.", frameColor: "Polished titanium", lensColor: "Lilac gradient", dimensions: "145mm / 34mm / 130mm", material: "Titanium / UV400 lens", fit: "Narrow / medium", inventory: 5 },
  { asset: "MERCURY RED", code: "BLR-04", name: "Mercury Red", priceUSD: 198, description: "Liquid-silver structure with a red optical field.", frameColor: "Brushed aluminium", lensColor: "Deep red mirror", dimensions: "151mm / 37mm / 132mm", material: "Aluminium / UV400 lens", fit: "Medium / wide", inventory: 4 },
  { asset: "POLAR STATIC", code: "BLR-05", name: "Polar Static", priceUSD: 184, description: "Black structure, high-energy cobalt lens.", frameColor: "Gloss black nylon", lensColor: "Electric blue mirror", dimensions: "154mm / 40mm / 133mm", material: "Recycled nylon / UV400 lens", fit: "Medium / wide", inventory: 9 },
  { asset: "CLEARCUT", code: "BLR-06", name: "Clearcut", priceUSD: 172, description: "A barely-there rectangle held by a precise metal line.", frameColor: "Clear acetate / titanium", lensColor: "Soft graphite", dimensions: "143mm / 36mm / 126mm", material: "Titanium / UV400 lens", fit: "Narrow", inventory: 6 },
  { asset: "EMBER WING", code: "BLR-07", name: "Ember Wing", priceUSD: 181, description: "A dark wing with a translucent cherry-red lens.", frameColor: "Black acetate", lensColor: "Cherry red", dimensions: "147mm / 38mm / 129mm", material: "Bio-acetate / UV400 lens", fit: "Medium", inventory: 7 },
  { asset: "SALTFRAME", code: "BLR-08", name: "Saltframe", priceUSD: 188, description: "Pearl metal around a softly smoked rectangle.", frameColor: "Pearl silver", lensColor: "Cool grey", dimensions: "149mm / 42mm / 131mm", material: "Stainless steel / UV400 lens", fit: "Medium", inventory: 5 },
  { asset: "THORNLINE", code: "BLR-09", name: "Thornline", priceUSD: 194, description: "A precise titanium cat-eye with engineered points.", frameColor: "Polished titanium", lensColor: "Clear smoke", dimensions: "144mm / 37mm / 127mm", material: "Titanium / UV400 lens", fit: "Narrow / medium", inventory: 4 },
  { asset: "VAPOR", code: "BLR-10", name: "Vapor", priceUSD: 178, description: "A clear technical wrap with a warm translucent tint.", frameColor: "Crystal smoke acetate", lensColor: "Warm brown", dimensions: "153mm / 39mm / 132mm", material: "Crystal acetate / UV400 lens", fit: "Medium / wide", inventory: 8 },
];

export const products: Product[] = productSeeds.map(({ asset, sideAsset = asset, ...product }, index) => ({
  ...product,
  id: `blr-${String(index + 1).padStart(2, "0")}`,
  slug: product.name.toLowerCase().replace(/\s+/g, "-"),
  primaryImage: `/products/${asset}-hero.png`,
  galleryImages: [
    `/products/${asset}-hero.png`,
    `/products/${sideAsset}-side.png`,
    `/products/${asset}-rear.png`,
  ],
}));

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
