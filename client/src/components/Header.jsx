import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChartLine, FaHistory, FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/history', icon: <FaHistory />, label: 'History' }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-[#F97316]'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-[#F97316]' : 'bg-white'
                }`}
              >
                <span className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-[#F97316]'}`}>
                  PM
                </span>
              </motion.div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-[#1E293B]' : 'text-white'}`}>
                Process Monitor
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 transition-colors relative group ${
                    isScrolled 
                      ? 'text-[#64748B] hover:text-[#F97316]' 
                      : 'text-white hover:text-[#F8FAFC]'
                  }`}
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-lg"
                  >
                    {item.icon}
                  </motion.span>
                  <span>{item.label}</span>
                  <motion.div
                    className={`absolute bottom-0 left-0 w-full h-0.5 ${
                      isScrolled ? 'bg-[#F97316]' : 'bg-white'
                    } transform scale-x-0 group-hover:scale-x-100 transition-transform`}
                    initial={false}
                    animate={{
                      scaleX: location.pathname === item.path ? 1 : 0,
                    }}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-[#64748B]' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Last Updated Time */}
          <div className={`hidden md:block ${isScrolled ? 'text-[#64748B]' : 'text-white'}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              Last Updated: {new Date().toLocaleTimeString()}
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-[#F97316] text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
