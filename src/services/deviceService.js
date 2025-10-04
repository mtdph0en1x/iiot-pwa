// Service to fetch device data from Azure Functions API

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://iiotfunc-bugvhvexfbh0b7ha.westeurope-01.azurewebsites.net/api'  // Azure Function App
  : 'http://localhost:7071/api';  // Local development

export const deviceService = {
  /**
   * Get latest telemetry for all devices
   */
  async getDevices() {
    try {
      const response = await fetch(`${API_BASE_URL}/devices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const devices = await response.json();

      // Transform Cosmos DB data to match frontend expectations
      return devices.map(device => ({
        id: device.DeviceId,
        name: device.DeviceId,
        deviceType: device.DeviceType,
        lineId: device.LineId,
        lineName: device.LineName,
        temperature: `${Math.round(device.AvgTemperature)}°C`,
        productionRate: `${Math.round(device.AvgProductionRate)} units/hr`,
        status: determineStatus(device),
        lastUpdate: device.WindowEnd,
        errorCode: device.CurrentErrorCode
      }));
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },

  /**
   * Get detailed telemetry for a specific device (last 24 hours)
   */
  async getDeviceDetail(deviceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching device detail:', error);
      throw error;
    }
  }
};

/**
 * Determine device status based on telemetry
 */
function determineStatus(device) {
  if (device.CurrentErrorCode !== 0) return 'error';
  if (device.AvailabilityPercentage < 0.8) return 'offline';
  if (device.AvgTemperature > 80) return 'warning';
  return 'online';
}
