const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'weather';

exports.handler = async (event) => {
    for (const record of event.Records) {
        const payload = JSON.parse(record.body);
        
        const { temperature, humidity } = payload;
        const currentTimestamp = new Date().toISOString();
        
        // Store data in Dynamo
        const params = {
            TableName: tableName,
            Item: {
                timestamp: currentTimestamp,
                temperature: temperature,
                humidity: humidity
            }
        };
        
        try {
            await dynamodb.put(params).promise();
        } catch (error) {
            console.error('Error storing data in DynamoDB:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error storing data in DynamoDB' })
            };
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data processed and stored successfully!' })
    };
};