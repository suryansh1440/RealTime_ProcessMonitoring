import React, { useState, useEffect, useCallback } from 'react'
import { FaMicrochip, FaMemory, FaServer, FaExclamationTriangle, FaShieldAlt, FaChartBar, FaClock } from 'react-icons/fa'
import io from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeProcesses: 0,
    alerts: 0
  })

  const [processes, setProcesses] = useState([])

  const updateMetrics = useCallback((data) => {
    setSystemMetrics(prev => ({
      ...prev,
      cpuUsage: data.cpuUsage,
      memoryUsage: data.memoryUsage,
      activeProcesses: data.activeProcesses,
      alerts: 0
    }))
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

  const MetricCard = ({ title, value, icon, color, showProgress = false }) => {
    const numericValue = typeof value === 'string' ? parseInt(value) : value
    
    return (
      <div className="relative bg-white rounded-xl p-6 overflow-hidden group">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        {/* Card Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#64748B] text-sm mb-1 font-medium">{title}</p>
              <p className="text-3xl font-bold text-[#1E293B]">
                {value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm`}>
              {icon}
            </div>
          </div>
          
          {showProgress && (
            <div className="mt-4">
              <div className="w-full bg-[#F8FAFC] rounded-full h-3 overflow-hidden">
                <div 
                  className={`${color} h-full rounded-full shadow-lg`}
                  style={{
                    width: `${numericValue}%`,
                    transition: 'width 0.3s ease-in-out'
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
      icon: <FaShieldAlt className="text-[#F97316] text-2xl" />,
      title: "Real-time Monitoring",
      description: "Track system performance metrics in real-time with millisecond precision"
    },
    {
      icon: <FaChartBar className="text-[#14B8A6] text-2xl" />,
      title: "Performance Analytics",
      description: "Get detailed insights into CPU, memory, and process utilization"
    },
    {
      icon: <FaClock className="text-[#1E293B] text-2xl" />,
      title: "Historical Data",
      description: "Access historical performance data for trend analysis and optimization"
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
        <h1 className="text-5xl font-bold text-[#1E293B] mb-4">
          System Performance Monitor
        </h1>
        <p className="text-[#64748B] text-xl max-w-2xl mx-auto">
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
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-[#1E293B] mb-2">{feature.title}</h3>
            <p className="text-[#64748B]">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="CPU Usage"
          value={`${systemMetrics.cpuUsage}%`}
          icon={<FaMicrochip className="text-[#F97316] text-2xl" />}
          color="bg-[#F97316]"
          showProgress={true}
        />
        <MetricCard
          title="Memory Usage"
          value={`${systemMetrics.memoryUsage}%`}
          icon={<FaMemory className="text-[#14B8A6] text-2xl" />}
          color="bg-[#14B8A6]"
          showProgress={true}
        />
        <MetricCard
          title="Active Processes"
          value={systemMetrics.activeProcesses}
          icon={<FaServer className="text-[#1E293B] text-2xl" />}
          color="bg-[#1E293B]"
          showProgress={false}
        />
        <MetricCard
          title="Active Alerts"
          value={systemMetrics.alerts}
          icon={<FaExclamationTriangle className="text-[#DC2626] text-2xl" />}
          color="bg-[#DC2626]"
          showProgress={false}
        />
      </div>

      {/* Process List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[#F8FAFC] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1E293B]">Active Processes</h2>
            <p className="text-[#64748B] text-sm mt-1">List of currently running system processes</p>
          </div>
          <div className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium">
            {processes.length} Processes
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-[#F8FAFC]">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider w-1/3">Process Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider w-1/6">PID</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider w-1/6">CPU %</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider w-1/6">Memory (MB)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider w-1/6">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#F8FAFC]">
                  {processes.map((process) => (
                    <tr 
                      key={process.id} 
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1E293B] truncate max-w-xs">{process.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">{process.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">{process.cpu}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">{process.memory}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#F8FAFC] text-[#1E293B]">
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
