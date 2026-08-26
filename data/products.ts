export type Product = {
  id: string;
  slug: string;
  code: string;
  name: string;
  priceUSD: number;
  description: string;
  frameColor: string;
  lensColor: string;
  backgroundColor: string;
  accentColor: string;
  primaryImage: string;
  galleryImages: string[];
  modelImage: string;
  modelVideo?: string;
  dimensions: string;
  material: string;
  fit: string;
  inventory: number;
  silhouette: string;
  rotationFrames?: string[];
  lensPreviewVideo?: string;
};

type ProductSeed = Omit<Product, "id" | "slug" | "primaryImage" | "galleryImages" | "modelImage">;

const productSeeds: ProductSeed[] = [
  { code: "BLR-001", name: "STATIC", priceUSD: 148, description: "A swollen, low-slung frame for images that refuse to settle.", frameColor: "Frosted glacier", lensColor: "Smoke blue", backgroundColor: "#9bc4d4", accentColor: "#eafcff", dimensions: "147mm / 42mm / 128mm", material: "Bio-acetate, UV400 lens", fit: "Medium / wide", inventory: 8, silhouette: "static" },
  { code: "BLR-002", name: "MELT", priceUSD: 156, description: "Softened edges and a liquid bridge, caught mid-transformation.", frameColor: "Pearl lime", lensColor: "Moss haze", backgroundColor: "#b8dc72", accentColor: "#26351c", dimensions: "151mm / 38mm / 130mm", material: "Plant resin, UV400 lens", fit: "Medium", inventory: 12, silhouette: "melt" },
  { code: "BLR-003", name: "GHOST", priceUSD: 132, description: "Barely-there crystal structure with a spectral smoke lens.", frameColor: "Clear ice", lensColor: "Pale graphite", backgroundColor: "#d4d6df", accentColor: "#24262e", dimensions: "145mm / 45mm / 126mm", material: "Recycled nylon, UV400 lens", fit: "Narrow / medium", inventory: 5, silhouette: "ghost" },
  { code: "BLR-004", name: "GLITCH", priceUSD: 164, description: "Interrupted geometry for a beautifully corrupted point of view.", frameColor: "Signal orange", lensColor: "Burnt umber", backgroundColor: "#e87b38", accentColor: "#25120b", dimensions: "154mm / 35mm / 131mm", material: "Bio-acetate, UV400 lens", fit: "Wide", inventory: 6, silhouette: "glitch" },
  { code: "BLR-005", name: "HAZE", priceUSD: 142, description: "A cloudy oval with an almost-imperceptible floating rim.", frameColor: "Milk lavender", lensColor: "Mist violet", backgroundColor: "#b8a5d8", accentColor: "#221e37", dimensions: "142mm / 48mm / 125mm", material: "Plant resin, UV400 lens", fit: "Narrow / medium", inventory: 9, silhouette: "haze" },
  { code: "BLR-006", name: "CHROME", priceUSD: 178, description: "Mirror-polished structure, tuned to bend a room around the wearer.", frameColor: "Liquid silver", lensColor: "Mercury grey", backgroundColor: "#9ca5ac", accentColor: "#101419", dimensions: "150mm / 39mm / 133mm", material: "Stainless steel, UV400 lens", fit: "Medium / wide", inventory: 4, silhouette: "chrome" },
  { code: "BLR-007", name: "FLUX", priceUSD: 152, description: "A pressure-formed wrap that moves faster than its shadow.", frameColor: "Aqua glass", lensColor: "Deep aqua", backgroundColor: "#63c4c6", accentColor: "#073336", dimensions: "158mm / 41mm / 132mm", material: "Recycled nylon, UV400 lens", fit: "Wide", inventory: 10, silhouette: "flux" },
  { code: "BLR-008", name: "VOID", priceUSD: 170, description: "An absence with arms. Blacked-out lenses make the face disappear.", frameColor: "Soft black", lensColor: "Obsidian", backgroundColor: "#25272e", accentColor: "#f2f5f4", dimensions: "149mm / 36mm / 129mm", material: "Bio-acetate, UV400 lens", fit: "Medium", inventory: 7, silhouette: "void" },
  { code: "BLR-009", name: "ECHO", priceUSD: 126, description: "Two offset rings repeating a familiar gesture in a new voice.", frameColor: "Shell pink", lensColor: "Rose smoke", backgroundColor: "#edafbc", accentColor: "#4a1b2a", dimensions: "143mm / 46mm / 124mm", material: "Plant resin, UV400 lens", fit: "Narrow", inventory: 13, silhouette: "echo" },
  { code: "BLR-010", name: "SHIFT", priceUSD: 159, description: "A diagonal cut through a classic shape. Balance was never the point.", frameColor: "Electric cobalt", lensColor: "Ink blue", backgroundColor: "#4d6ce3", accentColor: "#eff2ff", dimensions: "153mm / 40mm / 130mm", material: "Recycled nylon, UV400 lens", fit: "Medium / wide", inventory: 11, silhouette: "shift" },
  { code: "BLR-011", name: "WARP", priceUSD: 168, description: "Wide body, pinched center, an optical shortcut through the ordinary.", frameColor: "Acid green", lensColor: "Charcoal green", backgroundColor: "#9ecc40", accentColor: "#17220b", dimensions: "160mm / 37mm / 134mm", material: "Bio-acetate, UV400 lens", fit: "Wide", inventory: 3, silhouette: "warp" },
  { code: "BLR-012", name: "TRACE", priceUSD: 138, description: "An exposed wire drawing the outline of a frame that is not quite there.", frameColor: "Iridescent silver", lensColor: "Cool grey", backgroundColor: "#c3c8cd", accentColor: "#1d252a", dimensions: "146mm / 43mm / 127mm", material: "Stainless steel, UV400 lens", fit: "Medium", inventory: 14, silhouette: "trace" },
  { code: "BLR-013", name: "HALO", priceUSD: 146, description: "A rounded orbital frame with a softened, radiant perimeter.", frameColor: "Pale yellow", lensColor: "Honey smoke", backgroundColor: "#ecd878", accentColor: "#372b0b", dimensions: "144mm / 49mm / 126mm", material: "Plant resin, UV400 lens", fit: "Narrow / medium", inventory: 8, silhouette: "halo" },
  { code: "BLR-014", name: "SPECTRA", priceUSD: 175, description: "A broad refractive shield that catches every color in between.", frameColor: "Oil slick", lensColor: "Violet mirror", backgroundColor: "#7550b6", accentColor: "#faf7ff", dimensions: "161mm / 52mm / 135mm", material: "Recycled nylon, UV400 lens", fit: "Wide", inventory: 6, silhouette: "spectra" },
  { code: "BLR-015", name: "DRIFT", priceUSD: 134, description: "Small, buoyant, and gently warped like a memory at sea.", frameColor: "Cloud white", lensColor: "Pale aqua", backgroundColor: "#a8d5d2", accentColor: "#153332", dimensions: "140mm / 44mm / 122mm", material: "Bio-acetate, UV400 lens", fit: "Narrow", inventory: 15, silhouette: "drift" },
  { code: "BLR-016", name: "PIXEL", priceUSD: 144, description: "A stepped silhouette for the high-definition version of yourself.", frameColor: "Hot coral", lensColor: "Red wine", backgroundColor: "#e5605e", accentColor: "#321011", dimensions: "148mm / 40mm / 128mm", material: "Plant resin, UV400 lens", fit: "Medium", inventory: 10, silhouette: "pixel" },
  { code: "BLR-017", name: "PULSE", priceUSD: 160, description: "A lens line charged with a single, concentrated beat of light.", frameColor: "Ultraviolet", lensColor: "Black plum", backgroundColor: "#59429f", accentColor: "#fbf8ff", dimensions: "155mm / 34mm / 132mm", material: "Recycled nylon, UV400 lens", fit: "Medium / wide", inventory: 5, silhouette: "pulse" },
  { code: "BLR-018", name: "MIRAGE", priceUSD: 172, description: "Mirrored curves placed just beyond the edge of certainty.", frameColor: "Desert chrome", lensColor: "Bronze mirror", backgroundColor: "#cf9170", accentColor: "#332019", dimensions: "152mm / 47mm / 130mm", material: "Stainless steel, UV400 lens", fit: "Medium", inventory: 4, silhouette: "mirage" },
  { code: "BLR-019", name: "NEON", priceUSD: 150, description: "A shock of translucent color for places that never switch off.", frameColor: "Toxic lime", lensColor: "Night green", backgroundColor: "#b4df31", accentColor: "#182209", dimensions: "157mm / 36mm / 133mm", material: "Bio-acetate, UV400 lens", fit: "Wide", inventory: 7, silhouette: "neon" },
  { code: "BLR-020", name: "PHASE", priceUSD: 180, description: "Two states in one object: opaque architecture, clear ambition.", frameColor: "Transparent smoke", lensColor: "Deep indigo", backgroundColor: "#3e5871", accentColor: "#eff7fb", dimensions: "150mm / 43mm / 129mm", material: "Recycled nylon, UV400 lens", fit: "Medium", inventory: 2, silhouette: "phase" },
];

export const products: Product[] = productSeeds.map((product, index) => {
  const folder = `blr-${String(index + 1).padStart(3, "0")}`;
  const slug = `${folder}-${product.name.toLowerCase()}`;

  return {
    ...product,
    id: folder,
    slug,
    primaryImage: `/products/${folder}/hero.webp`,
    galleryImages: ["01.webp", "02.webp", "03.webp"].map((image) => `/products/${folder}/${image}`),
    modelImage: `/products/${folder}/model.webp`,
  };
});

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
