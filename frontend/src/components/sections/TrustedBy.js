'use client';
import { useSettings } from '@/hooks/useApi';

const TrustedBy = () => {
  const { data: settings } = useSettings();
  const s = settings || {};

  let technologies = [];
  try {
    const raw = s.technologies;
    if (raw) {
      if (typeof raw === 'string') {
        if (raw.startsWith('[')) {
          technologies = JSON.parse(raw);
        } else {
          technologies = raw.split(',').map(c => c.trim()).filter(Boolean);
        }
      } else if (Array.isArray(raw)) {
        technologies = raw;
      }
    }
  } catch (e) {
    technologies = [];
  }

  if (technologies.length === 0) {
    technologies = ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Three.js', 'Docker', 'Figma'];
  }

  const doubled = [...technologies, ...technologies];

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-xs uppercase tracking-widest text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          Technologies
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
                className="text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide"
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
