'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { CTASection } from '@/components/sections/CTASection';

const PHILOSOPHY = [
  {
    num: '01',
    title: 'Slow Travel',
    body: 'We host a maximum of eighteen guests at any time. No large groups, no tour buses. The lodge is designed for people who want to be present — in the valley, in the silence, in the moment.',
  },
  {
    num: '02',
    title: 'Mountain Cuisine',
    body: 'Every dish is sourced from the valley or the farms below it. Dal bhat. Buckwheat pancakes. Yak cheese. Nettle soup. We have never served food that couldn\'t be grown here.',
  },
  {
    num: '03',
    title: 'Local Employment',
    body: 'Every member of our team is from the Langtang Valley or the surrounding districts. We pay above the national rate and offer year-round employment, not just seasonal contracts.',
  },
];

const SUSTAINABILITY = [
  {
    stat: '100%',
    label: 'Solar-powered lodge. Zero diesel generators.',
  },
  {
    stat: 'Zero',
    label: 'Single-use plastic banned across the entire property since 2018.',
  },
  {
    stat: '18',
    label: 'Maximum guest capacity. Always. We have turned away full buyouts.',
  },
  {
    stat: '₹0',
    label: 'No import of food items available locally. All produce sourced within 60km.',
  },
];

export default function AboutPage() {
  const storyRef      = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const sustainRef    = useRef<HTMLElement>(null);
  const teamRef       = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-header-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
      );
      gsap.fromTo(
        '.about-header-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      gsap.fromTo(
        '.about-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.philosophy-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: philosophyRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.sustain-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: sustainRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.team-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: teamRef.current, start: 'top 80%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      {/* 1. Page Header — dark forest */}
      <section
        className="bg-ink"
        style={{
          paddingTop: 'calc(var(--section-gap) + 5rem)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        <div className="container">
          <p
            className="label about-header-fade mb-5"
            style={{ color: 'var(--color-accent)' }}
          >
            OUR STORY
          </p>
          <h1
            style={{
              fontSize: 'var(--text-display-lg)',
              color: 'var(--color-text-inverse)',
              maxWidth: '18ch',
            }}
          >
            <span className="block overflow-hidden">
              <span className="about-header-line block" style={{ fontWeight: 300 }}>
                Born from the
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="about-header-line block"
                style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--color-accent)' }}
              >
                mountains.
              </span>
            </span>
          </h1>
          <p
            className="about-header-fade"
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.7)',
              maxWidth: '52ch',
              marginTop: '1.75rem',
              lineHeight: 1.65,
            }}
          >
            Mountain Nest is not a hotel chain. It is a family home at 2,800 metres, built
            to share what Nepal does best — silence, warmth, and the Himalayas at first light.
          </p>
        </div>
      </section>

      {/* 2. Origin Story — ivory */}
      <section ref={storyRef} className="section bg-canvas">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Pull quote */}
            <div className="about-reveal">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-display-md)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  lineHeight: 1.2,
                  maxWidth: '22ch',
                }}
              >
                &ldquo;We didn&rsquo;t build a hotel. We built a place where the mountains do the talking.&rdquo;
              </h2>
            </div>

            {/* Body paragraphs */}
            <div
              className="about-reveal"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <p
                style={{
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                Mountain Nest was founded in 2011 by the Tamang family, who have lived in
                the Langtang Valley for four generations. What began as a small guesthouse
                for trekkers became, over fifteen years, a place guests return to year after
                year — not for the amenities, but for the people.
              </p>
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                The lodge sits at 2,800 metres above sea level, an hour&rsquo;s walk from the
                Langtang National Park boundary. On clear mornings, the Langtang Lirung peak
                — 7,227 metres — is visible from every south-facing room. We built the lodge
                to face it.
              </p>
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                Every room is named after a local peak or a wildflower found in the valley.
                Every meal begins with produce grown within a day&rsquo;s walk of the kitchen.
                We believe the best hospitality is the kind that knows its place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Philosophy — dark forest */}
      <section ref={philosophyRef} className="section bg-ink">
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(3rem, 5vw, 5rem)',
            }}
          >
            <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
              WHAT WE BELIEVE
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 300,
                color: 'var(--color-text-inverse)',
                maxWidth: '22ch',
                marginInline: 'auto',
              }}
            >
              Three principles.{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>No exceptions.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PHILOSOPHY.map((item) => (
              <div
                key={item.num}
                className="philosophy-card"
                style={{
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(245,240,232,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--color-accent)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                  }}
                >
                  {item.num}
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
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'rgba(245,240,232,0.65)',
                    lineHeight: 1.7,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sustainability — ivory */}
      <section ref={sustainRef} className="section bg-canvas">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: heading block */}
            <div className="sustain-reveal">
              <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
                SUSTAINABILITY
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-display-md)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  maxWidth: '16ch',
                  lineHeight: 1.15,
                }}
              >
                Built to leave
                <br />
                no trace.
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
                Mountain ecosystems are fragile. We have spent fifteen years learning
                to operate in one without degrading it.
              </p>
            </div>

            {/* Right: commitment rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SUSTAINABILITY.map((item) => (
                <div
                  key={item.stat}
                  className="sustain-reveal"
                  style={{
                    paddingTop: '1.75rem',
                    paddingBottom: '1.75rem',
                    borderTop: '1px solid var(--color-hairline)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: 'var(--color-accent)',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.stat}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.65,
                      maxWidth: '44ch',
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team — dark forest */}
      <section ref={teamRef} className="section bg-ink" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="label team-reveal mb-5" style={{ color: 'var(--color-accent)' }}>
            THE TEAM
          </p>
          <h2
            className="team-reveal"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-md)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--color-text-inverse)',
              lineHeight: 1.15,
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            Three families.
            <br />
            Fifteen years.
          </h2>
          <p
            className="team-reveal"
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.7)',
              lineHeight: 1.7,
              marginInline: 'auto',
            }}
          >
            The lodge is run by the Tamang, Gurung, and Lama families. Between us, we
            speak five languages, know every trail within 40km, and have collectively
            made more dal bhat than we care to count.
          </p>
        </div>
      </section>

      {/* 6. CTA */}
      <CTASection />
    </main>
  );
}
