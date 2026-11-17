import { products } from './catalog';
import { collections } from './collections';
import { currencies } from './CommerceContext';
import { isEmail } from './accountValidation';

export const adminCategories = [...new Set(products.map(p => p.category))];
export const adminMaterials = [...new Set(products.map(p => p.material))];
export const availabilityOptions = ['Unconfirmed', 'In stock', 'Out of stock'] as const;
export type AdminProduct = {
  id: string; sku: string; name: string; category: string; material: string;
  description: string; price: string; currency: string; availability: string;
  dimensions: string; weight: string; finish: string; care: string; contents: string;
  variants: string; shipping: string; collectionPaths: string[]; imageUrl: string; imageAlt: string;
};
export type ProductErrors = Partial<Record<keyof AdminProduct, string>>;
export const emptyAdminProduct = (): AdminProduct => ({ id: '', sku: '', name: '', category: '', material: '', description: '', price: '', currency: 'INR', availability: 'Unconfirmed', dimensions: '', weight: '', finish: '', care: '', contents: '', variants: '', shipping: '', collectionPaths: [], imageUrl: '', imageAlt: '' });
export const createAdminSamples = (): AdminProduct[] => products.map(p => ({
  ...emptyAdminProduct(), id: p.id, sku: `SAMPLE-${p.id}`, name: p.name, category: p.category, material: p.material,
  description: `${p.alt}. Reference concept only; actual specifications are not confirmed.`, imageUrl: `/images/reference/${p.image}.jpg`, imageAlt: p.alt,
  collectionPaths: collections.filter(c => c.material === p.material || c.category === p.category).map(c => c.path),
}));
export function validateAdminProduct(draft: AdminProduct, catalog: AdminProduct[]): ProductErrors {
  const errors: ProductErrors = {};
  const sku = draft.sku.trim();
  if (!draft.name.trim()) errors.name = 'Enter a product name.';
  if (!/^[a-z0-9_-]{3,40}$/i.test(sku)) errors.sku = 'Use 3–40 letters, numbers, hyphens or underscores.';
  else if (catalog.some(p => p.id !== draft.id && p.sku.trim().toLowerCase() === sku.toLowerCase())) errors.sku = 'This SKU is already used by another demo product.';
  if (!adminCategories.includes(draft.category)) errors.category = 'Choose a category.';
  if (!adminMaterials.includes(draft.material)) errors.material = 'Choose a material.';
  if (!draft.description.trim()) errors.description = 'Add a product description.';
  if (draft.price !== '' && !/^\d{1,9}(\.\d{1,2})?$/.test(draft.price)) errors.price = 'Enter a non-negative price with up to two decimal places, or leave blank.';
  if (!(currencies as readonly string[]).includes(draft.currency)) errors.currency = 'Choose a preview currency.';
  if (!(availabilityOptions as readonly string[]).includes(draft.availability)) errors.availability = 'Choose an availability state.';
  if (!draft.imageUrl) errors.imageUrl = 'Choose a primary product image.';
  if (draft.imageUrl && !draft.imageAlt.trim()) errors.imageAlt = 'Describe the image for accessibility.';
  if (draft.collectionPaths.some(path => !collections.some(c => c.path === path))) errors.collectionPaths = 'Choose collections from the available list.';
  return errors;
}
export function imageFileError(file: { type: string; size: number }): string {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG or WebP image.';
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) return 'Choose an image larger than 0 bytes and no larger than 5 MB.';
  return '';
}
export function validateAdminAccess(email: string, password: string) {
  return { email: isEmail(email) ? '' : 'Enter a valid email address.', password: password.length >= 8 && password.trim() ? '' : 'Use at least 8 characters for this preview.' };
}
