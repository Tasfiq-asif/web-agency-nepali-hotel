import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';

export default function BookPage() {
  return (
    <main>
      <div
        className="section bg-canvas"
        style={{ paddingTop: 'calc(var(--section-gap) + 5rem)' }}
      >
        <div className="container" style={{ maxWidth: 520 }}>
          <p className="label" style={{ marginBottom: '0.75rem' }}>
            Reserve Your Stay
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Choose your dates
          </h1>

          <AvailabilityCalendar />
        </div>
      </div>
    </main>
  );
}
