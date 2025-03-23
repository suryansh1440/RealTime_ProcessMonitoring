import React, { useState } from 'react'
import { FaBell, FaChartBar, FaShieldAlt } from 'react-icons/fa'

const Settings = () => {
  const [settings, setSettings] = useState({
    alerts: {
      cpuThreshold: 80,
      memoryThreshold: 85,
      emailNotifications: true,
      pushNotifications: false
    },
    monitoring: {
      updateInterval: 5,
      retentionPeriod: 30,
      autoRefresh: true
    },
    security: {
      requireAuth: true,
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  })

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Alert Settings */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <FaBell className="text-red-500" />
            <h2 className="text-xl font-semibold">Alert Settings</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPU Usage Threshold (%)</label>
            <input
              type="number"
              value={settings.alerts.cpuThreshold}
              onChange={(e) => handleSettingChange('alerts', 'cpuThreshold', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Memory Usage Threshold (%)</label>
            <input
              type="number"
              value={settings.alerts.memoryThreshold}
              onChange={(e) => handleSettingChange('alerts', 'memoryThreshold', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.alerts.emailNotifications}
                onChange={(e) => handleSettingChange('alerts', 'emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.alerts.pushNotifications}
                onChange={(e) => handleSettingChange('alerts', 'pushNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <FaChartBar className="text-blue-500" />
            <h2 className="text-xl font-semibold">Monitoring Settings</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Interval (seconds)</label>
            <input
              type="number"
              value={settings.monitoring.updateInterval}
              onChange={(e) => handleSettingChange('monitoring', 'updateInterval', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Retention Period (days)</label>
            <input
              type="number"
              value={settings.monitoring.retentionPeriod}
              onChange={(e) => handleSettingChange('monitoring', 'retentionPeriod', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.monitoring.autoRefresh}
                onChange={(e) => handleSettingChange('monitoring', 'autoRefresh', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-refresh Dashboard</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <FaShieldAlt className="text-green-500" />
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireAuth}
                onChange={(e) => handleSettingChange('security', 'requireAuth', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Require Authentication</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 