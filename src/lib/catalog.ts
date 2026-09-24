export const realProductImages = [
  'https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/laptops/macbook-pro-14-inch-space-grey/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/smartphones/iphone-13/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp',
  'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
];

export function getProductImages(rawImages: string, offset = 0) {
  const images = JSON.parse(rawImages) as string[];
  if (images.some((image) => image.includes('picsum.photos'))) {
    return realProductImages.map((_, index) => realProductImages[(index + offset) % realProductImages.length]);
  }
  return images;
}
