'use client';
import { useSettings } from '@/hooks/useApi';

const TrustedBy = () => {
  const { data: settings } = useSettings();
  const s = settings || {};

  let companies = [];
  try {
    const raw = s.trustedBy;
    if (raw) {
      if (typeof raw === 'string') {
        if (raw.startsWith('[')) {
          companies = JSON.parse(raw);
        } else {
          companies = raw.split(',').map(c => c.trim()).filter(Boolean);
        }
      } else if (Array.isArray(raw)) {
        companies = raw;
      }
    }
  } catch (e) {
    companies = [];
  }

  if (companies.length === 0) {
    companies = ['TechCorp', 'InnovateLabs', 'DigitalStudio', 'StartupHub', 'CloudNine', 'DataFlow'];
  }

  const doubled = [...companies, ...companies];

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-xs uppercase tracking-widest text-dim font-medium">
          Trusted by
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--bg)] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--bg)] to-transparent z-10" />
        <div className="flex overflow-hidden">
          <div className="flex gap-16 animate-marquee items-center">
            {doubled.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-sm font-medium text-dim hover:text-muted transition-colors whitespace-nowrap tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
