'use client'

import { memo, type FC } from 'react'
import { motion } from 'framer-motion'
import { useSacredStore } from '@/store/SacredStore'

// Centralize navigation links to avoid recreation on each render
const NAV_LINKS = [
  { href: '/research', label: 'Research' },
  { href: '/data', label: 'Data' },
  { href: '/collaborate', label: 'Collaborate' },
  { href: '/about', label: 'About' },
]

export const Navigation: FC = memo(() => {
  // Removed unused `sidebarOpen` state to eliminate dead code
  const { toggleSidebar } = useSacredStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-emerald-400"
          >
            MKWW
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="md:hidden text-emerald-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  )
})

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink: FC<NavLinkProps> = memo(({ href, children }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-200"
  >
    {children}
  </motion.a>
))
