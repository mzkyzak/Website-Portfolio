import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
  const blobRefs = useRef([])
  const timeRef = useRef(0)

  useEffect(() => {
    let rafId

    const animate = () => {
      timeRef.current += 0.004

      blobRefs.current.forEach((blob, i) => {
        if (!blob) return

        const x =
          Math.sin(timeRef.current + i) * 180
        const y =
          Math.cos(timeRef.current + i * 1.3) * 80

        blob.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })

      rafId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* 🔮 BLOBS */}
      <div className="absolute inset-0">
        <div
          ref={(el) => (blobRefs.current[0] = el)}
          className="absolute top-0 -left-20 w-80 h-80 md:w-96 md:h-96 bg-purple-500 rounded-full blur-[140px] opacity-30"
        />
        <div
          ref={(el) => (blobRefs.current[1] = el)}
          className="absolute top-10 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[140px] opacity-25 hidden sm:block"
        />
        <div
          ref={(el) => (blobRefs.current[2] = el)}
          className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-25"
        />
        <div
          ref={(el) => (blobRefs.current[3] = el)}
          className="absolute bottom-0 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-[160px] opacity-20 hidden sm:block"
        />
      </div>

      {/* 🧊 GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* 🎞 VIGNETTE */}
      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />
    </div>
  )
}

export default AnimatedBackground