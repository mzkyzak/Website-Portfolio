import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

export default function ParticlesBg() {
  const init = async (engine) => {
    await loadSlim(engine)
  }

  return (
    <Particles
      init={init}
      options={{
        fpsLimit: 30,
        particles: {
          number: { value: 40 },
          size: { value: 1 },
          move: { enable: true, speed: 0.4 },
          opacity: { value: 0.4 },
        },
      }}
      className="fixed inset-0 -z-10"
    />
  )
}