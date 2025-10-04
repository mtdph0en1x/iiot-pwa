const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos DB client
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("IIoTMonitoring");
const container = database.container("Telemetry");

module.exports = async function (context, req) {
    context.log('Getting latest device telemetry data');

    try {
        // Get recent data (last 2 weeks for thesis project)
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

        // Query to get latest telemetry for each device
        const query = {
            query: `
                SELECT c.DeviceId, c.DeviceType, c.LineId, c.LineName,
                       c.AvgTemperature, c.AvgProductionRate,
                       c.AvailabilityPercentage, c.CurrentErrorCode,
                       c.WindowEnd, c.DocumentType
                FROM c
                WHERE c.DocumentType IN ('telemetry-compressor', 'telemetry-press', 'telemetry-conveyor', 'telemetry-quality')
                  AND c.WindowEnd >= @twoWeeksAgo
                ORDER BY c.WindowEnd DESC
            `,
            parameters: [
                { name: "@twoWeeksAgo", value: twoWeeksAgo }
            ]
        };

        const { resources: items } = await container.items
            .query(query)
            .fetchAll();

        // Get latest record per device
        const latestByDevice = {};
        items.forEach(item => {
            if (!latestByDevice[item.DeviceId] ||
                new Date(item.WindowEnd) > new Date(latestByDevice[item.DeviceId].WindowEnd)) {
                latestByDevice[item.DeviceId] = item;
            }
        });

        const devices = Object.values(latestByDevice);

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: devices
        };

    } catch (error) {
        context.log.error('Error fetching devices:', error);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
