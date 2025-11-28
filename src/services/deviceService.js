// Service to fetch device data from Azure Functions API

const API_BASE_URL = import.meta.env.PROD
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

      // Transform Cosmos DB data
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
   * Get telemetry for device (last 24 hours)
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
  },

  /**
   * Get logs from blob storage
   */
  async getLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.deviceId) queryParams.append('deviceId', params.deviceId);
      if (params.date) queryParams.append('date', params.date);
      if (params.container) queryParams.append('container', params.container);

      const response = await fetch(`${API_BASE_URL}/logs?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  /**
   * Get available log dates
   */
  async getLogDates(deviceId = null, container = 'telemetry-qcs') {
    try {
      const queryParams = new URLSearchParams();
      if (deviceId) queryParams.append('deviceId', deviceId);
      queryParams.append('container', container);

      const response = await fetch(`${API_BASE_URL}/logs/dates?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching log dates:', error);
      throw error;
    }
  },

  /**
   * Get line KPI data
   */
  async getLineKPIs(lineId = null, daysBack = 30) {
    try {
      const queryParams = new URLSearchParams();
      if (lineId) queryParams.append('lineId', lineId);
      queryParams.append('daysBack', daysBack.toString());

      const response = await fetch(`${API_BASE_URL}/kpis?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching line KPIs:', error);
      throw error;
    }
  },

  /**
   * Update device twin desired property
   */
  async updateDeviceTwin(deviceId, propertyName, propertyValue) {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/twin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyName, propertyValue }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating device twin:', error);
      throw error;
    }
  },

  /**
   * Get device status change history
   */
  async getDeviceStatusHistory(deviceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/status-history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching device status history:', error);
      throw error;
    }
  },

  /**
   * Get error events with optional filters
   */
  async getErrors(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.deviceId) queryParams.append('deviceId', params.deviceId);
      if (params.lineId) queryParams.append('lineId', params.lineId);
      if (params.daysBack) queryParams.append('daysBack', params.daysBack.toString());

      const url = `${API_BASE_URL}/errors${queryParams.toString() ? '?' + queryParams : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const errors = await response.json();

      // Transform API data
      return errors.map((error, index) => ({
        id: index + 1,
        name: error.DeviceId,
        hubId: error.LineId,
        errorCode: error.ErrorCode,
        errorType: error.ErrorType,
        severity: error.Severity,
        timestamp: error.Timestamp,
        alertCode: `${error.ErrorType.toUpperCase()}-${error.ErrorCode}`,
        suggestedAction: getSuggestedAction(error.ErrorType),
        actionTaken: error.ActionTaken,
        alertId: error.AlertId,
        errorCount: error.ErrorCount
      }));
    } catch (error) {
      console.error('Error fetching error events:', error);
      throw error;
    }
  }
};

/**
 * Get suggested action based on error type 
 */
function getSuggestedAction(errorType) {
  const actionMap = {
    'EmergencyStop': 'Emergency stop activated - Check safety systems',
    'PowerFailure': 'Power failure detected - Restore power supply',
    'SensorFailure': 'Sensor malfunction - Replace or recalibrate sensor',
    'UnknownError': 'Unknown error - Inspect device manually',
    'LinePattern': 'Multiple errors detected - Check entire production line'
  };

  return actionMap[errorType] || 'Check device status';
}

/**
 * Determine device status based on telemetry
 */
function determineStatus(device) {
  // Check if device is offline 
  const lastUpdateTime = new Date(device.WindowEnd);
  const minutesSinceUpdate = (Date.now() - lastUpdateTime) / 1000 / 60;

  if (minutesSinceUpdate > 5) return 'offline';
  if (device.CurrentErrorCode !== 0) return 'error';
  if (device.AvgTemperature > 80) return 'warning';
  return 'online';
}
