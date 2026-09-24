export function isBestSellerProduct(product: { ratingAvg: number; ratingCount: number }) {
  return product.ratingAvg >= 4.5 && product.ratingCount >= 4000;
}
