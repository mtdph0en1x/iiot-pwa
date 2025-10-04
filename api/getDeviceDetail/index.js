const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos DB client
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("IIoTMonitoring");
const container = database.container("Telemetry");

module.exports = async function (context, req) {
    const deviceId = req.params.deviceId;
    context.log(`Getting details for device: ${deviceId}`);

    try {
        // Get last 24 hours of data for the device
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const query = {
            query: `
                SELECT *
                FROM c
                WHERE c.DeviceId = @deviceId
                  AND c.DocumentType LIKE 'telemetry-%'
                  AND c.WindowEnd >= @oneDayAgo
                ORDER BY c.WindowEnd DESC
            `,
            parameters: [
                { name: "@deviceId", value: deviceId },
                { name: "@oneDayAgo", value: oneDayAgo }
            ]
        };

        const { resources: items } = await container.items
            .query(query)
            .fetchAll();

        if (items.length === 0) {
            context.res = {
                status: 404,
                body: { error: "Device not found" }
            };
            return;
        }

        // Latest record is first (due to DESC order)
        const latest = items[0];

        // Historical data for charts
        const historical = items.map(item => ({
            timestamp: item.WindowEnd,
            temperature: item.AvgTemperature,
            productionRate: item.AvgProductionRate,
            availability: item.AvailabilityPercentage * 100
        })).reverse(); // Reverse to get chronological order for charts

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: {
                current: latest,
                historical: historical
            }
        };

    } catch (error) {
        context.log.error('Error fetching device details:', error);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
