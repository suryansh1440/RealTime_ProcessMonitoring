import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChartLine, FaHistory, FaBars, FaTimes, FaServer, FaClock, FaBell, FaUser, FaExclamationCircle, FaTimesCircle, FaSignOutAlt, FaCog, FaUserCircle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import io from 'socket.io-client'
import { playNotificationSound, cleanupNotificationSound } from '../utils/notificationSound'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [systemInfo, setSystemInfo] = useState({
    uptime: '0:00:00',
    serverStatus: 'offline',
    notifications: 0
  })
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'System User',
    role: 'Administrator'
  })
  const MAX_NOTIFICATIONS = 10 // Limit to 10 most recent notifications
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let socket = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    const reconnectDelay = 1000

    const connectSocket = () => {
      socket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        timeout: 5000,
        transports: ['websocket', 'polling']
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        setIsConnected(true)
        setSystemInfo(prev => ({
          ...prev,
          serverStatus: 'online'
        }))
        reconnectAttempts = 0
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
        setIsConnected(false)
        setSystemInfo(prev => ({
          ...prev,
          serverStatus: 'offline'
        }))
      })

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        setIsConnected(false)
        setSystemInfo(prev => ({
          ...prev,
          serverStatus: 'offline'
        }))
      })

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt:', attemptNumber)
        reconnectAttempts = attemptNumber
      })

      socket.on('reconnect_failed', () => {
        console.log('Reconnection failed')
        setIsConnected(false)
        setSystemInfo(prev => ({
          ...prev,
          serverStatus: 'offline'
        }))
      })
      
      socket.on('systemInfo', (data) => {
        if (data) {
          setSystemInfo(prev => ({
            ...prev,
            uptime: data.uptime || '0:00:00',
            serverStatus: 'online',
            notifications: Math.min(data.notifications || 0, MAX_NOTIFICATIONS)
          }))
          if (data.recentNotifications) {
            setNotifications(data.recentNotifications.slice(0, MAX_NOTIFICATIONS))
          }
        }
      })

      socket.on('newNotification', (notification) => {
        setNotifications(prev => {
          const newNotifications = [notification, ...prev].slice(0, MAX_NOTIFICATIONS)
          setSystemInfo(prev => ({
            ...prev,
            notifications: newNotifications.length
          }))
          return newNotifications
        })
        // Play notification sound
        playNotificationSound()
      })

      // Request initial system info
      socket.emit('requestSystemInfo')
    }

    connectSocket()

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect()
      }
      cleanupNotificationSound()
    }
  }, [])

  const handleAcknowledgeNotification = (notificationId) => {
    setNotifications(prev => {
      const newNotifications = prev.filter(n => n.id !== notificationId)
      setSystemInfo(prev => ({
        ...prev,
        notifications: newNotifications.length
      }))
      return newNotifications
    })
    socket.emit('acknowledgeNotification', notificationId)
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setSystemInfo(prev => ({
      ...prev,
      notifications: 0
    }))
    notifications.forEach(notification => {
      socket.emit('acknowledgeNotification', notification.id)
    })
  }

  const navItems = [
    { path: '/', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/history', icon: <FaHistory />, label: 'History' }
  ]

  const ServerStatusIndicator = () => (
    <div className={`flex items-center space-x-2 ${isScrolled ? 'text-[#64748B]' : 'text-white'}`}>
      <FaServer className="text-lg" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">Server Status</span>
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center text-red-500"
            >
              <FaExclamationCircle className="text-xs mr-1" />
              <span className="text-xs">No connection</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )

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

          {/* System Info and Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Server Status */}
            <ServerStatusIndicator />

            {/* Uptime */}
            <div className={`flex items-center space-x-2 ${isScrolled ? 'text-[#64748B]' : 'text-white'}`}>
              <FaClock className="text-lg" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-xs">{systemInfo.uptime}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full ${
                  isScrolled 
                    ? 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaBell className="text-lg" />
                {systemInfo.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {systemInfo.notifications}
                  </span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-lg shadow-lg border border-[#E2E8F0] dark:border-[#1E293B] z-50"
                  >
                    <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <span className="px-2 py-1 bg-[#F97316] text-white text-xs rounded-full">
                            {notifications.length}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-[#64748B] hover:text-[#F97316] text-sm"
                          >
                            Clear All
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-[#64748B] hover:text-[#F97316]"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start space-x-2">
                                  <div className={`mt-1 w-2 h-2 rounded-full ${
                                    notification.type === 'warning' ? 'bg-yellow-500' :
                                    notification.type === 'error' ? 'bg-red-500' :
                                    'bg-[#F97316]'
                                  }`} />
                                  <div>
                                    <p className={`text-sm font-medium ${
                                      notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                                      notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
                                      'text-[#0F172A] dark:text-white'
                                    }`}>
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-[#64748B] mt-1">
                                      {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAcknowledgeNotification(notification.id)}
                                className="ml-2 text-[#64748B] hover:text-[#F97316]"
                              >
                                <FaTimesCircle />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[#64748B]">
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`relative p-2 rounded-full ${
                  isScrolled 
                    ? 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaUser className="text-lg" />
              </motion.button>

              {/* User Profile Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E293B] rounded-lg shadow-lg border border-[#E2E8F0] dark:border-[#1E293B] z-50"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                            {userInfo.name}
                          </h3>
                          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                            {userInfo.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add profile settings functionality
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-[#64748B] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] flex items-center space-x-2"
                      >
                        <FaCog className="text-[#F97316]" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add logout functionality
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-[#64748B] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] flex items-center space-x-2"
                      >
                        <FaSignOutAlt className="text-[#F97316]" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-[#64748B]' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
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
                {/* Mobile System Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8FAFC] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaServer className="text-[#F97316]" />
                    <div>
                      <span className="text-sm font-medium text-[#64748B]">Server</span>
                      <div className="flex items-center space-x-1">
                        <span className={`block text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                          {isConnected ? 'Online' : 'Offline'}
                        </span>
                        {!isConnected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center text-red-500"
                          >
                            <FaExclamationCircle className="text-xs mr-1" />
                            <span className="text-xs">No connection</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-[#F97316]" />
                    <div>
                      <span className="text-sm font-medium text-[#64748B]">Uptime</span>
                      <span className="block text-xs text-[#64748B]">{systemInfo.uptime}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
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

                {/* Mobile Actions */}
                <div className="flex justify-around pt-4 border-t border-[#E2E8F0]">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 text-[#64748B]"
                  >
                    <FaBell className="text-lg" />
                    {systemInfo.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {systemInfo.notifications}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-[#64748B]"
                  >
                    <FaUser className="text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
