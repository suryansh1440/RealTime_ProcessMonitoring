import React, { useState, useEffect, useCallback, useRef } from 'react'
import { FaMicrochip, FaMemory, FaServer, FaExclamationTriangle, FaShieldAlt, FaChartBar, FaClock, FaMicrochip as FaCpu, FaDatabase, FaNetworkWired, FaBell } from 'react-icons/fa'
import io from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeProcesses: 0,
    alerts: 0
  })

  const [trends, setTrends] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeProcesses: 0,
    alerts: 0
  })

  const previousMetrics = useRef({
    cpuUsage: 0,
    memoryUsage: 0,
    activeProcesses: 0,
    alerts: 0
  })

  const [processes, setProcesses] = useState([])

  const calculateTrend = (current, previous) => {
    if (previous === 0) return null
    const trend = ((current - previous) / previous) * 100
    // Only return the trend if it's significant enough (more than 0.1%)
    return Math.abs(trend) > 0.1 ? Math.round(trend * 100) / 100 : null
  }

  const formatValue = (value, type = 'number') => {
    if (type === 'percentage') {
      return `${Math.round(value)}%`
    }
    return value
  }

  const updateMetrics = useCallback((data) => {
    setSystemMetrics(prev => {
      // Calculate trends before updating the metrics
      const newTrends = {
        cpuUsage: calculateTrend(data.cpuUsage, prev.cpuUsage),
        memoryUsage: calculateTrend(data.memoryUsage, prev.memoryUsage),
        activeProcesses: calculateTrend(data.activeProcesses, prev.activeProcesses),
        alerts: calculateTrend(data.alerts || 0, prev.alerts)
      }
      setTrends(newTrends)
      
      // Store current values as previous for next update
      previousMetrics.current = {
        cpuUsage: data.cpuUsage,
        memoryUsage: data.memoryUsage,
        activeProcesses: data.activeProcesses,
        alerts: data.alerts || 0
      }

      return {
        ...prev,
        cpuUsage: data.cpuUsage,
        memoryUsage: data.memoryUsage,
        activeProcesses: data.activeProcesses,
        alerts: data.alerts || 0
      }
    })

    setProcesses(prev => {
      if (JSON.stringify(prev) === JSON.stringify(data.processes)) {
        return prev
      }
      return data.processes || []
    })
  }, [])

  useEffect(() => {
    const socket = io('http://localhost:3000')
    socket.on('systemMetrics', updateMetrics)
    return () => socket.disconnect()
  }, [updateMetrics])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  const MetricCard = ({ title, value, icon, color, showProgress = false, trend = null }) => {
    const numericValue = typeof value === 'string' ? parseInt(value) : value
    
    return (
      <div className="relative bg-white dark:bg-[#1E293B] rounded-xl p-6 overflow-hidden group hover:shadow-xl transition-all duration-300 border border-[#E2E8F0] dark:border-[#1E293B]">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        {/* Card Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#475569] dark:text-[#CBD5E1] text-sm mb-1 font-medium">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-[#0F172A] dark:text-white">
                  {formatValue(numericValue, showProgress ? 'percentage' : 'number')}
                </p>
                {trend !== null && (
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          </div>
          
          {showProgress && (
            <div className="mt-4">
              <div className="w-full bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full h-2.5 overflow-hidden relative">
                {/* Main Progress Bar */}
                <motion.div 
                  className={`${color} h-full rounded-full shadow-lg relative`}
                  initial={false}
                  animate={{ width: `${numericValue}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 30,
                    damping: 15,
                    mass: 1.5
                  }}
                />
                {/* Shimmer Effect */}
                <motion.div
                  className={`absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent`}
                  initial={{ x: -100 }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                {/* Pulsing Glow Effect */}
                <motion.div
                  className={`absolute top-0 left-0 h-full w-8 ${color} opacity-20 blur-md`}
                  initial={{ x: -100 }}
                  animate={{ x: `${numericValue * 2}%` }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: <FaCpu className="text-[#F97316] text-3xl" />,
      title: "Real-time Monitoring",
      description: "Track system performance metrics in real-time with millisecond precision",
      color: "bg-[#F97316]"
    },
    {
      icon: <FaDatabase className="text-[#14B8A6] text-3xl" />,
      title: "Performance Analytics",
      description: "Get detailed insights into CPU, memory, and process utilization",
      color: "bg-[#14B8A6]"
    },
    {
      icon: <FaNetworkWired className="text-[#1E293B] text-3xl" />,
      title: "Historical Data",
      description: "Access historical performance data for trend analysis and optimization",
      color: "bg-[#1E293B]"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl flex items-center justify-center shadow-lg"
          >
            <FaChartBar className="text-white text-5xl" />
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold text-[#0F172A] dark:text-white mb-4">
          System Performance Monitor
        </h1>
        <p className="text-[#475569] dark:text-[#CBD5E1] text-xl max-w-2xl mx-auto">
          A powerful tool for monitoring and analyzing system performance in real-time. 
          Track CPU usage, memory consumption, and active processes with precision.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="bg-white dark:bg-[#1E293B] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E2E8F0] dark:border-[#1E293B]"
          >
            <div className={`p-4 ${feature.color} bg-opacity-10 rounded-xl mb-4 inline-block`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">{feature.title}</h3>
            <p className="text-[#475569] dark:text-[#CBD5E1]">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="CPU Usage"
          value={`${systemMetrics.cpuUsage}%`}
          icon={<FaCpu className="text-[#F97316] text-2xl" />}
          color="bg-[#F97316]"
          showProgress={true}
          trend={trends.cpuUsage}
        />
        <MetricCard
          title="Memory Usage"
          value={`${systemMetrics.memoryUsage}%`}
          icon={<FaDatabase className="text-[#14B8A6] text-2xl" />}
          color="bg-[#14B8A6]"
          showProgress={true}
          trend={trends.memoryUsage}
        />
        <MetricCard
          title="Active Processes"
          value={systemMetrics.activeProcesses}
          icon={<FaNetworkWired className="text-[#1E293B] text-2xl" />}
          color="bg-[#1E293B]"
          showProgress={false}
          trend={trends.activeProcesses}
        />
        <MetricCard
          title="Active Alerts"
          value={systemMetrics.alerts}
          icon={<FaBell className="text-[#DC2626] text-2xl" />}
          color="bg-[#DC2626]"
          showProgress={false}
          trend={trends.alerts}
        />
      </div>

      {/* Process List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A] dark:text-white">Active Processes</h2>
            <p className="text-[#475569] dark:text-[#CBD5E1] text-sm mt-1">List of currently running system processes</p>
          </div>
          <div className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium">
            {processes.length} Processes
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider w-1/3">Process Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider w-1/6">PID</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider w-1/6">CPU %</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider w-1/6">Memory (MB)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider w-1/6">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#1E293B] divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                  {processes.map((process) => (
                    <tr 
                      key={process.id} 
                      className="hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0F172A] dark:text-white truncate max-w-xs">{process.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#CBD5E1]">{process.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#CBD5E1]">{process.cpu}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#CBD5E1]">{process.memory} MB</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white">
                          {process.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
