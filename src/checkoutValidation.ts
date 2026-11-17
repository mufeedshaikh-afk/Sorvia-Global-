export type Delivery = { email: string; name: string; phone: string; address: string; apartment: string; city: string; area: string; postal: string };
export type DeliveryErrors = Partial<Record<keyof Delivery | 'country', string>>;
export const emptyDelivery: Delivery = { email: '', name: '', phone: '', address: '', apartment: '', city: '', area: '', postal: '' };
export const postalRules: Record<string, { label: string; example: string; pattern: RegExp }> = {
  IN: { label: 'PIN code', example: '400001', pattern: /^[1-9]\d{5}$/ },
  US: { label: 'ZIP code', example: '10001 or 10001-1234', pattern: /^\d{5}(-\d{4})?$/ },
  GB: { label: 'Postcode', example: 'SW1A 1AA', pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i },
  DE: { label: 'Postal code', example: '10115', pattern: /^\d{5}$/ },
  FR: { label: 'Postal code', example: '75001', pattern: /^\d{5}$/ },
};
export function validateDelivery(data: Delivery, country: string): DeliveryErrors {
  const errors: DeliveryErrors = {};
  if (!postalRules[country]) errors.country = country === 'OTHER' ? 'Choose one of the example countries to try the checkout preview. Delivery to other countries is not yet configured.' : 'Choose a country for the preview.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter an email address, for example alex@example.com.';
  if (!data.name.trim()) errors.name = 'Enter the recipient’s name.';
  const digits = data.phone.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(data.phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number with 7–15 digits, including the country code if needed.';
  if (!data.address.trim()) errors.address = 'Enter a street address.';
  if (!data.city.trim()) errors.city = 'Enter a city or town.';
  if (['IN', 'US'].includes(country) && !data.area.trim()) errors.area = country === 'US' ? 'Enter a state.' : 'Enter a state or union territory.';
  if (postalRules[country] && !postalRules[country].pattern.test(data.postal.trim())) errors.postal = `Enter a valid ${postalRules[country].label.toLowerCase()}, for example ${postalRules[country].example}.`;
  return errors;
}
