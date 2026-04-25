const request = require('supertest');
const app = require('./server');

// Mock @google/generative-ai
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: () => "Mocked Gemini Response",
            },
          }),
        }),
      };
    }),
  };
});

// Mock @google-cloud/logging
jest.mock('@google-cloud/logging', () => {
  return {
    Logging: jest.fn().mockImplementation(() => {
      return {
        log: jest.fn().mockReturnValue({
          entry: jest.fn(),
          write: jest.fn().mockResolvedValue(true),
        }),
      };
    }),
  };
});

describe('Election Guide Assistant API', () => {
  describe('GET /health', () => {
    it('should return 200 and a healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'Election Guide Assistant is running');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /ask', () => {
    it('should return 400 if question is missing', async () => {
      const res = await request(app).post('/ask').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('answer', 'Question is required and must be text');
    });

    it('should return 400 if question is empty', async () => {
      const res = await request(app).post('/ask').send({ question: '   ' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('answer', 'Question cannot be empty');
    });

    it('should return 400 if question is too long', async () => {
      const longQuestion = 'a'.repeat(301);
      const res = await request(app).post('/ask').send({ question: longQuestion });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('answer', 'Question is too long (max 300 characters)');
    });

    it('should return fallback answer for registration intent', async () => {
      const res = await request(app).post('/ask').send({ question: 'how to register' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('answer');
      expect(res.body.answer).toContain('**How to Register to Vote in India**');
      expect(res.body.answer).toContain('💡 Did you know?');
    });

    it('should return fallback answer for voting process intent', async () => {
      const res = await request(app).post('/ask').send({ question: 'how to vote' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('answer');
      expect(res.body.answer).toContain('**The Voting Process (Election Day)**');
    });

    it('should return fallback answer for timeline intent', async () => {
      const res = await request(app).post('/ask').send({ question: 'election timeline' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('answer');
      expect(res.body.answer).toContain('**Understanding the Election Timeline**');
    });

    it('should return fallback answer for general queries', async () => {
      const res = await request(app).post('/ask').send({ question: 'general info' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('answer');
      expect(res.body.answer).toContain('**General Election Information**');
    });

    it('should return unmatched intent fallback', async () => {
      const res = await request(app).post('/ask').send({ question: 'what is the recipe for cake' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('answer');
      expect(res.body.answer).toContain("**I'm not sure about that!**");
    });
  });
});
