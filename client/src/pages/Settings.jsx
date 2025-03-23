import React, { useState, useEffect } from 'react'
import { FaBell, FaChartLine, FaDatabase, FaShieldAlt, FaUser, FaPalette, FaSave, FaUndo } from 'react-icons/fa'
import { settingsService } from '../services/settingsService'
import { toast } from 'react-toastify'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      cpuAlert: true,
      memoryAlert: true,
      processAlert: true,
      emailNotifications: false,
      pushNotifications: true
    },
    monitoring: {
      updateInterval: 1000,
      maxProcesses: 50,
      retentionPeriod: 30,
      autoRefresh: true
    },
    appearance: {
      theme: 'light',
      accentColor: '#F97316',
      showAnimations: true,
      compactMode: false
    },
    security: {
      requireAuth: true,
      sessionTimeout: 30,
      twoFactorAuth: false,
      apiKey: 'sk-1234567890abcdef'
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const savedSettings = await settingsService.getSettings()
      setSettings(savedSettings)
    } catch (error) {
      toast.error('Failed to load settings')
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await settingsService.updateSettings(settings)
      toast.success('Settings saved successfully')
      
      // Apply theme changes immediately
      if (settings.appearance.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // Apply compact mode
      if (settings.appearance.compactMode) {
        document.body.classList.add('compact-mode')
      } else {
        document.body.classList.remove('compact-mode')
      }

      // Update monitoring settings in the Home component
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }))
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        setIsLoading(true)
        const defaultSettings = await settingsService.resetSettings()
        setSettings(defaultSettings)
        toast.success('Settings reset to default')
      } catch (error) {
        toast.error('Failed to reset settings')
        console.error('Error resetting settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const SettingSection = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-[#F97316] bg-opacity-10 rounded-lg mr-4">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-[#1E293B]">{title}</h2>
      </div>
      {children}
    </div>
  )

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#F97316]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const InputField = ({ label, type, value, onChange, placeholder, min, max }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#64748B] mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const val = type === 'number' ? parseInt(e.target.value) : e.target.value
          if (type === 'number' && (min !== undefined && val < min || max !== undefined && val > max)) {
            return
          }
          onChange(val)
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
      />
    </div>
  )

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#64748B] mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">Settings</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <FaUndo className="mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Notifications Settings */}
      <SettingSection title="Notifications" icon={<FaBell className="text-[#F97316] text-xl" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">CPU Usage Alerts</h3>
              <p className="text-sm text-[#64748B]">Get notified when CPU usage exceeds threshold</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.cpuAlert}
              onChange={() => handleSettingChange('notifications', 'cpuAlert', !settings.notifications.cpuAlert)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Memory Usage Alerts</h3>
              <p className="text-sm text-[#64748B]">Get notified when memory usage exceeds threshold</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.memoryAlert}
              onChange={() => handleSettingChange('notifications', 'memoryAlert', !settings.notifications.memoryAlert)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Process Alerts</h3>
              <p className="text-sm text-[#64748B]">Get notified about critical process events</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.processAlert}
              onChange={() => handleSettingChange('notifications', 'processAlert', !settings.notifications.processAlert)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Email Notifications</h3>
              <p className="text-sm text-[#64748B]">Receive alerts via email</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.emailNotifications}
              onChange={() => handleSettingChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Push Notifications</h3>
              <p className="text-sm text-[#64748B]">Receive browser push notifications</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.pushNotifications}
              onChange={() => handleSettingChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
            />
          </div>
        </div>
      </SettingSection>

      {/* Monitoring Settings */}
      <SettingSection title="Monitoring" icon={<FaChartLine className="text-[#F97316] text-xl" />}>
        <div className="space-y-4">
          <InputField
            label="Update Interval (ms)"
            type="number"
            value={settings.monitoring.updateInterval}
            onChange={(value) => handleSettingChange('monitoring', 'updateInterval', value)}
            placeholder="1000"
            min={100}
            max={10000}
          />
          <InputField
            label="Max Processes to Display"
            type="number"
            value={settings.monitoring.maxProcesses}
            onChange={(value) => handleSettingChange('monitoring', 'maxProcesses', value)}
            placeholder="50"
            min={10}
            max={200}
          />
          <SelectField
            label="Data Retention Period"
            value={settings.monitoring.retentionPeriod}
            onChange={(value) => handleSettingChange('monitoring', 'retentionPeriod', parseInt(value))}
            options={[
              { value: 7, label: '7 days' },
              { value: 30, label: '30 days' },
              { value: 90, label: '90 days' },
              { value: 365, label: '1 year' }
            ]}
          />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Auto Refresh</h3>
              <p className="text-sm text-[#64748B]">Automatically refresh data at specified interval</p>
            </div>
            <ToggleSwitch
              checked={settings.monitoring.autoRefresh}
              onChange={() => handleSettingChange('monitoring', 'autoRefresh', !settings.monitoring.autoRefresh)}
            />
          </div>
        </div>
      </SettingSection>

      {/* Appearance Settings */}
      <SettingSection title="Appearance" icon={<FaPalette className="text-[#F97316] text-xl" />}>
        <div className="space-y-4">
          <SelectField
            label="Theme"
            value={settings.appearance.theme}
            onChange={(value) => handleSettingChange('appearance', 'theme', value)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' }
            ]}
          />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Show Animations</h3>
              <p className="text-sm text-[#64748B]">Enable smooth transitions and animations</p>
            </div>
            <ToggleSwitch
              checked={settings.appearance.showAnimations}
              onChange={() => handleSettingChange('appearance', 'showAnimations', !settings.appearance.showAnimations)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Compact Mode</h3>
              <p className="text-sm text-[#64748B]">Display more information in a compact layout</p>
            </div>
            <ToggleSwitch
              checked={settings.appearance.compactMode}
              onChange={() => handleSettingChange('appearance', 'compactMode', !settings.appearance.compactMode)}
            />
          </div>
        </div>
      </SettingSection>

      {/* Security Settings */}
      <SettingSection title="Security" icon={<FaShieldAlt className="text-[#F97316] text-xl" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Require Authentication</h3>
              <p className="text-sm text-[#64748B]">Enable login requirement for accessing the dashboard</p>
            </div>
            <ToggleSwitch
              checked={settings.security.requireAuth}
              onChange={() => handleSettingChange('security', 'requireAuth', !settings.security.requireAuth)}
            />
          </div>
          <InputField
            label="Session Timeout (minutes)"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
            placeholder="30"
            min={5}
            max={120}
          />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1E293B]">Two-Factor Authentication</h3>
              <p className="text-sm text-[#64748B]">Add an extra layer of security to your account</p>
            </div>
            <ToggleSwitch
              checked={settings.security.twoFactorAuth}
              onChange={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
            />
          </div>
          <div className="relative">
            <InputField
              label="API Key"
              type="password"
              value={settings.security.apiKey}
              onChange={(value) => handleSettingChange('security', 'apiKey', value)}
              placeholder="Enter your API key"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(settings.security.apiKey)
                toast.success('API key copied to clipboard')
              }}
              className="absolute right-2 top-8 text-[#64748B] hover:text-[#F97316]"
            >
              Copy
            </button>
          </div>
        </div>
      </SettingSection>
    </div>
  )
}

export default Settings 