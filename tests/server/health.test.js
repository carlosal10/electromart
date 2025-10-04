import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { app } from '../../app.js';

describe('health check', () => {
  it('responds with a status message', async () => {
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Server is working');
  });
});
