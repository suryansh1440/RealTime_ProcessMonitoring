import React from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Contact', href: '#' },
  ]

  const socialLinks = [
    { icon: <FaGithub />, href: '#', label: 'GitHub' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-[#1E293B] text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center"
            >
              <span className="text-white text-xl font-bold">PM</span>
            </motion.div>
            <p className="text-[#E2E8F0] text-sm">
              Process Monitor - Real-time system monitoring and analytics
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href={link.href}
                    className="text-[#E2E8F0] hover:text-[#F97316] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <a href="#" className="text-[#E2E8F0] hover:text-[#F97316] transition-colors text-sm">
                  Documentation
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="#" className="text-[#E2E8F0] hover:text-[#F97316] transition-colors text-sm">
                  API Reference
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="#" className="text-[#E2E8F0] hover:text-[#F97316] transition-colors text-sm">
                  Support
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center text-white hover:bg-[#14B8A6] transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#0F172A]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#E2E8F0] text-sm">
              © {currentYear} Process Monitor. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  className="text-[#E2E8F0] hover:text-[#F97316] transition-colors text-sm"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
