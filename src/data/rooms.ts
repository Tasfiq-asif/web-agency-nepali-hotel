export interface Room {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageSrc: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  pricePerNight: number;
}

export const ROOMS: Room[] = [
  {
    slug: 'himalayan-suite',
    name: 'Himalayan Suite',
    tagline: 'Panoramic mountain views from your private balcony',
    description:
      'Wake to unobstructed views of the Annapurna massif from your king-size bed. The private balcony catches the first alpenglow at dawn — a quiet moment before the day begins. A stone fireplace and hand-woven woollen rugs add warmth through the cool mountain evenings.',
    imageSrc: '/images/rooms/himalayan-suite.webp',
    images: [
      '/images/rooms/himalayan-suite.webp',
      '/images/rooms/himalayan-suite-2.webp',
      '/images/rooms/himalayan-suite-3.webp',
    ],
    amenities: ['Mountain View', 'Private Balcony', 'Stone Fireplace', 'King Bed', 'Rain Shower', 'Himalayan Tea Service'],
    maxGuests: 3,
    pricePerNight: 180,
  },
  {
    slug: 'forest-retreat',
    name: 'Forest Retreat',
    tagline: 'Nestled among rhododendrons with floor-to-ceiling windows',
    description:
      'Rhododendrons press against the floor-to-ceiling windows of this intimate room, their blooms shifting from pink to crimson through the seasons. A window seat invites hours of reading while the forest sounds carry through. Designed for two, with nothing to interrupt the quiet.',
    imageSrc: '/images/rooms/forest-retreat.webp',
    images: [
      '/images/rooms/forest-retreat.webp',
      '/images/rooms/forest-retreat-2.webp',
      '/images/rooms/forest-retreat-3.webp',
    ],
    amenities: ['Forest View', 'Window Seat', 'Rain Shower', 'Queen Bed', 'Writing Desk', 'Morning Basket'],
    maxGuests: 2,
    pricePerNight: 140,
  },
  {
    slug: 'summit-lodge',
    name: 'Summit Lodge',
    tagline: 'Our most spacious suite with a private terrace and hot tub',
    description:
      'Mountain Nest\'s most generous suite unfolds across a private terrace overlooking the valley. An open-air soaking tub, a living area with hand-carved furniture, and direct garden access below. For those who come to stay, not just to sleep.',
    imageSrc: '/images/rooms/summit-lodge.webp',
    images: [
      '/images/rooms/summit-lodge.webp',
      '/images/rooms/summit-lodge-2.webp',
      '/images/rooms/summit-lodge-3.webp',
    ],
    amenities: ['Private Terrace', 'Outdoor Hot Tub', 'Separate Living Area', 'King Bed', 'Garden Access', 'Butler Service'],
    maxGuests: 4,
    pricePerNight: 260,
  },
  {
    slug: 'valley-room',
    name: 'Valley Room',
    tagline: 'Warm wood interiors with views over the river valley',
    description:
      'Warm pine panels and hand-loomed textiles create a room that feels like it grew from the hillside. Twin beds that convert to a double — ideal for couples or close companions. The writing desk faces the river valley, a perennial invitation to slow down.',
    imageSrc: '/images/rooms/valley-room.webp',
    images: [
      '/images/rooms/valley-room.webp',
      '/images/rooms/valley-room-2.webp',
      '/images/rooms/valley-room-3.webp',
    ],
    amenities: ['Valley View', 'Writing Desk', 'Rain Shower', 'Twin or Double Bed', 'Cedar Wardrobe', 'Local Honey Tray'],
    maxGuests: 2,
    pricePerNight: 110,
  },
  {
    slug: 'rhododendron-room',
    name: 'Rhododendron Room',
    tagline: 'An intimate garden-facing room wrapped in natural light',
    description:
      'The most intimate room in the lodge, facing the garden courtyard where rhododendrons bloom from March through May. Generous natural light, a deep reading nook, and a cedar-panelled rain shower. A room that rewards those who come without rush.',
    imageSrc: '/images/rooms/rhododendron-room.webp',
    images: [
      '/images/rooms/rhododendron-room.webp',
      '/images/rooms/rhododendron-room-2.webp',
      '/images/rooms/rhododendron-room-3.webp',
    ],
    amenities: ['Garden View', 'Reading Nook', 'Cedar Rain Shower', 'Double Bed', 'Natural Light', 'Botanical Bath Kit'],
    maxGuests: 2,
    pricePerNight: 120,
  },
  {
    slug: 'annapurna-suite',
    name: 'Annapurna Suite',
    tagline: 'A corner suite with dual-aspect windows framing the peaks',
    description:
      'Dual-aspect windows frame two distinct faces of the Annapurna range as the light changes from dawn to dusk. A freestanding soaking tub, a separate sitting area, and a curated shelf of books about the Himalaya. The kind of room guests return to ask for by name.',
    imageSrc: '/images/rooms/annapurna-suite.webp',
    images: [
      '/images/rooms/annapurna-suite.webp',
      '/images/rooms/annapurna-suite-2.webp',
      '/images/rooms/annapurna-suite-3.webp',
    ],
    amenities: ['Dual Mountain View', 'Freestanding Soaking Tub', 'Sitting Area', 'King Bed', 'Himalayan Library', 'Evening Turndown'],
    maxGuests: 3,
    pricePerNight: 200,
  },
];

export const GUEST_FILTERS = [
  { label: 'All Rooms', value: 0 },
  { label: '2 Guests', value: 2 },
  { label: '3 Guests', value: 3 },
  { label: '4+ Guests', value: 4 },
] as const;
