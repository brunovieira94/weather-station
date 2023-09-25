const AWS = require('aws-sdk-mock');
const { handler } = require('./lambda');

AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
  callback(null, 'Mocked DynamoDB Response');
});

describe('Lambda Function', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should store data in DynamoDB and return success response', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            timestamp: '2023-09-24T02:14:55.520Z',
            temperature: 25,
            humidity: 40,
          }),
        },
      ],
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({ message: 'Data processed and stored successfully!' }));
  });

  it('should handle DynamoDB errors and return an error response', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            timestamp: '2023-09-24T02:14:55.520Z',
            temperature: 25,
            humidity: 40,
          }),
        },
      ],
    };

    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(new Error('DynamoDB Error'));
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(JSON.stringify({ message: 'Error storing data in DynamoDB' }));
  });

  it('should handle empty event Records', async () => {
    const event = {
      Records: [],
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({ message: 'Data processed and stored successfully!' }));
  });
});