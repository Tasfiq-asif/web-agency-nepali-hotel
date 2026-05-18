import type { Room } from '@/data/rooms';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mountainnesthotel.com';

export function hotelSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'Hotel'],
    name: 'Mountain Nest Hotel',
    description:
      'A boutique mountain lodge in the Annapurna region of Nepal, offering six thoughtfully designed rooms and suites with panoramic Himalayan views.',
    url: SITE_URL,
    priceRange: '$$$',
    numberOfRooms: 6,
    checkinTime: '14:00',
    checkoutTime: '12:00',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NP',
      addressRegion: 'Gandaki Province',
      addressLocality: 'Annapurna Region',
    },
    // Update with exact coordinates before going live
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.3949,
      longitude: 84.124,
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Mountain View', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Guided Trekking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: true },
    ],
    starRating: { '@type': 'Rating', ratingValue: '4' },
  };
}

export function roomSchema(room: Room) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: room.name,
    description: room.description,
    url: `${SITE_URL}/rooms/${room.slug}`,
    image: `${SITE_URL}${room.imageSrc}`,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.maxGuests,
    },
    amenityFeature: room.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: 'Mountain Nest Hotel',
      url: SITE_URL,
    },
  };
}

export function roomsListSchema(rooms: Room[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rooms & Suites — Mountain Nest Hotel',
    description:
      'Six thoughtfully designed mountain rooms and suites in the Annapurna region of Nepal.',
    url: `${SITE_URL}/rooms`,
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/rooms/${room.slug}`,
      name: room.name,
    })),
  };
}
