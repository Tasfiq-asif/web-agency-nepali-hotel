'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { CTASection } from '@/components/sections/CTASection';

const ACTIVITIES = [
  {
    num: '01',
    title: 'Himalayan Treks',
    description:
      'Guided day hikes and multi-day treks through rhododendron forests to panoramic ridgelines. Routes for all fitness levels — from gentle valley walks to high-altitude trails above 3,500m.',
    tags: ['Guided', 'All Levels', 'Half or Full-day'],
    image: '/images/gallery/sunrise-trek.webp',
  },
  {
    num: '02',
    title: 'Sunrise Viewpoints',
    description:
      'Pre-dawn drives to elevated viewpoints for golden-hour photography of the Himalayan peaks. Clear-sky mornings reveal the full Annapurna and Dhaulagiri ranges.',
    tags: ['Early Start', 'Photography', '4:30 AM Pickup'],
    image: '/images/gallery/mountain-vista.webp',
  },
  {
    num: '03',
    title: 'Mountain Yoga',
    description:
      'Daily morning sessions on the open terrace — breathwork, pranayama, and asanas with a full Himalayan backdrop. Led by our resident practitioner every morning at 6:30 AM.',
    tags: ['Daily', 'All Levels', 'Outdoor Terrace'],
    image: null,
  },
  {
    num: '04',
    title: 'Birding Expeditions',
    description:
      'Over 200 species inhabit the surrounding forest, including Himalayan monal, blood pheasant, and rare vultures. Guided walks at dawn with spotting scopes provided.',
    tags: ['Guided', 'Dawn Start', 'Equipment Provided'],
    image: null,
  },
  {
    num: '05',
    title: 'Village Walks',
    description:
      'Visit nearby Gurung and Magar villages with our local guide. Meet artisans, observe traditional weaving, and share tea in a family home. A connection no trekking route can offer.',
    tags: ['Cultural', 'Local Guide', '3–4 Hours'],
    image: '/images/gallery/evening-gathering.webp',
  },
  {
    num: '06',
    title: 'Herb Garden & Kitchen Tour',
    description:
      "Walk our kitchen herb garden with our head chef, learning which plants season each dish. Harvest herbs together and join the prep for that evening's dinner.",
    tags: ['Chef-Led', 'Included', 'Morning Only'],
    image: '/images/gallery/mountain-herb-garden.webp',
  },
];

const SEASONS = [
  {
    name: 'Spring',
    months: 'March – May',
    highlight: 'Peak trekking season',
    description:
      'Rhododendrons in full bloom across the hillsides. Warm days and cool nights. The valley is alive with birdsong and the trails are at their most vivid.',
    tags: ['Best for Trekking', 'Wildflowers', 'Bird Migration'],
  },
  {
    name: 'Monsoon',
    months: 'June – August',
    highlight: 'Quiet immersion',
    description:
      'Low season, lower rates. The lodge is quieter and the hillsides intensely green. Waterfalls emerge from cliff-faces. Wildlife is most active. Not for trekkers — for those who want stillness.',
    tags: ['Lush Landscape', 'Fewer Guests', 'Lower Rates'],
  },
  {
    name: 'Autumn',
    months: 'September – November',
    highlight: 'Peak visibility season',
    description:
      'Crystal-clear skies after the monsoon. The finest mountain views of the year. Every local festival — Dashain, Tihar — falls in this window. Book months ahead.',
    tags: ['Best for Views', 'Festival Season', 'Book Early'],
  },
  {
    name: 'Winter',
    months: 'December – February',
    highlight: 'Snow and silence',
    description:
      'Snow on the lower slopes. Crisp mountain air. The lodge by a fire with no one else in the valley. Experienced hikers find trails less crowded and views uniquely clear.',
    tags: ['Snow Season', 'Very Quiet', 'Fire Nights'],
  },
];

export default function ActivitiesPage() {
  const gridRef = useRef<HTMLElement>(null);
  const seasonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.activities-header-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
      );
      gsap.fromTo(
        '.activities-header-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      gsap.fromTo(
        '.activity-full-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: 'top 70%' },
        }
      );

      gsap.fromTo(
        '.season-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: seasonRef.current, start: 'top 70%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      {/* Page header — dark forest */}
      <section
        className="bg-forest"
        style={{
          paddingTop: 'calc(var(--section-gap) + 5rem)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        <div className="container">
          <p
            className="label activities-header-fade mb-5"
            style={{ color: 'var(--color-accent)' }}
          >
            Activities & Nature
          </p>
          <h1
            style={{
              fontSize: 'var(--text-display-lg)',
              color: 'var(--color-text-inverse)',
              maxWidth: '18ch',
            }}
          >
            <span className="block overflow-hidden">
              <span
                className="activities-header-line block"
                style={{ fontWeight: 300 }}
              >
                The mountains are
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="activities-header-line block"
                style={{
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--color-accent)',
                }}
              >
                your itinerary
              </span>
            </span>
          </h1>
          <p
            className="activities-header-fade"
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.7)',
              maxWidth: '52ch',
              marginTop: '1.75rem',
              lineHeight: 1.65,
            }}
          >
            From pre-dawn treks to candlelight village evenings — every activity at
            Mountain Nest is guided by people who have lived on this land their entire lives.
          </p>
        </div>
      </section>

      {/* Activities grid — ivory */}
      <section ref={gridRef} className="section bg-canvas">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {ACTIVITIES.map((activity) => (
              <div key={activity.num} className="activity-full-card">
                {activity.image && (
                  <div
                    className="overflow-hidden rounded-sm"
                    style={{ aspectRatio: '3 / 2', marginBottom: '1.5rem' }}
                  >
                    <img
                      src={activity.image}
                      alt={activity.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition:
                          'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'rgba(196,112,79,0.4)',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {activity.num}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-display-sm)',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {activity.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: '1.25rem',
                  }}
                >
                  {activity.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-warm-mid)',
                        padding: '4px 10px',
                        border: '1px solid var(--color-hairline)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal highlights — dark forest */}
      <section ref={seasonRef} className="section bg-forest">
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
              When to Come
            </p>
            <h2
              style={{
                fontSize: 'var(--text-display-md)',
                fontWeight: 300,
                color: 'var(--color-text-inverse)',
                maxWidth: '22ch',
                marginInline: 'auto',
              }}
            >
              Every season has{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                its own character
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SEASONS.map((season) => (
              <div
                key={season.name}
                className="season-card"
                style={{
                  padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                  border: '1px solid rgba(245,240,232,0.1)',
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-display-sm)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'var(--color-text-inverse)',
                    }}
                  >
                    {season.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-label)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {season.months}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    fontWeight: 400,
                    color: 'rgba(245,240,232,0.85)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3,
                  }}
                >
                  {season.highlight}
                </p>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'rgba(245,240,232,0.6)',
                    lineHeight: 1.65,
                    marginBottom: '1.25rem',
                  }}
                >
                  {season.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {season.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.5)',
                        padding: '4px 10px',
                        border: '1px solid rgba(245,240,232,0.12)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
