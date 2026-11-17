import { isEmail } from './accountValidation';

export const enquiryTopics = ['Product information', 'Order help', 'Delivery', 'Returns & refunds', 'Other'] as const;
export type Enquiry = { name: string; email: string; topic: string; order: string; message: string };
export function validateEnquiry(value: Enquiry) {
  const errors: Partial<Record<keyof Enquiry, string>> = {};
  if (!value.name.trim()) errors.name = 'Enter your name.';
  if (!isEmail(value.email)) errors.email = 'Enter a valid email address.';
  if (!(enquiryTopics as readonly string[]).includes(value.topic)) errors.topic = 'Choose a topic.';
  if (value.message.trim().length < 10) errors.message = 'Add at least 10 characters so we can understand your enquiry.';
  if (value.message.length > 2000) errors.message = 'Keep the message within 2,000 characters.';
  return errors;
}
export function validateTracking(reference: string, email: string) {
  const errors: { reference?: string; email?: string } = {};
  if (!reference.trim()) errors.reference = 'Enter an order reference.';
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  return errors;
}
export const trackingExamples = [
  { reference: 'DEMO-1001', status: 'Processing', stage: 1, description: 'An example selection awaiting preparation. No real order or shipment exists.' },
  { reference: 'DEMO-1002', status: 'Delivered', stage: 4, description: 'An example of a completed delivery view. No real delivery is confirmed.' },
];
export const findTrackingExample = (reference: string, email: string) => email.trim().toLowerCase() === 'alex@example.com' ? trackingExamples.find(example => example.reference === reference.trim().toUpperCase()) : undefined;

export const faqs = [
  { topic: 'Shopping', question: 'Can I place an order now?', answer: 'This is a design preview. Products are sample concepts with reference photographs. You can explore the cart and checkout, but no order or payment is processed.', link: '/shop', label: 'Explore samples' },
  { topic: 'Shopping', question: 'Are the photographs actual SorviaGlobal products?', answer: 'The photographs show reference objects, including museum pieces. They do not confirm the design, material, size, condition or availability of future inventory.', link: '/images/reference/credits.html', label: 'View photograph credits' },
  { topic: 'Delivery', question: 'Which countries will you deliver to?', answer: 'Delivery coverage is still awaiting business confirmation. Country choices currently demonstrate the interface and do not confirm shipping availability.', link: '/policies/shipping', label: 'Shipping information' },
  { topic: 'Delivery', question: 'How can I track an order?', answer: 'The tracking page demonstrates example order states. Real references, carrier events and delivery estimates will come from the order and shipping services.', link: '/track-order', label: 'Try tracking preview' },
  { topic: 'Delivery', question: 'Are shipping costs, taxes and duties included?', answer: 'No charges have been calculated in this preview. Applicable shipping costs, taxes, duties and final payment currency must be confirmed before real checkout.', link: '/policies/shipping', label: 'Shipping and charges' },
  { topic: 'Returns', question: 'What are the return and cancellation rules?', answer: 'Return eligibility, time limits, cancellation cutoffs, costs and refund handling have not yet been approved. This preview does not establish a return or refund promise.', link: '/policies/returns', label: 'Returns policy preview' },
  { topic: 'Account', question: 'Does the demo create a customer account?', answer: 'No. Account forms demonstrate the design only. Profile and address edits stay in memory and clear when you leave, refresh or end the demo session.', link: '/account', label: 'Explore account preview' },
  { topic: 'Account', question: 'Where are my cart and favourites saved?', answer: 'The preview keeps your cart, favourites and region preference in this browser. They do not sync to an account or another device, and they do not reserve stock.', link: '/policies/privacy', label: 'Preview data information' },
];
export const policies = [
  { path: '/policies/shipping', title: 'Shipping & delivery', intro: 'Delivery information will be published once the business confirms its service.', sections: [
    { title: 'Destinations & delivery estimates', body: 'Supported countries, carriers, dispatch timings and estimated delivery windows are awaiting confirmation. The preview’s region options do not establish delivery coverage.' },
    { title: 'Shipping costs, taxes & duties', body: 'Shipping rates, tax treatment, customs charges and any import-duty responsibilities must be confirmed for the destination before real checkout. No amounts are calculated here.' },
    { title: 'Tracking & delivery questions', body: 'Real tracking updates will come from the order or shipping service. The tracking preview currently shows fictional examples only.' },
  ] },
  { path: '/policies/returns', title: 'Returns, refunds & cancellations', intro: 'The business’s approved return and cancellation policy is still to come.', sections: [
    { title: 'Return eligibility', body: 'Eligible products, item condition requirements, exclusions, request time limits and the return process have not yet been approved. No return window is promised by this preview.' },
    { title: 'Cancellations & refunds', body: 'Cancellation cutoffs, refund methods, processing times, return shipping costs and any applicable charges are awaiting business confirmation.' },
    { title: 'Damaged or incorrect items', body: 'The business will confirm how customers should report a problem, what information is needed and which remedies are available. The contact form is currently a local preview and cannot send a request.' },
  ] },
  { path: '/policies/privacy', title: 'Privacy & browser storage', intro: 'This describes the application preview. The final privacy policy requires business approval before launch.', sections: [
    { title: 'Details entered in preview forms', body: 'Checkout, account and enquiry details stay in page memory. This application does not submit them to a backend, and leaving or refreshing clears them. Use fictional details while reviewing.' },
    { title: 'Preferences stored in this browser', body: 'The application stores sample cart items, wishlist selections and country/currency preferences in local browser storage. These do not sync to a customer account. You can remove items in the cart or wishlist, change your region, or clear this site’s data using your browser settings.' },
    { title: 'Before the live service opens', body: 'The final policy must explain the business identity, contact information, purposes of data use, service providers, retention, applicable privacy choices and any cookies or analytics used by the finished service. Hosting-platform data handling is not described by this application preview.' },
  ] },
  { path: '/policies/terms', title: 'Terms & conditions', intro: 'Final business terms are not yet published. This page is a content and layout preview.', sections: [
    { title: 'Preview use', body: 'This frontend displays sample concepts and reference images. Checkout results, account access, order records and tracking states are demonstrations, and no purchase or account contract is created by using these controls.' },
    { title: 'Terms to be confirmed', body: 'The business will supply its approved identity, trading information, order acceptance process, pricing and payment rules, delivery terms, account conditions and other applicable terms before launch.' },
    { title: 'Product information & imagery', body: 'Reference photographs are credited to their sources and are not confirmed inventory photography. Actual product descriptions, specifications, prices and availability are awaiting the approved catalog.' },
  ] },
];
