'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { CTASection } from '@/components/sections/CTASection';

const MEAL_MOMENTS = [
  {
    label: 'Sunrise Breakfast',
    title: 'The day begins with the mountains',
    description:
      'Fresh bread from our stone oven, local honey, Himalayan cheese, and pour-over Ilam tea — served as the first light touches the peaks.',
    image: '/images/gallery/mountain-vista.webp',
  },
  {
    label: 'Highland Lunch',
    title: 'Simple. Seasonal. Satisfying.',
    description:
      'Dal bhat reimagined with heirloom lentils, organic rice from the Terai, and slow-cooked curries drawn from valley-farm vegetables.',
    image: '/images/dining.webp',
  },
  {
    label: 'Candlelight Dinner',
    title: 'Five courses by firelight',
    description:
      'Guests gather each evening as dusk falls over the valley. A communal table, five seasonal courses, and Nepali wines selected to match the mountain air.',
    image: '/images/gallery/dining-candlelight.webp',
  },
];

const INGREDIENTS = [
  {
    label: 'Herb Garden',
    description:
      'We grow 24 varieties of highland herbs — thyme, lemon balm, mountain mint — used the same morning they are harvested.',
  },
  {
    label: 'Valley Farms',
    description:
      'Three partner farms within 12 km supply our seasonal vegetables. Our chef visits each farm at the start of every season.',
  },
  {
    label: 'Trout Streams',
    description:
      'Freshwater trout from cold mountain streams — pan-fried simply, finished with herb butter and smoked salt.',
  },
  {
    label: 'Ilam Tea',
    description:
      'Sourced directly from gardens in the Ilam district — first and second flush, served throughout the day.',
  },
];

export default function DiningPage() {
  const storyRef = useRef<HTMLElement>(null);
  const mealsRef = useRef<HTMLElement>(null);
  const ingredientsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dining-header-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
      );
      gsap.fromTo(
        '.dining-header-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      gsap.fromTo(
        '.story-image',
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.story-text > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: storyRef.current, start: 'top 65%' },
        }
      );

      gsap.fromTo(
        '.meal-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: mealsRef.current, start: 'top 70%' },
        }
      );

      gsap.fromTo(
        '.ingredient-item',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: ingredientsRef.current, start: 'top 70%' },
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
            className="label dining-header-fade mb-5"
            style={{ color: 'var(--color-accent)' }}
          >
            Dining & Local Cuisine
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
                className="dining-header-line block"
                style={{ fontWeight: 300 }}
              >
                Farm to table,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="dining-header-line block"
                style={{
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--color-accent)',
                }}
              >
                mountain to plate
              </span>
            </span>
          </h1>
          <p
            className="dining-header-fade"
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.7)',
              maxWidth: '52ch',
              marginTop: '1.75rem',
              lineHeight: 1.65,
            }}
          >
            Every meal at Mountain Nest is a celebration of the valley below — sourced
            within 12 km, prepared by hand, and shared around a table with mountain views.
          </p>
        </div>
      </section>

      {/* Kitchen story — ivory */}
      <section ref={storyRef} className="section bg-canvas">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              className="story-image overflow-hidden rounded-sm"
              style={{ aspectRatio: '4 / 5' }}
            >
              <img
                src="/images/dining.webp"
                alt="Mountain Nest Hotel kitchen — herbs and fresh produce"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="story-text">
              <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
                Our Kitchen
              </p>
              <h2
                style={{
                  fontSize: 'var(--text-display-md)',
                  fontWeight: 300,
                  color: 'var(--color-ink)',
                  marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                Where the altitude{' '}
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                  shapes the flavour
                </span>
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: '44ch',
                  marginBottom: '1.25rem',
                }}
              >
                At 2,800 metres, ingredients carry a different character. Herbs grow more
                slowly and with more concentration. Trout from glacial streams have a
                cleaner, colder flavour. Lentils from highland farms absorb spice
                differently than those grown in the plains.
              </p>
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: '44ch',
                  marginBottom: '2.5rem',
                }}
              >
                Our chef, trained in Kathmandu and London, returned to the mountains to
                build a kitchen that respects this altitude. No freezers. No imports. No
                shortcuts.
              </p>
              <a
                href="/gallery"
                className="inline-flex items-center gap-3 group"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-button)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  borderBottom: '1px solid var(--color-hairline)',
                  paddingBottom: 4,
                  textDecoration: 'none',
                  transition: 'border-color 0.3s',
                }}
              >
                View the Kitchen
                <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three meal moments — dark forest */}
      <section ref={mealsRef} className="section bg-forest">
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
              The Day on a Plate
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
              Three moments,{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>one table</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {MEAL_MOMENTS.map((meal) => (
              <div key={meal.label} className="meal-card">
                <div
                  className="overflow-hidden rounded-sm"
                  style={{ aspectRatio: '3 / 2', marginBottom: '1.5rem' }}
                >
                  <img
                    src={meal.image}
                    alt={meal.title}
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
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-label)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {meal.label}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-display-sm)',
                    fontWeight: 400,
                    color: 'var(--color-text-inverse)',
                    marginBottom: '0.875rem',
                  }}
                >
                  {meal.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'rgba(245,240,232,0.65)',
                    lineHeight: 1.65,
                  }}
                >
                  {meal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local ingredients — ivory */}
      <section ref={ingredientsRef} className="section bg-canvas">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: heading + intro */}
            <div>
              <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
                From the Land
              </p>
              <h2
                style={{
                  fontSize: 'var(--text-display-md)',
                  fontWeight: 300,
                  color: 'var(--color-ink)',
                  maxWidth: '18ch',
                }}
              >
                Every ingredient has{' '}
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>a story</span>
              </h2>
              <div
                style={{
                  width: 48,
                  height: 1,
                  backgroundColor: 'var(--color-accent)',
                  marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              />
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: '44ch',
                  marginTop: '1.5rem',
                }}
              >
                Our commitment to hyperlocal sourcing is not a marketing position — it
                is how mountain kitchens have always worked. The valley provides what it
                can, when it can. We plan our menus around it.
              </p>
            </div>

            {/* Right: ingredient grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
            >
              {INGREDIENTS.map((item) => (
                <div
                  key={item.label}
                  className="ingredient-item"
                  style={{
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--color-hairline)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-display-sm)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'var(--color-ink)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
