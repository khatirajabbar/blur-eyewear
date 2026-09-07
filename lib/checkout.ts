import { products, type Product } from "@/data/products";

export type CheckoutCartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutLine = CheckoutCartItem & {
  product: Product;
  unitAmount: number;
};

export type CheckoutCartValidation =
  | { success: true; lines: CheckoutLine[] }
  | { success: false; message: string };

const maxDistinctProducts = products.length;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getCartCandidates(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value.items)) return value.items;
  return null;
}

/**
 * Rebuilds cart lines from the immutable catalogue. Prices and quantities from
 * the browser are never accepted as an authority for a payment.
 */
export function validateCheckoutCart(value: unknown): CheckoutCartValidation {
  const candidates = getCartCandidates(value);
  if (!candidates || candidates.length === 0) {
    return { success: false, message: "Your cart is empty." };
  }

  if (candidates.length > maxDistinctProducts) {
    return { success: false, message: "Your cart could not be verified. Please refresh and try again." };
  }

  const quantities = new Map<string, number>();

  for (const candidate of candidates) {
    if (
      !isRecord(candidate)
      || typeof candidate.productId !== "string"
      || typeof candidate.quantity !== "number"
      || !Number.isSafeInteger(candidate.quantity)
    ) {
      return { success: false, message: "Your cart could not be verified. Please refresh and try again." };
    }

    if (candidate.quantity <= 0) {
      return { success: false, message: "Your cart could not be verified. Please refresh and try again." };
    }

    const product = products.find((item) => item.id === candidate.productId);
    if (!product) {
      return { success: false, message: "One of the selected frames is no longer available." };
    }

    const nextQuantity = (quantities.get(product.id) ?? 0) + candidate.quantity;
    if (nextQuantity > product.inventory) {
      return { success: false, message: `${product.name} no longer has that quantity available.` };
    }

    quantities.set(product.id, nextQuantity);
  }

  const lines: CheckoutLine[] = [];

  for (const [productId, quantity] of quantities) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return { success: false, message: "Your cart could not be verified. Please refresh and try again." };
    }

    lines.push({
      productId,
      quantity,
      product,
      unitAmount: Math.round(product.priceUSD * 100),
    });
  }

  return { success: true, lines };
}

export function checkoutMetadata(lines: CheckoutLine[]) {
  return JSON.stringify(lines.map(({ productId, quantity }) => ({ productId, quantity })));
}

export function validateCheckoutMetadata(value: string | null | undefined): CheckoutCartValidation {
  if (!value) {
    return { success: false, message: "The checkout details are incomplete." };
  }

  try {
    return validateCheckoutCart(JSON.parse(value) as unknown);
  } catch {
    return { success: false, message: "The checkout details are incomplete." };
  }
}
