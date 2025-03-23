import React, { useState, useEffect } from 'react'
import { FaMicrochip, FaMemory, FaServer, FaExclamationTriangle } from 'react-icons/fa'
import io from 'socket.io-client'

const History = () => {
  const [historicalData, setHistoricalData] = useState({
    cpuHistory: [],
    memoryHistory: [],
    processHistory: [],
    timestamps: []
  })

  useEffect(() => {
    const socket = io('http://localhost:3000')
    const maxDataPoints = 30 // Keep last 30 data points

    socket.on('systemMetrics', (data) => {
      setHistoricalData(prev => {
        const newTimestamp = new Date().toLocaleTimeString()
        const newData = {
          cpuHistory: [...prev.cpuHistory, data.cpuUsage].slice(-maxDataPoints),
          memoryHistory: [...prev.memoryHistory, data.memoryUsage].slice(-maxDataPoints),
          processHistory: [...prev.processHistory, data.activeProcesses].slice(-maxDataPoints),
          timestamps: [...prev.timestamps, newTimestamp].slice(-maxDataPoints)
        }
        return newData
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const getAverage = (array) => {
    if (array.length === 0) return 0
    return (array.reduce((a, b) => a + b, 0) / array.length).toFixed(1)
  }

  const getPeak = (array) => {
    if (array.length === 0) return 0
    return Math.max(...array)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">System History</h1>

      {/* Historical Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average CPU Usage</p>
              <p className="text-2xl font-bold">{getAverage(historicalData.cpuHistory)}%</p>
              <p className="text-sm text-gray-500">Peak: {getPeak(historicalData.cpuHistory)}%</p>
            </div>
            <FaMicrochip className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Memory Usage</p>
              <p className="text-2xl font-bold">{getAverage(historicalData.memoryHistory)}%</p>
              <p className="text-sm text-gray-500">Peak: {getPeak(historicalData.memoryHistory)}%</p>
            </div>
            <FaMemory className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Processes</p>
              <p className="text-2xl font-bold">{getAverage(historicalData.processHistory)}</p>
              <p className="text-sm text-gray-500">Peak: {getPeak(historicalData.processHistory)}</p>
            </div>
            <FaServer className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Historical Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Processes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicalData.timestamps.map((timestamp, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historicalData.cpuHistory[index]}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historicalData.memoryHistory[index]}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historicalData.processHistory[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default History 