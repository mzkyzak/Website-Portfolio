import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      navItems.forEach((item) => {
        const section = document.querySelector(item.href)
        if (!section) return

        const top = section.offsetTop - 120
        const bottom = top + section.offsetHeight

        if (window.scrollY >= top && window.scrollY < bottom) {
          setActiveSection(item.href.replace("#", ""))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const section = document.querySelector(href)
    if (!section) return

    window.scrollTo({
      top: section.offsetTop - 90,
      behavior: "smooth",
    })

    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030014]/60 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="px-[5%] lg:px-[10%] h-16 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="text-xl font-bold bg-gradient-to-r from-[#d3380d] to-[#f2270d] bg-clip-text text-transparent"
        >
          mzkyzak
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "")
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="relative text-sm font-medium group"
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                      : "text-[#e2d3fd] group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] transition-transform ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            )
          })}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU - ONLY TEXT VERSION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full md:hidden pointer-events-none"
          >
            <div className="flex flex-col items-center py-10 space-y-8 pointer-events-auto">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`text-xl tracking-[0.3em] uppercase font-black transition-all drop-shadow-[0_2px_15px_rgba(0,0,0,1)] ${
                    activeSection === item.href.replace("#", "")
                      ? "text-red-500 scale-110"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar