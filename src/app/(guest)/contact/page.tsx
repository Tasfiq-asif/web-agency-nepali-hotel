import type { Metadata } from 'next';
import { ContactReveal } from './ContactReveal';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Mountain Nest Hotel in Nepal\'s Solukhumbu District. Chat on WhatsApp, send an email, or fill in our inquiry form — we respond within 4 hours.',
};

const CONTACT_INFO = [
  { label: 'Location',       value: 'Langtang Valley, Rasuwa District, Bagmati Province, Nepal' },
  { label: 'Altitude',       value: '2,800 metres above sea level' },
  { label: 'Phone / WhatsApp', value: '+977 98XXXXXXXX' },
  { label: 'Email',          value: 'stay@mountainnest.com' },
  { label: 'Check-in',       value: '11:00 AM · Check-out: 10:00 AM' },
  { label: 'Peak Seasons',   value: 'March–May · October–November' },
];

const ROUTES = [
  {
    label: 'From Kathmandu',
    body:  '7–8 hour drive via Dhunche. A 4WD vehicle is recommended. We can arrange transport.',
  },
  {
    label: 'Helicopter',
    body:  'Scenic 45-minute flight from Kathmandu. Seasonal availability — contact us to check dates.',
  },
  {
    label: 'Trekking Route',
    body:  '3 days on foot from Syabrubesi. The standard Langtang Circuit passes through our valley.',
  },
  {
    label: 'Coordinates',
    body:  '28.2083° N, 85.5137° E — GPS waypoint available on request.',
  },
];

export default function ContactPage() {
  return (
    <main id="main-content">
      <ContactReveal>
        {/* Page header — ivory */}
        <section
          className="contact-reveal bg-canvas"
          style={{
            paddingTop: 'calc(var(--section-gap) + 5rem)',
            paddingBottom: 'var(--section-gap)',
          }}
        >
          <div className="container">
            <p
              className="label contact-header-fade mb-5"
              style={{ color: 'var(--color-accent)' }}
            >
              Contact
            </p>
            <h1
              style={{
                fontSize: 'var(--text-display-lg)',
                color: 'var(--color-ink)',
                maxWidth: '18ch',
              }}
            >
              <span className="block overflow-hidden">
                <span
                  className="contact-header-line block"
                  style={{ fontWeight: 300 }}
                >
                  Come find us
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="contact-header-line block"
                  style={{ fontStyle: 'italic', fontWeight: 400 }}
                >
                  in the valley.
                </span>
              </span>
            </h1>
            <p
              className="contact-header-fade"
              style={{
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '52ch',
                marginTop: '1.75rem',
                lineHeight: 1.65,
              }}
            >
              We respond to all inquiries within 4 hours during the day. For immediate
              assistance, WhatsApp is always faster.
            </p>
          </div>
        </section>

        {/* Two-column — ivory */}
        <section className="section bg-canvas">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: contact info */}
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.25rem, 1.5vw, 1.375rem)',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                  }}
                >
                  Mountain Nest Hotel
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {CONTACT_INFO.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '8rem 1fr',
                        gap: '1rem',
                        padding: '1rem 0',
                        borderTop: '1px solid var(--color-hairline)',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-label)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--color-ink)',
                          lineHeight: 1.55,
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--color-hairline)' }} />
                </div>

                {/* WhatsApp CTA */}
                <div
                  style={{
                    background: 'var(--color-ink)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    marginTop: '2rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'rgba(245,240,232,0.75)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                    }}
                  >
                    For fastest response, message us directly on WhatsApp.
                  </p>
                  <a
                    href="https://wa.me/97798XXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                    style={{
                      display: 'inline-block',
                      background: 'var(--color-ink)',
                      color: 'var(--color-canvas)',
                      border: '1px solid rgba(245,240,232,0.25)',
                      padding: '0.75rem 1.5rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body-sm)',
                      letterSpacing: '0.02em',
                      textDecoration: 'none',
                      transition: 'background 0.3s, border-color 0.3s',
                    }}
                  >
                    Message on WhatsApp →
                  </a>
                </div>
              </div>

              {/* Right: inquiry form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Find Us — ivory, hairline bordered card */}
        <section className="contact-reveal section bg-canvas">
          <div className="container">
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                padding: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              <p className="label mb-5" style={{ color: 'var(--color-accent)' }}>
                Find Us
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'var(--text-display-md)',
                  color: 'var(--color-ink)',
                  marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                Getting to Mountain Nest
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                  marginBottom: 'clamp(2rem, 4vw, 3rem)',
                }}
              >
                {ROUTES.map((route) => (
                  <div
                    key={route.label}
                    style={{
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-hairline)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 400,
                        fontSize: 'var(--text-display-sm)',
                        color: 'var(--color-ink)',
                        marginBottom: '0.625rem',
                      }}
                    >
                      {route.label}
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.65,
                      }}
                    >
                      {route.body}
                    </p>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  maxWidth: '62ch',
                }}
              >
                We do not have a street address. All guests receive detailed arrival
                instructions with their booking confirmation.
              </p>
            </div>
          </div>
        </section>
      </ContactReveal>
    </main>
  );
}
