export type StorageVariant = { id: string; label: string; price: number };
export type FashionVariantConfig = { type: 'fashion'; colors: string[]; sizes: string[]; sizePrices: Record<string, number> };
export type ProductVariantConfig =
  | { type: 'storage'; options: StorageVariant[] }
  | FashionVariantConfig
  | null;

export function getProductVariantConfig(categorySlug: string, title: string, basePrice: number): ProductVariantConfig {
  const accessory = /charger|case|battery|watch|airpods?|headphones?|earphones?|cable|adapter/i.test(title);
  const mobile = !accessory && /smartphone|mobile phone|\bphone\b|\biphone\b|\bgalaxy\b|\boppo\b|\brealme\b|\bvivo\b/i.test(title);
  const tablet = !accessory && /tablet|\bipad\b|\bgalaxy tab\b/i.test(title);
  const storageProduct = categorySlug === 'computers' || mobile || tablet;
  if (storageProduct) {
    return {
      type: 'storage',
      options: [
        { id: '128gb', label: '128GB', price: basePrice },
        { id: '256gb', label: '256GB', price: Number((basePrice + 35).toFixed(2)) },
        { id: '512gb', label: '512GB', price: Number((basePrice + 85).toFixed(2)) },
        { id: '1tb', label: '1TB', price: Number((basePrice + 155).toFixed(2)) },
      ],
    };
  }

  if (categorySlug.includes('fashion')) {
    const shoe = /shoe|sneaker|boot|sandal|trainer/i.test(title);
    const clothing = /shirt|dress|top|jacket|hoodie|t-shirt|jean|trouser|shorts|clothing/i.test(title);
    if (!shoe && !clothing) return null;
    const sizes = shoe ? ['7', '8', '9', '10', '11'] : ['S', 'M', 'L', 'XL'];
    return {
      type: 'fashion',
      colors: ['Black', 'Navy', 'White', 'Red'],
      sizes,
      sizePrices: Object.fromEntries(sizes.map((size) => [size, basePrice])),
    };
  }

  return null;
}
