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
  { path: '/collections/brass', name: 'Brass décor', eyebrow: 'A STUDY IN WARMTH', description: 'Golden tones. Distinctive forms.', detail: 'Explore a sample selection of brass objects, from sculptural vessels to decorative chess. A warm starting point for a considered space.', kind: 'brass', material: 'Brass' },
  { path: '/collections/wood', name: 'Wooden décor', eyebrow: 'NATURAL CHARACTER', description: 'Texture that feels at home.', detail: 'Discover wooden accents, vessels and chess in this sample collection. An exploration of natural tones and expressive shapes.', kind: 'wood', material: 'Wood' },
  { path: '/collections/copper', name: 'Copper objects', eyebrow: 'RICH TONES, SIMPLE FORMS', description: 'A little warmth, beautifully placed.', detail: 'Explore copper vessels and tabletop accents in this sample selection, with warm tones for the corners you make your own.', kind: 'copper', material: 'Copper' },
  { path: '/category/decorative-chess', name: 'Decorative chess', eyebrow: 'PLAYFUL BY DESIGN', description: 'A different kind of statement.', detail: 'Explore sample chess sets across materials. Familiar pieces, distinctive silhouettes and a playful point of interest for your space.', kind: 'chess', category: 'Decorative chess' },
  { path: '/category/decorative-objects', name: 'Decorative objects', eyebrow: 'THE FINISHING DETAILS', description: 'Small details. Lasting character.', detail: 'Browse a sample selection of accents in brass, copper and wood. Discover forms and textures that bring a room together.', kind: 'brass', category: 'Decorative objects' },
  { path: '/category/vases-vessels', name: 'Vases & vessels', eyebrow: 'AN EXPLORATION OF FORM', description: 'Considered shapes for everyday spaces.', detail: 'Discover a sample selection of decorative vessels across warm metals and natural wood. Explore the material that speaks to your space.', kind: 'copper', category: 'Vases & vessels' },
];
