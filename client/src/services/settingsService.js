import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const settingsService = {
  // Get all settings
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      return response.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Update settings
  updateSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_URL}/settings`, settings)
      return response.data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Reset settings to default
  resetSettings: async () => {
    try {
      const response = await axios.post(`${API_URL}/settings/reset`)
      return response.data
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw error
    }
  }
} 