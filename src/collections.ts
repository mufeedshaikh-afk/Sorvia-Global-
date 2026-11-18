export type Collection = {
  path: string;
  name: string;
  eyebrow: string;
  description: string;
  detail: string;
  kind: string;
  material?: string;
  category?: string;
};

export const collections: Collection[] = [
  { path: '/collections/brass', name: 'Brass décor', eyebrow: 'A STUDY IN WARMTH', description: 'Golden tones. Distinctive forms.', detail: 'Explore brass objects, from sculptural vessels to decorative chess. A warm starting point for a considered space.', kind: 'brass', material: 'Brass' },
  { path: '/collections/wood', name: 'Wooden décor', eyebrow: 'NATURAL CHARACTER', description: 'Texture that feels at home.', detail: 'Discover wooden accents, vessels and chess in a collection of natural tones and expressive shapes.', kind: 'wood', material: 'Wood' },
  { path: '/collections/copper', name: 'Copper objects', eyebrow: 'RICH TONES, SIMPLE FORMS', description: 'A little warmth, beautifully placed.', detail: 'Explore copper vessels and tabletop accents, with warm tones for the corners you make your own.', kind: 'copper', material: 'Copper' },
  { path: '/collections/ceramic', name: 'Ceramic décor', eyebrow: 'EARTH, COLOUR & FORM', description: 'Expressive surfaces. Considered shapes.', detail: 'Explore ceramic forms, from painted vessels to decorative bowls. Colour, texture and expressive form lead the way.', kind: 'ceramic', material: 'Ceramic' },
  { path: '/collections/glass', name: 'Glass objects', eyebrow: 'LIGHT IN A DIFFERENT FORM', description: 'A new way to catch the light.', detail: 'Explore clear glass, rich colour and distinctive silhouettes for your everyday surroundings.', kind: 'glass', material: 'Glass' },
  { path: '/collections/stone', name: 'Stone décor', eyebrow: 'QUIET, SCULPTURAL CHARACTER', description: 'Natural presence. Lasting inspiration.', detail: 'Discover stone textures and sculptural silhouettes with a quiet, lasting presence.', kind: 'stone', material: 'Stone' },
  { path: '/category/decorative-chess', name: 'Decorative chess', eyebrow: 'PLAYFUL BY DESIGN', description: 'A different kind of statement.', detail: 'Explore decorative chess across materials. Familiar pieces, distinctive silhouettes and a playful point of interest for your space.', kind: 'chess', category: 'Decorative chess' },
  { path: '/category/decorative-objects', name: 'Decorative objects', eyebrow: 'THE FINISHING DETAILS', description: 'Small details. Lasting character.', detail: 'Browse a selection of decorative accents. Discover forms and textures that bring a room together.', kind: 'brass', category: 'Decorative objects' },
  { path: '/category/vases-vessels', name: 'Vases & vessels', eyebrow: 'AN EXPLORATION OF FORM', description: 'Considered shapes for everyday spaces.', detail: 'Discover decorative vessels across warm metals and natural wood. Explore the material that speaks to your space.', kind: 'copper', category: 'Vases & vessels' },
];
