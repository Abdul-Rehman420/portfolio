import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 pointer-events-none"
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          number: { value: 80, density: { enable: true } },
          color: { value: "#2563EB" },
          links: { enable: true, color: "#2563EB", opacity: 0.15, distance: 150 },
          move: { enable: true, speed: 1, direction: "none", outModes: "bounce" },
          size: { value: { min: 1, max: 3 } },
          opacity: { value: 0.3 },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100 },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
