const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
  });
});
